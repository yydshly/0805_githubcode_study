from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
GRAPH_PATH = ROOT / "artifacts" / "pi" / "graphify-out" / "graph.json"
ANALYSIS_PATH = ROOT / "artifacts" / "pi" / "graphify-out" / ".graphify_analysis.json"
RUNS_PATH = ROOT / "research" / "runs.json"
LEARNING_PATH = ROOT / "research" / "pi-learning.json"
SYSTEM_MAP_PATH = ROOT / "research" / "pi-system-map.json"
DEEP_DIVES_PATH = ROOT / "research" / "pi-deep-dives.json"
OUTPUT_PATH = ROOT / "site" / "data.js"


def package_bucket(source_file: str) -> str:
    parts = source_file.replace("\\", "/").split("/")
    if len(parts) >= 2 and parts[0] == "packages":
        return f"packages/{parts[1]}"
    if parts and parts[0].startswith("."):
        return parts[0]
    return parts[0] if parts and parts[0] else "unknown"


def language_bucket(source_file: str) -> str:
    suffix = Path(source_file).suffix.lower()
    return {
        ".ts": "TypeScript",
        ".tsx": "TSX",
        ".js": "JavaScript",
        ".mjs": "JavaScript",
        ".json": "JSON",
        ".sql": "SQL",
        ".sh": "Shell",
    }.get(suffix, suffix.removeprefix(".").upper() or "Other")


def main() -> None:
    graph = json.loads(GRAPH_PATH.read_text(encoding="utf-8"))
    analysis = json.loads(ANALYSIS_PATH.read_text(encoding="utf-8"))
    run_data = json.loads(RUNS_PATH.read_text(encoding="utf-8"))
    learning_data = json.loads(LEARNING_PATH.read_text(encoding="utf-8"))
    system_map_data = json.loads(SYSTEM_MAP_PATH.read_text(encoding="utf-8"))
    deep_dives_data = json.loads(DEEP_DIVES_PATH.read_text(encoding="utf-8"))

    nodes = graph["nodes"]
    links = graph["links"]
    node_by_id = {node["id"]: node for node in nodes}
    degree: Counter[str] = Counter()
    for link in links:
        degree[link["source"]] += 1
        degree[link["target"]] += 1

    confidence = Counter(link.get("confidence", "UNKNOWN") for link in links)
    relations = Counter(link.get("relation", "unknown") for link in links)
    source_files = {node.get("source_file", "") for node in nodes if node.get("source_file")}
    languages = Counter(language_bucket(source_file) for source_file in source_files)
    packages = Counter(package_bucket(source_file) for source_file in source_files)

    community_members: dict[int, list[dict]] = defaultdict(list)
    for node in nodes:
        cid = node.get("community")
        if isinstance(cid, int):
            community_members[cid].append(node)

    cohesion = {int(key): value for key, value in analysis.get("cohesion", {}).items()}
    communities = []
    for cid, members in community_members.items():
        hub = max(members, key=lambda item: (degree[item["id"]], item.get("label", "")))
        communities.append(
            {
                "id": cid,
                "name": hub.get("community_name") or hub.get("label") or f"Community {cid}",
                "size": len(members),
                "cohesion": round(float(cohesion.get(cid, 0.0)), 4),
                "hub": hub.get("label", hub["id"]),
            }
        )
    communities.sort(key=lambda item: (-item["size"], item["id"]))

    gods = []
    for item in analysis.get("gods", [])[:10]:
        node = node_by_id[item["id"]]
        gods.append(
            {
                **item,
                "source": node.get("source_file", ""),
                "location": node.get("source_location", ""),
                "community": node.get("community_name", ""),
            }
        )

    focus_labels = {
        "AgentSession",
        "Agent",
        "ExtensionRunner",
        "SettingsManager",
        "SessionManager",
        "ModelRuntime",
        "ToolDefinition",
        "InteractiveMode",
        "Model",
        "Context",
        "ExtensionAPI",
        "TUI",
    }
    focus_nodes: dict[str, dict] = {}
    for node in nodes:
        label = node.get("label")
        if label in focus_labels:
            current = focus_nodes.get(label)
            if current is None or degree[node["id"]] > degree[current["id"]]:
                focus_nodes[label] = node

    focus_ids = {node["id"] for node in focus_nodes.values()}
    focus_edges = []
    seen_edges = set()
    for link in links:
        if link["source"] not in focus_ids or link["target"] not in focus_ids:
            continue
        key = (link["source"], link["target"], link.get("relation"))
        if key in seen_edges:
            continue
        seen_edges.add(key)
        focus_edges.append(
            {
                "source": link["source"],
                "target": link["target"],
                "relation": link.get("relation", "related"),
                "confidence": link.get("confidence", "UNKNOWN"),
            }
        )

    architecture = {
        "nodes": [
            {
                "id": node["id"],
                "label": node.get("label", node["id"]),
                "degree": degree[node["id"]],
                "source": node.get("source_file", ""),
                "location": node.get("source_location", ""),
                "community": node.get("community_name", ""),
            }
            for node in focus_nodes.values()
        ],
        "edges": focus_edges,
    }

    isolated = sum(1 for node in nodes if degree[node["id"]] <= 1)
    summary = {
        **run_data,
        "generatedAt": "2026-08-05",
        "final": {
            "files": run_data["runs"][-1]["files"],
            "nodes": len(nodes),
            "edges": len(links),
            "communities": len(community_members),
            "isolated": isolated,
            "builtAtCommit": graph.get("built_at_commit"),
            "confidence": dict(confidence),
        },
        "topNodes": gods,
        "topRelations": [
            {"label": label, "value": value} for label, value in relations.most_common(10)
        ],
        "languages": [
            {"label": label, "value": value} for label, value in languages.most_common(10)
        ],
        "packages": [
            {"label": label, "value": value} for label, value in packages.most_common(10)
        ],
        "communities": communities[:12],
        "architecture": architecture,
        "surprises": analysis.get("surprises", [])[:5],
        "learning": learning_data,
        "systemMap": system_map_data,
        "deepDives": deep_dives_data,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(summary, ensure_ascii=False, separators=(",", ":"))
    OUTPUT_PATH.write_text(f"window.GRAPHIFY_STUDY_DATA={payload};\n", encoding="utf-8")
    print(
        f"wrote {OUTPUT_PATH}: {len(nodes)} nodes, {len(links)} edges, "
        f"{len(community_members)} communities, {len(focus_edges)} focus edges"
    )


if __name__ == "__main__":
    main()
