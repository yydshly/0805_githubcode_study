import{n as e}from"./BufferGeometryUtils-rYU0g5NO.js";import{At as t,C as n,J as r,K as i,Nt as a,S as o,Tt as s,X as c,Z as l,_ as u,b as d,bt as f,c as p,d as m,f as h,ft as g,g as _,kt as v,l as y,m as b,p as x,q as S,s as C,st as w,u as T,xt as E}from"./index-D368tsPV.js";var D=.001,O={uSunV:{value:new a(0,0,-1)},uSunTint:{value:new b(1,1,1)},uRimGain:{value:1},uBounce:{value:new b(.04,.05,.07)},uShineV:{value:new a(0,-1,0)},uShineCol:{value:new b(.075,.092,.12)},uShineK:{value:.26},uVoidCol:{value:new b(.009,.0135,.018)}};typeof window<`u`&&(window.__hullLight=O);var k=`
uniform vec3 uSunV;
uniform vec3 uSunTint;
uniform float uRimGain;
uniform vec3 uBounce;
uniform vec3 uShineV;
uniform vec3 uShineCol;
uniform float uShineK;
uniform vec3 uVoidCol;
`;function A(e){e.uniforms.uSunV=O.uSunV,e.uniforms.uSunTint=O.uSunTint,e.uniforms.uRimGain=O.uRimGain,e.uniforms.uBounce=O.uBounce,e.uniforms.uShineV=O.uShineV,e.uniforms.uShineCol=O.uShineCol,e.uniforms.uShineK=O.uShineK,e.uniforms.uVoidCol=O.uVoidCol}var j=`
  #include <lights_physical_fragment>
  {
    float matte = max(smoothstep(0.22, 0.62, material.roughness), MATTE_MIN)
                * (1.0 - metalnessFactor);
    material.specularF90 = mix(material.specularF90, MATTE_F90, matte);
  }
`,M=`
  #include <lights_fragment_end>
  {
    // Indirect light does not reach into a groove. Applied to what three has
    // already accumulated, before anything of ours is added.
    float cav = CAVITY;
    reflectedLight.indirectDiffuse *= cav;
    reflectedLight.indirectSpecular *= cav;

    vec3 Vv = normalize(vViewPosition);
    float fres = pow(clamp(1.0 - dot(normal, Vv), 0.0, 1.0), 3.2);
    // 1 when the key is directly behind the subject, 0 when it is behind us
    float back = clamp(-dot(uSunV, Vv), 0.0, 1.0);
    // and only along the true silhouette, where the surface turns away
    float graze = clamp(1.0 - abs(dot(normal, uSunV)), 0.0, 1.0);
    reflectedLight.directSpecular += uSunTint * fres * back * graze * uRimGain * 2.6;

    /* ---- the analytic environment.  See HULL_LIGHT.
       The world nearby is a disc of radiance uShineCol subtending an angular
       radius whose sine is uShineK. Reflect the view about the normal, ask
       whether that ray lands on the disc, and blur the answer by the surface
       roughness: a mirrored trim ring returns the disc's hard edge, chalky
       paint returns a soft gradient across its whole planet-facing side, and
       the same number does both. */
    float rgh = material.roughness;
    vec3 Rv = reflect(-Vv, normal);
    float cA = sqrt(max(0.0, 1.0 - uShineK*uShineK));   // cos of the angular radius
    float blur = 0.02 + rgh*rgh*2.7 + rgh*0.28;
    float disc = smoothstep(cA - blur, min(1.0, cA + blur*0.22), dot(Rv, uShineV));
    // A rough surface smears the same energy over a wide lobe, so what comes
    // back is never brighter than what went in.
    vec3 radiance = uShineCol * disc * mix(0.42, 1.0, 1.0/(1.0 + rgh*rgh*8.0)) + uVoidCol;
    reflectedLight.indirectSpecular += radiance * cav
      * EnvironmentBRDF(normal, Vv, material.specularColorBlended, material.specularF90, rgh);

    // Diffuse off the same disc. Game.js runs planetshine as a real
    // directional, which delivers the N.L part already, so only the wrap is
    // added here: the light a source half a sky wide puts *past* the
    // terminator, which is the one thing a directional can never do.
    float nl = dot(normal, uShineV);
    float wk = 0.18 + 0.82*uShineK;
    float wr = clamp((nl + wk) / (1.0 + wk), 0.0, 1.0);
    float pastTerm = max(0.0, wr*wr - max(0.0, nl));
    reflectedLight.indirectDiffuse += uShineCol * (uShineK*uShineK*3.2) * pastTerm
                                   * material.diffuseContribution * cav;

    // A wrapped bounce term so the shadow side sits on a colour instead of on
    // zero. Real vacuum shadows are filled by whatever large thing is nearby.
    float nsun = dot(normal, uSunV);
    float wrap = clamp(nsun*0.5 + 0.5, 0.0, 1.0);
    reflectedLight.indirectDiffuse += uBounce * diffuseColor.rgb * (0.35 + 0.65*wrap);

    /* ---- the void, on the diffuse lobe.
       uVoidCol is the one term in this rig whose entire job is the brief's
       first rule — shadows are never black — and it was only ever handed to
       the environment BRDF, which for chalky paint returns about four per
       cent. So it arrived at four hundredths of its own value, and every face
       in the game that the key did not reach rendered at zero: measured, a
       nacelle in silhouette sat at 10/255 against 230 on its lit side, which
       is a cut-out, not a shadow. Deep space is not a black room. It is a
       full sphere of very dim, very cold light, and the honest place for that
       is the diffuse lobe.

       It is *shaped*, not flat, which is the whole difference between this
       and raising ambient. The weight is zero wherever the key already lands
       and rises to one as a face turns away from it, so the lit side, the
       terminator and the value separation between a bone hull and a black
       nacelle are all untouched — only the part of the frame that was
       previously a hole gets anything at all. */
    float unlit = clamp(0.5 - nsun*0.5, 0.0, 1.0);
    reflectedLight.indirectDiffuse += uVoidCol * diffuseColor.rgb
                                    * (unlit*unlit*2.2 + 0.18) * cav;
PLUME_LIGHT
  }
`;function ee(e){return e.onBeforeCompile=e=>{A(e),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
`+k).replace(`#include <lights_fragment_end>`,M.replace(`CAVITY`,`1.0`).replace(`PLUME_LIGHT`,``))},e.customProgramCacheKey=()=>`skyLit`,e}var N=`
  varying vec3 vShipPos;
  varying vec3 vShipNrm;
  varying vec2 vHull;          // baked: x occlusion, y exposed-edge

  float hHash(vec3 p){
    p = fract(p*0.3183099 + vec3(0.71,0.113,0.419));
    p *= 17.0;
    return fract(p.x*p.y*p.z*(p.x+p.y+p.z));
  }
  float hNoise(vec3 x){
    vec3 i = floor(x), f = fract(x);
    f = f*f*(3.0-2.0*f);
    return mix(mix(mix(hHash(i+vec3(0,0,0)), hHash(i+vec3(1,0,0)), f.x),
                   mix(hHash(i+vec3(0,1,0)), hHash(i+vec3(1,1,0)), f.x), f.y),
               mix(mix(hHash(i+vec3(0,0,1)), hHash(i+vec3(1,0,1)), f.x),
                   mix(hHash(i+vec3(0,1,1)), hHash(i+vec3(1,1,1)), f.x), f.y), f.z);
  }
  /* Five octaves, for whoever injects their own weathering into a dressed
     material — Station.js draws its ruin burns with this. Nothing in the
     plating law below uses it: see hFbm3. */
  float hFbm(vec3 p){
    float s = 0.0, a = 0.5;
    for(int i=0;i<5;i++){ s += a*hNoise(p); p *= 2.07; a *= 0.5; }
    return s;
  }
  /* Three octaves. This shader pays for its noise three times over, and the
     fourth and fifth octaves of a nine-metre blotch mask, a two-metre flow
     streak and a forty-centimetre paint tooth all land under a pixel from
     anywhere anyone looks at this hull. */
  float hFbm3(vec3 p){
    float s = 0.0, a = 0.5;
    for(int i=0;i<3;i++){ s += a*hNoise(p); p *= 2.07; a *= 0.5; }
    return s;
  }

  /* Brushed metal, in one line. Real anisotropy wants a tangent frame and a
     second GGX lobe; a roughness that varies twenty times faster around the
     hull than along it buys the same read — a highlight that smears into
     lengthwise bands as the key rakes across — for two noise fetches. */
  float brush(vec3 p){
    return hNoise(vec3(p.x*3.4, p.y*3.4, p.z*0.16))*0.62
         + hNoise(vec3(p.x*9.3, p.y*9.3, p.z*0.44))*0.38;
  }

  /* ---- how big a pixel is, in metres of ship -----------------------------
     The renderer supersamples, so anything authored below the sample spacing
     is not detail, it is noise that crawls. Every sub-panel feature below —
     fastener heads, weld beads, the fine seam octave, the detail normal — is
     multiplied by this, which is the shader's own mip chain: a rivet six
     millimetres wide fades out at exactly the distance it stops being
     resolvable instead of sparkling all the way to the horizon. It also buys
     back most of what the detail costs, because the branches it gates are
     screen-coherent and skip whole tiles at once. */
  float hullLod(float s, float px){ return clamp(s/(px*3.2) - 0.55, 0.0, 1.0); }

  /* ---- one plate edge ----------------------------------------------------
     A dark groove with a burnished lip either side of it, not a flat dark
     stripe. The groove sits at a jittered place inside its cell and one edge
     in six is missing altogether, because plates of exactly one length in a
     perfect grid is the definition of the brick-pattern read.

     Two joints in three are bolted and carry a row of fastener heads just
     outboard of the gap; the rest are welded, which is a *raised bead* and no
     gap at all. Mixing the two is most of what stops a hull reading as one
     repeated panel, and it is the detail an art director means by "no rivets,
     no weld seams". x runs across the seam and y along it.

     The reg argument is registration, and it is the difference between plating
     texture. At 0 the joint sits at a jittered place inside its cell, one cell
     in eight has no joint at all, and two joints in three are bolted — which is
     right for a butt strap between two plates, where the yard put the joint
     wherever the stock ran out. At 1 the joint is at the *same* place in every
     cell, no cell is ever skipped, and every joint is bolted: that is a
     structural frame, and a frame ring is at its station because the ship was
     designed around it. Running the jittered law over both families is what
     makes a hull read as an arbitrary scatter of dashes rather than as bays.

     Out: gv = (groove, lip); dt = (fastener, weld bead, dirt washing aft). */
  void seamLine(float x, float y, float w, float fine, float reg, out vec2 gv, out vec3 dt){
    float c = floor(x);
    float j = hHash(vec3(c, 7.7, 1.3));
    float sp = mix(0.33 + 0.34*j, 0.5, reg);
    float d = fract(x) - sp;
    float g = abs(d);
    float keep = max(step(0.12, hHash(vec3(c, 3.1, 9.2))), reg);
    float bolt = max(step(0.34, hHash(vec3(c, 11.3, 4.9))), reg);
    // a welded joint still shows, but as a line rather than as a gap
    float core = (1.0 - smoothstep(0.0, w, g)) * keep * mix(0.42, 1.0, bolt);
    // The lip has to stay *narrower* than the groove. Wider and every plate
    // acquires a bright border, which reads as quilting rather than as metal.
    float lip  = smoothstep(w*2.0, w*1.05, g) * (1.0 - core) * keep;
    gv = vec2(core, lip);

    float riv = 0.0, bead = 0.0;
    if (fine > 0.002){
      /* Fastener heads, in a row either side of the gap. Sized like fasteners:
         the first pass made the band six times too wide and the row read as a
         soft lump beside the seam rather than as hardware. A head is three
         centimetres on a two-and-a-half metre plate. */
      float band = 1.0 - smoothstep(w*0.30, w*0.95, abs(g - w*2.3));
      float fy = fract(y*6.0) - 0.5;
      riv = band * (1.0 - smoothstep(0.05, 0.15, abs(fy))) * bolt * keep * fine;
      // a weld bead, wandering along its length the way a hand-run bead does
      float wob = (hNoise(vec3(y*2.6, c*0.7, 4.0)) - 0.5) * w*1.4;
      bead = (1.0 - smoothstep(w*0.7, w*2.2, abs(d - wob))) * (1.0 - bolt) * keep * fine;
    }
    /* Dirt washes out of a gap and dies away within one plate. This is the
       streaking a hull gets from vented gas and handling, and unlike fbm
       staining it is *registered to the panel grid*, which is the whole
       reason it reads as coming from the seam.

       The onset is a ramp across the gap rather than a hard step. As a stain
       that is merely more honest — dirt comes out of a joint, it does not begin at a
       mathematical line down the middle of one. As *height* it is the
       difference between a lap joint and a defect: this field is also the
       plate overlap in the relief block, a hard step there is an infinite
       screen-space gradient, and an infinite gradient through
       perturbNormalArb is one pixel of arbitrary normal down the centre of
       every seam on the ship — which at 1:1 is a bright dotted chain and in
       motion is a crawling one. */
    float wash = keep * smoothstep(-w*1.3, w*1.3, d) * exp2(-max(d, 0.0)*6.5)
               * (0.25 + 0.75*hHash(vec3(c, floor(y*2.3), 5.1)));
    dt = vec3(riv, bead, wash);
  }

  /* Seams follow the form, and the form is read off the surface normal.
     A pressure vessel is rolled plate: rings around it and stringers along it
     in its own cylindrical frame. A fin, a deck or a bulkhead is cut plate: a
     rectangular grid in the plane it actually lies in. Running the cylindrical
     law over everything is what turned the tail fin into vertical dashes on a
     plain field — a flat plate on the centreline has no radius to run rings
     around, so all it ever got was the one family of lines.

     Plate *size* varies by surface class, which is the fix for the tiled read:
     a barrel is plated in sheets that scale with its radius, flanks and fins
     are plated finer than decks, and a spine and a wing therefore never share
     a grid. One cell size over the whole ship is a texture; four is structure.

     The fr argument turns the *transverse* family into real frames — see the
     reg argument above — and opens the hatch field below. It is off for
     everything the shared kit builds and on for the player's hull, which is
     the one asset anybody ever reads at one to one.

     Out: sm = (groove, lip, plate seed) — the seed matters most, because no
     two panels were rolled in the same year or faded by the same amount;
     dt = (fastener, weld bead, gap wash); hd = (hatch recess, hatch rim). */
  void plating(vec3 p, vec3 n, float S, float w, float fine, float fr,
               out vec3 sm, out vec3 dt, out vec2 hd){
    vec3 an = abs(n);
    float rad = length(p.xy);
    float ln = length(n.xy);
    float radial = (rad > 0.05 && ln > 0.02) ? dot(p.xy/rad, n.xy/ln) : 0.0;
    // rolled plate only where the surface genuinely wraps a barrel
    float cw = smoothstep(0.60, 0.92, radial) * smoothstep(1.2, 2.6, rad)
             * (1.0 - an.z*an.z);

    vec2 gv = vec2(0.0), g0, g1;
    vec3 dd = vec3(0.0), d0, d1;
    float seed = 0.5;
    vec2 puv = vec2(0.0);        // the plate coordinate of whichever law won

    /* cylindrical: rings across, stringers around, and the stringers stagger
       by bay so the joints never line up into one long ladder — which is how
       plating is actually laid, and the reason it does not read as brick.
       The rings wobble, but *smoothly*: jittering them per angular cell
       shatters every ring into staggered dashes.

       Under fr the ring stops wobbling at all and the stagger goes to exactly
       half a plate. A rolled barrel is built on frames, and a frame is a ring
       of the same section at the same station all the way round: the wobble was
       there to keep a perfect grid from reading as a texture and it does the
       opposite, because a line that drifts has no station to be at. Half-plate
       stagger is what a shipwright actually lays, and unlike 0.41 of a plate it
       repeats every second bay, so the eye can count the bays. */
    if (cw > 0.004){
      float Sc = S / clamp(rad*0.23, 0.60, 1.55);
      float ang = atan(p.y, p.x) * (1.55 + rad*0.045);
      float uCyl = p.z*Sc + hNoise(vec3(ang*0.30, 0.0, 0.0))*0.17*(1.0 - fr);
      float vCyl = ang*2.0 + floor(p.z*Sc)*mix(0.41, 0.5, fr);
      seamLine(uCyl, vCyl, w,     fine, fr,  g0, d0);   // frames
      seamLine(vCyl, uCyl, w*1.4, fine, 0.0, g1, d1);   // butt straps
      gv = max(g0, g1*0.85);
      dd = vec3(max(d0.xy, d1.xy*0.85), d0.z);
      puv = vec2(uCyl, vCyl);
      seed = hHash(vec3(floor(puv), 2.7));
    }

    /* cut plate, in whichever plane the surface lies in. Only the frames that
       actually carry weight are evaluated: an axis-aligned face has one, and
       computing the other two for it tripled the cost of the busiest shader
       in the game for a contribution of 0.4%. */
    if (cw < 0.996){
      float wx = an.x*an.x*an.x, wy = an.y*an.y*an.y, wz = an.z*an.z*an.z;
      float ws = wx + wy + wz + 1e-4;
      vec2 cg = vec2(0.0); vec3 cd = vec3(0.0);
      vec2 cc = vec2(0.0); float best = -1.0;
      if (wx > 0.004*ws){
        float Sx = S*1.34;                       // flanks and fins: fine plate
        vec2 u = vec2(p.z*Sx + 0.31, p.y*Sx*1.3 + floor(p.z*Sx)*mix(0.37, 0.5, fr));
        seamLine(u.x, u.y, w,     fine, fr,  g0, d0);
        seamLine(u.y, u.x, w*1.3, fine, 0.0, g1, d1);
        cg += max(g0, g1*0.85)*wx;
        cd += vec3(max(d0.xy, d1.xy*0.85), d0.z)*wx;
        cc = u; best = wx;
      }
      if (wy > 0.004*ws){
        float Sy = S*0.71;                       // decks and roofs: long sheets
        vec2 u = vec2(p.z*Sy + 0.13, p.x*Sy*1.3 + floor(p.z*Sy)*mix(0.29, 0.5, fr));
        seamLine(u.x, u.y, w,     fine, fr,  g0, d0);
        seamLine(u.y, u.x, w*1.3, fine, 0.0, g1, d1);
        cg += max(g0, g1*0.85)*wy;
        cd += vec3(max(d0.xy, d1.xy*0.85), d0.z)*wy;
        if (wy > best){ cc = u; best = wy; }
      }
      if (wz > 0.004*ws){
        vec2 u = vec2(p.x*S + 0.57, p.y*S*1.3 + floor(p.x*S)*mix(0.23, 0.5, fr));
        seamLine(u.x, u.y, w,     fine, fr,  g0, d0);
        seamLine(u.y, u.x, w*1.3, fine, 0.0, g1, d1);
        cg += max(g0, g1*0.85)*wz;
        cd += vec3(max(d0.xy, d1.xy*0.85), 0.0)*wz;   // a face plate has no aft
        if (wz > best){ cc = u; best = wz; }
      }
      cg /= ws; cd /= ws;
      /* One plate identity, taken from whichever frame actually won rather
         than blended between them — a blended hash is a smooth gradient,
         which is the one thing a plate boundary must never be. */
      float cSeed = hHash(vec3(floor(cc), 2.7));
      gv = mix(cg, gv, cw);
      dd = mix(cd, dd, cw);
      seed = mix(cSeed, seed, step(0.5, cw));
      puv = mix(cc, puv, step(0.5, cw));
    }

    /* ---- doors, hatches and access panels.
       The plate law can say where a joint is. What it could never say is that
       something was *cut out* of the hull and hinged, and the difference is the
       whole of an art director's reading of this ship against a reference:
       theirs has doors with hinges and real recesses that catch the key, ours
       had rectangles drawn on with a hairline bevel.

       A hatch fills its own bay. That is not a simplification, it is how one is
       built — an opening interrupts the plating, so it is framed by the seams
       that are already there rather than laid across them, and its size comes
       out of the material's own plate gauge. A 3.7 m pressure-hull bay gives a
       2.5 by 1.4 m door; a 1.15 m fairing bay gives a 780 mm access panel; the
       same four lines do both. hd.y is the perimeter, and it is handed to the
       fastener channel so the dogs round the edge answer the key exactly as the
       fasteners on a plate joint do. */
    hd = vec2(0.0);
    if (fr > 0.5){
      float dh = hHash(vec3(floor(puv), 31.7));
      float on = step(0.928, dh);              // about one bay in fourteen
      vec2 f2 = abs(fract(puv) - 0.5) - vec2(0.30, 0.26);
      float e = max(f2.x, f2.y);
      // A soft-shouldered step, for the same reason the gap wash has one: a
      // hard step in a height field is an infinite screen-space gradient, and
      // an infinite gradient through perturbNormalArb is one pixel of arbitrary
      // normal all the way round every hatch on the ship.
      hd = vec2(on * (1.0 - smoothstep(-0.020, 0.020, e)),
                on * (1.0 - smoothstep(0.0, 0.034, abs(e))));
    }

    sm = vec3(gv, seed);
    dt = dd;
  }

  /* ---- micrometeoroid pitting -------------------------------------------
     A hull three years out is not flat between its seams. Every square metre
     of it has been sandblasted by grit at fifteen kilometres a second, and
     what that leaves is a scatter of shallow dishes a few centimetres across
     with the ejecta burr still standing round the rim. It is the one piece of
     surface history that cannot be painted on: a crater has *relief*, and
     under a raking key it is a bright crescent against a dark one, which is
     precisely what an albedo blotch can never do.

     One cell owns one crater and neighbours are not consulted. Eight more
     hash lookups would let them overlap; at four to ten centimetres across
     nothing in this game is ever close enough to notice that they do not, and
     this function is evaluated on every hull fragment in the frame. */
  float pitH(vec3 p, float sc){
    vec3 c = floor(p*sc);
    float h = hHash(c + 3.7);
    vec3 j = vec3(hHash(c + 1.3), hHash(c + 5.9), hHash(c + 9.1));
    // centre and radius both held clear of the cell wall, so a crater is never
    // sliced in half by the grid it was drawn in
    float rad = 0.13 + 0.16*fract(h*23.0);
    float d = length(fract(p*sc) - (0.35 + j*0.30)) / rad;
    // A crater is a bowl, not a dimple: deepest in the middle and *steepest at
    // the rim*, which is the opposite of the smoothstep shape reached for
    // first and the reason that one read as a soft smudge.
    float dd = min(d, 1.0);
    float e = (d - 1.0)*5.0;
    // the dish, and the burr of melt thrown up around it
    return step(0.72, h) * (dd*dd - 1.0 + exp2(-e*e*1.44)*0.26);
  }

  /* ---- doublers, standoffs and access pads -------------------------------
     Small plates laid *on* the hull and bolted down. Every real vehicle is
     covered in them, and between its seams this one was a plane — which is
     what left the largest, palest and most-looked-at surfaces on the ship
     with nothing in them for the key to find. The plate law can only draw
     where a joint *is*; this draws what was later bolted over one.

     A box in ship space cuts a rectangle out of any surface it meets, so one
     cell distance answers this for a flank, a deck and a barrel alike without
     paying for the plating law's three-frame projection a third time — and
     stretching that box along the *surface normal* is what turns it from a
     cube into a plate lying on the hull. Across the surface it is the size of
     the doubler; through it, it is deep enough that the hull can never slip
     between two of them. Without that stretch a two-dimensional surface
     misses a three-dimensional cube two times in three, and the field reads
     as one pad every few metres instead of a vehicle covered in them. */
  float padH(vec3 p, vec3 n, float sc){
    vec3 c = floor(p*sc);
    float h = hHash(c + 21.3);
    vec3 j = vec3(hHash(c + 2.9), hHash(c + 7.1), hHash(c + 13.7));
    vec3 d = abs(fract(p*sc) - (0.35 + j*0.30));
    // deliberately unequal in the three axes, so a pad is a rectangle rather
    // than the square that gives a cell grid away
    vec3 hs = vec3(0.09 + 0.15*fract(h*13.0), 0.09 + 0.15*fract(h*29.0),
                   0.09 + 0.15*fract(h*53.0)) + abs(n)*0.42;
    float e = max(max(d.x - hs.x, d.y - hs.y), d.z - hs.z);
    return step(0.62, h) * (1.0 - smoothstep(-0.012, 0.012, e));
  }

  /* Height into normal, from screen derivatives — three's perturbNormalArb,
     inlined because the bump chunk is only compiled in when a bump *map* is
     bound and there is no map here. Without it the seams are a printed
     pattern: they change the albedo and never catch the key, which is why a
     panel line at a raking angle looked drawn on rather than cut in.

     The height must arrive in the *same units as vpos*, which is world space
     and not ship metres — a groove authored at twenty millimetres and handed
     to a derivative taken in kilometres perturbs the normal by a factor of a
     thousand, and the whole hull dissolves into crawling static. Callers
     multiply by hullU2M for that reason. */
  vec3 hullBump(vec3 N, vec3 vpos, float h, float k){
    vec3 dpx = dFdx(vpos), dpy = dFdy(vpos);
    vec2 dH = vec2(dFdx(h), dFdy(h)) * k;
    vec3 r1 = cross(dpy, N), r2 = cross(N, dpx);
    float det = dot(dpx, r1);
    vec3 grad = sign(det) * (dH.x*r1 + dH.y*r2);
    return normalize(abs(det)*N - grad);
  }
`,P=`
  #include <begin_vertex>
  vShipPos = position;
  vShipNrm = normalize(normal);
  vHull = aHull;
`,te=1024,F=512,ne=2,I=null;function L(){if(I)return I;let e={},t=typeof document<`u`?document.createElement(`canvas`):null;if(!t)return I={tex:null,cells:e};t.width=te*ne,t.height=F*ne;let n=t.getContext(`2d`);n.scale(ne,ne),n.fillStyle=`#000`,n.fillRect(0,0,te,F);let r=`#ff0000`,i=`#00ff00`,a=`#0000ff`,o=(t,n,r,i,a)=>{e[t]=[n/te,1-a/F,i/te,1-r/F]},s=(e,t)=>(t||`bold`)+` `+e+`px "Helvetica Neue", Helvetica, Arial, sans-serif`,c=(e,t,r,i,a,o=0,c=`left`,l)=>{n.save(),n.font=s(i,l),n.fillStyle=a,n.textBaseline=`alphabetic`;let u=-o;for(let t of e)u+=n.measureText(t).width+o;let d=c===`center`?t-u/2:c===`right`?t-u:t;for(let t of e)n.fillText(t,d,r),d+=n.measureText(t).width+o;return n.restore(),u},l=(e,t,r,i,a)=>{n.fillStyle=a,n.fillRect(e,t,r-e,i-t)};o(`reg`,8,8,644,110),l(8,36,644,88,a),l(8,28,644,33,r),l(8,91,644,96,r),c(`PS-114`,26,78,44,r,6),c(`PALE SEEKER`,258,76,38,r,11),c(`CREW 04`,26,23,17,r,3),c(`DEEP SURVEY / LONG DURATION`,636,23,17,r,2,`right`),o(`name`,8,124,700,222),c(`PALE SEEKER`,354,190,62,r,22,`center`),l(60,202,648,209,r),l(60,132,300,138,a),l(408,132,648,138,a),o(`num`,716,124,856,234),c(`07`,792,210,104,i,4,`center`),c(`07`,786,204,104,r,4,`center`),o(`mark`,872,8,1e3,136),n.save(),n.translate(936,72),n.strokeStyle=r,n.lineWidth=9,n.beginPath(),n.arc(0,0,52,0,Math.PI*2),n.stroke(),n.fillStyle=a,n.beginPath(),n.moveTo(0,-40),n.lineTo(34,26),n.lineTo(0,10),n.lineTo(-34,26),n.closePath(),n.fill(),n.fillStyle=r,n.fillRect(-52,30,104,8),n.restore(),o(`haz`,8,236,228,292),l(8,236,228,292,i),n.save(),n.beginPath(),n.rect(8,236,220,56),n.clip();for(let e=-2;e<10;e++){n.fillStyle=a,n.beginPath();let t=8+e*46;n.moveTo(t,292),n.lineTo(t+24,292),n.lineTo(t+24+56,236),n.lineTo(t+56,236),n.closePath(),n.fill()}l(8,236,228,241,r),l(8,287,228,292,r),n.restore(),o(`caut`,716,250,1e3,306),c(`CAUTION`,722,282,30,r,5),c(`ENGINE EFFLUX`,722,302,17,r,4),o(`hatch`,244,236,372,364),n.save(),n.strokeStyle=r,n.lineWidth=5,n.strokeRect(252,244,112,92),n.fillStyle=r;for(let[e,t]of[[262,254],[354,254],[262,326],[354,326]])n.beginPath(),n.arc(e,t,5,0,Math.PI*2),n.fill();n.restore(),c(`ACCESS`,308,296,19,r,4,`center`),c(`NO STEP`,308,358,17,r,4,`center`),o(`arrow`,388,236,692,336),n.save(),n.fillStyle=r,n.beginPath(),n.moveTo(396,286),n.lineTo(450,242),n.lineTo(450,268),n.lineTo(536,268),n.lineTo(536,304),n.lineTo(450,304),n.lineTo(450,330),n.closePath(),n.fill(),n.restore(),c(`RESCUE`,556,278,24,r,4),c(`CUT HERE`,556,316,20,a,4);let u=new y(t);return u.colorSpace=``,u.anisotropy=16,u.wrapS=u.wrapT=x,u.needsUpdate=!0,I={tex:u,cells:e},I}var R=`
  const vec3 INK_L = vec3(0.600, 0.575, 0.500);
  const vec3 INK_D = vec3(0.012, 0.014, 0.017);
  const vec3 INK_O = vec3(0.332, 0.068, 0.009);
`;function z(e,t){let n=t[e.cell];if(!n)return``;let[r,i,a,o]=n,s=e=>e.toFixed(4);if(e.cyl){let t=e.cyl,n=t.mirror?`sign(vShipPos.x)`:`1.0`,[c,l]=e.rect,u=e.flipU?`1.0 - `:``;return`
  {
    float sg = ${n};
    vec2 rel = vec2((vShipPos.x - ${s(t.c[0])}*sg)*sg, vShipPos.y - ${s(t.c[1])});
    float ang = atan(rel.y, rel.x);
    float u = ${u}((vShipPos.z - ${s(c)}) / ${s(l-c)});
    // Lettering reads the right way round on both flanks, which means the
    // atlas lookup mirrors with the side rather than the geometry doing it.
    u = mix(u, 1.0 - u, step(0.0, sg));
    float v = (ang - ${s(t.a0??-.6)}) / ${s((t.a1??.6)-(t.a0??-.6))};
    float inr = step(0.0, u)*step(u, 1.0)*step(0.0, v)*step(v, 1.0);
    // only where the surface actually faces out of the barrel
    vec2 nr = vec2(vShipNrm.x*sg, vShipNrm.y);
    float fc = clamp(dot(normalize(rel + 1e-5), normalize(nr + 1e-5))*3.0 - 1.4, 0.0, 1.0);
    fc *= 1.0 - smoothstep(${s((t.r??3)*1.35)}, ${s((t.r??3)*2.1)}, length(rel));
    vec2 duv = mix(vec2(${s(r)}, ${s(i)}), vec2(${s(a)}, ${s(o)}),
                   clamp(vec2(u, ${e.flipV?`1.0 - v`:`v`}), 0.0, 1.0));
    ink += texture2D(uDecal, duv).rgb * inr * fc;
  }`}let[c,l,u,d]=e.rect,f=e.plane===`x`?`x`:e.plane===`y`?`y`:`z`,p=e.plane===`x`||e.plane===`y`?`vShipPos.z`:`vShipPos.x`,m=e.plane===`x`?`vShipPos.y`:e.plane===`y`?`vShipPos.x`:`vShipPos.y`,h=e=>e.toFixed(4),g=e.both?`step(0.0, sg)`:h(+!!e.flipU),_=h(+!!e.flipV),v=e.both?``:`  fc *= step(0.0, sg*${h(e.side??1)});\n`;return`
  {
    float sg = sign(vShipNrm.${f});
    float fc = clamp(abs(vShipNrm.${f})*${h(e.wrap??2.6)} - ${h((e.wrap??2.6)*.36)}, 0.0, 1.0);
${v}    vec2 t = (vec2(${p}, ${m}) - vec2(${h(c)}, ${h(l)})) / vec2(${h(u-c)}, ${h(d-l)});
    float inr = step(0.0, t.x)*step(t.x, 1.0)*step(0.0, t.y)*step(t.y, 1.0);
    vec2 tt = vec2(mix(t.x, 1.0 - t.x, ${g}), mix(t.y, 1.0 - t.y, ${_}));
    vec2 duv = mix(vec2(${h(r)}, ${h(i)}), vec2(${h(a)}, ${h(o)}), clamp(tt, 0.0, 1.0));
    ink += texture2D(uDecal, duv).rgb * inr * fc;
  }`}var B=`
uniform float uPlumePow;
float plumeSeg(vec3 A, float len, float rad, vec3 P, vec3 N){
  float t = clamp(P.z - A.z, 0.0, len);
  vec3 L = vec3(A.x, A.y, A.z + t) - P;
  float q = dot(L, L) + rad*rad;
  vec3 Ln = L * inversesqrt(q);
  float nl = clamp(dot(N, Ln)*0.72 + 0.28, 0.0, 1.0);
  return nl*nl / q;
}
`;function V(e,t={}){let n=t.plate??2.2,r=t.soot??.5,i=t.bleach??.7,a=t.livery??0,o=t.glare??(a>0?.82:.55),s=t.edge??.35,c=t.grazeF90??.08,l=t.brushed??.5,u=t.rivet??1,d=t.bump??1,f=t.ao??1,p=+!!t.frame,m=t.doors??t.frame?1:0,h=t.matteMin??0,g=t.marks||null,_=t.plume||null,v=e=>e.toFixed(4),y=`hull_${n}_${r}_${i}_${a}_${o}_${s}_${c}_${l}_${u}_${d}_${f}_${p}_${m}_${h}_${g?JSON.stringify(g):0}_${_?JSON.stringify(_.at)+_.gain:0}`;return e.defaultAttributeValues=Object.assign({},e.defaultAttributeValues,{aHull:[0,0]}),e.onBeforeCompile=e=>{A(e);let t=``,y=``;if(g&&g.length){let n=L();n.tex&&(e.uniforms.uDecal={value:n.tex},t=`
uniform sampler2D uDecal;
`+R,y=g.map(e=>z(e,n.cells)).join(``))}let b=``,x=``;if(_){e.uniforms.uPlumePow=_.power,b=B;let t=_.col||[.6,.76,1];x=`
    {
      float pg = 0.0;
${_.at.map(e=>`      pg += plumeSeg(vec3(${v(e[0])}, ${v(e[1])}, ${v(e[2])}), ${v(_.len??22)}, ${v(_.rad??2.4)}, vShipPos, vShipNrm);`).join(`
`)}
      // a floor, so the bell is still lit from inside when the drive is idling
      vec3 pc = vec3(${v(t[0])}, ${v(t[1])}, ${v(t[2])})
              * (pg * ${v(_.gain??40)} * max(uPlumePow, 0.075));
      reflectedLight.directDiffuse += pc * BRDF_Lambert(material.diffuseContribution) * cav;
      // the nozzle lip and the alloy aft of it pick it up as a highlight too
      reflectedLight.directSpecular += pc * material.specularColorBlended
                                     * (0.35 / (1.0 + rgh*rgh*22.0)) * cav;
    }`}e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
attribute vec2 aHull;
varying vec3 vShipPos;
varying vec3 vShipNrm;
varying vec2 vHull;`).replace(`#include <begin_vertex>`,P),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
`+N+k+t+b).replace(`#include <lights_physical_fragment>`,j.replace(`MATTE_F90`,c.toFixed(3)).replace(`MATTE_MIN`,h.toFixed(3))).replace(`#include <lights_fragment_end>`,M.replace(`CAVITY`,`hullCav`).replace(`PLUME_LIGHT`,x)).replace(`#include <map_fragment>`,`
        #include <map_fragment>
        /* Everything the rest of the shader needs is computed once, here.
           <map_fragment> runs before roughness, metalness and emissive, so the
           expensive noise is paid for exactly once instead of three times. */
        float hullWear = 0.0;
        float hullCav = 1.0;
        float hullSeam = 0.0, hullLip = 0.0, hullTooth = 0.5;
        float hullBrush = 0.5, hullGrime = 0.0, hullAft = 0.0, hullPlate = 0.5;
        float hullDrip = 0.0;
        float hullHgt = 0.0, hullFine = 0.0, hullRiv = 0.0, hullBead = 0.0;
        /* Band-limited copies of the two noise fields that end up in the
           *specular* answer, and the projected-size gate for the wear. See the
           note at the band limits below: procedural detail has no mip chain, so
           anything that steers roughness, metalness or the normal has to be
           faded out by hand at the size it stops being resolvable, or it comes
           back as a dotted white fringe on every truss member and plate edge. */
        float hullToothQ = 0.5, hullBrushQ = 0.5, hullDet = 1.0;
${y?`        float hullInk = 0.0;`:``}
        {
          float mpp = max(length(fwidth(vShipPos)), 1e-6);   // metres per pixel
          /* Plate size is not one number. It already varies by surface class —
             a barrel is plated to its radius, a flank finer than a deck — but
             within a class it was one grid over the whole ship, and at 1:1 that
             is what gives away a tiled texture: a yard does not roll the same
             sheet for the prow, the tank saddles and the sail. A slow draw over
             about twenty metres puts a different sheet size on each module
             without ever putting a seam between them, which a per-part id
             could not do anyway — the whole hull is four merged meshes.

             Except that a structural grid cannot drift. A bay pitch that wanders
             by a third over twenty metres is exactly why the flank read as an
             arbitrary scatter rather than as panelling: no two seams are
             parallel and no run of plates is one length, so there is no station
             for a frame to be at. Under the frame option the pitch is fixed
             and the variety comes from where it belongs: the four gauges the
             hull actually rolls, which is a yard's answer, not a shader's. */
          float S  = ${(1/n).toFixed(4)}
                   ${p?``:`* (0.84 + 0.30*hNoise(vShipPos*0.046 + 17.0))`};
          // A fastener head is about 30 mm and a weld bead about 60; both are
          // gone long before the plate they sit on is.
          float fine = hullLod(${(.055*n).toFixed(4)}, mpp) * ${u.toFixed(3)};
          hullFine = fine;
          vec3 sm, dt, fnm = vec3(0.0, 0.0, 0.5), fdt;
          vec2 hd, fhd;
          plating(vShipPos, vShipNrm, S, 0.026, fine, ${p?`1.0`:`0.0`}, sm, dt, hd);
          ${m?``:`hd = vec2(0.0);   // frames, but nothing cut into them`}
          // The second, finer octave of plating is a whole traversal of the
          // law; at chase distance it lands under a pixel and there is no
          // reason to walk it at all.
          float fLod = hullLod(${(.3*n).toFixed(4)}, mpp);
          if (fLod > 0.004) plating(vShipPos + 41.0, vShipNrm, S*3.1, 0.040, 0.0, 0.0, fnm, fdt, fhd);
          /* The hatch perimeter is folded straight into the seam channel rather
             than shaded separately, because that is what it physically is: the
             gap round a door leaf is a plate joint, and every term downstream —
             the dark groove, the burnished lip, the dirt that washes out of it,
             the cavity that stops indirect light reaching in, the roughness
             lift and the relief — is already written for one. Shading it on its
             own account is how a hatch ends up as a drawn rectangle with a
             hairline bevel, which is the finding. */
          float pl = max(sm.x, hd.y*0.85), px = fnm.x * fLod;
          float lip = sm.y*0.55 + fnm.y*0.20*fLod;
          hullSeam = pl; hullLip = lip; hullPlate = sm.z;
          float rivets = max(dt.x, hd.y*fine*0.9), bead = dt.y, wash = dt.z;
          float door = hd.x;
          hullRiv = rivets; hullBead = bead;

          /* ---- band limits.
             Everything below this line that steers *roughness, metalness or the
             normal* is faded out at the size its own feature stops being
             resolvable. Procedural detail has no mip chain — nothing prefilters
             it — and MSAA antialiases coverage, not shading, so a wear patch or
             a brush streak that lands under a pixel does not read as fine
             detail. It reads as a specular answer that changes completely from
             one pixel to the next, which the chromatic-aberration taps in post
             then pull apart into a dotted white and magenta fringe: glitter
             crawling on every truss member and plate edge, worst on the
             thinnest geometry and closest to the lens, which is exactly where
             an art director found it.

             The gauge for each is the feature's own wavelength in metres.
             hullLod holds full strength above about five pixels and is gone
             under two, which is where a normal stops being a normal and becomes
             a distribution of normals. The *albedo* half of each term is left
             alone: an albedo that averages is simply a slightly darker plate,
             which is the correct answer, and it is what keeps the panel read at
             chase distance after the relief has gone. */
          float lodT = hullLod(0.40, mpp);                            // paint tooth
          float lodB = hullLod(0.14, mpp);                            // brushing
          float lodP = hullLod(${(.052*n).toFixed(4)}, mpp);   // one plate groove
          hullDet = hullLod(0.25, mpp);                               // a wear patch

          // Weathering at three scales: broad blotching from vacuum exposure,
          // streaks that run aft along the flow, and a fine tooth so the paint
          // never reads as a flat fill.
          float blotch = hFbm3(vShipPos*0.09);
          float streak = hFbm3(vec3(vShipPos.x*0.55, vShipPos.y*0.55, vShipPos.z*0.055));
          float tooth  = hFbm3(vShipPos*2.6);
          hullTooth = tooth;
          hullBrush = brush(vShipPos);
          hullToothQ = mix(0.5, tooth, lodT);
          hullBrushQ = mix(0.5, hullBrush, lodB);
          /* One patchiness draw, read at several scales — by the wear masks
             below, and by the relief at the end. Three separate noise fetches
             for three masks that are all "some places, not others" is
             twenty-four hashes a fragment for a difference nobody can see. */
          float mottle = hNoise(vShipPos*0.62 + 5.0);

          /* ---- what the bake knows that no amount of noise does.
             aHull.x is how enclosed this point is — the inside of a collar,
             the angle where a strut lands on a tube, the throat of a nozzle.
             aHull.y is the opposite: a lip, a rim, a corner, the one place on
             a painted hull where bare alloy is allowed to show. */
          float occ = vHull.x * ${f.toFixed(3)};
          float exposed = vHull.y;

          // Anti-glare paint on everything that faces the sky. Two-tone is what
          // gives the hull value contrast; without it every surface sits in the
          // same narrow band and the whole ship reads as one moulded piece.
          // Keying off the *normal* means it wraps the curves correctly and
          // needs no UVs across the merged geometry.
          float up = clamp(vShipNrm.y, 0.0, 1.0);
          float top = smoothstep(0.42, 0.86, up + (blotch-0.5)*0.22);
          vec3 antiGlare = vec3(0.030, 0.038, 0.046);
          diffuseColor.rgb = mix(diffuseColor.rgb, antiGlare, top*${o.toFixed(3)});

          // Sun-bleaching, applied *after* the paint so the dark panel chalks
          // rather than staying showroom-fresh.
          float fade = pow(up, 1.9) * ${i.toFixed(2)} * (0.55 + blotch*0.7);
          diffuseColor.rgb = mix(diffuseColor.rgb,
                                 mix(diffuseColor.rgb, vec3(0.30,0.30,0.29), 0.42)*1.20, fade*0.75);

          // Soot: exhaust wash that starts behind the nozzles and thins forward.
          float aft = smoothstep(6.0, 46.0, vShipPos.z);
          float grime = aft * ${r.toFixed(2)} * (0.35 + streak*0.9);
          hullAft = aft; hullGrime = grime;

          /* ---- grime.  One layer, and it is most of what separates a vehicle
             from a render of one. Side by side against a real game's ship this
             hull was bone white and *perfectly clean*: theirs has dirt running
             out of every panel joint, pooled around every housing and staining
             the greebles yellow, and ours had a mask so shy that a flank — the
             largest, palest, most-looked-at surface on the ship — picked up
             about nine per cent of it.

             Grime needs a direction, and a spacecraft has two. Thrust carries
             the exhaust wash *aft* along the hull on every burn, and every hour
             this ship spends standing on its gear runs the same dirt *down*
             toward the pads. So the flow is aft and down, and the noise is
             squashed across that axis rather than sampled round it — which is
             the whole difference between a streak and a blotch.

             And it needs a source. Dirt does not appear in the middle of a
             clean plate: it comes out of a gap — the wash term, registered to
             the panel grid, which already dies within one plate of the seam it
             left — or out of the fold where a fitting lands on a hull, which is
             the occlusion the bake found and which no amount of noise knows.
             Source times flow is the effect; either alone is a stain map. */
          vec3 FLOW = vec3(0.0, -0.5289, 0.8487);            // aft and down
          vec3 sp = vShipPos - FLOW*dot(vShipPos, FLOW)*0.86;
          float run = hFbm3(sp*0.62 + 11.0);
          // A surface streaks when the flow runs across it. One that faces
          // straight into it is scoured instead, and one facing away is dry.
          float face = 1.0 - abs(dot(vShipNrm, FLOW));
          float pool = smoothstep(0.05, 0.44, occ);
          float src  = clamp(wash*1.20 + pool*0.90 + pl*0.35, 0.0, 1.0);
          float drip = smoothstep(0.28, 0.80, run) * face * (0.26 + 0.95*src)
                     * smoothstep(-44.0, -4.0, vShipPos.z);
          // and it caked in the folds whether anything ran out of them or not.
          // Scaled by the material's own aft-staining number, because a ceramic
          // radiator face has to stay the brightest thing on the hull and a
          // drive shroud is allowed to be filthy — one grime layer, but not one
          // amount of it.
          drip = clamp(drip*1.30 + pool*0.34, 0.0, 1.0) * ${(.34+.66*r).toFixed(3)};
          hullDrip = drip;

          // The groove itself: dark, and dirtier than the plate face. The lip
          // either side of it is burnished by handling, so it comes back up.
          diffuseColor.rgb *= 1.0 - pl*0.58 - px*0.14 + lip*0.055;
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.048,0.044,0.040),
                                 pl*(0.20 + 0.30*streak) + px*0.06);
          /* Per-plate albedo. This is the whole difference between a hull and
             a moulded shell, and it is the one thing the previous plating law
             had no way to express: it knew where the seams were but not which
             side of one it was on. Two independent draws — one for the panel,
             one for the batch of panels around it — so the drum reads as
             sections of plate rather than as static. */
          float batch = hHash(vec3(floor(vShipPos.z*${(.18/n).toFixed(4)}), 5.5, 1.9));
          diffuseColor.rgb *= 0.80 + 0.38*sm.z;
          diffuseColor.rgb *= 0.90 + 0.20*batch;
          // and some panels were replaced later than others, so they are less
          // chalked and a shade colder than the paint around them
          diffuseColor.rgb = mix(diffuseColor.rgb,
                                 diffuseColor.rgb*vec3(0.86,0.92,1.02),
                                 smoothstep(0.72, 0.94, sm.z));
          diffuseColor.rgb *= 0.74 + blotch*0.44;
          diffuseColor.rgb *= 0.90 + tooth*0.20;
          diffuseColor.rgb *= 1.0 - grime*0.55 - drip*0.22;
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.026,0.024,0.023), grime*0.42);
          /* Two steps, because dirt is not a grey filter. First the paint under
             it goes warm and dark — that is the stain itself, and keeping it a
             multiply means a bleached panel stains lighter than a sooted one,
             which is what actually happens. Then a little opaque muck on top,
             for the heavy end. Doing only the second put a flat grey wash over
             the livery and killed the one warm colour on the ship. */
          diffuseColor.rgb = mix(diffuseColor.rgb,
                                 diffuseColor.rgb*vec3(0.66,0.575,0.475), drip*0.86);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.050,0.042,0.033), drip*0.34);

          /* A hatch is a different sheet from the hull it is let into — a door
             leaf gets replaced, repainted and handled on its own schedule — and
             it sits *in* a shadowed recess, which is the half of it that the
             drawn rectangle could never do. Kept small on the albedo: the read
             has to come from the recess catching the key, not from a darker
             rectangle, or it is the same defect in a different colour. */
          diffuseColor.rgb *= 1.0 - door*0.10;
          diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb*vec3(0.95,0.97,1.03), door*0.55);

          // Fastener heads catch the light; a weld bead is proud of the plate
          // and burned clean of paint along its crown.
          diffuseColor.rgb *= 1.0 + rivets*0.26;
          diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb*vec3(1.16,1.06,0.92), bead*0.70);

          // Dirt collects where a surface folds into itself, and no amount of
          // fbm puts it in the right place.
          diffuseColor.rgb *= 1.0 - occ*0.26;
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.030,0.028,0.027), occ*0.16);

          // The cavity term the lighting tail uses. A seam, the fine detail
          // scale, the caked soot and the baked occlusion all shade what
          // indirect light can reach.
          hullCav = clamp(1.0 - pl*0.50 - px*0.18 - grime*0.20 - drip*0.20 - occ*0.58
                              - door*0.22, 0.08, 1.0);
${y?`
          // ---- markings.  Painted on top of the weathering and then worn back
          // into it, so a stencil sits in the paint instead of floating over it.
          // The wear mask reuses the fine tooth rather than fetching its own
          // fbm: five octaves of 3D noise is the most expensive thing in this
          // shader and there is no reason to pay for it twice.
          //
          // It is a *wear* mask and nothing else. Anything that pulls the ink
          // below about 0.8 stops reading as paint and starts reading as an
          // out-of-focus texture, which is what made the small lettering mush.
          vec3 ink = vec3(0.0);
${y}
          ink = clamp(ink, 0.0, 1.0);
          float dwear = (0.86 + 0.14*tooth) * (1.0 - grime*0.45) * (1.0 - pl*0.55);
          diffuseColor.rgb = mix(diffuseColor.rgb, INK_L, ink.r*dwear);
          diffuseColor.rgb = mix(diffuseColor.rgb, INK_D, ink.g*dwear);
          diffuseColor.rgb = mix(diffuseColor.rgb, INK_O, ink.b*dwear);
          // Paint is a film on top of the plate, so it is smoother than the
          // chalk around it and it is the giveaway that a marking is painted
          // on rather than printed in.
          hullInk = max(max(ink.r, ink.g), ink.b) * dwear;
`:``}
${s>.001?`
          /* ---- bare alloy where a hull actually wears.  Three causes, all
             physical: a lip or a rim is what a boot, a toolbox and a docking
             collar actually hit; plate edges get handled and scuffed; and
             everything facing into the direction of travel is scoured by dust.
             Nothing else on the ship is allowed to show metal, which is what
             keeps the wear reading as history rather than as noise — and it is
             why every ring, rail and nozzle lip here is *painted* alloy with
             the bare metal masked back in, rather than a chrome cylinder. */
          float lead  = clamp(-vShipNrm.z, 0.0, 1.0);
          float scour = pow(lead, 2.2) * smoothstep(0.30, 0.64, mottle);
          float chip  = (lip*1.25 + pl*0.55) * smoothstep(0.62, 0.26, mottle) * lodP;
          /* The rim mask is *broken*, not drawn. A 30 cm handrail in a 85 cm
             voxel has almost no matter around it, so the bake reads the whole
             rail as exposed — which is fair, a rail is exposed — but running
             an unbroken line of bare alloy down every rail, ring and bevel on
             the ship put a white outline round every part in the frame. Paint
             wears off in patches. The tooth is already in hand and is exactly
             the right frequency for one.

             And the *break* has to converge on its own mean once it goes under
             a pixel, rather than resolving to whichever side of 0.34 the noise
             happened to land on. A binary mask sampled below its own Nyquist is
             not detail, it is a coin toss per pixel, and the coin was being
             tossed on the thinnest geometry on the ship — every truss member
             read as bare metal here and painted there, one pixel apart. */
          float rim   = exposed * mix(0.62, smoothstep(0.34, 0.70, tooth), lodT)
                      * (0.55 + 0.45*mottle);
          hullWear = clamp(chip*1.05 + scour*0.75 + rim*0.85, 0.0, 1.0)
                   * ${s.toFixed(2)} * (1.0 - grime*0.5) * (1.0 - occ*0.6);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.150,0.142,0.130), hullWear*0.62);
`:``}
          /* ================================================= relief =========
             Everything above changes what a surface *is*; this is the same
             surface expressed as height, and it is the difference between a
             hull that is lit and a hull that is printed. An audit of the live
             scene graph found zero normal maps on 243 exterior materials and
             called it the largest single contributor to "the lighting looks
             unrealistic" — larger than the light rig. It is right: a panel
             line that is only an albedo stripe cannot catch a highlight, and
             a rivet with no normal is a dot.

             Authored in real metres of relief, coarse to fine, in the order
             the eye actually reads them: the plate bows, it laps its
             neighbour, the joint is cut into it, hardware stands on it, the
             hull is pitted, and the paint has a tooth. Nothing here is a new
             noise field except the craters — the bow, the tooth, the grain
             and the wash are all octaves this shader has already paid for,
             which is why a great deal more surface costs almost nothing.

             Everything under about a decimetre is gated by hullLod, because a
             feature authored below the sample spacing is not detail, it is
             static that crawls. */
          float u2m = max(length(fwidth(vViewPosition)), 1e-9) / mpp;
          float hgt = 0.0;

          /* Rolled plate is never flat. It bows between its frames by a few
             millimetres — what a coachbuilder calls oil-canning — and it is
             the one thing that separates sheet metal from a solid billet
             under a raking key: a flat face returns one value across its
             whole width and a bowed one returns a slow gradient with an edge
             at every frame. The streak octave is already in hand and is
             squashed *across* the hull, which is the axis a plate bows on. */
          hgt += (streak - 0.5)*0.030 + (mottle - 0.5)*0.011;

          /* A lap joint. Plates overlap; the sheet on one side of a seam
             stands a few millimetres proud of the one on the other, and that
             asymmetry is most of what reads as construction rather than as a
             scored line. The gap wash is already exactly this field — one
             sided, registered to the panel grid, dying within one plate —
             which is also why the dirt and the step co-register, as they do
             on anything that has ever been outside. */
          hgt += wash*0.0045;

          /* The joint itself, and the hardware standing on it.

             Band-limited by the groove's own width, which for a 2.4 m plate is
             about 125 mm: under two pixels of that, a normal taken from the
             screen-space gradient of the height field is not the seam's normal,
             it is whatever the gradient happened to be inside one pixel. The
             albedo groove stays — a seam that averages to a darker line is the
             right answer — and hullSeam still lifts the roughness at the same
             place, which is the honest way to spend the variance a normal map's
             mip chain would have absorbed. */
          hgt += (-pl*0.034 - px*0.013 + lip*0.005)*lodP + rivets*0.016 + bead*0.012;

          /* The hatch: a real recess, 30 mm deep with a lipped edge, which is
             the whole of what separates a door from a drawn rectangle. Under a
             raking key one side of it goes dark and the other catches a hard
             line; a painted rectangle does neither, at any light angle. */
          hgt += (-door*0.030 - hd.y*0.006)*lodP;

          /* Doublers bolted over the plate. Held off the rims and edges the
             bake found — a pad standing on a nozzle lip or a handrail is not
             a doubler, it is a bug — and scaled by the material's own
             hardware number, so a ceramic radiator face stays clean and a
             drive shroud does not. */
          float dk = hullLod(0.30, mpp) * ${u.toFixed(3)} * (1.0 - exposed);
          if (dk > 0.01) {
            float pad = padH(vShipPos, vShipNrm, 1.45) * dk;
            hgt += pad*0.0095;
            // a doubler is its own sheet, cut from its own batch of stock
            diffuseColor.rgb *= 1.0 - pad*0.09;
          }

          /* Impact history. Gated hard: a five-centimetre crater is under a
             pixel from anywhere but a close pass, and the branch is
             screen-coherent, so whole tiles skip it at once. */
          float pk = hullLod(0.10, mpp);
          if (pk > 0.01) hgt += pitH(vShipPos, 2.8)*0.0110*pk;

          /* The tooth of the paint and the grain of the metal under it. Both
             sub-millimetre, both gone by the time the ship is a hundred
             metres away, and between them they are the reason a surface at
             1:1 stops being a plane with marks on it. */
          float tk = hullLod(0.13, mpp);
          if (tk > 0.01) {
            hgt += (tooth - 0.5)*0.0016*tk
                 + (hullBrush - 0.5)*0.0011*${l.toFixed(3)}*tk;
          }

          // Caked soot has thickness, and a stencil is a film of paint on top
          // of the plate rather than a change of colour in it.
          hgt += drip*0.0020${y?` + hullInk*0.00045`:``};

          hullHgt = hgt * u2m;
        }
      `).replace(`#include <roughnessmap_fragment>`,`
        #include <roughnessmap_fragment>
        {
          // A polished part stays polished: the surface noise below is scaled by
          // how matte the material already is, so a mirrored trim ring is not
          // quietly sanded back to 0.28 and the ship keeps its one hard highlight.
          float grit = clamp((roughnessFactor - 0.13)*4.5, 0.0, 1.0);
          /* The floor, and it is the brief's floor. Brushing swings roughness
             by a quarter either way, which was taking a 0.55 composite down to
             0.32 on the light side of every band — a tight highlight on a
             near-black surface, which is the exact read of glossy plastic.
             Variation is allowed to make a surface *rougher* freely and
             smoother only down to here. */
          float rMin = min(0.36, roughnessFactor);
          /* Five causes, and the whole point of listing them separately is that
             one roughness for a whole material is what makes a hull read as one
             moulded piece however good the lighting and the albedo are:
               the groove is raw and dusty and the lip beside it is burnished;
               each plate weathered on its own schedule;
               the paint has a tooth that varies over a couple of metres;
               brushing runs *along* the hull, so the highlight breaks into
                 lengthwise bands instead of one soft blob;
               soot aft kills the sheen outright. */
          /* The tooth and the brushing arrive here *band-limited* — see the
             note where they are drawn. Both are sub-decimetre fields and both
             swing roughness by a quarter; sampled below their own Nyquist they
             put a different specular answer in every pixel, which is the
             glitter that was crawling on the trusses. Converged to their mean
             they are a slightly wider highlight instead, which is what the real
             surface would have done. */
          float dr = hullSeam*0.24 - hullLip*0.07
                   + (hullPlate-0.5)*0.20
                   + (hullToothQ-0.5)*0.22
                   + (hullBrushQ-0.5)*${(l*.62).toFixed(3)}
                   // a dirty streak is dust held on paint, and dust is matte:
                   // without this the grime reads as a dark *polish*
                   + hullDrip*0.30
                   + hullAft*${r.toFixed(2)}*0.20;
          roughnessFactor = clamp(roughnessFactor + dr*grit, rMin, 1.0);
          /* Worn-through alloy is the only hard highlight left on the ship, so
             it has to be genuinely hard where it appears. It appears on rims
             and lips and nowhere else — and only while a patch of it is still
             several pixels across. Past that, the honest average of a metal rim
             and the paint around it is mostly paint: the albedo lightening above
             stays and the *specular character* goes, which is the difference
             between wear that reads as history and wear that reads as sparkle. */
          roughnessFactor = mix(roughnessFactor, 0.30, hullWear*0.70*hullDet);
          /* A fastener head is turned stock and gets handled, so it is
             burnished; a weld bead is scaled and never was painted. Half of
             what makes hardware read as hardware is that it answers the key
             differently from the plate it is set into. */
          roughnessFactor = clamp(roughnessFactor - hullRiv*0.20 + hullBead*0.16, 0.05, 1.0);
${y?`          roughnessFactor = mix(roughnessFactor, 0.42, hullInk*0.55);`:``}
        }
      `).replace(`#include <metalnessmap_fragment>`,`
        #include <metalnessmap_fragment>
        metalnessFactor = mix(metalnessFactor, 0.82, hullWear*0.60*hullDet);
${y?`        metalnessFactor *= 1.0 - hullInk*0.7;`:``}
      `),e.fragmentShader=e.fragmentShader.replace(`#include <normal_fragment_maps>`,`
        #include <normal_fragment_maps>
${d>.001?`        normal = hullBump(normal, -vViewPosition, hullHgt, ${d.toFixed(3)});`:``}
        {
          vec3 dnx = dFdx(normal), dny = dFdy(normal);
          float nvar = dot(dnx, dnx) + dot(dny, dny);
          // Capped: past a quarter this stops being anti-aliasing and starts
          // sanding the trim rings flat wherever the geometry is dense.
          float widen = min(nvar*0.68, 0.24);
          roughnessFactor = sqrt(clamp(roughnessFactor*roughnessFactor + widen, 0.0, 1.0));
        }
      `),a>.001&&(e.fragmentShader=e.fragmentShader.replace(`#include <emissivemap_fragment>`,`
        #include <emissivemap_fragment>
        {
          // only on flanks that face outward, never on the anti-glare tops
          float side = 1.0 - abs(vShipNrm.y);
          float band = 0.0;
          band = max(band, 1.0 - smoothstep(0.30, 0.55, abs(vShipPos.z + 19.5)));
          band = max(band, 1.0 - smoothstep(0.30, 0.55, abs(vShipPos.z + 17.9)));
          band = max(band, 1.0 - smoothstep(0.55, 0.85, abs(vShipPos.z - 7.4)));
          // the fine tooth is already in hand from <map_fragment>; a second
          // five-octave fbm for a scuff mask is the most expensive thing in
          // the shader bought twice
          float scuff = smoothstep(0.26, 0.62, hullTooth);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.36,0.105,0.022),
                                 band*side*scuff*${a.toFixed(2)});
        }
      `))},e.customProgramCacheKey=()=>y,e}var H=(()=>{let e=[];for(let t=-1;t<=1;t++)for(let n=-1;n<=1;n++)for(let r=-1;r<=1;r++)if(t||n||r){let i=Math.hypot(t,n,r);e.push(t/i,n/i,r/i)}return new Float32Array(e)})();function re(e,t=.85){let n=1/0,r=1/0,i=1/0,a=-1/0,o=-1/0,s=-1/0;for(let t of e){let e=t.attributes.position;if(!e)continue;let c=e.array;for(let e=0;e<c.length;e+=3)c[e]<n&&(n=c[e]),c[e]>a&&(a=c[e]),c[e+1]<r&&(r=c[e+1]),c[e+1]>o&&(o=c[e+1]),c[e+2]<i&&(i=c[e+2]),c[e+2]>s&&(s=c[e+2])}if(!isFinite(n))return null;let c=t*5;n-=c,r-=c,i-=c,a+=c,o+=c,s+=c;let l=1/t,u=Math.max(2,Math.min(200,Math.ceil((a-n)*l))),d=Math.max(2,Math.min(200,Math.ceil((o-r)*l))),f=Math.max(2,Math.min(200,Math.ceil((s-i)*l))),p=new Uint8Array(u*d*f),m={x0:n,y0:r,z0:i,inv:l,nx:u,ny:d,nz:f,data:p,cell:t},h=(e,t,a)=>{let o=(e-n)*l|0,s=(t-r)*l|0,c=(a-i)*l|0;o<0||s<0||c<0||o>=u||s>=d||c>=f||(p[(c*d+s)*u+o]=1)};for(let t of e){let e=t.attributes.position;if(!e)continue;let n=e.array,r=t.index?t.index.array:null,i=r?r.length:e.count;for(let e=0;e<i;e+=3){let t=(r?r[e]:e)*3,i=(r?r[e+1]:e+1)*3,a=(r?r[e+2]:e+2)*3,o=n[t],s=n[t+1],c=n[t+2],u=n[i],d=n[i+1],f=n[i+2],p=n[a],m=n[a+1],g=n[a+2],_=Math.max(Math.hypot(u-o,d-s,f-c),Math.hypot(p-o,m-s,g-c),Math.hypot(p-u,m-d,g-f)),v=Math.min(12,Math.max(1,Math.ceil(_*l*1.4)));for(let e=0;e<=v;e++)for(let t=0;t<=v-e;t++){let n=e/v,r=t/v,i=1-n-r;h(o*i+u*n+p*r,s*i+d*n+m*r,c*i+f*n+g*r)}}}return m}function ie(e,t){if(!t)return;let{x0:n,y0:r,z0:i,inv:a,nx:o,ny:s,nz:c,data:l,cell:u}=t,d=(e,t,u)=>{let d=(e-n)*a|0,f=(t-r)*a|0,p=(u-i)*a|0;return d<0||f<0||p<0||d>=o||f>=s||p>=c?0:l[(p*s+f)*o+d]},f=[u*1.7,u*3.4],p=[.62,.38],m=H.length/3,h=new Map,g=[],_=(e,t,n)=>(Math.round(e*8)+8192)*16777216+(Math.round(t*8)+8192)*4096+(Math.round(n*8)+8192),v=[];for(let t of e){let e=t.attributes.position;if(!e){v.push(null);continue}let n=e.array,r=new Int32Array(e.count);for(let t=0;t<e.count;t++){let e=n[t*3],i=n[t*3+1],a=n[t*3+2],o=_(e,i,a),s=h.get(o);if(s===void 0){s=g.length,h.set(o,s);let t=0,n=0;for(let r=0;r<f.length;r++){let o=f[r],s=p[r];for(let r=0;r<m;r++)t+=s*d(e+H[r*3]*o,i+H[r*3+1]*o,a+H[r*3+2]*o),n+=s}g.push(t/n)}r[t]=s}v.push(r)}let y=Float32Array.from(g).sort(),b=e=>y[Math.min(y.length-1,Math.max(0,Math.round(e*(y.length-1))))],x=b(.62),S=b(.42),w=Math.max(x+.13,b(.97)),T=Math.min(S-.13,b(.03)),E=new Float32Array(g.length*2);for(let e=0;e<g.length;e++){let t=g[e],n=Math.min(1,Math.max(0,(t-x)/(w-x))),r=Math.min(1,Math.max(0,(S-t)/(S-T)));E[e*2]=n*n*(3-2*n),E[e*2+1]=r**2.3}for(let t=0;t<e.length;t++){let n=v[t];if(!n)continue;let r=new Uint8Array(n.length*2);for(let e=0;e<n.length;e++)r[e*2]=E[n[e]*2]*255|0,r[e*2+1]=E[n[e]*2+1]*255|0;e[t].setAttribute(`aHull`,new C(r,2,!0))}}function U(e,{pos:t=[0,0,0],rot:n=[0,0,0],scale:r=null}={}){let i=e.index?e.toNonIndexed():e.clone();r&&i.scale(r[0],r[1],r[2]),n[0]&&i.rotateX(n[0]),n[1]&&i.rotateY(n[1]),n[2]&&i.rotateZ(n[2]),i.translate(t[0],t[1],t[2]);for(let e of Object.keys(i.attributes))e!==`position`&&e!==`normal`&&e!==`uv`&&i.deleteAttribute(e);return i.morphAttributes={},i.clearGroups(),i}var W=.07;function G(e,t,n,r=.12){let i=new E,a=e/2,o=t/2,s=Math.min(r,a*.45,o*.45),c=Math.min(Math.max(s*.5,W),s*.92,n*.42);i.moveTo(-a+s,-o),i.lineTo(a-s,-o),i.quadraticCurveTo(a,-o,a,-o+s),i.lineTo(a,o-s),i.quadraticCurveTo(a,o,a-s,o),i.lineTo(-a+s,o),i.quadraticCurveTo(-a,o,-a,o-s),i.lineTo(-a,-o+s),i.quadraticCurveTo(-a,-o,-a+s,-o);let l=new d(i,{depth:n,bevelEnabled:!0,bevelSize:c,bevelThickness:c,bevelSegments:2,curveSegments:4});return l.translate(0,0,-n/2),l}function K(e,t,n=.1){let r=new E;r.moveTo(e[0][0],e[0][1]);for(let t=1;t<e.length;t++)r.lineTo(e[t][0],e[t][1]);r.closePath();let i=n>0,a=Math.min(Math.max(n,W),t*.45),o=new d(r,{depth:t,bevelEnabled:i,bevelSize:a,bevelThickness:a,bevelSegments:1,curveSegments:2});return o.translate(0,0,-t/2),o}function q(e,t=.18,n=!0,r=!0){let i=e.map(([e,n,r,i=0,a=0])=>{let o=Math.min(t,n*.62),s=Math.min(t,r*.62),c=[[n,-r+s],[n,r-s],[n-o,r],[-n+o,r],[-n,r-s],[-n,-r+s],[-n+o,-r],[n-o,-r]],l=new Float32Array(24);for(let t=0;t<8;t++)l[t*3]=e,l[t*3+1]=c[t][1]+i,l[t*3+2]=c[t][0]+a;return l}),a=i.length,o=(a-1)*8*2+(n?6:0)+(r?6:0),s=new Float32Array(o*9),c=new Float32Array(o*9),l=new Float32Array(o*6),u=0,d=(e,t,n,r,o,d)=>{let f=i[e],p=i[n],m=i[o],h=f[t*3],g=f[t*3+1],_=f[t*3+2],v=p[r*3],y=p[r*3+1],b=p[r*3+2],x=m[d*3],S=m[d*3+1],C=m[d*3+2],w=v-h,T=y-g,E=b-_,D=x-h,O=S-g,k=C-_,A=T*k-E*O,j=E*D-w*k,M=w*O-T*D,ee=Math.hypot(A,j,M)||1;A/=ee,j/=ee,M/=ee;let N=u*9,P=u*6;s[N]=h,s[N+1]=g,s[N+2]=_,s[N+3]=v,s[N+4]=y,s[N+5]=b,s[N+6]=x,s[N+7]=S,s[N+8]=C;for(let e=0;e<3;e++)c[N+e*3]=A,c[N+e*3+1]=j,c[N+e*3+2]=M;l[P]=t/8,l[P+1]=e/(a-1),l[P+2]=r/8,l[P+3]=n/(a-1),l[P+4]=d/8,l[P+5]=o/(a-1),u++};for(let e=0;e<a-1;e++)for(let t=0;t<8;t++){let n=(t+1)%8;d(e,t,e+1,t,e,n),d(e,n,e+1,t,e+1,n)}if(n)for(let e=1;e<7;e++)d(0,0,0,e,0,e+1);if(r)for(let e=1;e<7;e++)d(a-1,0,a-1,e+1,a-1,e);let f=new p;return f.setAttribute(`position`,new C(s,3)),f.setAttribute(`normal`,new C(c,3)),f.setAttribute(`uv`,new C(l,2)),f}function ae(e,t,n,r=n,i=12,o=0){let s=new a(e[0],e[1],e[2]),c=new a(t[0],t[1],t[2]).sub(s),l=c.length();if(l<1e-6)return[];let d=new g().setFromUnitVectors(new a(0,1,0),c.clone().multiplyScalar(1/l)),f=[s.x+c.x/2,s.y+c.y/2,s.z+c.z/2],p=[],m=(e,t)=>{e.applyQuaternion(d),e.translate(s.x+c.x*t,s.y+c.y*t,s.z+c.z*t),p.push(U(e))},h=new u(r,n,l,i,1);if(h.applyQuaternion(d),h.translate(f[0],f[1],f[2]),p.push(U(h)),o>0){let e=Math.min(o*1.6,l*.14);m(new u(n*1.55,n*1.15,e,i),.5*e/l),m(new u(r*1.15,r*1.55,e,i),1-.5*e/l)}return p}function oe(e,t=32){let n=e.attributes.position;if(!n||e.index)return e;let r=n.array,i=n.count,a=i/3|0,o=new Float32Array(a*3),s=new Float32Array(a*3);for(let e=0;e<a;e++){let t=e*9,n=r[t+3]-r[t],i=r[t+4]-r[t+1],a=r[t+5]-r[t+2],c=r[t+6]-r[t],l=r[t+7]-r[t+1],u=r[t+8]-r[t+2],d=i*u-a*l,f=a*c-n*u,p=n*l-i*c,m=Math.hypot(d,f,p)||1;o[e*3]=d,o[e*3+1]=f,o[e*3+2]=p,s[e*3]=d/m,s[e*3+1]=f/m,s[e*3+2]=p/m}let c=(e,t,n)=>((Math.round(e*256)+32768)*65536+(Math.round(t*256)+32768))*65536+(Math.round(n*256)+32768),l=new Map;for(let e=0;e<a;e++)for(let t=0;t<3;t++){let n=(e*3+t)*3,i=c(r[n],r[n+1],r[n+2]),a=l.get(i);a===void 0?l.set(i,[e]):a.push(e)}let u=Math.cos(t*Math.PI/180),d=new Float32Array(i*3);for(let e=0;e<a;e++){let t=s[e*3],n=s[e*3+1],i=s[e*3+2];for(let a=0;a<3;a++){let f=(e*3+a)*3,p=l.get(c(r[f],r[f+1],r[f+2])),m=0,h=0,g=0;for(let e=0;e<p.length;e++){let r=p[e]*3;s[r]*t+s[r+1]*n+s[r+2]*i<u||(m+=o[r],h+=o[r+1],g+=o[r+2])}let _=Math.hypot(m,h,g);_>1e-12?(d[f]=m/_,d[f+1]=h/_,d[f+2]=g/_):(d[f]=t,d[f+1]=n,d[f+2]=i)}}return e.setAttribute(`normal`,new C(d,3)),e}function se(t,n,r){if(!t.length)return null;let i=e(t,!1);oe(i,32);let a=new S(i,n);return a.frustumCulled=!1,r&&r.add(a),t.forEach(e=>e.dispose()),t.length=0,a}function ce(e={}){return V(new l({color:e.color??11843510,metalness:e.metalness??.14,roughness:e.roughness??.44,envMapIntensity:e.env??1.7}),{plate:e.plate??3.4,bleach:e.bleach??.12,soot:e.soot??.55,matteMin:e.matteMin??0,frame:e.frame??0,doors:e.doors??0,edge:e.edge??.55,brushed:e.brushed??1,rivet:e.rivet??.5,plume:e.plume??null})}function le(e,t=1){return new r({color:new b(e).multiplyScalar(t),toneMapped:!1})}var J=`
#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
  varying float vFragDepth;
  varying float vIsPerspective;
  bool lsIsPersp(mat4 m){ return m[2][3] == -1.0; }
#endif
`,ue=`
#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
  vFragDepth = 1.0 + gl_Position.w;
  vIsPerspective = float(lsIsPersp(projectionMatrix));
#endif
`,de=`
#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
  uniform float logDepthBufFC;
  varying float vFragDepth;
  varying float vIsPerspective;
#endif
`,fe=`
#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
  gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
`,pe=`
${J}
varying vec2 vUvP;
varying vec3 vNv;
varying vec3 vVv;
varying vec3 vAx;
void main(){
  vUvP = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vVv = -mv.xyz;                       // toward the eye, view space
  vNv = normalMatrix * normal;
  vAx = normalMatrix * vec3(0.0, 0.0, 1.0);
  gl_Position = projectionMatrix * mv;
${ue}
}
`,me=`
precision highp float;
${de}
varying vec2 vUvP;
varying vec3 vNv;
varying vec3 vVv;
varying vec3 vAx;
uniform float uTime;
uniform float uPower;
uniform vec3  uColA;      // throat, hottest
uniform vec3  uColB;      // cooled sheath
uniform vec3  uColC;      // the ionised fringe, coldest

float ph(vec2 p){ return fract(sin(dot(p, vec2(41.7, 289.3)))*43758.5453); }
float pn(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(ph(i), ph(i+vec2(1,0)), f.x),
             mix(ph(i+vec2(0,1)), ph(i+vec2(1,1)), f.x), f.y);
}

void main(){
  float t = clamp(vUvP.y, 0.0, 1.0);           // 0 at the throat -> 1 at the tip

  /* Throttle. Below about a twentieth there is no torch at all — only the
     throat core, which is the drive lit and idling. A plume that is always
     burning is a plume the eye stops reading, and a full-length one in a
     parked shot walks the auto-exposure down and takes the hull with it.
     Tested first because this cone is twenty-six metres long and covers a large
     part of the frame at chase distance: the idle case must not pay for the
     noise, and the branch is uniform, so it costs nothing when it is taken. */
  float pw = clamp(uPower, 0.0, 1.8);
  float lit = smoothstep(0.02, 0.30, pw);
  if (lit < 0.002) {
    gl_FragColor = vec4(0.0);
${fe}
    return;
  }
  pw = max(pw, 0.10);

  vec3 N = normalize(vNv), V = normalize(vVv), A = normalize(vAx);

  /* ---- the chord, not the shell ---------------------------------------
     For a convex body of revolution the length of gas a view ray crosses is
     2R|N.V| at the point where it enters, and that ray passes the axis at
     R.sqrt(1-(N.V)^2). So one dot product gives both how much plume is in
     front of this pixel and *where across the plume* it is — and because the
     cone is drawn double sided and added, the near and far faces sum to the
     whole chord for nothing. Shading a shell without this is limb-bright,
     which is exactly backwards: it draws a bright ring and a hollow middle.

     Looking straight down the axis is the one case the identity does not
     cover — N.V goes to zero all round the rim while the true chord is the
     whole remaining length of the torch — so it is blended out by how axial
     the view is. That is the view from dead astern, which is the view the
     plume has to survive. */
  float nv = abs(dot(N, V));
  float axial = abs(dot(A, V));
  float rr = sqrt(max(0.0, 1.0 - nv*nv));      // 0 on the axis, 1 at the edge
  float chord = mix(nv*0.92 + 0.08, 1.35, axial*axial*axial);

  /* Radial temperature. A fusion exhaust is not one colour: the collimated
     core is white with the blue barely in it, the sheath around it is where
     the recombination light comes from, and the outermost skirt is cold
     enough to go violet. */
  vec3 col = mix(uColA, uColB, smoothstep(0.05, 0.52, rr));
  col = mix(col, uColC, smoothstep(0.50, 1.0, rr));

  // Axial density: dense and collimated at the throat, thinning fast as the
  // flow expands and cools.
  float dens = pow(1.0 - t*0.97, 2.9);

  /* Standing shock cells. Closely spaced at the throat and stretching out as
     the flow expands, and only in the first third — a torch banded from end to
     end reads as corduroy. */
  float cell = 0.5 + 0.5*sin(pow(t, 0.70)*30.0 - uTime*8.0);
  cell *= smoothstep(0.40, 0.03, t) * (1.0 - rr*0.6);

  /* Turbulent break-up downstream, and a fast flicker near the throat. There
     is no scene texture to refract here so this stands in for heat shimmer:
     the density itself boils, which is what the eye reads as heat. One octave
     — this shader covers a large, doubled-up area of the frame and the second
     octave cost four sines a fragment for something nothing could see. */
  float turb = pn(vec2(t*8.0 - uTime*2.6, rr*3.4 + uTime*0.7));
  float boil = mix(1.0, 0.42 + turb*1.10, smoothstep(0.06, 0.72, t));
  float flick = 0.94 + 0.06*sin(uTime*41.0 + t*23.0);

  // radial falloff at the skirt, so the cone has no hard edge anywhere
  float skirt = 1.0 - smoothstep(0.55, 1.0, rr);

  /* One face, doubled. The chord identity wants the near and the far wall of
     the cone summed, and drawing the mesh double sided does that for free —
     but it also doubles the fragments, and at chase distance this quad was
     half the frame. The two walls carry very nearly the same |N.V| at the same
     pixel, so the near one is worth exactly two of itself. */
  float amt = dens * chord * skirt * boil * flick * pow(pw, 0.9) * lit * 2.0;
  /* And it *ends*. A torch that fades all the way to the far end of its mesh
     puts a large dim area in the frame, and a large dim area is exactly what
     auto-exposure meters on: the first cut had the hull at 84% black in a burn
     shot not because the core was too bright but because the tail was too big. */
  amt *= smoothstep(0.80, 0.06 + pw*0.30, t);
  /* Bright enough that the core clips — a frame in which nothing clips reads
     as flat — but no brighter. At 170 the torches were most of the light in
     the frame, auto-exposure stopped down to meet them, and a burn shot came
     back with the hull at 85% black. Clipping a thin core is the read; boiling
     the whole plume is a light meter problem. */
  vec3 rad = col * amt * 108.0 + uColA * cell * amt * 46.0;

  gl_FragColor = vec4(rad, 1.0);
${fe}
}
`,he=`
${J}
attribute vec3 aCenter;
uniform float uSize;
uniform float uPower;
varying vec2 vQ;
void main(){
  vQ = uv;
  vec4 mv = modelViewMatrix * vec4(aCenter, 1.0);
  mv.xy += position.xy * uSize * (0.74 + 0.34*clamp(uPower, 0.0, 1.8));
  gl_Position = projectionMatrix * mv;
${ue}
}
`,ge=`
precision highp float;
${de}
uniform float uPower;
uniform vec3  uColA;
uniform vec3  uColB;
varying vec2 vQ;
void main(){
  vec2 d = vQ*2.0 - 1.0;
  float r = length(d);
  float m = step(r, 1.0);
  float core = pow(max(1.0 - r, 0.0), 3.6);
  float halo = pow(max(1.0 - r, 0.0), 1.3)*0.28;
  /* Idle is a *lit* drive, not a burning one. The exponent is what separates
     the two: a linear ramp made a parked ship look like it was under power,
     which is the same mistake as a plume that never goes out. */
  float pw = max(clamp(uPower, 0.0, 1.8), 0.10);
  vec3 c = mix(uColB, uColA, core);
  gl_FragColor = vec4(c * (core*250.0 + halo*40.0) * pow(pw, 1.45) * m, 1.0);
${fe}
}
`;function _e(e,t=26,n=24){let r=e=>{let t=Math.min(1,Math.max(0,e));return t*t*(3-2*t)},i=e=>(1.68+1.2*r(e/.17))*(1-.87*r((e-.18)/.52)),a=new u(1,1,e,t,n,!0),o=a.attributes.position,s=a.attributes.normal,c=1/(n*4);for(let t=0;t<o.count;t++){let n=o.getX(t),r=o.getZ(t),a=o.getY(t),l=Math.min(1,Math.max(0,(a+e/2)/e)),u=i(l),d=(i(Math.min(1,l+c))-i(Math.max(0,l-c)))/(2*c);o.setX(t,n*u),o.setZ(t,r*u);let f=e*n,p=-d,m=e*r,h=Math.hypot(f,p,m)||1;s.setXYZ(t,f/h,p/h,m/h)}return a.translate(0,e/2,0),a.rotateX(Math.PI/2),a}var ve=[{cell:`reg`,rect:[-19.5,-1.5],cyl:{c:[0,0],r:5.2,a0:-.83,a1:-.275,mirror:!0}},{cell:`name`,plane:`y`,rect:[-16.5,-1.55,5.5,1.55],side:1},{cell:`mark`,plane:`x`,rect:[10.4,7.6,15.9,13.1],both:!0},{cell:`hatch`,plane:`x`,rect:[-9,-.5,-5.8,2.7],side:1,flipU:!0},{cell:`arrow`,plane:`x`,rect:[-49.5,-1.4,-44.5,.2],both:!0}],ye=[{cell:`num`,rect:[12.9,17],cyl:{c:[11,-3.4],r:2.6,a0:-.62,a1:.62,mirror:!0}},{cell:`caut`,rect:[17.8,22.4],cyl:{c:[11,-3.4],r:2.6,a0:.96,a1:1.31,mirror:!0}},{cell:`haz`,plane:`y`,rect:[-13.6,-1.1,-5.2,1.1],side:-1}],be=.2,Y=(e,t=6,n=96)=>Math.max(t,Math.min(n,2*Math.ceil(Math.PI*Math.abs(e)/be))),xe=(e,t,n=3,r=64)=>Math.max(n,Math.min(r,Math.ceil(Math.abs(e*t)/be)));function Se(e,t){let n=e.length,r=[],i=[],a=(e,t,n,a,o)=>{r.push(e*Math.cos(n),t,e*Math.sin(n)),i.push(a,o)};for(let r=0;r<n-1;r++){let[i,o]=e[r],[s,c]=e[r+1];if(i<1e-5&&s<1e-5)continue;let l=r/(n-1),u=(r+1)/(n-1);for(let e=0;e<t;e++){let n=e/t,r=(e+1)/t,d=n*Math.PI*2,f=r*Math.PI*2;i<1e-5?(a(0,o,d,n,l),a(s,c,d,n,u),a(s,c,f,r,u)):s<1e-5?(a(i,o,d,n,l),a(0,c,d,n,u),a(i,o,f,r,l)):(a(i,o,d,n,l),a(s,c,d,n,u),a(s,c,f,r,u),a(i,o,d,n,l),a(s,c,f,r,u),a(i,o,f,r,l))}}let s=new p;return s.setAttribute(`position`,new o(r,3)),s.setAttribute(`uv`,new o(i,2)),s.computeVertexNormals(),s}function Ce(e,t,n,r=.06,o=[0,1,0]){let s=new a(e[0],e[1],e[2]),c=new a(t[0],t[1],t[2]).sub(s),l=c.length();if(l<1e-6)return null;let u=q(n.map(([e,t,n,r=0,i=0])=>[e*l,t,n,r,i]),r),d=c.multiplyScalar(1/l),f=new a().crossVectors(d,new a(o[0],o[1],o[2]));f.lengthSq()<1e-8&&f.crossVectors(d,new a(0,0,1)),f.normalize();let p=new a().crossVectors(f,d).normalize();return u.applyMatrix4(new i().makeBasis(d,p,f)),u.translate(s.x,s.y,s.z),u}function we(e,n,r=24,i=7){return new t(new m(e.map(e=>new a(e[0],e[1],e[2]))),r,n,i,!1)}function Te(e,t,n,r,i){let a=[];for(let e=0;e<=6;e++){let n=Math.PI*.5+e/6*Math.PI;a.push([Math.cos(n)*t,Math.sin(n)*t])}a.push([e*.32,-r],[e*.68,-r]);for(let t=0;t<=6;t++){let r=-Math.PI*.5+t/6*Math.PI;a.push([e+Math.cos(r)*n,Math.sin(r)*n])}return a.push([e*.68,r],[e*.32,r]),K(a,i,Math.min(.055,i*.4))}var X=(e,t)=>new u(e,e*.94,t,6);function Ee(){let t=new n,i={},o={value:0},d={power:o,at:[[11,-3.4,24.4],[-11,-3.4,24.4]],len:20,rad:2.7,col:[.52,.72,1],gain:34},m=V(new l({color:9342342,metalness:.04,roughness:.74,envMapIntensity:.85}),{plate:2.4,bleach:.85,soot:.55,livery:0,glare:.82,edge:.24,brushed:.35,frame:1,marks:ve,plume:d}),g=V(new l({color:9342342,metalness:.04,roughness:.74,envMapIntensity:.85}),{plate:3.7,bleach:.85,soot:.55,livery:0,glare:.82,edge:.24,brushed:.35,frame:1,marks:ve,plume:d}),y=V(new l({color:9144963,metalness:.05,roughness:.72,envMapIntensity:.85}),{plate:1.15,bleach:.8,soot:.55,livery:0,glare:.82,edge:.3,brushed:.35,rivet:1.15,frame:1,marks:ve,plume:d}),x=V(new l({color:2303274,metalness:.1,roughness:.58,envMapIntensity:.85}),{plate:1.3,bleach:.2,soot:.85,edge:.2,brushed:.75,frame:1,marks:ye,plume:d}),E=V(new l({color:8090730,metalness:.15,roughness:.52,envMapIntensity:1.05}),{plate:.9,bleach:.25,soot:.7,edge:.5,brushed:1,frame:1,doors:0,plume:d}),O=ce({soot:.6,env:1.05,matteMin:1,frame:1,doors:0,plume:d}),k=V(new l({color:6448479,metalness:.18,roughness:.58,envMapIntensity:1}),{plate:1.5,bleach:.1,soot:.44,edge:.52,brushed:.38,rivet:.95,bump:.85,frame:1,plume:d}),A=V(new l({color:13027787,metalness:.88,roughness:.19,envMapIntensity:1.9}),{plate:5,bleach:0,soot:.3,edge:.14,brushed:1,rivet:0,bump:.2,plume:d}),j=V(new l({color:9192472,metalness:.14,roughness:.66,envMapIntensity:.8}),{plate:1.1,bleach:.9,soot:.4,edge:.22,brushed:.3,frame:1,doors:0,plume:d}),M=V(new l({color:11053476,metalness:0,roughness:.94,envMapIntensity:.7,emissive:new b(5250053),emissiveIntensity:0,side:2}),{plate:2.1,bleach:.5,soot:.15,edge:.12,brushed:.15,rivet:.35,bump:.45,frame:1,doors:0,plume:d}),N=ee(new c({color:727586,metalness:0,roughness:.04,envMapIntensity:3.4,clearcoat:1,clearcoatRoughness:.02,emissive:new b(861748),emissiveIntensity:.5,transparent:!0,opacity:.46,depthWrite:!1,side:2})),P=le(10406143,1.9),te=le(9213604,.55),F=[],ne=[],I=[],L=[],R=[],z=[],B=[],H=[],W=[],J=[],ue=[];{let e=G(19,4.6,11,1.4);F.push(U(e,{pos:[0,.2,-52]})),L.push(U(G(19.4,1.6,11.3,1.2),{pos:[0,-1.55,-52]}));for(let e of[1,-1])B.push(U(G(.42,.3,10.4,.1),{pos:[8.9*e,2.44,-52]}));let t={rot:[0,-Math.PI/2,0]};for(let e of[1,-1]){I.push(U(q([[-56.9,3.16,.24,0,-5.42*e],[-54.2,3.34,.27,0,-5.36*e],[-51,3.34,.27,0,-5.36*e],[-48.6,3.06,.24,0,-5.26*e]],.09),{rot:t.rot,pos:[0,2.44,0]}));for(let t=0;t<8;t++){let n=-56.2+t*1.05;for(let t of[2.42,8.42])B.push(U(X(.11,.09),{pos:[t*e,2.68,n]}))}}L.push(U(q([[-57,2.05,.12],[-48.4,2.05,.12]],.05),{rot:t.rot,pos:[0,2.3,0]})),z.push(U(new u(.26,.26,8.4,Y(.26,12)),{pos:[.78,2.58,-52.5],rot:[Math.PI/2,0,0]}));for(let e of[-55.8,-52.6,-49.4])z.push(U(q([[-.4,.18,.3],[.4,.18,.3]],.05),{pos:[.78,2.44,e]}));let n=[[-57.2,-55.55,1,1.24],[-55.25,-53.9,.66,1.46],[-53.6,-51.65,1.04,1.2]];for(let e of[1,-1]){L.push(U(q([[-57.3,.2,1.8,.55],[-46.7,.2,1.8,.55]],.06),{rot:t.rot,pos:[9.36*e,0,0]}));for(let[r,i,a,o]of n){I.push(U(q([[r,.26,o],[r+.3,.3,o+.07],[i-.3,.3,o+.07],[i,.26,o]],.07),{rot:t.rot,pos:[9.72*e,a,0]}));for(let t=0;t<4;t++){let n=r+.32+t/3*(i-r-.64);for(let t of[o-.2,-(o-.2)])B.push(U(X(.1,.09),{rot:[0,0,Math.PI/2*e],pos:[10.02*e,a+t,n]}))}}B.push(U(q([[-57.5,.34,.22],[-46.9,.28,.18]],.06),{rot:t.rot,pos:[9.88*e,-.72,0]})),z.push(U(q([[-1.35,.66,1.5],[-.55,.8,1.66],[.45,.6,1.36]],.16),{pos:[8.7*e,.3,-57.3]})),z.push(U(q([[-1.1,.34,.17],[.45,.28,.14]],.07),{pos:[8.76*e,2.44,-57.2]}))}L.push(U(K([[-5.5,0],[5.5,0],[4.2,-2.5],[-4.2,-2.5]],9.6,.3),{pos:[0,-1.9,-53],rot:[0,Math.PI/2,0]})),J.push(U(new h(.42,Y(.42,24)),{pos:[0,-3.1,-57.3],rot:[-.5,0,0]})),B.push(U(new v(.56,.09,8,Y(.56,26)),{pos:[0,-3.05,-57.25],rot:[-.5,0,0]}));let r=G(15.5,3.1,1.2,.5);L.push(U(r,{pos:[0,.2,-57.6]}));let i={rot:[0,Math.PI,0]};z.push(U(q([[-58.86,1.34,1.14],[-58.3,1.44,1.24],[-57.9,1.3,1.1]],.1),{rot:t.rot,pos:[-5.35,.25,0]})),L.push(U(G(2.16,1.86,.16,.06),{pos:[-5.35,.25,-58.52]})),W.push(U(new w(1.92,1.62),{pos:[-5.35,.25,-58.61]})),z.push(U(K([[-1.42,0],[1.42,0],[1.16,.78],[-1.16,.78]],.14,.06),{rot:[1.24,0,0],pos:[-5.35,1.66,-58.86]})),z.push(U(Se([[1.02,0],[1.28,0],[1.28,.95],[.42,.95],[.42,.74],[.62,.74],[.62,.5],[.82,.5],[.82,.26],[1.02,.26],[1.02,0]],Y(1.28,26)),{rot:[Math.PI/2,0,0],pos:[-1.65,.25,-58.34]})),J.push(U(new h(.4,Y(.4,20)),{rot:i.rot,pos:[-1.65,.25,-57.42]})),z.push(U(q([[-58.46,1,.88],[-58.14,1.08,.96]],.08),{rot:t.rot,pos:[1.35,.25,0]})),L.push(U(G(1.72,1.52,.14,.05),{pos:[1.35,.25,-58.3]}));for(let e=0;e<5;e++)z.push(U(q([[-.84,.16,.055],[.84,.16,.055]],.03),{rot:[.44,0,0],pos:[1.35,-.56+e*.29,-58.42]}));z.push(U(q([[-58.44,.72,1.04],[-58.12,.78,1.1]],.07),{rot:t.rot,pos:[4.2,.25,0]}));for(let[e,t,n]of[[-.42,.44,.28],[.4,.4,.21],[.02,-.4,.24]])z.push(U(new u(n+.08,n+.1,.26,Y(n,16)),{pos:[4.2+e,.25+t,-58.5],rot:[Math.PI/2,0,0]})),(n>.25?J:L).push(U(new h(n,Y(n,16)),{rot:i.rot,pos:[4.2+e,.25+t,-58.56]}));for(let e=0;e<4;e++)B.push(U(X(.085,.08),{rot:[Math.PI/2,0,0],pos:[4.2+(e%2?.88:-.88),.25+(e<2?.94:-.94),-58.44]}));L.push(U(q([[-58.34,1.12,.82],[-58.16,1.16,.86]],.05),{rot:t.rot,pos:[6.95,.25,0]}));for(let e=0;e<6;e++)z.push(U(q([[-.72,.055,.055],[.72,.055,.055]],.02),{rot:[0,0,Math.PI/2],pos:[6.05+e*.36,.25,-58.28]}));{let e=4.85,t=-50.9;for(let[n,r,i,a]of[[0,-1.3,1.62,.13],[0,1.3,1.62,.13],[-1.49,0,.13,1.43],[1.49,0,.13,1.43]])z.push(U(q([[-i,a,.14],[i,a,.14]],.05),{pos:[e+n,2.68,t+r]}));I.push(U(K([[-1.36,-1.14],[1.36,-1.14],[1.36,1.14],[-1.36,1.14]],.2,.08),{rot:[Math.PI/2,0,0],pos:[e,2.62,t]}));for(let e of[-.86,0,.86])B.push(U(new u(.13,.13,.4,10),{pos:[6.25,2.74,t+e],rot:[Math.PI/2,0,0]}));B.push(U(q([[-.62,.11,.09],[.62,.11,.09]],.04),{rot:[0,.34,0],pos:[e,2.8,t]})),z.push(U(new u(.2,.22,.16,12),{pos:[e,2.76,t]}));for(let e of[-1.05,1.05])B.push(U(X(.14,.12),{pos:[3.7499999999999996,2.76,t+e]}));for(let e of[-.95,.95])B.push(U(new v(.3,.075,6,14,Math.PI),{pos:[2.4999999999999996,2.62,t+e]}));z.push(U(q([[-.52,.36,.09],[.52,.36,.09]],.04),{rot:[0,0,-.3],pos:[9.86,1.1,-49]}))}for(let e of[1,-1]){let t=G(5,3,15,1);F.push(U(t,{pos:[8*e,.1,-44],rot:[0,0,.2*e]})),H.push(U(G(.9,.5,12,.2),{pos:[10.6*e,1.4,-48],rot:[0,-.06*e,0]})),B.push(U(G(.42,.3,13.5,.1),{pos:[9.3*e,1.75,-44.5],rot:[0,-.05*e,0]}))}}{let e=[45.5,2.2],t=[57.4,2.25],n=[56.4,3.3],r=[54.2,5.25],i=[50,5.4],a=[46.4,3.5],o=[54.2,4.05],c=[50,4.2],l=3.28;for(let r of[1,-1])F.push(U(K([e,t,n,o,c,a],.46,.12),{pos:[l*r,0,0],rot:[0,Math.PI/2,0]})),W.push(U(new w(4.3,1.35),{pos:[3.51*r,4.75,-52.1],rot:[0,Math.PI/2,0]})),B.push(U(G(.36,.32,4.5,.09),{pos:[l*r,4.12,-52.1]})),B.push(U(G(.32,1.5,.32,.08),{pos:[l*r,4.75,-54.1]})),B.push(U(G(.32,1.5,.32,.08),{pos:[l*r,4.8,-50.1]}));F.push(U(G(6.6,.45,1.5,.15),{pos:[0,2.55,-56.9]})),F.push(U(K([i,a,e,[50,2.2]],6.5,.14),{rot:[0,Math.PI/2,0]})),L.push(U(G(6.6,.55,7.2,.15),{pos:[0,2.45,-53]})),L.push(U(G(4.6,.55,1.6,.15),{pos:[0,3.15,-55.5],rot:[-.45,0,0]})),J.push(U(new w(3.8,1.15),{pos:[0,3.46,-55.4],rot:[-1.1,0,0]})),J.push(U(new w(1.5,.5),{pos:[0,3.02,-56.4],rot:[-.2,0,0]})),J.push(U(new w(4.2,.2),{pos:[0,4.55,-49.35],rot:[0,Math.PI,0]}));for(let e of[1,-1])L.push(U(G(1.2,1.85,.32,.1),{pos:[1.3*e,3.85,-51.6],rot:[-.14,0,0]})),L.push(U(G(1.3,.28,1.4,.1),{pos:[1.3*e,3,-52.4]}));ue.push(U(new T(.4,.85,5,14),{pos:[-1.3,3.72,-52.05],rot:[.22,0,0]})),ue.push(U(new s(.33,12,10),{pos:[-1.3,4.48,-52.2]})),ue.push(U(new T(.16,.85,4,10),{pos:[-1.84,3.5,-52.95],rot:[1.1,0,0]})),ue.push(U(new T(.16,.75,4,10),{pos:[-.8,3.52,-52.95],rot:[1.1,0,0]}));let u=-(n[0]+r[0])/2,d=(n[1]+r[1])/2,f=Math.hypot(n[0]-r[0],r[1]-n[1]),p=Math.atan2(n[0]-r[0],r[1]-n[1]);W.push(U(new w(6.2,f),{pos:[0,d,u],rot:[p-Math.PI,0,0]})),W.push(U(new w(6.2,4.3),{pos:[0,5.34,-52.1],rot:[-Math.PI/2,0,0]})),B.push(U(G(6.7,.28,.28,.08),{pos:[0,r[1],-r[0]]})),B.push(U(G(6.7,.32,.32,.09),{pos:[0,n[1],-n[0]]})),B.push(U(G(6.7,.26,.26,.07),{pos:[0,i[1],-i[0]]}));for(let e of[1,-1])B.push(U(G(.3,.32,f,.08),{pos:[1.75*e,d,u],rot:[p-Math.PI/2,0,0]})),B.push(U(G(.3,.32,4.2,.08),{pos:[1.75*e,5.38,-52.1]}))}for(let e of[1,-1]){B.push(U(new u(.42,.42,26,Y(.42,18)),{pos:[2.6*e,1.5,-30],rot:[Math.PI/2,0,0]})),B.push(U(new u(.42,.42,26,Y(.42,18)),{pos:[2.6*e,-1.5,-30],rot:[Math.PI/2,0,0]}));for(let t=0;t<6;t++){let n=-42+t*4.4;L.push(U(new u(.28,.28,5.2,Y(.28,12)),{pos:[2.6*e,0,n],rot:[0,0,0]})),L.push(U(new u(.24,.24,6.6,Y(.24,12)),{pos:[2.6*e,0,n+2.2],rot:[(t%2?1:-1)*.75,0,0]}))}L.push(U(new u(.55,.55,25,Y(.55,18)),{pos:[3.4*e,-.2,-30],rot:[Math.PI/2,0,0]}))}L.push(U(G(2,1.4,26,.3),{pos:[0,0,-30]}));for(let e=0;e<3;e++)J.push(U(new w(.3,.3),{pos:[0,-.78,-38+e*8],rot:[Math.PI/2,0,0]}));{let e=new u(5.2,5.2,30,Y(5.2),1,!1);ne.push(U(e,{pos:[0,0,-6],rot:[Math.PI/2,0,0]}));for(let e of[-21.2,9.2])B.push(U(new v(5.3,.42,12,Y(5.3)),{pos:[0,0,e]}));for(let e of[-15,-9,-3,3])L.push(U(new v(5.28,.3,10,Y(5.28)),{pos:[0,0,e]}));I.push(U(G(3.4,2.2,27,.4),{pos:[0,6,-6]}));for(let e of[1,-1])B.push(U(G(.42,.34,25,.11),{pos:[1.58*e,7.18,-6]}));L.push(U(G(1,.7,5,.15),{pos:[0,7.35,-19.5]})),L.push(U(G(6,2.4,13,.4),{pos:[0,-6,-8]}));for(let e of[1,-1])I.push(U(G(.25,2.6,12,.1),{pos:[2.9*e,-7.3,-8],rot:[0,0,.55*e]}));let t=[!0,!1,!0,!0,!1,!0,!0,!1];for(let e=0;e<4;e++)for(let n of[1,-1])(t[e*2+(n>0?0:1)]?J:L).push(U(new h(.62,Y(.62,28)),{pos:[5.15*n,1.4,-16+e*6],rot:[0,Math.PI/2*n,0]})),B.push(U(new v(.78,.2,9,Y(.78,30)),{pos:[5.1*n,1.4,-16+e*6],rot:[0,Math.PI/2*n,0]}));z.push(U(new u(1.85,1.95,.55,Y(1.95)),{pos:[5.25,-1.1,4.4],rot:[0,0,Math.PI/2]})),B.push(U(new v(1.9,.14,8,Y(1.9)),{pos:[5.5,-1.1,4.4],rot:[0,Math.PI/2,0]})),J.push(U(new w(.5,.22),{pos:[5.45,1.05,4.4],rot:[0,Math.PI/2,0]}));for(let e of[1,-1])ne.push(U(new T(2.5,9,xe(2.5,Math.PI/2,4,10),Y(2.5)),{pos:[6.4*e,-1.6,4],rot:[Math.PI/2,0,0]})),B.push(U(new v(2.55,.22,9,Y(2.55)),{pos:[6.4*e,-1.6,.6]})),B.push(U(new v(2.55,.22,9,Y(2.55)),{pos:[6.4*e,-1.6,7.4]})),L.push(U(G(2.4,.5,1.2,.1),{pos:[4.3*e,-.9,1.2],rot:[0,0,.5*e]})),L.push(U(G(2.4,.5,1.2,.1),{pos:[4.3*e,-.9,7],rot:[0,0,.5*e]}))}F.push(U(K([[-2,4.8],[-19,5],[-18.3,15.4],[-11.8,15.4]],.95,.22),{rot:[0,Math.PI/2,0]})),B.push(U(new u(.32,.32,14.4,14),{pos:[0,10.1,6.9],rot:[.746,0,0]})),B.push(U(G(.62,.44,6.6,.13),{pos:[0,15.5,15.1]}));for(let e of[1,-1])L.push(U(G(.22,4.4,6.2,.1),{pos:[.56*e,9,12]})),J.push(U(new w(5.4,.14),{pos:[.7*e,7.1,12],rot:[0,Math.PI/2*e,0]}));for(let e of[1,-1])L.push(U(K([[-2,0],[-11,0],[-9,2.6]],.35,.08),{pos:[.62*e,4.9,0],rot:[0,Math.PI/2,0]}));let de=[],fe=[],be=new s(.3,12,9),Ee=(e,t)=>new r({color:new b(e).multiplyScalar(t),toneMapped:!1}),De=(e,n,r,i)=>{let a=new S(be,Ee(n,r));return a.position.set(e[0],e[1],e[2]),a.frustumCulled=!1,(i||t).add(a),fe.push(a),a},Z=.52,Oe=.9,ke=[[0,.3,.115,.065],[.345,.635,.075,-.05],[.68,1,.15,.01]],Ae=[.322,.657],je=[.115,.285,.455,.625,.775,.905],Q=(e,t,n,r,i,a)=>{let o=t[0]-e[0],s=t[1]-e[1];return U(G(Math.hypot(o,s),i,r,a),{rot:[0,Math.atan2(-s,o),0],pos:[(e[0]+t[0])/2,n,(e[1]+t[1])/2]})},Me=(e,t,n,r)=>{let i=[];for(let a=0;a<e.length;a++){let o=e[a],s=e[(a+1)%e.length],c=t*o[0]+n*o[1]-r,l=t*s[0]+n*s[1]-r;if(c<=0&&i.push(o),c<0!=l<0){let e=c/(c-l);i.push([o[0]+(s[0]-o[0])*e,o[1]+(s[1]-o[1])*e])}}return i},Ne=e=>{let t=e>>>0;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)},Pe=6.4,Fe=(e,t,n)=>{let{len:r,zc:i,cR:a,cT:o,sw:s,crop:c,cdep:l,ph:u}=e,d=Pe+r,f=i-a/2,p=i-o/2+s,m=i+a/2,h=i+o/2+s,g=e=>Pe+e*r,_=e=>f+e*(p-f),v=e=>m+e*(h-m),y=(e,t)=>{let n=_(e)+Z,r=v(e)-Z;return[g(e),n+t*(r-n)]},b=[d-c,_(1-c/r)],x=[d,_(1)+l],S=x[1]-b[1],C=-(x[0]-b[0]),w=Math.hypot(S,C)||1;S/=w,C/=w;let T=S*b[0]+C*b[1];S*Pe+C*i-T>0&&(S=-S,C=-C,T=-T);let E=e=>S*e[0]+C*e[1]-T,D=(e,t)=>{let n=E(e),r=E(t);return r<=0?1:n>0?0:n/(n-r)},O=(e,t,n)=>[e[0]+(t[0]-e[0])*n,e[1]+(t[1]-e[1])*n];for(let[e,n,r,i]of ke){let a=Me([y(0,e),y(1,e),y(1,n),y(0,n)],S,C,T);a.length<3||t.push(U(K(a,r*2,r*.75),{rot:[Math.PI/2,0,0],pos:[0,i,0]}))}for(let e of Ae){let n=y(0,e),r=y(1,e);t.push(Q(n,O(n,r,D(n,r)),0,.36,.64,.18))}for(let e=0;e<je.length;e++){let n=Math.min(.955,Math.max(.06,je[e]+u)),r=y(n,0),i=y(n,1),a=1-D(i,r);a>.86||t.push(Q(O(r,i,a),i,0,.34+e%3*.05,.5+e%2*.09,.16))}let k=[g(0),_(0)+Z/2],A=[d,_(1)+Z/2];t.push(Q(k,O(k,A,D(k,A)),0,Z,Oe,.22)),t.push(Q([g(0),v(0)-Z/2],[d,v(1)-Z/2],0,Z,Oe,.22)),t.push(Q(b,x,0,Z*.86,Oe*.82,.2)),t.push(Q([d-Z/2,x[1]],[d-Z/2,v(1)],0,Z*.86,Oe*.82,.2));let j=y(0,.5),M=y(.52,.5),ee=y(1,.5);return n.push(Q(j,M,-.66,.7,.76,.22)),n.push(Q(M,O(j,ee,D(j,ee)),-.6,.48,.52,.18)),{pt:y,cut:D,sd:E,mix2:O,x1:d,LEz:_,TEz:v,X:g}};for(let r of[{s:1,baseZ:.4,yaw:-.26,sw:.95,short:0,seed:6236065},{s:-1,baseZ:-.344,yaw:.222,sw:.58,short:1.8,seed:10570505}]){let i=r.s,a=new n,o=[],s=[],c=Ne(r.seed),l=[];for(let e=0;e<3;e++)l.push(Fe({len:19.8+e*2.6-(e===2?r.short:0),zc:-5.2+e*5.2,cR:4.9-e*.1,cT:3.25-e*.1,sw:r.sw+e*.22,crop:2.5+e*.35,cdep:1.45+e*.12,ph:(e-1)*.055+(r.s>0?0:.028)},o,s));s.push(U(new u(.46,.46,17.4,18),{pos:[5.300000000000001,-.12,0],rot:[Math.PI/2,0,0]}));for(let e of[-8.7,8.7])s.push(U(new u(.3,.5,.62,18),{pos:[5.300000000000001,-.12,e],rot:[Math.PI/2*Math.sign(e),0,0]}));for(let e=0;e<3;e++){let t=-5.2+e*5.2;for(let n=0;n<2;n++){let r=t+(n?1.55:-1.32)-e*.12,i=n?.27:.22;s.push(U(new u(i,i,1.9+n*.35,14),{pos:[6.050000000000001,-.06,r],rot:[0,0,Math.PI/2]})),s.push(U(new v(i*1.5,.085,8,16),{pos:[6.9+n*.18,-.06,r],rot:[0,Math.PI/2,0]})),s.push(U(G(.55,.8,i*2.6,.16),{pos:[5.3500000000000005,-.1,r]}))}}let d=[5.9,14,22,29.4],f=[.46,.38,.3,.22];for(let e=0;e<3;e++)s.push(U(new u(f[e],f[e+1],d[e+1]-d[e],16),{pos:[(d[e]+d[e+1])/2,-.72,0],rot:[0,0,Math.PI/2]})),s.push(U(new v(f[e+1]*1.3,.075,8,18),{pos:[d[e+1],-.72,0],rot:[0,Math.PI/2,0]}));for(let[e,t,n]of[[11.4,0,.3],[11.4,2,.3],[21,0,.72],[21,2,.7]]){let r=l[t].pt(n,.5);l[t].sd(r)>-.4||s.push(...ae([e,-.72,0],[r[0],-.34,r[1]],.2,.16,12,.15))}let p=5+Math.floor(c()*4);for(let e=0;e<p;e++){let e=l[Math.floor(c()*3)],t=ke[Math.floor(c()*3)],n=e.pt(.1+c()*.8,t[0]+.14+c()*Math.max(.02,t[1]-t[0]-.28));if(e.sd(n)>-.6)continue;let r=.3+c()*.44,i=c()<.55?1:-1,a=t[3]+i*(t[2]+.05);s.push(U(new u(r,r*.88,.12,Y(r,14)),{pos:[n[0],a,n[1]],rot:[0,c()*3.1,0]})),r>.52&&s.push(U(new v(r*.97,.055,6,Y(r*.97,20)),{pos:[n[0],a+i*.03,n[1]],rot:[Math.PI/2,0,0]}))}let m=e(o,!1);m.computeVertexNormals(),oe(m),o.forEach(e=>e.dispose());let h=new S(m,M);h.scale.x=i,h.frustumCulled=!1,a.add(h);let g=e(s,!1);g.computeVertexNormals(),oe(g),s.forEach(e=>e.dispose());let _=new S(g,x);ie([m,g],re([m,g],.5)),_.scale.x=i,_.frustumCulled=!1,a.add(_),a.position.set(3.4*i,1.2,2),a.rotation.y=r.yaw,a.rotation.z=r.baseZ,a.userData.baseZ=a.rotation.z,t.add(a),de.push(a);let y=l[2];De([(y.x1-1)*i,.35,y.TEz(1)-.8],i>0?3211104:16724e3,5,a),B.push(U(new u(.95,.95,4.2,Y(.95,24)),{pos:[4.4*i,1.2,2],rot:[0,0,Math.PI/2]}));for(let e of[-1.55,1.55])B.push(U(new v(1.06,.15,8,Y(1.06,24)),{pos:[4.4*i,1.2,2+e],rot:[0,Math.PI/2,0]}));L.push(U(K([[-6,-.35],[-4.6,-1.1],[4.4,-1.15],[6,-.4],[6,.5],[4.4,1.2],[-4.6,1.05],[-6,.42]],3.4,.3),{rot:[0,Math.PI/2,.4*i],pos:[4.9*i,.6,2]}))}let Ie=[];L.push(U(q([[0,2.45,1.62],[.5,2.72,1.86],[1.1,2.66,1.8],[1.5,2.44,1.6],[4.4,2.3,1.52],[6.6,2.1,1.38,-.06],[8.6,1.84,1.16,-.14]],.34),{rot:[0,-Math.PI/2,0],pos:[0,-1.3,8.7]}));for(let e of[1,-1]){let t=11*e,n=-3.4,r={rot:[.16,e>0?0:Math.PI,-.26*e],pos:[1.3*e,-1.3,13.5]},i=(e,t)=>{let n=U(t,r);t.dispose(),e.push(n)};i(F,q([[-1.1,2.26,1.34],[0,2.3,1.36],[1.9,2.22,1.32],[4.1,1.98,1.16,-.06],[5.9,1.82,1.06,-.11],[6.2,1.66,.98,-.12],[9,1.46,.79,-.22],[11.4,1.3,.72,-.28]],.38)),i(L,q([[.4,2.58,1.66],[2.1,2.48,1.56],[3,2.44,1.5,-.03],[3.16,2.18,1.28,-.04],[4.6,2.04,1.18,-.09]],.26)),i(B,q([[1.6,.22,.17,1.42,1.05],[5.4,.19,.15,1.08,.9],[10.4,.16,.13,.58,.72]],.06)),i(R,q([[1.2,.22,.22,1.44,-1.06],[6,.2,.2,1,-.86],[10.6,.16,.16,.54,-.7]],.06));for(let e of[2.7,5.4,8.3]){let t=(e-1.2)/9.4;i(R,U(G(.28,.56,.6,.14),{pos:[e,1.44-t*.9,-1.06+t*.36]}))}let a=[[[2.15*e,-2.45,10.4],[8.2*e,-3.4,12.3]],[[2.15*e,-2.45,16.4],[8.2*e,-3.4,14.7]]];for(let[t,n]of a){R.push(...ae(t,n,.23,.18,12,.16));let r=[(t[0]+n[0])/2,(t[1]+n[1])/2,(t[2]+n[2])/2];R.push(...ae(r,[5.9*e,-3.05,13.5],.16,.14,12,.12))}L.push(U(new T(2.6,13,xe(2.6,Math.PI/2,4,10),Y(2.6)),{pos:[t,n,17],rot:[Math.PI/2,0,0]})),B.push(U(new u(2.75,2.3,3,Y(2.75),1,!0),{pos:[t,n,9],rot:[Math.PI/2,0,0]})),L.push(U(new v(2.5,.3,11,Y(2.5)),{pos:[t,n,7.6]}));for(let e=0;e<4;e++)(e===1?B:H).push(U(new v(2.72,.3,11,Y(2.72)),{pos:[t,n,12.5+e*3.2]}));J.push(U(new w(.16,11),{pos:[t,-.7199999999999998,17],rot:[-Math.PI/2,0,0]})),R.push(U(new u(3.15,2.05,5.2,Y(3.15),1,!0),{pos:[t,n,26.4],rot:[Math.PI/2,0,0]})),L.push(U(new u(2.85,1.85,5,Y(2.85),1,!0),{pos:[t,n,26.4],rot:[Math.PI/2,0,0],scale:[-1,1,1]})),B.push(U(new v(3.15,.26,11,Y(3.15)),{pos:[t,n,28.9]})),B.push(U(new v(2.16,.2,10,Y(2.16)),{pos:[t,n,23.9]})),Ie.push({x:t,y:n,z:17})}let Le=new n;Le.position.set(-4.2,7.2,-14);{let n=[],r=new s(6.4,Y(6.4),xe(6.4,Math.PI*.2,6,16),0,Math.PI*2,Math.PI*.8,Math.PI*.2);n.push(U(r,{rot:[Math.PI,0,0]})),n.push(U(new v(6.35,.26,10,Y(6.35)),{rot:[Math.PI/2,0,0],pos:[0,1.05,0]}));for(let e=0;e<8;e++){let t=e/8*Math.PI*2;n.push(U(G(6,.34,.5,.1),{pos:[Math.cos(t)*3.2,.35,Math.sin(t)*3.2],rot:[Math.PI/2,-t,0]}))}for(let e=0;e<3;e++){let t=e/3*Math.PI*2;n.push(U(new u(.18,.18,4.6,Y(.18,12)),{pos:[Math.cos(t)*1.9,2.4,Math.sin(t)*1.9],rot:[.42*Math.cos(t+Math.PI/2),0,-.42*Math.cos(t)]}))}n.push(U(new _(.6,1.5,Y(.6,20)),{pos:[0,4.5,0],rot:[Math.PI,0,0]}));let i=e(n,!1);i.computeVertexNormals(),oe(i),n.forEach(e=>e.dispose()),ie([i],re([i],.6));let a=new S(i,V(new l({color:9144188,metalness:.2,roughness:.74,side:2,envMapIntensity:.9}),{plate:1.6,bleach:.9,soot:0,edge:.3}));a.frustumCulled=!1,Le.add(a),t.add(Le),B.push(U(new u(.75,.95,3.2,Y(.95,24)),{pos:[-4.2,5.6,-14]}))}{let e=(e,t,n,r)=>{for(let i of[[.9,0],[-.9,0],[0,.9],[0,-.9]])R.push(U(new u(.28,.4,.8,Y(.4,14)),{pos:[e+i[0],t+i[1],n],rot:[Math.PI/2,0,r]}));L.push(U(G(2.6,2.6,.6,.2),{pos:[e,t,n+.5]}))};e(7.2,1.6,-46,0),e(-7.2,1.6,-46,0),e(4.6,3.2,6,0),e(-4.6,3.2,6,0);for(let e=0;e<9;e++)R.push(U(new v(.34,.105,7,16,Math.PI),{pos:[1.8,7.1,-17+e*2.6],rot:[0,0,0]}));for(let e=0;e<4;e++)R.push(U(new u(.135,.21,4.5-e*.6,Y(.21,12)),{pos:[1.4-e*.9,9.4,2+e*1.4],rot:[.1*e,0,.12*(e-1.5)]})),B.push(U(new u(.34,.4,.45,Y(.4,14)),{pos:[1.4-e*.9,7.35+e*.1,2+e*1.4],rot:[.1*e,0,.12*(e-1.5)]}));for(let e=0;e<3;e++)R.push(U(new T(.55,2.2,6,Y(.55,18)),{pos:[-1.7+e*1.7,-7.5,-3],rot:[Math.PI/2,0,0]}));let r=[],a=[],o=[],s=[],c=[],l=.34,d=-4.9;for(let[e,t]of[[3.6,-16],[-3.6,-16],[10.2,15],[-10.2,15]]){let n=Math.sign(e),i=(r,i,a)=>{let o=U(i,a);n<0&&o.rotateY(Math.PI),o.rotateZ(n*l),o.translate(e,d,t),r.push(o),i.dispose()},f=Math.cos(n*l),p=Math.sin(n*l),m=r=>{let i=n<0?-r[0]:r[0],a=n<0?-r[2]:r[2];return[e+i*f-r[1]*p,d+i*p+r[1]*f,t+a]};a.push(U(q([[-2.85,.95,.42],[-2.1,1.28,.86],[-1.1,1.42,1.12],[1.1,1.42,1.12],[2.1,1.28,.86],[2.85,.95,.42]],.2),{rot:[0,Math.PI/2,0],pos:[e+n*.3,-3.62,t]})),o.push(U(q([[-3.25,1.62,.3],[-2.6,1.86,.52],[2.6,1.86,.52],[3.25,1.62,.3]],.14),{rot:[0,Math.PI/2,0],pos:[e+n*.25,-4.02,t]}));for(let e of[-.98,.98])i(a,K([[-1.24,1.3],[1.24,1.3],[1.06,.22],[.62,-.46],[0,-.62],[-.62,-.46],[-1.06,.22]],.28,.09),{pos:[0,0,e]}),i(s,new u(.52,.52,.34,Y(.52,16)),{rot:[Math.PI/2,0,0],pos:[0,0,e+(e>0?.18:-.18)]});i(s,new u(.3,.3,2.86,Y(.3,16)),{rot:[Math.PI/2,0,0]});for(let e of[-1.46,1.46])i(s,new u(.44,.4,.16,Y(.44,16)),{rot:[Math.PI/2,0,0],pos:[0,0,e]}),i(s,X(.16,.14),{rot:[Math.PI/2,0,0],pos:[0,0,e+Math.sign(e)*.14]});for(let r=0;r<6;r++){let i=-2.35+r*.94;for(let r of[-1.28,1.28])s.push(U(X(.15,.13),{pos:[e+n*.3+r,-4.36,t+i]}))}i(a,q([[0,.92,.8],[.44,.98,.94],[1.05,.92,.9],[1.62,.84,.8],[1.92,.8,.74]],.14),{rot:[0,0,-Math.PI/2],pos:[0,.54,0]}),i(a,Se([[.34,-6.16],[.76,-6.16],[.82,-6.06],[.82,-5.7],[.76,-5.58],[.712,-5.5],[.7,-4.34],[.8,-4.26],[.8,-4.08],[.7,-4],[.7,-2.94],[.8,-2.86],[.8,-2.68],[.7,-2.6],[.716,-1.6],[.83,-1.5],[.83,-1.26],[.738,-1.18],[.738,-1.02],[0,-.96]],Y(.83,22)),{});for(let e of[Math.PI*.25,Math.PI*.75,Math.PI*1.25,Math.PI*1.75]){let t=q([[-1.92,.15,.1],[-1.62,.2,.15],[1.62,.2,.15],[1.92,.15,.1]],.05);t.rotateZ(Math.PI/2),t.translate(.76,-3.5,0),i(a,t,{rot:[0,e,0]})}i(a,X(.9,.32),{pos:[0,-6.3,0]}),i(s,new v(.42,.075,6,Y(.42,18)),{rot:[Math.PI/2,0,0],pos:[0,-6.5,0]}),i(c,new u(.345,.345,2.95,22),{pos:[0,-7,0]}),i(a,new u(.44,.4,.26,Y(.44,18)),{pos:[0,-8.3,0]});let h=[1.52,-6.98],g=(e,t,n,r,o,s,c)=>{let l=Math.hypot(t[0]-e[0],t[1]-e[1]);for(let u of c)i(a,Te(l,n,r,o,s),{rot:[0,0,Math.atan2(t[1]-e[1],t[0]-e[0])],pos:[e[0],e[1],u]})};g([.8,-5.58],h,.3,.26,.16,.19,[0]),g(h,[.44,-8.14],.26,.28,.16,.16,[-.26,.26]);for(let[e,t,n]of[[.8,-5.58,.15],[h[0],h[1],.14],[.44,-8.14,.15]])i(s,new u(n,n,.78,10),{rot:[Math.PI/2,0,0],pos:[e,t,0]});i(a,q([[-.3,.24,.22],[.3,.24,.22]],.06),{rot:[0,0,0],pos:[.86,-5.58,0]});let _=[[0,.5,.4],[.05,.39,.31],[.11,.32,.25],[.16,.42,.34],[.21,.31,.24],[.34,.4,.32],[.39,.29,.23],[.52,.38,.31],[.57,.28,.22],[.7,.36,.29],[.75,.27,.21],[.86,.35,.28],[.91,.28,.23],[1,.4,.33]];for(let e of[-1,1])i(a,Ce([.12,.16,e*2.62],[.24,-4.16,e*.86],_,.055,[1,0,0])),i(s,X(.19,.16),{rot:[Math.PI/2,0,0],pos:[.12,.16,e*2.78]}),i(a,q([[-.24,.4,.3],[.24,.4,.3]],.07),{rot:[0,Math.PI/2,0],pos:[.2,-4.16,e*.86]});for(let[e,t]of[[0,.36],[.26,.21]])i(o,we([[.1,.34,1+e],[.52,-.55,.96+e],[.7,-1.9,.86+e],[.74,-3.6,.84+e],[.78,-5.2,.84+e],[.94+t,-6.1,.74+e],[.72+t,-7.1,.6+e],[.38,-7.95,.46+e],[.2,-8.34,.32+e]],.105,26,7),{});for(let e of[-1.9,-3.6,-5.2])i(a,q([[-.16,.3,.13],[.16,.3,.13]],.05),{pos:[.8,e,.92]});for(let e of[-.46,.46])i(a,K([[-.44,.34],[.44,.34],[.4,-.3],[.22,-.52],[-.22,-.52],[-.4,-.3]],.26,.08),{pos:[0,-8.62,e]});i(s,new u(.21,.21,1.42,12),{rot:[Math.PI/2,0,0],pos:[0,-8.7,0]});for(let e of[-.74,.74])i(s,X(.21,.11),{rot:[Math.PI/2,0,0],pos:[0,-8.7,e]});let[y,,b]=m([0,-8.7,0]),x=(e,t,n={})=>{let r=U(t,n);r.translate(y,0,b),e.push(r),t.dispose()};x(a,q([[0,.5,.54],[.3,.4,.44],[.72,.31,.35],[1.06,.28,.32]],.09),{rot:[0,0,Math.PI/2],pos:[0,-14.02,0]});for(let e of[-13.96,-13.84])x(s,new v(.5,.07,6,Y(.5,18)),{rot:[Math.PI/2,0,0],pos:[0,e,0]});x(a,Se([[0,-14.54],[1.18,-14.54],[1.42,-14.47],[1.6,-14.3],[1.68,-14.12],[1.63,-13.97],[1.45,-13.87],[1.18,-13.81],[.94,-13.78],[.76,-13.75],[.66,-13.69],[0,-13.65]],Y(1.68,24,40)),{}),x(a,new v(1.28,.1,6,Y(1.28,22,36)),{rot:[Math.PI/2,0,0],pos:[0,-13.82,0]});for(let e=0;e<12;e++){let t=e/12*Math.PI*2+Math.PI/12;x(a,X(.12,.11),{pos:[Math.cos(t)*1.04,-13.71,Math.sin(t)*1.04]})}for(let e=0;e<4;e++){let t=e*Math.PI/2;x(a,q([[1.02,.82,.24,0],[1.75,.86,.21,.03],[2.35,.76,.17,.09],[2.8,.56,.14,.19],[3.02,.36,.11,.31]],.08),{rot:[0,t,0],pos:[0,-14.32,0]});let n=q([[-.9,.15,.13],[-.6,.19,.19],[.6,.17,.15],[.92,.13,.1]],.05);n.translate(1.92,-14.06,0),x(a,n,{rot:[0,t,0]}),x(o,q([[1,.78,.06,0],[1.9,.8,.055,.03],[2.45,.68,.05,.095],[2.92,.42,.045,.245]],.03),{rot:[0,t,0],pos:[0,-14.6,0]})}x(o,new u(1.24,1.32,.12,Y(1.32,20,36)),{pos:[0,-14.6,0]});for(let i of[1,-1]){let o=[0,n*i<0?Math.PI:0,-(n*i)*1.28],c=[e+n*i*1.72,-4.46,t],l=(e,t,n)=>{let r=U(t,n);o[1]&&r.rotateY(o[1]),r.rotateZ(o[2]),r.translate(c[0],c[1],c[2]),e.push(r),t.dispose()};l(r,K([[.06,-2.66],[1.7,-2.52],[1.7,2.52],[.06,2.66]],.15,.06),{rot:[Math.PI/2,0,0]});for(let[e,t]of[[.2,.14],[1.6,.13]])l(a,q([[-2.58,t,.16],[2.58,t,.16]],.05),{rot:[0,Math.PI/2,0],pos:[e,.16,0]});for(let e of[-2.55,2.55])l(a,q([[.14,.13,.15],[1.64,.13,.15]],.05),{pos:[0,.16,e]});for(let e of[-1.28,1.28])l(a,q([[.2,.11,.13],[1.58,.11,.13]],.04),{pos:[0,.15,e]});for(let e of[-2.05,0,2.05])l(s,new u(.17,.17,.44,10),{rot:[Math.PI/2,0,0],pos:[.03,0,e]}),l(a,q([[-.06,.2,.2],[.34,.18,.16]],.05),{pos:[0,0,e]});l(s,new u(.075,.075,1.2,8),{rot:[0,0,.52],pos:[.66,.5,-2.05]}),l(a,X(.14,.16),{rot:[0,0,.52],pos:[1.18,.2,-2.05]})}}let f=new n,p=[se(r,m,f),se(a,k,f),se(o,x,f),se(s,O,f),se(c,A,f)].filter(Boolean).map(e=>e.geometry);ie(p,re(p,.42)),f.visible=!1,t.add(f),i.gear=f,B.push(U(new u(.1,.32,16,Y(.32,14)),{pos:[0,.2,-66],rot:[Math.PI/2,0,0]}));for(let e=0;e<3;e++)R.push(U(new v(.58-e*.12,.115,8,Y(.58-e*.12,20)),{pos:[0,.2,-62+e*-3.2]}))}let Re=[],ze=[],$=(n,r,i,a)=>{if(!n.length)return null;let o=e(n,!1);o.computeVertexNormals(),oe(o);let s=new S(o,r);return s.frustumCulled=!1,i&&(s.renderOrder=i),t.add(s),n.forEach(e=>e.dispose()),Re.push(o),a&&ze.push(o),s};$(F,m,0,!0),$(ne,g,0,!0),$(I,y,0,!0),$(L,x,0,!0),$(R,E,0,!0),$(z,k,0,!0),$(B,O,0,!0),$(H,j,0,!0),$(ue,te),$(J,P),$(W,N,4),ie(ze,re(Re,.85));let Be=De([0,15.9,15.4],16777215,0);De([0,.2,-59.6],16767144,2.2);let Ve=[];{let n=Ie.map(e=>U(_e(26),{pos:[e.x,e.y,e.z+7.4]})),r=e(n,!1);n.forEach(e=>e.dispose());let i=new f({vertexShader:pe,fragmentShader:me,transparent:!0,depthWrite:!1,side:1,blending:5,blendEquation:100,blendSrc:201,blendDst:201,uniforms:{uTime:{value:0},uPower:o,uColA:{value:new b(1,.97,.94)},uColB:{value:new b(.4,.62,1)},uColC:{value:new b(.16,.2,.78)}}}),a=new S(r,i);a.renderOrder=12,a.frustumCulled=!1,t.add(a),Ve.push(i);let s=[[-1,-1,0,0],[1,-1,1,0],[1,1,1,1],[-1,1,0,1]],c=Ie.length,l=new Float32Array(c*12),u=new Float32Array(c*8),d=new Float32Array(c*12),m=new Uint16Array(c*6);for(let e=0;e<c;e++){let t=Ie[e];for(let n=0;n<4;n++){let r=e*4+n;l[r*3]=s[n][0],l[r*3+1]=s[n][1],u[r*2]=s[n][2],u[r*2+1]=s[n][3],d[r*3]=t.x,d[r*3+1]=t.y,d[r*3+2]=t.z+10.9}let n=e*4;m.set([n,n+1,n+2,n,n+2,n+3],e*6)}let h=new p;h.setAttribute(`position`,new C(l,3)),h.setAttribute(`uv`,new C(u,2)),h.setAttribute(`aCenter`,new C(d,3)),h.setIndex(new C(m,1));let g=new f({vertexShader:he,fragmentShader:ge,transparent:!0,depthWrite:!1,side:2,blending:5,blendEquation:100,blendSrc:201,blendDst:201,uniforms:{uTime:{value:0},uPower:o,uSize:{value:1.9*D},uColA:{value:new b(1,.98,.95)},uColB:{value:new b(.42,.66,1)}}}),_=new S(h,g);_.renderOrder=11,_.frustumCulled=!1,t.add(_),Ve.push(g)}return t.scale.setScalar(D),t.traverse(e=>{e.frustumCulled=!1,e.isMesh&&e.material&&!e.material.transparent&&e.material.type!==`MeshBasicMaterial`&&(e.castShadow=!0,e.receiveShadow=!0)}),{root:t,engineMats:Ve,radiator:M,vanes:de,dishPivot:Le,strobe:Be,lamps:fe,gear:i.gear,nacelles:Ie.map(e=>new a(e.x*D,e.y*D,(e.z+13)*D)),length:84*D}}export{Ee as buildHull};