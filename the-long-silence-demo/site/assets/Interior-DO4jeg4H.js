import{n as e}from"./BufferGeometryUtils-rYU0g5NO.js";import{At as t,C as n,Et as r,J as i,Mt as a,Nt as o,R as s,S as c,T as l,Z as u,_ as d,_t as f,bt as p,c as m,ct as h,d as g,f as _,gt as v,ht as y,it as b,jt as x,kt as S,m as C,mt as w,n as ee,o as T,q as E,s as D,t as O,v as te,vt as ne,w as re,z as ie}from"./index-D368tsPV.js";var k=new o;function A(e,t,n,r,i,a){let o=2*Math.PI*i/4,s=Math.max(a-2*i,0),c=Math.PI/4;k.copy(t),k[r]=0,k.normalize();let l=.5*o/(o+s),u=1-k.angleTo(e)/c;return Math.sign(k[n])===1?u*l:s/(o+s)+l+l*(1-u)}var ae=class e extends T{constructor(e=1,t=1,n=1,r=2,i=.1){let a=r*2+1;if(i=Math.min(e/2,t/2,n/2,i),super(1,1,1,a,a,a),this.type=`RoundedBoxGeometry`,this.parameters={width:e,height:t,depth:n,segments:r,radius:i},a===1)return;let s=this.toNonIndexed();this.index=null,this.attributes.position=s.attributes.position,this.attributes.normal=s.attributes.normal,this.attributes.uv=s.attributes.uv;let c=new o,l=new o,u=new o(e,t,n).divideScalar(2).subScalar(i),d=this.attributes.position.array,f=this.attributes.normal.array,p=this.attributes.uv.array,m=d.length/6,h=new o,g=.5/a;for(let r=0,a=0;r<d.length;r+=3,a+=2)switch(c.fromArray(d,r),l.copy(c),l.x-=Math.sign(l.x)*g,l.y-=Math.sign(l.y)*g,l.z-=Math.sign(l.z)*g,l.normalize(),d[r+0]=u.x*Math.sign(c.x)+l.x*i,d[r+1]=u.y*Math.sign(c.y)+l.y*i,d[r+2]=u.z*Math.sign(c.z)+l.z*i,f[r+0]=l.x,f[r+1]=l.y,f[r+2]=l.z,Math.floor(r/m)){case 0:h.set(1,0,0),p[a+0]=A(h,l,`z`,`y`,i,n),p[a+1]=1-A(h,l,`y`,`z`,i,t);break;case 1:h.set(-1,0,0),p[a+0]=1-A(h,l,`z`,`y`,i,n),p[a+1]=1-A(h,l,`y`,`z`,i,t);break;case 2:h.set(0,1,0),p[a+0]=1-A(h,l,`x`,`z`,i,e),p[a+1]=A(h,l,`z`,`x`,i,n);break;case 3:h.set(0,-1,0),p[a+0]=1-A(h,l,`x`,`z`,i,e),p[a+1]=1-A(h,l,`z`,`x`,i,n);break;case 4:h.set(0,0,1),p[a+0]=1-A(h,l,`x`,`y`,i,e),p[a+1]=1-A(h,l,`y`,`x`,i,t);break;case 5:h.set(0,0,-1),p[a+0]=A(h,l,`x`,`y`,i,e),p[a+1]=1-A(h,l,`y`,`x`,i,t)}}static fromJSON(t){return new e(t.width,t.height,t.depth,t.segments,t.radius)}},j=1,M={value:1},N={value:1},oe={value:1};function se(e){return P(e,!1)}function P(e,t){if(!e)return e;if(e._logDepthHook!==e.onBeforeCompile){let t=e.onBeforeCompile;e.onBeforeCompile=function(e,n){t&&t.call(this,e,n),this.userData.noLogDepth&&(e.vertexShader=`#undef USE_LOGARITHMIC_DEPTH_BUFFER
`+e.vertexShader,e.fragmentShader=`#undef USE_LOGARITHMIC_DEPTH_BUFFER
`+e.fragmentShader)},e._logDepthHook=e.onBeforeCompile;let n=e.customProgramCacheKey;e.customProgramCacheKey=function(){return(n?n.call(this):``)+(this.userData.noLogDepth?`|nologd`:``)},e.userData.noLogDepth=void 0}let n=!t;return e.userData.noLogDepth===n?e:(e.userData.noLogDepth=n,e.needsUpdate=!0,e)}var F=`
/* Angular lobe of a line emitter, seen from o along d.

   Closest approach between the ray and the segment, with the miss distance
   divided by the range so it comes out as an angle. Both clamps matter: s off
   the end of the segment means the lamp stops rather than running to infinity,
   and t behind the eye means a fixture that is *behind* the pane contributes
   nothing instead of reflecting through it. */
float lineLobe(vec3 o, vec3 d, vec3 a, vec3 b, float sig){
  vec3 u = b - a;
  vec3 w = o - a;
  float uu = dot(u, u), ud = dot(u, d), uw = dot(u, w), dw = dot(d, w);
  float s = clamp((uw - dw * ud) / max(uu - ud * ud, 1e-4), 0.0, 1.0);
  float t = max(s * ud - dw, 0.0);
  float m = length(w + t * d - s * u) / max(t, 0.30);
  float q = m / sig;
  return exp(-q * q);
}

/* The same for a lit rectangle — a panel rather than a lamp.

   ax and ay are unit, in the plane; hw is the half-extent along each. The
   parametric distance is clamped rather than branched on, because a ray nearly
   parallel to the plane otherwise produces an infinity that comes back through
   length() as a NaN, and a NaN in an additively blended HDR target is a black
   pixel with two blown neighbours. */
float rectLobe(vec3 o, vec3 d, vec3 c, vec3 ax, vec3 ay, vec2 hw, float soft){
  vec3 pn = cross(ax, ay);
  float dn = dot(d, pn);
  float t = clamp(dot(c - o, pn) / (dn + (step(0.0, dn) * 2.0 - 1.0) * 1e-3),
                  -1.0, 40.0);
  vec3 h = o + t * d - c;
  vec2 q = abs(vec2(dot(h, ax), dot(h, ay))) - hw;
  float sd = length(max(q, vec2(0.0))) + min(max(q.x, q.y), 0.0);
  return step(0.02, t) * (1.0 - smoothstep(0.0, soft * max(t, 0.30), sd));
}

/* The painted shell, as radiance rather than as reflectance.

   Three values and not two, because the two that matter most are next to each
   other: the *walls* are the brightest thing the room has to offer a mirror —
   bone paint washed directly by the coves — and the *deck* is the darkest,
   and a single up/down ramp puts the crossover in the wrong place and makes
   the canopy brightest where it reflects the ceiling. Across a wrapped pane
   what that produces is a gradient running from dark at the crown, where the
   glass is looking straight down at the floor, to bright at the sills, where
   it is looking across the cabin — which is both correct and, not by accident,
   the same direction the edge sheen climbs in.

   And a hole where the canopy is, because most of what a windscreen reflects
   is the window. */
vec3 cabinRoom(vec3 r){
  vec3 c = mix(vec3(0.100, 0.070, 0.042), vec3(0.240, 0.210, 0.170),
               smoothstep(-0.80, -0.06, r.y));
  c = mix(c, vec3(0.200, 0.220, 0.262), smoothstep(0.02, 0.72, r.y));
  c = mix(c, vec3(0.009, 0.015, 0.024),
          smoothstep(0.02, 0.55, -r.z) * smoothstep(-0.35, 0.28, r.y) * 0.88);
  return c;
}

/* The old direction-only environment, kept at its old scale and shape.

   HoloScreen.js is in this chunk too and its env gains are calibrated against
   what this returned before — a reflectance around 0.05 to 0.12 with the
   ceiling coves and the glareshield as direction-only lobes. A small MFD does
   not need parallax and cannot afford the lobes, so it keeps this; the glazing
   uses cabinRoom + cabinLamps and does not go through here at all. Changing
   the units under a caller in another file would have quietly rescaled every
   screen in the ship.

   The two squarings used to be pow(x, 2.0) with x a difference that goes
   negative on one side of the lobe, which is undefined in GLSL ES and returns
   NaN under ANGLE. It never showed because the lobe was narrow and the NaN
   landed where the mask was already zero, but it was one normal away from a
   black pixel with two blown neighbours. */
vec3 cabinEnv(vec3 r){
  vec3 c = cabinRoom(r) * 0.42;
  // the two tungsten ceiling coves, high and outboard
  float xr = (abs(r.x) - 0.46) / 0.21;
  c += vec3(1.00, 0.84, 0.64)
     * smoothstep(0.40, 0.90, r.y) * exp(-xr * xr) * 0.80;
  // the overhead console's cold forward lip, high and ahead
  c += vec3(0.70, 0.82, 1.00)
     * smoothstep(0.22, 0.72, r.y) * smoothstep(0.12, 0.58, -r.z) * 0.30;
  // the glareshield, down and forward: seven lit displays and a light strip
  float xg = r.x / 0.62;
  c += vec3(0.62, 0.78, 1.00)
     * smoothstep(-0.24, -0.72, r.y) * smoothstep(0.08, 0.58, -r.z)
     * exp(-xg * xg) * 0.34;
  return c;
}

/* The room with its lamps in it, from the point p along the reflected ray r.

   The branch is on cabin z and is coherent for every fragment of a given pane
   — the canopy is entirely forward of the cockpit bulkhead and the nav plate
   and the observation port are entirely aft of it — so it costs a scalar
   compare and saves half the lobes on every pixel. */
vec3 cabinLamps(vec3 p, vec3 r){
  vec3 c = vec3(0.0);
  if(p.z < -3.40){
    /* The two tungsten ceiling coves, 0xffd7b0 at 2.66. The longest bright
       thing in the cockpit and the streak a canopy is made of.

       The forward end is -5.19, which is where the coves physically stop:
       ROOF_Z + 0.06, sixty millimetres aft of the glazing edge. This was
       guessed at -6.30 while the geometry was mid-rewrite, and the guess put
       1.1 m of reflected cove forward of the roof line — reflecting a lamp
       that is not there, in the part of the pane you look through. Keep it
       tied to the geometry: if the coves move, this moves. */
    vec3 cove = vec3(1.000, 0.679, 0.434) * 2.66;
    c += cove * lineLobe(p, r, vec3(-1.28, 2.42, -5.19), vec3(-1.28, 2.42, -3.48), 0.085);
    c += cove * lineLobe(p, r, vec3( 1.28, 2.42, -5.19), vec3( 1.28, 2.42, -3.48), 0.085);
    /* The coaming strip, tucked under the glareshield lip and aimed down the
       panel. It never shines back into the canopy, but the canopy can see it.
       0xfff0da at 0.86, and it follows the shield's curve, so the segment sits
       on the mean of Interior.js's cLamp() rather than on its centre. */
    c += vec3(1.000, 0.871, 0.701) * 1.05
       * lineLobe(p, r, vec3(-1.19, 0.905, -6.44), vec3(1.19, 0.905, -6.44), 0.075);
    // the overhead console's cold forward lip, 0xf2f8ff at 1.85
    c += vec3(0.888, 0.940, 1.000) * 1.85
       * lineLobe(p, r, vec3(-0.62, 2.038, -6.230), vec3(0.62, 2.038, -6.230), 0.050);
    /* The main display cluster, on the fascia raked -0.60 rad about X. This is
       Interior.js's onPanel() frame: the one thing in the reflection with a
       shape rather than a length, and the reason the pane reads as a surface
       instead of as fog. */
    c += vec3(0.347, 0.631, 1.000) * 0.62
       * rectLobe(p, r, vec3(0.0, 0.838, -6.292),
                  vec3(1.0, 0.0, 0.0), vec3(0.0, 0.8253, -0.5646),
                  vec2(0.60, 0.235), 0.200);
  } else {
    // habitat coves, 0xffd7b0 at 2.57, and the corridor pair, 0xdcecf8 at 1.71
    vec3 cove = vec3(1.000, 0.679, 0.434) * 2.57;
    c += cove * lineLobe(p, r, vec3(-1.28, 2.378, 1.00), vec3(-1.28, 2.378, 6.80), 0.085);
    c += cove * lineLobe(p, r, vec3( 1.28, 2.378, 1.00), vec3( 1.28, 2.378, 6.80), 0.085);
    vec3 cool = vec3(0.740, 0.848, 0.955) * 1.71;
    c += cool * lineLobe(p, r, vec3(-0.713, 2.078, -3.10), vec3(-0.713, 2.078, 0.30), 0.075);
    c += cool * lineLobe(p, r, vec3( 0.713, 2.078, -3.10), vec3( 0.713, 2.078, 0.30), 0.075);
  }
  return c;
}
`,I=(()=>{let e=(e,t)=>{let n=e.indexOf(t);if(n<0)return e;let r=n+t.length,i=e.indexOf(`#pragma unroll_loop_end`,r);if(i<0)return e;let a=e.slice(r,i),o=a.lastIndexOf(`}`);return o<0?e:e.slice(0,r)+`
		if ( directLight.visible ) {
`+a.slice(0,o)+`
		}
	`+a.slice(o)+e.slice(i)},t=O.lights_fragment_begin;return t=e(t,`getPointLightInfo( pointLight, geometryPosition, directLight );`),t=e(t,`getSpotLightInfo( spotLight, geometryPosition, directLight );`),t})();function ce(e){return e.fragmentShader=e.fragmentShader.replace(`#include <lights_fragment_begin>`,I),e}function le(e){return function(){e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var L=null;function ue(e=512){if(L)return L;let t=le(1592597118),n=new Float32Array(e*e),r=(r,i)=>{let a=new Float32Array(r*r);for(let e=0;e<r*r;e++)a[e]=t();for(let t=0;t<e;t++){let o=t*r/e,s=o|0,c=o-s,l=c*c*(3-2*c),u=s%r*r,d=(s+1)%r*r;for(let o=0;o<e;o++){let s=o*r/e,c=s|0,f=s-c,p=f*f*(3-2*f),m=c%r,h=(c+1)%r,g=a[u+m]+(a[u+h]-a[u+m])*p,_=a[d+m]+(a[d+h]-a[d+m])*p;n[t*e+o]+=(g+(_-g)*l)*i}}};r(8,.15),r(16,.17),r(32,.2),r(64,.21),r(128,.16),r(192,.11);let i=new Float32Array(e*e),a=(n,r,a,o,s)=>{for(let c=0;c<n;c++){let n=t()<.58?(t()-.5)*.55:t()*Math.PI,c=r+(a-r)*t()*t(),l=t()*e,u=t()*e,d=Math.cos(n),f=Math.sin(n),p=o*(.35+.65*t()),m=.55+t()*s,h=Math.max(2,Math.ceil(c)),g=Math.ceil(m)+1;for(let t=0;t<=h;t++){let n=t/h,r=Math.min(1,Math.sin(Math.PI*n)*2.6),a=l+d*c*n,o=u+f*c*n;for(let t=-g;t<=g;t++){let n=((o+t|0)%e+e)%e;for(let o=-g;o<=g;o++){let s=Math.sqrt(o*o+t*t);if(s>m+1)continue;let c=1-s/(m+1),l=((a+o|0)%e+e)%e,u=n*e+l,d=p*r*c*c;d>i[u]&&(i[u]=d)}}}}};a(110,4,32,1,.85),a(10,34,130,.75,1.2);for(let r=0;r<58;r++){let r=t()*e,i=t()*e,a=1.6+t()*t()*9,o=.2+t()*.55,s=Math.ceil(a)+1;for(let t=-s;t<=s;t++){let c=((i+t|0)%e+e)%e;for(let i=-s;i<=s;i++){let s=Math.sqrt(i*i+t*t)/a;if(s>1)continue;let l=c*e+((r+i|0)%e+e)%e;n[l]-=o*(1-s*s)*.32}}}let o=1/0,c=-1/0;for(let t=0;t<e*e;t++)n[t]-=i[t]*.19,n[t]<o&&(o=n[t]),n[t]>c&&(c=n[t]);let l=1/Math.max(c-o,1e-6);for(let t=0;t<e*e;t++)n[t]=(n[t]-o)*l;let u=new Uint8Array(e*e*4),d=1.4;for(let t=0;t<e;t++){let r=(t-1+e)%e,a=(t+1)%e;for(let o=0;o<e;o++){let s=(o-1+e)%e,c=(o+1)%e,l=t*e+o,f=(n[t*e+c]-n[t*e+s])*d,p=(n[a*e+o]-n[r*e+o])*d,m=Math.sqrt(f*f+p*p+1),h=l*4;u[h]=Math.round((-f/m*.5+.5)*255),u[h+1]=Math.round((-p/m*.5+.5)*255),u[h+2]=Math.round(n[l]*255);let g=Math.max(0,(n[l]-.7)/.3);u[h+3]=Math.round(Math.min(1,i[l]*1.15+g*g*.85)*255)}}return L=new te(u,e,e,w,x),L.wrapS=L.wrapT=v,L.minFilter=ie,L.magFilter=s,L.generateMipmaps=!0,L.anisotropy=8,L.colorSpace=``,L.needsUpdate=!0,L}var de=`
  varying vec3 vLocalPos;
  varying vec3 vLocalNrm;
  uniform sampler2D tAlb;
  uniform sampler2D tNrm;
  uniform sampler2D tOrm;
  uniform sampler2D tMicro;
  uniform float uTile;      // reciprocal of the tile size in metres
  uniform float uMicro;     // reciprocal of the micro tile in metres
  uniform float uFill;      // shared trim on the bounce fill
  uniform float uSpecOcc;   // shared trim on the specular occlusion
  uniform float uShape;     // shared trim on the shaping of the flat ambient

  /* Triplanar weights, sharpened hard.
     The cabin is a rounded-rectangle tube: the flats are axis-aligned and only
     the corner fillets need blending at all, so the blend band is worth
     keeping narrow. Four squarings puts it inside a few degrees of the
     diagonal, which is where the fillet is anyway. */
  vec3 iWeights(vec3 n){
    vec3 w = max(abs(n) - 0.22, vec3(0.0));
    w *= w; w *= w;
    return w / max(w.x + w.y + w.z, 1e-5);
  }

  float iStep(float x, float e, float w){ return smoothstep(e-w, e+w, x); }
  float iBand(float x, float a, float b, float w){
    return clamp(iStep(x,a,w) - iStep(x,b,w), 0.0, 1.0);
  }

  /* Per-cell dihedral shuffle of the tiling projection.

     A 2 m tile repeating across a wall puts the same stencil, the same
     inspection placard and the same hatch roundel down in a grid, and an art
     review counted the same circle-and-dot motif four times at identical
     scale in one frame. Rotating and mirroring each cell by a hash of its
     index breaks that without a second texture: the tile's border is a plate
     seam on all four sides, so any of the eight transforms still meets its
     neighbour at a seam.

     It has to be sampled with textureGrad. The transform is discontinuous at
     the cell boundary, so implicit derivatives there are garbage and the
     hardware picks the smallest mip for one pixel — a bright crawling line
     along every cell edge. The transform is rigid, so the correct gradients
     are just the original ones put through the same rotation.

     And the lattice has to be *offset*. floor(uv) puts a cell boundary at
     every integer, which for the Z projection means one at x = 0 — the ship's
     own centreline, the plane the whole cabin is built symmetric about and the
     one place the eye is guaranteed to be looking. Two neighbouring cells draw
     different plates at different tones, so what that produced was a hard
     vertical seam straight down the middle of the centre pedestal, splitting
     the tactical hologram in half, and a matching one down the overhead
     console in the forward view. The offset is per-axis and deliberately not a
     simple fraction of any tile size in the ship, so no boundary lands on the
     centreline, the deck plane, or a bulkhead. */
  const vec2 CELL_OFF = vec2(0.373, 0.229);

  mat2 iCellRot(float h, out float mir){
    float r = floor(h * 4.0);
    mir = step(0.5, fract(h * 7.31)) * 2.0 - 1.0;
    mat2 m = mat2(1.0, 0.0, 0.0, 1.0);
    if (r > 2.5)      m = mat2( 0.0, 1.0, -1.0, 0.0);
    else if (r > 1.5) m = mat2(-1.0, 0.0,  0.0,-1.0);
    else if (r > 0.5) m = mat2( 0.0,-1.0,  1.0, 0.0);
    m[0][0] *= mir; m[0][1] *= mir;
    return m;
  }
  vec4 iCellTex(sampler2D t, vec2 uv, vec2 ddx, vec2 ddy){
    vec2 p = uv + CELL_OFF;
    vec2 c = floor(p);
    float h = fract(sin(dot(c, vec2(127.1, 311.7))) * 43758.5453);
    float mir;
    mat2 m = iCellRot(h, mir);
    vec2 f = m * (p - c - 0.5) + 0.5;
    return textureGrad(t, c + f, m * ddx, m * ddy);
  }

  vec3 iCellNrm(sampler2D t, vec2 uv, vec2 ddx, vec2 ddy){
    vec2 p = uv + CELL_OFF;
    vec2 c = floor(p);
    float h = fract(sin(dot(c, vec2(127.1, 311.7))) * 43758.5453);
    float mir;
    mat2 m = iCellRot(h, mir);
    vec2 f = m * (p - c - 0.5) + 0.5;
    vec3 n = textureGrad(t, c + f, m * ddx, m * ddy).xyz * 2.0 - 1.0;
    // inverse-rotate the tangent-space direction back into cell space
    vec2 xy = transpose(m) * n.xy;
    return vec3(xy, n.z);
  }

  /* A slow, cheap blotch. The old model spent three nine-octave value-noise
     fbms per fragment on this; everything they were doing at high frequency is
     in the baked maps now, and all that is still wanted is a large-scale mask
     that decorrelates the wear terms from one another. Two sines cost about
     four instructions and are indistinguishable at this scale. */
  float iBlot(vec3 p){
    return clamp(0.5
      + 0.26*sin(p.x*1.73 + p.z*0.91 + 1.7)
      + 0.24*sin(p.y*2.11 - p.z*1.37 + 0.4), 0.0, 1.0);
  }

  /* Where the wear is, as opposed to how much of it there is.

     The micro map was applied everywhere at one strength, and the review of
     that is the whole reason this function exists: "the ship interior is a big
     soup of textures", "everything looks the same", "the textures are all
     messy". Detail spread evenly over every surface is worth exactly as much
     as no detail, because what the eye reads is *contrast between* a clean
     area and a marked one. A painted panel in any of the reference frames is
     mostly flat paint; the scuffs are in patches, along the edges, and where
     hands and boots and stowed cases actually reach.

     So this is a decisive mask rather than a gradient: three sines at
     twenty-five to seventy centimetres, put through a smoothstep tight enough
     that roughly a third of the area is inside it and the rest is genuinely
     clean. It is deliberately *not* iBlot — that one is a slow metre-scale
     decorrelator shared by half a dozen terms, and reusing it here would make
     the wear agree with the grime and the dust, which is precisely how six
     independent modulations collapse back into one blotch. */
  float iPatch(vec3 p){
    float v = 0.5
      + 0.30*sin(p.x*2.37 - p.y*1.61 + 2.6)
      + 0.27*sin(p.z*3.11 + p.y*0.83 - 1.1)
      + 0.17*sin(p.x*5.73 + p.z*4.19 + 0.3);
    return smoothstep(0.44, 0.80, v);
  }
`;function R(e,t={}){let n=t.set||`panel`,r=t.tile??(n===`deck`?1.5:n===`soft`?.5:2),i=(t.detail??1).toFixed(3),a=(t.wear??.6).toFixed(3),o=(t.grime??.6).toFixed(3),s=(t.bump??1).toFixed(3),c=(t.bare??.5).toFixed(3),l=(t.dust??.4).toFixed(3),u=(t.kick??1).toFixed(3),d=(t.lane??0).toFixed(3),f=(t.hands??0).toFixed(3),p=(t.markFloor??.16).toFixed(3),m=(t.sheenKill??.5).toFixed(3),h=(t.bounce??1).toFixed(3),g=`vec3(${(t.edgeTint||[.66,.68,.71]).map(e=>e.toFixed(3)).join(`,`)})`,_=t.micro??1,v=t.microTile??.26,y=(_*(t.microBump??1)).toFixed(3),b=(_*(t.microGrime??1)).toFixed(3),x=(_*(t.microWear??1)).toFixed(3),S=(_*(t.microRough??1)).toFixed(3),C=e.roughness??.85,w=(t.roughLo??Math.max(.05,C-.22)).toFixed(3),ee=(t.roughHi??Math.min(1,C+.12)).toFixed(3),T=t.tex||{},E=T[n+`Alb`]||T.panelAlb,D=T[n+`Nrm`]||T.panelNrm,O=T[n+`Orm`]||T.panelOrm;return e.onBeforeCompile=e=>{e.uniforms.uFill=M,e.uniforms.uSpecOcc=N,e.uniforms.uShape=oe,e.uniforms.tAlb={value:E||null},e.uniforms.tNrm={value:D||null},e.uniforms.tOrm={value:O||null},e.uniforms.tMicro={value:_>0?ue():null},e.uniforms.uTile={value:1/r},e.uniforms.uMicro={value:1/v},e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vLocalPos;
varying vec3 vLocalNrm;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vLocalPos = (modelMatrix * vec4(position, 1.0)).xyz;
vLocalNrm = mat3(modelMatrix) * normal;`),ce(e),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
`+de).replace(`#include <map_fragment>`,`
        #include <map_fragment>
        vec3  si_P = vLocalPos;
        vec3  si_N = normalize(vLocalNrm);
        vec3  si_w = iWeights(si_N);
        vec3  si_s = sign(si_N + 1e-6);
        vec2  si_uX = vec2(si_P.z, si_P.y) * uTile;
        vec2  si_uY = vec2(si_P.x, si_P.z) * uTile;
        vec2  si_uZ = vec2(si_P.x, si_P.y) * uTile;

        vec2 si_dXx = dFdx(si_uX), si_dXy = dFdy(si_uX);
        vec2 si_dYx = dFdx(si_uY), si_dYy = dFdy(si_uY);
        vec2 si_dZx = dFdx(si_uZ), si_dZy = dFdy(si_uZ);
        vec3 si_alb = iCellTex(tAlb, si_uX, si_dXx, si_dXy).rgb * si_w.x
                    + iCellTex(tAlb, si_uY, si_dYx, si_dYy).rgb * si_w.y
                    + iCellTex(tAlb, si_uZ, si_dZx, si_dZy).rgb * si_w.z;
        vec3 si_orm = iCellTex(tOrm, si_uX, si_dXx, si_dXy).rgb * si_w.x
                    + iCellTex(tOrm, si_uY, si_dYx, si_dYy).rgb * si_w.y
                    + iCellTex(tOrm, si_uZ, si_dZx, si_dZy).rgb * si_w.z;

${_>0?`
        /* ---- the micro projection, an order of magnitude finer.
           Plain texture2D and not textureGrad: unlike the plate tile there is
           no per-cell transform here, so the implicit derivatives are the
           correct ones and cost nothing. No dihedral shuffle either — the
           shuffle exists to stop a *placard* repeating in a grid, and this map
           has no feature in it large enough to recognise twice.
           .b is height, .a is where the paint has gone. */
        vec4 mcX = texture2D(tMicro, vec2(si_P.z, si_P.y) * uMicro);
        vec4 mcY = texture2D(tMicro, vec2(si_P.x, si_P.z) * uMicro);
        vec4 mcZ = texture2D(tMicro, vec2(si_P.x, si_P.y) * uMicro);
        vec4 si_mic = mcX * si_w.x + mcY * si_w.y + mcZ * si_w.z;
        /* World-space perturbation, built the same way the plate normal is:
           for the X plane the map's (s,t) are world (z,y), for Y (x,z), for Z
           (x,y). Only the tangential part is wanted — the normal component of a
           flat map is exactly what the geometric normal already is — so the
           subtraction the plate map does explicitly is done here by simply not
           writing the third component. */
        vec3 si_mn = vec3(0.0, mcX.y * 2.0 - 1.0, mcX.x * 2.0 - 1.0) * si_w.x
                   + vec3(mcY.x * 2.0 - 1.0, 0.0, mcY.y * 2.0 - 1.0) * si_w.y
                   + vec3(mcZ.x * 2.0 - 1.0, mcZ.y * 2.0 - 1.0, 0.0) * si_w.z;
`:`
        vec4 si_mic = vec4(0.5, 0.5, 0.5, 0.0);
        vec3 si_mn = vec3(0.0);
`}

        /* Grazing incidence, and it earns its two instructions.
           GGX keeps a mirror lobe alive at glancing angles on surfaces that in
           life have none, and this cabin is a tube you spend the whole game
           looking down the length of: most of the wall area in any frame is
           seen at seventy degrees or worse. abs(), because the hull shells are
           double-sided and the normal here is the one that faces out. */
        vec3  si_V  = normalize(cameraPosition - si_P);
        float si_gz = 1.0 - abs(dot(si_N, si_V));
        si_gz *= si_gz; si_gz *= si_gz;

        float si_up   = clamp(si_N.y, 0.0, 1.0);
        float si_vert = 1.0 - abs(si_N.y);
        float si_blot = iBlot(si_P);
        float si_wear = clamp((1.0 - si_orm.g) * 1.6, 0.0, 1.0) * (0.35 + si_blot*0.9);
        float si_lane = ${d} > 0.0
          ? (1.0 - smoothstep(0.30, 0.95, abs(si_P.x))) * si_up * (0.4 + si_blot*0.7) * ${d}
          : 0.0;
        float si_hand = ${f} > 0.0
          ? si_vert * iBand(si_P.y, 0.84, 1.44, 0.20) * (0.35 + si_blot*0.85) * ${f}
          : 0.0;
        /* Kick scuffs. The bottom half-metre of every vertical face in a
           crewed vehicle is walked into, and it is bare alloy long before
           anything else is. Hoisted out of the albedo block because it is one
           of the three places wear is *motivated*, and the micro layer below
           is now concentrated into those places rather than spread evenly. */
        float si_kick = (1.0 - smoothstep(0.06, 0.62, si_P.y)) * si_vert * ${u};
        /* Where the surface is allowed to be marked at all. A third of the
           area from the patch mask, plus every place a human being physically
           touches this ship. Outside it a panel keeps a sixth of the micro
           wear, which is enough to stop the clean areas reading as vinyl and
           nowhere near enough to compete with the marked ones. */
        float si_touch = clamp(iPatch(si_P)*0.80 + si_kick*1.30
                             + si_hand*1.15 + si_lane*1.05, 0.0, 1.0);
        float si_mark  = ${p} + (1.0 - ${p})*si_touch;

        {
          diffuseColor.rgb *= mix(vec3(1.0), si_alb, ${i});
          // A touch of the baked cavity on top of what is already in the
          // albedo: the seams want to read as holes, not as printed lines.
          diffuseColor.rgb *= mix(1.0, si_orm.r, 0.30);

          /* Grime. Deepens toward the deck, which is where a crewed volume
             actually collects it.
             The gradient used to run from the deck to 2.35 m — the whole
             height of the room — with a 0.28 floor under it, so *everything*
             in here was 30-90% dirty and the term was a second slow blotch
             laid over the whole ship rather than a floor gradient. It now
             dies out at 1.3 m, above which a bulkhead is simply paint. */
          float low  = 1.0 - smoothstep(0.0, 1.30, si_P.y);
          float dirt = clamp((0.10 + low*0.92) * si_blot * ${o}, 0.0, 1.0);
          diffuseColor.rgb = mix(diffuseColor.rgb,
                                 diffuseColor.rgb*vec3(0.60,0.56,0.50),
                                 clamp(dirt*0.36, 0.0, 0.36));

          float kick = si_kick;
          diffuseColor.rgb = mix(diffuseColor.rgb, ${g}*0.70,
                                 clamp(kick*(0.20 + si_blot*0.85)*${a}*0.45, 0.0, 0.38));

          // dust only settles on surfaces that face up
          diffuseColor.rgb = mix(diffuseColor.rgb,
                                 diffuseColor.rgb*vec3(1.10,1.06,0.99) + 0.012,
                                 si_up*${l}*si_blot*0.5);
          // the lane down the deck, scrubbed back toward bare alloy
          diffuseColor.rgb = mix(diffuseColor.rgb, ${g}*0.82,
                                 clamp(si_lane*0.26, 0.0, 0.26));
          // and the greasy shadow round anything held
          diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb*vec3(0.76,0.73,0.68),
                                 clamp(si_hand*0.40, 0.0, 0.40));

          /* ---- and the centimetre scale on top of all of it.
             Both terms are written so that the *mean* of the map leaves the
             colour where it was — si_mic.b averages 0.5, and 0.93 + 0.14*0.5
             is 1.0. That matters more than it looks: the map filters down to
             its own mean as the projection shrinks, so a modulation centred
             anywhere else would quietly shift the albedo of the whole ship
             with distance.

             The swing was 0.55 + 0.90*b, which is plus or minus forty-five per
             cent of the albedo — a bigger value modulation than the *lighting*
             puts across most of a bulkhead. That one line was measured to be
             most of the "big soup of textures": with the plate albedo switched
             off entirely, so no seam, fastener or placard was drawn at all, the
             bulkhead still came back covered in a one-to-two centimetre grey
             mottle, and that mottle was this. Seven per cent is a finish;
             forty-five is camouflage.

             What the map should be carrying at this scale is *roughness*,
             which is below. Roughness variation breaks the specular lobe —
             which is what makes painted alloy read as painted alloy — without
             putting a second cloud into the value, and it mips honestly. */
          diffuseColor.rgb *= mix(1.0, 0.93 + 0.14*si_mic.b, ${b}*0.92);
          // grime is not a neutral darkening; it is warm-grey dust in a recess,
          // and only where the surface is dirty in the first place
          diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb*vec3(0.78,0.75,0.70),
                                 clamp((1.0-si_mic.b)*si_mark*${b}*0.26, 0.0, 0.26));
          /* Paint gone: scratches and the crowns of the relief. This is the
             art direction's "bare metal only at wear edges" at the scale it
             actually happens at, and it is most of what separates a painted
             surface from a moulded one at 45 cm.

             The colour it goes to is *relative to the paint*, and that is the
             correction to the first version of this. edgeTint is a raw vec3
             literal near 0.7 — which is linear, not sRGB — while a panel
             painted 0x847c6c sits at 0.23 linear. Mixing the two put every
             scratch three times brighter than the wall it was cut into, and at
             1:1 the bulkhead came back covered in pale straws lying on top of
             it rather than in marks cut into it. Bare alloy under paint is
             lighter and greyer than the paint by something like half a stop,
             not by seven. */
          vec3 si_bare = mix(diffuseColor.rgb * 1.85, ${g} * 0.30, 0.45);
          diffuseColor.rgb = mix(diffuseColor.rgb, si_bare,
                                 clamp(si_mic.a*si_mark*${x}*${a}*0.46, 0.0, 0.46));
        }
      `).replace(`#include <roughnessmap_fragment>`,`
        #include <roughnessmap_fragment>
        {
          // The baked band is roughly 0.5-1.0; remap it into this material's own.
          float t = clamp((si_orm.g - 0.50) * 2.0, 0.0, 1.0);
          roughnessFactor = mix(${w}, ${ee}, t);
          // The three reasons a real surface is allowed under its own floor:
          // something rubs it, boots walk it, hands hold it.
          roughnessFactor -= si_wear*0.06 + si_lane*0.16 + si_hand*0.18;
          /* Micro-roughness, and this is the term that stops a small metal
             part reading as chrome. A wide specular lobe on a knob is not a
             roughness *value* problem — 0.44 is already matte by any number —
             it is that the value is the same across the whole part, so the lobe
             is smooth and unbroken. Breaking it at the millimetre scale is what
             "matte and mineral" physically is. Recesses hold dust and are
             rougher; scratches and rubbed crowns are barer and take a little
             off. Centred so the mean of the map is a no-op. */
          roughnessFactor += (0.5 - si_mic.b) * ${S} * 0.44;
          roughnessFactor -= si_mic.a * si_mark * ${S} * 0.16;
          // Grazing incidence, answered. Matte paint does not turn to glass at
          // seventy degrees; GGX does, and the whole length of this hull is
          // seen at seventy degrees.
          roughnessFactor = mix(roughnessFactor, 1.0, si_gz*${m});
          /* A hard floor at the art direction's own number rather than at
             0.06. Nothing in this ship is polished: the floor exists so that
             the three subtractions above cannot stack a painted panel down into
             glass, which they could, and which is the read the review called
             "broad specular highlights on chrome knobs". */
          roughnessFactor = clamp(roughnessFactor, 0.35, 1.0);
        }
      `).replace(`#include <lights_physical_fragment>`,`
        #include <lights_physical_fragment>
        material.specularF90 = mix(
          mix(material.specularF90, 0.62, smoothstep(0.30, 0.78, material.roughness)),
          material.specularF90, metalnessFactor);
      `).replace(`#include <metalnessmap_fragment>`,`
        #include <metalnessmap_fragment>
        /* Bare alloy only where the bake says the paint has actually gone. A
           metal surface has no diffuse term at all, so anything driven metal
           by mistake returns a reflection of the room probe and nothing else —
           which is most of what "mirror-like" was. */
        metalnessFactor = clamp(metalnessFactor + si_orm.b*${c}
                                + si_mic.a*si_mark*${x}*${c}*0.45, 0.0, 1.0);
      `).replace(`#include <normal_fragment_maps>`,`
        #include <normal_fragment_maps>
        {
          /* The normal has to be rotated by the same transform its cell was:
             a tangent-space normal carries a direction, so shuffling the cell
             without turning the vector lights every rotated plate from the
             wrong side. */
          vec3 tX = iCellNrm(tNrm, si_uX, si_dXx, si_dXy);
          vec3 tY = iCellNrm(tNrm, si_uY, si_dYx, si_dYy);
          vec3 tZ = iCellNrm(tNrm, si_uZ, si_dZx, si_dZy);
          vec3 nX = vec3(tX.z*si_s.x, tX.y, tX.x);
          vec3 nY = vec3(tY.x, tY.z*si_s.y, tY.y);
          vec3 nZ = vec3(tZ.x, tZ.y, tZ.z*si_s.z);
          vec3 blended = nX*si_w.x + nY*si_w.y + nZ*si_w.z;
          vec3 flat_   = vec3(si_s.x*si_w.x, si_s.y*si_w.y, si_s.z*si_w.z);
          /* Plate relief and micro relief added as two independent
             perturbations of the same geometric normal, which is what they
             physically are: the cast texture of the paint does not know where
             the panel seams are. */
          vec3 wN = normalize(si_N + (blended - flat_) * ${s}
                                   + si_mn * ${y} * 0.55);
          normal = normalize((viewMatrix * vec4(wN, 0.0)).xyz);
        }
      `).replace(`#include <aomap_fragment>`,`
        #include <aomap_fragment>
        float si_cav = clamp(si_orm.r * mix(1.0, 0.45 + 1.10 * si_mic.b, ${S}),
                             0.0, 1.0);
        {
          float si_nv = clamp(dot(geometryNormal, geometryViewDir), 0.0, 1.0);
          float si_so = mix(1.0,
            computeSpecularOcclusion(si_nv, si_cav, material.roughness), uSpecOcc);
          reflectedLight.indirectSpecular *= si_so;
          reflectedLight.directSpecular *= mix(1.0, si_so, 0.75);
        }
        /* ---- the ambient, shaped.
           An AmbientLight is a constant added to every fragment in the room
           regardless of which way it faces, what is in front of it or how deep
           into a corner it sits, and a HemisphereLight is the same thing with a
           single cosine on it. Between them the cabin carries 0.8 of flat
           irradiance, and that — not the lamps, and not the bounce fill — is
           the largest single reason the owner's read is "everything looks
           uniformly lit and bright, hardly any shadows, feels really fake".
           A constant cannot describe shadow. It is the definition of no shadow.

           It cannot simply be turned down, because auto-exposure undoes any
           change to the frame's overall level within a second — measured:
           setting both lights to zero moved the corridor's median by four
           levels out of 255. What survives normalisation is *shape*, so that
           is what this does, and it leaves the total roughly where it was:

             · cavity, so a crease, a seam and a fastener well see less of the
               room than an open face does — the one thing a flat ambient is
               most obviously wrong about. It composes with three's own aomap
               chunk immediately above, which does the same job at corner scale
               for the twelve kit materials that carry a baked atlas, and with
               the screen-space pass in PostFX, which does it at room scale;
               this is the millimetre-to-centimetre term neither of those can
               resolve. Applied at 0.72 rather than 1 because it is a
               statistical stand-in for geometry and taking it to one turns a
               lit surface into its own bump map.
             · a hemisphere weighting steeper than three's own, because the
               light in this ship is in the ceiling coves and there is a
               painted deck under it, not a sky. A face pointing at the deck
               keeps a third; one pointing at the coves keeps all of it.

           Normalised so an open, upward-facing, uncreased surface is unchanged
           and everything else falls away from it — so it costs no exposure. It
           is a light probe with two terms in it rather than none, which is the
           cheapest honest thing short of baking irradiance volumes into the
           ship, and about twelve ALU with no new texture fetch. */
        {
          float si_hemi = 0.34 + 0.66 * clamp(si_N.y * 0.62 + 0.38, 0.0, 1.0);
          float si_open = mix(1.0, si_cav, 0.72);
          reflectedLight.indirectDiffuse *= mix(1.0, si_hemi * si_open, uShape);
        }
        {
          float si_lit = dot(reflectedLight.directDiffuse, vec3(0.3333));
          /* Steepened from 11. The gate decides how much *direct* light a
             fragment has to have before the bounce stops arriving, and at 11 a
             surface at a third of full key still collected two thirds of it —
             so the fill was not filling shadows, it was raising the whole
             room. At 20 it is confined to pixels that are genuinely unlit,
             which is what the term was built for. */
          float si_fill = exp(-si_lit * 20.0);
          float si_low = 1.0 - smoothstep(0.10, 2.30, si_P.y);
          /* These three were (0.720,0.429,0.219), (0.309,0.363,0.449) and
             (0.207,0.297,0.456), and between them they were most of a measured
             colour problem: the fill lands in the *shadows*, which is most of
             the area of any frame in here, so its hue is the room's hue. The
             cockpit put 77% of its chromatic energy into two adjacent ten-degree
             bins at 200-210 — which is precisely the hue of the second and third
             of those — at a mean saturation of 0.47 against 0.19-0.24 for the
             reference. It read as a colour-graded screenshot rather than as lit
             materials, and walking aft was a 180-degree hue jump.
             They keep their direction, at 58% of the chroma. The art direction
             asks for a shadow filled by planetshine and shifted toward the
             key's complement; it does not ask for the shadow to *be* that
             colour. */
          /* And two thirds of the strength they had. The fill closed a genuine
             fault — 19.3% of the habitat was at pure 0,0,0 — but it closed it
             by adding an almost-constant to the two thirds of every frame that
             is in shadow, which is the same mistake the ambient above makes.
             At this strength the histogram still has a floor (black% under one
             per cent, p1 in single figures) and there is somewhere for the
             shadows to go. */
          vec3 si_b = vec3(0.586, 0.455, 0.360) * 0.66
                    * (0.22 + 0.78 * clamp(-si_N.y, 0.0, 1.0)) * (0.24 + 0.76 * si_low);
          si_b += vec3(0.337, 0.360, 0.398) * 0.66
                * (0.18 + 0.82 * clamp(si_N.y, 0.0, 1.0));
          si_b += vec3(0.254, 0.293, 0.360) * 0.72 * clamp(-si_N.z, 0.0, 1.0)
                * (1.0 - smoothstep(-4.10, -2.30, si_P.z));
          /* Against a floor on the albedo, not against the albedo itself.
             Most of the pure black in this room is not black *paint* — it is
             the panel gaps, weld reliefs and fastener recesses in the baked
             map, which are dark because the bake put occlusion into the albedo
             as well as into the ORM. Multiplying the fill by that gives the
             darkest pixels in the frame the least fill, which is precisely
             backwards. Six percent is about the floor of a real anodised or
             painted surface, and nothing in here is charcoal. */
          vec3 si_fa = max(diffuseColor.rgb, vec3(0.058))
                     * (1.0 - metalnessFactor);
          reflectedLight.indirectDiffuse += si_b * si_fa * si_fill
            * ${h} * uFill * mix(1.0, si_cav, 0.62);
        }
      `)},e.customProgramCacheKey=()=>`bake5:`+(t.key||`${n}_${r}_${i}_${a}_${o}_${s}_${c}_${l}_${u}_${d}_${f}_${m}_${w}_${ee}_${g}`)+`_k`+p+`_b`+h+`_m`+[y,b,x,S,v].join(`,`),e.userData.dress=t,e.userData.fill=M,e.userData.specOcc=N,e.userData.shape=oe,e}function z(e,t={},n={}){let r=e.clone();return Object.assign(r,t),R(r,{...e.userData.dress||{},...n,key:(e.userData.dress?.key||`?`)+`:`+Object.keys(t).join(`,`)+`:`+Object.keys(n).join(`,`)}),se(r)}var B=`
varying vec3 vWPos;
varying vec3 vWNrm;
varying vec2 vGuv;
void main(){
  vGuv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWPos = wp.xyz;
  vWNrm = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,fe=`
precision highp float;
varying vec3 vWPos;
varying vec3 vWNrm;
varying vec2 vGuv;

uniform vec3  uCamPos;
uniform vec3  uSunDir;     // cabin space, unit, toward the star
uniform vec3  uSunCol;     // star colour scaled by how much reaches the glass
uniform vec3  uTint;       // the colour of the plate in its own thickness
uniform float uEnvGain;    // trim on the painted shell's own radiance
uniform float uSheen;      // master gain on everything specular
uniform float uCover;      // fraction of the reflectance that removes sky
uniform float uCoverLum;   // extra coverage per unit of reflected luminance
uniform float uCoat;       // 0 uncoated (mirror at the edges), 1 fully coated
uniform float uGrime;      // dust and salt in the perimeter fringe
uniform float uPolish;     // scratch and swirl density
uniform float uLamp;       // gain on the reflected fixtures of the cabin
uniform float uRim;        // metres of pane over which the sheen climbs
uniform float uFrit;       // printed border band at the seal, 0..1
uniform vec2  uSpan;       // metres spanned by uv.x and uv.y
uniform float uRadial;     // 1 for a round port, 0 for a rectangular pane
uniform vec2  uArc;        // shoulder line of the section: y = uArc.x + uArc.y*z
uniform float uOutside;    // 1 when there is deep space behind the plate

${F}

float h21(vec2 p){
  p = fract(p * vec2(139.71, 271.13));
  p += dot(p, p + 41.7);
  return fract(p.x * p.y);
}
float vn(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x),
             mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float a = 0.5, s = 0.0;
  for(int i = 0; i < 4; i++){ s += a * vn(p); p *= 2.03; a *= 0.5; }
  return s;
}

/* What is on the other side.
 *
 * The observation port was a disc of flat emissive in a ring, which reads as a
 * lamp set into the wall rather than as a hole in the hull -- the review called
 * it a blank white disc. It cannot show the real sky: the cabin is a separate
 * scene drawn over the world with its own cleared depth, and the hull skin
 * behind the port occludes it. So the view is authored here.
 *
 * Voronoi-ish rather than thresholded noise, for the reason the starfield in
 * the exterior already knows: noise cannot separate density from size. One
 * star per cell, kept or thrown away on a per-cell random, with a per-cell
 * brightness -- so the count is set by the cell scale and the size by the
 * radius, independently. Authored well above the clip point, because a window
 * onto space in a lit room is the one place a few pixels are allowed to blow.
 */
vec3 outside(vec3 d, vec3 sunDir, vec3 sunCol){
  // the void is teal-black, never neutral grey
  vec3 c = mix(vec3(0.0035, 0.0062, 0.0088), vec3(0.0060, 0.0098, 0.0130),
               d.y * 0.5 + 0.5);
  /* Density, size and brightness, and all three were wrong in the same
     direction: 6.2% of cells kept at a cell scale of 52, a disc radius of 0.11
     cells and a magnitude of mag-cubed came to about thirty stars across the
     whole aperture, nearly all of them faint, and each of them 0.12 degrees
     across — under one and a half pixels at any sane size for a 1.1 m port on
     screen. This project has learned twice that a sub-pixel emissive is not
     dim, it is *absent*: the sky sprites and the dust motes both needed
     explicit pixel floors. So the keep rate goes to 22%, the disc to a quarter
     of a cell (about three and a half pixels), and the magnitude distribution
     from a cube to a square with a real floor under it, which raises the faint
     end without touching the bright one. */
  vec3 p = d * 52.0;
  vec3 gi = floor(p);
  vec3 gf = fract(p) - 0.5;
  float h = h21(gi.xy * 1.7 + gi.z * 37.13);
  if(h > 0.780){
    vec3 j = vec3(h21(gi.xy + 11.3), h21(gi.yz + 7.7), h21(gi.zx + 3.1)) - 0.5;
    float r = length(gf - j * 0.62);
    float mag = fract(h * 913.7);
    c += smoothstep(0.25, 0.0, r) * (1.1 + 30.0 * mag * mag)
       * mix(vec3(1.0, 0.86, 0.70), vec3(0.80, 0.88, 1.0), fract(h * 57.1));
  }
  // and the star itself, plus the glare it throws across the plate
  float sd = dot(d, sunDir);
  c += sunCol * (smoothstep(0.99976, 0.99994, sd) * 240.0
                 + pow(max(sd, 0.0), 90.0) * 0.9
                 + pow(max(sd, 0.0), 6.0) * 0.030);
  return c;
}

void main(){
  vec3 N = normalize(vWNrm);
  vec3 V = normalize(uCamPos - vWPos);
  // the pane is a single sheet drawn double-sided; face the normal at the eye
  if(dot(N, V) < 0.0) N = -N;
  float ndv = clamp(dot(N, V), 0.002, 1.0);

  /* ---- metres from the nearest edge of the pane, and a metric coordinate to
     print things in.

     Neither can come from uv, and this is the hard vertical seam down the
     middle of the canopy. The wrap panes are lofted by glassGeo, whose u is
     the *vertex index* along the section: twenty-eight points, of which
     twenty-six are spent on the two corner radii and exactly one span covers
     the flat of the roof. That one span is 2.8 m of pane inside a u-step of
     0.037, and it sits at u = 0.5 — dead centre. Anything authored against uv
     is therefore thirteen times finer down the middle of the windscreen than
     it is at the sills, with a hard discontinuity either side of it: the
     scratch set's own pixel-footprint fade keeps the scratches on the flat and
     throws them away on the arcs, so what the eye sees is a corduroy stripe
     down the centreline with a sharp edge on both sides.

     So the scale is *measured*, by inverting the uv Jacobian against the
     world-space one, which is exact and costs six instructions; and the print
     coordinate for the wrap panes is a real arc-length-and-station pair taken
     from cabin space, which is continuous whatever the tessellation does. The
     dome, the port and the nav plate all carry a genuinely geometric uv, so
     they keep theirs. */
  vec3 dPx = dFdx(vWPos), dPy = dFdy(vWPos);
  vec2 dUx = dFdx(vGuv),  dUy = dFdy(vGuv);
  float det = dUx.x * dUy.y - dUx.y * dUy.x;
  float idet = 1.0 / (det + (step(0.0, det) * 2.0 - 1.0) * 1e-9);
  vec2 sp = clamp(vec2(length((dPx * dUy.y - dPy * dUx.y) * idet),
                       length((dPy * dUx.x - dPx * dUy.x) * idet)),
                  uSpan * 0.15, uSpan * 4.0);

  vec2 e2 = min(vGuv, 1.0 - vGuv) * sp;
  float edge = max(mix(min(e2.x, e2.y),
                       (0.5 - length(vGuv - 0.5)) * sp.x, uRadial), 0.0);

  /* ---- arc length across the section, and this replaced a polar coordinate
     that put a *pole on the windscreen*.

     What was here was atan(x, max(y - 0.55, 0.03)) — an angle about a point at
     (0, 0.55). Two things are wrong with that and the second is fatal. The
     point is only 470 mm above the deck, so it is nowhere near the centre of
     the section and the angle is badly non-uniform along the arc; and the
     clamp means that for every fragment below y = 0.58 the second argument is
     the constant 0.03, so atan flips from +pi/2 to -pi/2 the instant x changes
     sign. The swirl field rotates the anisotropic tangent frame from this
     coordinate, so every polish stroke and every scratch on the pane radiates
     from that singularity.

     It is invisible until the anisotropic lobe lights up, which needs the star
     within a few degrees of the mirror direction — so it never appeared in any
     shot taken with the star ahead. Put the star behind the ship at a phase
     near 150 and it draws a hard four-lobed X across the whole canopy with a
     fan of about ten radial spokes off the pole, with bloom, streak and flare
     all switched off. The seam this coordinate was introduced to fix was real;
     the cure had a worse defect in it than the disease.

     What the pane actually wants is arc length from the crown, in metres,
     continuous, and with no pole anywhere. For a rounded-rectangle section
     that is exactly x across the roof flat, and x plus the vertical descent
     down the shoulder and the sill. The two agree at the centreline because
     the descent term is identically zero there — the crown is the highest part
     of the section by construction — so there is nothing to flip. uArc carries
     the shoulder line as a linear function of z, which is what makes it hold
     over a canopy that tapers from 2.44 m tall at the header to 1.62 m at the
     nose ring: below that line the section is running vertically, above it,
     horizontally. The corner radius is measured a little short (it counts the
     chord rather than the arc, so a fillet is compressed by about a third),
     which for a noise field is not a thing the eye can find. */
  float shoulder = uArc.x + uArc.y * vWPos.z;
  float run = max(shoulder - vWPos.y, 0.0);
  vec2 mp = mix(vec2(vWPos.x + clamp(vWPos.x * 8.0, -1.0, 1.0) * run, vWPos.z),
                vGuv * sp, uRadial);

  /* ---- Fresnel, for a slab rather than an interface, then coated nearly
     flat. See the block comment: an incidence-driven sheen on a pane that is
     everywhere at 70-85 degrees is not a sheen, it is a veil. What is left
     after the coat is a near-constant 8%, which is what a coated window
     actually returns. */
  float f = 0.040 + 0.960 * pow(max(1.0 - ndv, 0.0), 5.0);
  float R = f * (2.0 - f);
  R *= mix(1.0, 0.145, uCoat * smoothstep(0.72, 0.04, ndv));

  /* ---- and the sheen put back where the pane does turn away: the band before
     the seal, where the glass curves hard into its frame. Squared so the clean
     middle of the pane is untouched and the climb happens in the last third of
     the band. */
  float rim = 1.0 - smoothstep(0.0, uRim, edge);
  rim *= rim;
  R *= (1.0 + rim * 5.0) * uSheen;

  // ---- polish. The pane was drawn and buffed along its length, so the
  //      anisotropy runs with the hull axis, swirled by a slow field: a
  //      perfectly parallel scratch set reads as brushed metal, not glass.
  vec3 tanZ = vec3(0.0, 0.0, 1.0) - N * N.z;
  float tl = length(tanZ);
  vec3 T = tl > 1e-3 ? tanZ / tl : normalize(cross(N, vec3(1.0, 0.0, 0.0)));
  vec3 Bt = cross(N, T);
  float sw = (fbm(mp * vec2(0.62, 0.71)) - 0.5) * 1.6;
  vec3 Ts = normalize(T * cos(sw) + Bt * sin(sw));
  vec3 Bs = cross(N, Ts);

  vec3 L = uSunDir;
  vec3 Hv = normalize(L + V);
  float ht = dot(Hv, Ts) / 0.022;      // tight along the stroke
  float hb = dot(Hv, Bs) / 0.30;       // smeared across it
  float aniso = exp(-(ht * ht + hb * hb));

  /* Individual scratches: long along the run of the pane, sparse and hard
     across it -- and *prefiltered by their own footprint*. Forty cycles to the
     metre puts a scratch under two pixels wide at working resolution, which
     does not read as polish, it reads as a corduroy over the whole windscreen.
     The same failure the procedural surface model died of: a hard step
     computed in the shader with no mip chain under it. Fading the term out as
     its period approaches a pixel is the filter it never had.

     Skipped entirely where the star is nowhere near the mirror direction,
     which is most of the pane most of the time: the whole term is multiplied
     by an anisotropic lobe that has already gone to zero, and it costs two
     value-noise fetches to compute a number that will be multiplied by 1e-9.
     The branch is on a smooth function of the half-vector, so it is a band
     across the pane rather than per-pixel confetti, and a warp takes it
     together. */
  float polish = 0.0;
  if(aniso > 1.0e-4){
    const float SFREQ = 39.0;          // cycles per metre, across the pane
    float scr = vn(mp * vec2(SFREQ, 3.75) + sw * 3.0);
    scr = smoothstep(0.56, 1.0, scr);
    scr *= scr * clamp(1.0 - fwidth(mp.x) * SFREQ * 2.4, 0.0, 1.0);
    // and the broad swirl band the buffing wheel left
    float band = pow(max(vn(mp * vec2(4.6, 2.1) + 3.7), 0.0), 3.0);
    /* Weighted to the perimeter. A wiper sweeps the middle of a windscreen and
       never reaches its corners, so that is where the swirl and the fine
       scratch set survive; run flat across the pane it is one more constant
       term over the part of the frame the whole game is played through. */
    float worn = 0.30 + 1.70 * rim;
    polish = uPolish * (0.03 + (2.4 * scr + 1.0 * band) * worn);
  }

  // ---- the star's own disc, reflected. Half a degree wide, and it has to be
  //      authored in real HDR or the bloom has nothing to find.
  float mir = dot(reflect(-V, N), L);
  float disc = smoothstep(0.99900, 0.99986, mir);

  /* ---- the seal. Dirt, dried salt and the printed frit border, all of them
     in the last few centimetres against the frame and none of them across the
     middle. The frit is the strongest single cue that a pane is a physical
     object: every glazed panel ever made has a ceramic band screened round its
     edge to hide the adhesive, solid at the rim and dithered out into a dot
     matrix. It is opaque, so it goes into coverage rather than into colour.

     All of it is confined to a band of a few centimetres, so all of it is
     inside a branch: two fbms and a value-noise fetch, skipped over the ninety
     percent of the pane the seal cannot reach. Same argument as the polish —
     the band is contiguous, so warps either take it or skip it whole. */
  float film = 0.0, salt = 0.0, frit = 0.0;
  if(edge < max(0.135, uRim * 0.58)){
    float grit = fbm(mp * 26.0);
    float fringe = 1.0 - smoothstep(0.0, 0.115, edge);
    fringe *= fringe;
    film = uGrime * fringe * (0.24 + 0.76 * grit);
    salt = uGrime * smoothstep(0.60, 0.90, fbm(mp * 38.0 + 11.3))
         * (1.0 - smoothstep(0.0, 0.055, edge));
    const float DFREQ = 78.0;
    float dots = smoothstep(0.38, 0.86, vn(mp * DFREQ + 5.1))
               * clamp(1.0 - fwidth(mp.x) * DFREQ * 2.2, 0.0, 1.0);
    // scaled off the same band the sheen climbs in, so a 1.1 m porthole does
    // not get the 5 m canopy's border printed round it
    frit = uFrit * clamp((1.0 - smoothstep(uRim * 0.04, uRim * 0.24, edge))
                         + dots * (1.0 - smoothstep(uRim * 0.14, uRim * 0.52, edge)) * 0.85,
                         0.0, 1.0);
  }
  // a scattering layer blazes when the source is behind it and merely glows
  // when the room lights it
  float fwd = pow(clamp(dot(V, -L) * 0.5 + 0.5, 0.0, 1.0), 4.0);
  vec3 dustLit = uSunCol * (0.03 + 0.97 * fwd) * 0.055
               + cabinRoom(N) * uEnvGain * 0.55;

  /* ---- the plate seen in its own thickness. Rim-gated, not incidence-gated,
     for the same reason the sheen is: from the seat the canopy wraps the whole
     upper field at 70-85 degrees, so anything proportional to path length is a
     veil over half the frame before it is a colour in the glass. Where you
     genuinely do look through a long path of it is at the rim, where the pane
     curves away. */
  float thick = clamp(1.0 / ndv - 1.0, 0.0, 2.0) * rim;

  /* ---- the room, with parallax and with its lamps in it. This is the whole
     point of the rewrite: an environment sampled by direction alone is
     constant over a pane whose normal barely changes, and constant is fog. */
  vec3 Rv = reflect(-V, N);
  vec3 refl = (cabinRoom(Rv) * uEnvGain + cabinLamps(vWPos, Rv) * uLamp) * R;

  vec3 spec = refl
            + uSunCol * aniso * polish * uSheen
            + uSunCol * disc * 34.0 * uSheen
            + dustLit * (film * 0.9 + salt * 1.7)
            + uTint * uEnvGain * 0.055 * thick;

  /* Coverage. A small fixed share of the reflectance — tuned so the clean
     centre of the pane passes better than 99% of the sky — plus what the glass
     is actually showing you, so a hot streak hides what is behind it and clean
     glass does not. The seal is opaque and simply counts. */
  float lum = dot(spec, vec3(0.2126, 0.7152, 0.0722));
  float alpha = clamp(R * uCover + lum * uCoverLum
                      + (film + salt) * 0.30 + frit, 0.0, 1.0);
  vec3 col = spec * (1.0 - frit * 0.88);
  if(uOutside > 0.5){
    // an opening, not a film: whatever the renderer drew behind this is the
    // cabin's own far wall, and it has to be replaced rather than tinted
    col += outside(-V, uSunDir, uSunCol) * (1.0 - R) * (1.0 - frit * 0.95);
    alpha = 1.0;
  }
  gl_FragColor = vec4(col, alpha);
}
`;function V(e={}){return new p({vertexShader:B,fragmentShader:fe,uniforms:{uCamPos:{value:new o},uSunDir:{value:new o(0,.3,-1).normalize()},uSunCol:{value:new C(0,0,0)},uTint:{value:new C(.42,.72,.68)},uEnvGain:{value:e.envGain??1},uSheen:{value:e.sheen??1},uCover:{value:e.cover??.13},uCoverLum:{value:e.coverLum??.55},uCoat:{value:e.coat??1},uGrime:{value:e.grime??1},uPolish:{value:e.polish??1},uLamp:{value:e.lamp??1.3},uRim:{value:e.rim??.3},uFrit:{value:e.frit??1},uSpan:{value:new a(e.spanU??5,e.spanV??2.4)},uRadial:{value:+!!e.radial},uArc:{value:new a(e.arcA??3.59,e.arcB??.3277)},uOutside:{value:+!!e.outside}},transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:2})}function pe(e,t){return e.userData.noShadow=!0,e.onBeforeRender=(n,r,i)=>{let a=t.uniforms;a.uCamPos.value.setFromMatrixPosition(i.matrixWorld);let o=e.userData._sun;o===void 0&&(o=null,r.traverse(e=>{!o&&e.isDirectionalLight&&(o=e)}),e.userData._sun=o),o&&(a.uSunDir.value.copy(o.position).sub(o.target.position).normalize(),a.uSunCol.value.copy(o.color).multiplyScalar(o.intensity))},e}function me(e={}){let t=e.tex||{},n={},r=e=>new u(e);n.panel=R(r({color:8551280,metalness:0,roughness:.86,envMapIntensity:.14}),{tex:t,set:`panel`,wear:.75,grime:.55,bump:1,bare:.45,dust:.6,hands:.35,edgeTint:[.72,.73,.75],roughLo:.62,roughHi:.97,sheenKill:.55,microTile:.28,key:`panel`}),n.hull=R(r({color:7106924,metalness:0,roughness:.9,envMapIntensity:.12}),{tex:t,set:`panel`,wear:.9,grime:.7,bump:1.1,bare:.5,dust:.7,hands:.25,edgeTint:[.66,.69,.72],roughLo:.66,roughHi:.99,sheenKill:.6,microTile:.32,microWear:1.15,key:`hull`}),n.dark=R(r({color:4869198,metalness:.07,roughness:.66,envMapIntensity:.26}),{tex:t,set:`panel`,tile:1.15,wear:.6,grime:.45,bump:.75,bare:.58,dust:.35,hands:.5,edgeTint:[.6,.63,.68],markFloor:.34,roughLo:.5,roughHi:.86,sheenKill:.45,microTile:.19,microRough:1.15,microBump:.62,key:`dark`}),n.floor=R(r({color:5986385,metalness:.04,roughness:.88,envMapIntensity:.11}),{tex:t,set:`deck`,wear:1,grime:.8,bump:1,bare:.5,dust:.2,kick:0,lane:.85,edgeTint:[.62,.63,.64],markFloor:.42,roughLo:.58,roughHi:.96,sheenKill:.45,microTile:.3,microGrime:1.25,microWear:.6,key:`floor`}),n.accent=R(r({color:8673327,metalness:0,roughness:.8,envMapIntensity:.12}),{tex:t,set:`panel`,tile:1.6,wear:1,grime:.5,bump:.8,bare:.35,dust:.5,hands:.7,edgeTint:[.66,.62,.56],markFloor:.5,roughLo:.58,roughHi:.93,sheenKill:.5,microTile:.16,microWear:1.25,key:`accent`}),n.rubber=R(r({color:3026480,metalness:0,roughness:.96,envMapIntensity:.05}),{tex:t,set:`soft`,tile:.26,detail:.85,wear:.3,grime:.5,bump:.55,bare:0,dust:.25,kick:0,edgeTint:[.34,.34,.36],roughLo:.9,roughHi:1,sheenKill:.35,microTile:.1,microWear:0,microBump:.85,key:`rubber`}),n.seat=R(r({color:4998200,metalness:0,roughness:.96,envMapIntensity:.07}),{tex:t,set:`soft`,tile:.155,detail:.42,wear:.4,grime:.6,bump:.55,bare:0,dust:.3,kick:0,edgeTint:[.5,.47,.43],roughLo:.88,roughHi:1,sheenKill:.25,microTile:.085,microWear:0,microBump:.7,microGrime:.85,key:`seat`}),n.rail=R(r({color:10132119,metalness:.7,roughness:.52,envMapIntensity:.34}),{tex:t,set:`panel`,tile:.26,detail:.32,wear:.8,grime:.25,bump:.3,bare:.12,dust:.15,kick:0,markFloor:.62,edgeTint:[.8,.82,.84],roughLo:.44,roughHi:.64,sheenKill:0,microTile:.115,microRough:1.45,microWear:1.2,key:`rail`}),n.liner=R(r({color:7234389,metalness:0,roughness:.97,envMapIntensity:.05}),{tex:t,set:`soft`,tile:.26,detail:.78,wear:.35,grime:.55,bump:.6,bare:0,dust:.5,hands:.4,edgeTint:[.52,.52,.5],roughLo:.9,roughHi:1,sheenKill:.25,microTile:.1,microWear:0,microBump:.65,key:`liner`}),n.shell=R(r({color:3881268,metalness:.06,roughness:.78,envMapIntensity:.14}),{tex:t,set:`panel`,tile:.85,wear:.5,grime:.4,bump:.6,bare:.42,dust:.3,hands:.4,edgeTint:[.54,.57,.61],roughLo:.6,roughHi:.94,sheenKill:.55,microTile:.135,microRough:1.35,key:`shell`}),n.glass=V({spanU:5,spanV:2.4,rim:.34}),n.noseGlass=V({spanU:2.5,spanV:2.5,radial:!0,grime:.4,polish:1.05,cover:.09,coverLum:.42,lamp:.85,rim:.26}),n.portGlass=V({spanU:1.1,spanV:1.1,radial:!0,grime:.7,polish:.35,envGain:.42,lamp:.4,rim:.13,outside:!0,cover:1}),n.navPlate=V({spanU:1.4,spanV:1.4,radial:!0,grime:.7,polish:.55,envGain:1.6,lamp:1.3,coat:.35,rim:.16,cover:.3,coverLum:.85});for(let e of Object.keys(n))se(n[e]);return n}function H(e,t,n=.85){return t?z(e,{aoMap:t,aoMapIntensity:n}):e}var he=new Map;function U(e,t=1){let n=e+`|`+t;if(!he.has(n)){let r=se(new i({color:new C().setHex(e,ne).multiplyScalar(t),toneMapped:!0}));r.userData.emissiveTint=r.color,he.set(n,r)}return he.get(n)}var W=null;function ge(){return W||=se(new i({vertexColors:!0,toneMapped:!0})),W}var _e=.001,ve=new y;ve.layers.enableAll(),ve.far=12;var ye=new o,be=new o;function xe(e,t,n,r=5){let i=[],o=(e,t,o,s)=>{for(let c=0;c<=r;c++){let l=o+(s-o)*(c/r);i.push(new a(e+Math.cos(l)*n,t+Math.sin(l)*n))}};return o(e-n,n,-Math.PI/2,0),o(e-n,t-n,0,Math.PI/2),o(-e+n,t-n,Math.PI/2,Math.PI),o(-e+n,n,Math.PI,Math.PI*1.5),i}function Se(e,t,n){let r=e.length,i=[],a=[];for(let n of e)i.push(n.x,n.y,t);for(let t of e)i.push(t.x,t.y,n);for(let e=0;e<r;e++){let t=e,n=(e+1)%r,i=e+r,o=(e+1)%r+r;a.push(t,i,n,n,i,o)}let o=new m;return o.setAttribute(`position`,new c(i,3)),o.setIndex(a),o.computeVertexNormals(),o}function Ce(e,t,n){let r=e.length,i=[],a=[];for(let t of e)i.push(t.x,t.y,n);for(let e of t)i.push(e.x,e.y,n);for(let e=0;e<r;e++){let t=e,n=(e+1)%r,i=e+r,o=(e+1)%r+r;a.push(t,i,n,n,i,o)}let o=new m;return o.setAttribute(`position`,new c(i,3)),o.setIndex(a),o.computeVertexNormals(),o}function we(e,t,n,r){let i=Math.min(e.length,t.length),a=[],o=[];for(let t=0;t<i;t++)a.push(e[t].x,e[t].y,n);for(let e=0;e<i;e++)a.push(t[e].x,t[e].y,r);for(let e=0;e<i-1;e++){let t=e,n=e+1,r=e+i,a=e+1+i;o.push(t,r,n,n,r,a)}let s=new m;return s.setAttribute(`position`,new c(a,3)),s.setIndex(o),s.computeVertexNormals(),s}function Te(e,t,n,r,i=5,o=0){let s=[new a(e,r)];for(let t=0;t<=i;t++){let r=-(Math.PI/2)*(t/i);s.push(new a(e-n+Math.cos(r)*n,n+Math.sin(r)*n))}o>0&&(s.push(new a(e-n,-o)),s.push(new a(-e+n,-o)));for(let t=0;t<=i;t++){let r=-Math.PI/2-Math.PI/2*(t/i);s.push(new a(-e+n+Math.cos(r)*n,n+Math.sin(r)*n))}return s.push(new a(-e,r)),s}function Ee(e,t,n,r,i=5){let o=[new a(e,r)];for(let r=0;r<=i;r++){let s=Math.PI/2*(r/i);o.push(new a(e-n+Math.cos(s)*n,t-n+Math.sin(s)*n))}for(let r=0;r<=i;r++){let s=Math.PI/2+Math.PI/2*(r/i);o.push(new a(-e+n+Math.cos(s)*n,t-n+Math.sin(s)*n))}return o.push(new a(-e,r)),o}function De(e){let t=Math.min(...e.map(e=>e.pts.length)),n=[],r=[],i=[];for(let i of e){let e=[0];for(let n=1;n<t;n++)e.push(e[n-1]+Math.hypot(i.pts[n].x-i.pts[n-1].x,i.pts[n].y-i.pts[n-1].y));let a=e[t-1]||1;for(let o=0;o<t;o++)n.push(i.pts[o].x,i.pts[o].y,i.z),r.push(e[o]/a,i.v)}for(let n=0;n<e.length-1;n++)for(let e=0;e<t-1;e++){let r=n*t+e,a=n*t+e+1,o=r+t,s=a+t;i.push(r,o,a,a,o,s)}let a=new m;return a.setAttribute(`position`,new c(n,3)),a.setAttribute(`uv`,new c(r,2)),a.setIndex(i),a.computeVertexNormals(),a}function Oe(e,t,n,r,i,a=-1,o=96,s=7){let l=e.map(e=>[e.x,e.y]);l.push(l[0]);let u=[],d=[0];for(let e=0;e<l.length-1;e++)u.push(Math.hypot(l[e+1][0]-l[e][0],l[e+1][1]-l[e][1])),d.push(d[e]+u[e]);let f=d[d.length-1]||1,p=[];for(let e=0,t=0;e<o;e++){let n=e/o*f;for(;t<u.length-1&&d[t+1]<n;)t++;let r=u[t]>1e-9?(n-d[t])/u[t]:0;p.push([l[t][0]+(l[t+1][0]-l[t][0])*r,l[t][1]+(l[t+1][1]-l[t][1])*r])}let h=p.length,g=p.map(e=>Math.atan2(e[1]-n,e[0]-t)),_=[],v=[],y=[];for(let e=0;e<s;e++){let o=1-e/s,c=1-o,l=a*i*c*c*(3-2*c);for(let e=0;e<h;e++)_.push(t+(p[e][0]-t)*o,n+(p[e][1]-n)*o,r+l),v.push(.5+.5*o*Math.cos(g[e]),.5+.5*o*Math.sin(g[e]))}_.push(t,n,r+a*i),v.push(.5,.5);let b=s*h;for(let e=0;e<s-1;e++)for(let t=0;t<h;t++){let n=(t+1)%h,r=e*h+t,i=e*h+n,a=(e+1)*h+t,o=(e+1)*h+n;y.push(r,a,i,i,a,o)}let x=(s-1)*h;for(let e=0;e<h;e++)y.push(x+e,b,x+(e+1)%h);let S=new m;return S.setAttribute(`position`,new c(_,3)),S.setAttribute(`uv`,new c(v,2)),S.setIndex(y),S.computeVertexNormals(),S}function ke(e,t,n){let r=[0,n,t],i=[];for(let n of e)r.push(n.x,n.y,t);let a=e.length;for(let e=0;e<a;e++)i.push(0,1+e,1+(e+1)%a);let o=new m;return o.setAttribute(`position`,new c(r,3)),o.setIndex(i),o.computeVertexNormals(),o}var Ae=new Map;function G(e,t,n,r,i=0,a=0,o=0,s=.012){let c=Math.min(s,e*.32,t*.32,n*.32),l=`${e.toFixed(3)}|${t.toFixed(3)}|${n.toFixed(3)}|${c.toFixed(4)}`,u=Ae.get(l);u||(u=new ae(e,t,n,1,c),Ae.set(l,u));let d=new E(u,r);return d.position.set(i,a,o),d}function K(e,t,n,r,i=0,a=0,o=0){let s=new E(new T(e,t,n),r);return s.position.set(i,a,o),s}function q(e,t,n,r,i,a=0,o=0,s=0){let c=new E(new d(e,t,n,r),i);return c.position.set(a,o,s),c}function je(e={}){let i=me(e),a=e.kit||{},s=e.tex?.kitAo||null,u=new n,p=[],v=[],y=[],x=[],w=2.05,T=2.55,D=.55,O=1.15,te=2.25,ie=.4,k=.08,A=xe(w,T,D),ae=xe(O,te,ie),j=e=>(u.add(e),e);i.hullShell=z(i.hull,{side:2}),i.darkShell=z(i.dark,{side:2}),i.accentShell=z(i.accent,{side:2}),i.decal=z(i.dark,{polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2});let M={KIT_HULL:H(i.hull,s,.9),KIT_DARK:H(i.dark,s,.9),KIT_ACCENT:H(i.accent,s,.9),KIT_DECK:H(i.floor,s,.8),KIT_RAIL:H(i.rail,s,.7),KIT_SEAT:H(i.seat,s,.85),KIT_RUBBER:H(i.rubber,s,.85),KIT_SHELL:H(i.shell,s,.9)},N=(e,t,n={})=>z(e,{aoMap:s||void 0,aoMapIntensity:.9},{tile:t,detail:1.15,...n}),oe=s?{...M,KIT_HULL:N(i.hull,.3),KIT_DARK:N(i.dark,.28),KIT_ACCENT:N(i.accent,.34),KIT_SEAT:N(i.seat,.11,{detail:.62}),KIT_RUBBER:N(i.rubber,.09,{detail:1.1})}:M,se=new Set([`cp_tub`,`cp_coaming`,`cp_pedestal`,`cp_seat`,`cp_controls`,`cp_overhead`,`cp_canopy`,`cp_stow`]),P=(e,t,n,r,i=0)=>{let o=a[e];if(!o)return!1;let s=se.has(e)?oe:M;for(let e of o){let a=new E(e.geo,s[e.mat]||s.KIT_HULL);a.position.set(t,n,r),i&&(a.rotation.y=i),a.userData.kit=!0,j(a)}return!0},F=!!a.corr_bay&&!!a.hab_bay,I=[[-3.4,w,T,D,1.34],[-5.25,1.97,2.44,.57,1.2],[-6.45,1.78,2.1,.6,1.02],[-7.6,1.24,1.62,.52,.88]],ce=I[1][0],le=I[I.length-1][0];for(let e=0;e<I.length-1;e++){let[t,n,r,a,o]=I[e],[s,c,l,u,d]=I[e+1],f=F?.012:0;j(new E(we(Te(n,r,a,o,5,f),Te(c,l,u,d,5,f),t,s),i.hullShell)),e===0&&j(new E(we(Ee(n,r,a,o),Ee(c,l,u,d),t,s),i.hullShell));for(let r of e===0?[-1,1]:[]){let e=q(.032,.032,Math.abs(s-t),10,i.rail,r*(n+c)*.5,(o+d)*.5,(t+s)*.5);e.rotation.x=Math.PI/2,e.rotation.z=Math.atan2((n-c)*r,Math.abs(s-t)),j(e)}}let L=[];{let e=e=>(e-ce)/(le-ce),t=new E(De(I.slice(1).map(([t,n,r,i,a])=>({pts:Ee(n,r,i,a,12),z:t,v:e(t)}))),i.glass);t.renderOrder=14,pe(t,i.glass),j(t),L.push(t)}{let[e,t,n,r,a]=I[I.length-1],o=new E(Oe(Ee(t,n,r,a,12),0,(a+n)*.5,e,.055),i.noseGlass);o.renderOrder=15,pe(o,i.noseGlass),j(o),L.push(o)}let ue=[-2.9,-1.9,-.9,.1],de=[1.15,2.25,3.35,4.45,5.55,6.65];if(F){for(let e of ue)P(`corr_bay`,0,0,e);for(let e of de)P(`hab_bay`,0,0,e);P(`bulkhead`,0,0,-3.4),P(`bulkhead`,0,0,.6)}else{j(new E(Se(ae,-3.4,.6),i.hullShell)),j(new E(Se(A,.6,7.2),i.hullShell));let e=xe(1.29,2.39,ie);for(let t of[-3.4,.6])j(new E(Ce(A,e,t),i.darkShell)),j(new E(Se(e,t-.1,t+.1),i.accentShell)),j(new E(Ce(e,ae,t+(t<0?.1:-.1)),i.darkShell));for(let[e,t,n]of[[-3.4,.6,1.0299999999999998],[.6,7.2,1.7499999999999998]])j(G(n*2,.08,t-e,i.floor,0,.04,(e+t)/2))}j(new E(ke(A,7.2,T*.5),i.hullShell));let R=e=>{let t=Math.min(Math.max(e,I[I.length-1][0]),I[0][0]);for(let e=0;e<I.length-1;e++){let n=I[e],r=I[e+1];if(t<=n[0]&&t>=r[0]){let e=(t-n[0])/(r[0]-n[0]);return[n[1]+(r[1]-n[1])*e,n[2]+(r[2]-n[2])*e,n[3]+(r[3]-n[3])*e,n[4]+(r[4]-n[4])*e]}}return I[I.length-1].slice(1)},B=(e,t)=>{let[n,r,i]=R(e);if(t>=i&&t<=r-i)return n;let a=t<i?i-t:t-(r-i);return n-i+Math.sqrt(Math.max(i*i-a*a,0))},fe=(e,t)=>{let[n,r,i]=R(e),a=Math.abs(t);if(a<=n-i)return r;let o=a-(n-i);return r-i+Math.sqrt(Math.max(i*i-o*o,0))},V=ce,he=(e,n,r,i=26,a=9)=>{let s=new g(e.map(e=>new o(e[0],e[1],e[2])),!1,`catmullrom`,.4);return j(new E(new t(s,i,n,a,!1),r))};if(!F){let e=e=>Math.min(1.7499999999999998,B(e,k)-.026),t=[],n=[];for(let n=0;n<=12;n++){let r=-7.58+n/12*4.18,i=e(r);t.push(-i,k,r,i,k,r,-i,0,r,i,0,r)}for(let e=0;e<12;e++){let t=e*4,r=(e+1)*4;n.push(t,r,t+1,t+1,r,r+1),n.push(t+2,t,r+2,t,r,r+2),n.push(t+1,t+3,r+1,t+3,r+3,r+1)}let r=new m;r.setAttribute(`position`,new c(t,3)),r.setIndex(n),r.computeVertexNormals(),j(new E(r,i.floor)),j(G(.34,.03,4.18-.2,i.dark,0,.085,-10.98/2));for(let t=-7.08;t<-3.4;t+=.62)j(K(e(t)*2-.1,.016,.05,i.decal,0,.082,t))}let W=(e,t,n,r)=>{j(new E(Se(xe(t-.07,n-.07,r),e-.05,e+.05),i.darkShell))};if(W(-4.2,w,T,D),!F){for(let e=1.1;e<7.2;e+=1.15)W(e,w,T,D);for(let e=-3;e<.5;e+=.9)W(e,O,te,ie)}for(let e of[-1,1]){let t=e<0?3:2,n=e<0?.2:.27,r=e<0?.16:.21,a=(t,i)=>{let a=[e*(B(t,T-n)-r-i*.05),Math.min(T-n,fe(t,w-r)-.055)-i*.045,t],[,,,o]=R(t),s=o-.115-i*.048,c=[e*(B(t,s)-.062-i*.052),s,t],l=Math.min(Math.max((V-.06-t)/.45,0),1),u=l*l*(3-2*l);return[a[0]+(c[0]-a[0])*u,a[1]+(c[1]-a[1])*u,t]};for(let e=0;e<t;e++){let t=.022+e*.007,n=[];for(let t=0;t<=16;t++)n.push(a(-3.36-4.1/16*t,e));he(n,t,e===1?i.accent:i.dark,30,9)}{let t=a(V-.1,0);j(G(.13,.2,.17,i.dark,t[0]+e*.02,t[1]-.02,t[2],.018)),j(G(.09,.045,.11,i.accent,t[0]+e*.02,t[1]+.085,t[2],.012))}for(let n=-7.28;n<-3.5;n+=e<0?.72:.58){let e=a(n,0),r=a(n,t-1),o=(e[0]+r[0])*.5,s=(e[1]+r[1])*.5,c=Math.abs(e[0]-r[0])+.075,l=Math.abs(e[1]-r[1])+.075;j(G(c,l,.03,i.dark,o,s,n,.01)),j(G(c*.42,l*.32,.038,i.rail,o,s,n,.008))}}let ge=(e,t,n,r,a,o,s=-1,c=!0)=>{c&&j(K(.215,.014,r+.04,i.dark,e,t-s*.016,n)),j(K(.155,.026,r-.03,U(a,o*.09),e,t+s*0,n)),j(K(.098,.026,r-.015,U(a,o*.28),e,t+s*.008,n)),j(K(.054,.026,r,U(a,o*.95),e,t+s*.016,n))},Ae=-3.48,je=V+.06;for(let e of[-1,1]){ge(e*1.28,2.395,(Ae+je)*.5,Ae-je,16766896,2.6),j(G(.235,.075,.085,i.dark,e*1.28,2.3739999999999997,je-.03,.016)),j(G(.085,.048,.055,i.rail,e*1.28,2.3579999999999997,je-.062,.01));let t=(e,t,n,r,i,a,o)=>{let s=.9;for(let c=0;c<3;c++){let l=n+o+s*.5+c*1.4500000000000002;if(l+s*.5>r)break;ge(e,t,l,s,i,a,-1,!F)}};t(e*(F?O*.62:.78),te-(F?.172:.11),-3.1,.3,14478584,1.2,e>0?.1:.62),t(e*1.28,T-(F?.172:.13),1,6.8,16766896,1.9,e>0?.35:1.55)}for(let e of[-1,1])for(let t=0;t<7;t++){let n=V-.24-t*.31,[,,,r]=R(n),a=e*(B(n,r-.085)-.052);j(K(.03,.026,.255,i.dark,a+e*.012,r-.07,n)),j(K(.014,.02,.235,U(16768180,.3),a-e*.004,r-.078,n)),j(K(.01,.013,.225,U(16771276,.9),a-e*.012,r-.08,n))}let Ne=(e,t,n,r,a,o)=>{let s=t-e,c=(e+t)/2;for(let e of[-1,1]){let t=e*(n-(o?.045:.078)),l=o?.148:.176;o&&(j(K(.1,.075,s,i.dark,e*(n-.02),.255,c)),j(K(.03,.115,s,i.dark,e*(n-.012),.17,c))),j(K(.02,.086,s-.03,U(r,a*.1),t+e*.01,l,c)),j(K(.02,.058,s-.015,U(r,a*.3),t,l,c)),j(K(.02,.034,s,U(r,a*.95),t-e*.01,l,c))}};for(let[e,t]of[[-4.86,-3.45],[-6.22,-4.9],[-7.34,-6.26]])Ne(e,t,Math.min(1.7499999999999998,B((e+t)*.5,.2)-.032),16757880,.82,!0);Ne(-3.38,.58,O,16762778,.5,!F),Ne(.62,7.05,w,16762778,.56,!F);let Pe=(e,t,n,r)=>{j(K(.075,.01,.075,i.dark,e,.083,t)),j(K(.052,.012,.052,U(n,r),e,.087,t))};for(let e of[-1,1])for(let t=-7+(e>0?.39:0);t<7;t+=.78)Pe(e*(t<-3.4?Math.min(1.63,B(t,k)-.155):t<.6?.9099999999999999:1.63),t,10477823,1.45);ge(0,.095,-1.4,3.2,8378623,1.6,1);let J=(e,t,n,r,i,a)=>{let o=new h(new C().setHex(r,ne),i,a,2);return o.position.set(e,t,n),o.layers.set(1),o.userData.dynamic=!0,j(o),y.push(o),o},Y=(e,t,n,i,a,o,s,c,l,u)=>{let d=new r(new C().setHex(s,ne),c,14,l,.55,2);d.position.set(e,t,n),d.target.position.set(i,a,o),d.castShadow=!0,d.shadow.mapSize.set(u,u),d.shadow.camera.near=.25,d.shadow.camera.far=d.distance,d.shadow.bias=-.0011,d.shadow.radius=1.6;let f=Math.hypot(i-e,a-t,o-n)||1;return d.shadow.normalBias=2*f*Math.tan(l)/u*d.shadow.radius,d.userData.dynamic=!0,j(d),j(d.target),y.push(d),d};Y(0,2.3899999999999997,-5.6,0,.55,-6.1,16767424,40,.95,1024),Y(.55,1.62,-5.05,-.1,.82,-6.35,13952242,15,.72,512),Y(-.92,2.16,-1.55,-1.12,.42,-1.82,13624048,30,1.05,1024),Y(0,2.3899999999999997,2.9,0,.5,3.1,16764840,88,1,1024),J(.62,2.21,-6.4,13229295,9,4.2),J(.42,1.5,-1.45,10472944,6,3),Y(.92,2.3499999999999996,4.3,-1.28,1.02,5.45,12900588,40,.92,1024),J(.62,1.15,1.3,16761504,3,1.6),J(-.58,1.15,-4.05,16761504,3,1.6),J(-.48,.36,-6.15,16760466,6,2.1),J(-.55,.72,-4.66,14208196,4.6,2.2),J(.85,.34,1.9,16754788,6,2.4);let Fe=(e,t,n)=>{let r=e*1.9499999999999997;j(G(.09,.34,.2,i.dark,r,t,n,.02)),j(G(.05,.24,.13,i.accent,e*1.88,t,n,.012)),j(K(.02,.175,.075,U(16764830,.55),e*1.8449999999999998,t,n)),j(K(.02,.135,.048,U(16766893,1.9),e*1.8349999999999997,t,n)),J(e*1.7099999999999997,t,n,16758401,5,2.1)};Fe(1,1.62,6.2),Fe(-1,1.62,3.15),Fe(-1,.92,5.72);let Ie=new re(11186870,9071180,.7);Ie.layers.set(1),j(Ie);let Le=new ee(12432034,.14);if(Le.layers.set(1),j(Le),F)P(`cp_tub`,0,0,0),P(`cp_coaming`,0,0,0),P(`cp_pedestal`,0,0,0),P(`cp_seat`,0,0,0),P(`cp_controls`,0,0,0),P(`cp_overhead`,0,0,0),P(`cp_canopy`,0,0,0),P(`cp_stow`,0,0,0),j(G(2.42,.92,.09,i.panel,0,.5,-7.58));else{j(G(2.1,.5,.1,i.panel,0,.3,-7.55)),j(G(2.5,.34,.62,i.dark,0,.8,-6.3)),j(G(.62,.36,.56,i.dark,0,.57,-6.1)),j(G(.8,.1,.68,i.shell,0,.545,-5.02,.03));let e=G(.76,1.06,.09,i.shell,0,1.09,-4.66,.03);e.rotation.x=-.17,j(e);for(let e=0;e<3;e++)j(G(.6,.085,.2,i.seat,0,.605,-5.22+e*.2,.03)),j(G(.56-e*.03,.22,.11,i.seat,0,.74+e*.245,-4.79-e*.042,.035));j(G(.34,.19,.13,i.seat,0,1.6,-4.7,.045));for(let e of[-1,1])j(G(.1,.74,.17,i.seat,e*.3,1.02,-4.83,.04)),j(G(.09,.09,.5,i.seat,e*.28,.6,-5.06,.035)),j(G(.09,.045,.8,i.shell,e*.38,.8,-5.24,.02)),j(G(.05,.2,.05,i.shell,e*.38,.68,-4.9,.02)),j(G(.055,.86,.018,i.rubber,e*.15,1.06,-4.82));j(q(.09,.14,.42,22,i.shell,0,.3,-5.02)),j(G(.46,.05,.46,i.shell,0,.06,-5.02,.02))}let Re=e=>{let t=Math.min(Math.abs(e)/1.34,1),n=Math.max(0,(Math.abs(e)-.98)/.36);return[1.096-.052*t*t-.3*n*n,-6.53+.3*t*t+.15*n*n]},ze=e=>{let t=Math.min(Math.abs(e)/1.34,1),[n,r]=Re(e);return[n-.1265*(1-.3*t*t),r-.048*(1-.14*t*t)]};if(F)for(let e=0;e<12;e++){let t=-1.21+e*.22,[n,r]=ze(t);j(K(.205,.014,.02,U(16770760,.12),t,n+.01,r)),j(K(.195,.012,.013,U(16769212,.34),t,n+.004,r)),j(K(.195,.008,.009,U(16773338,.86),t,n,r-.003))}if(F){Y(0,1.04,-6.62,0,.48,-6.14,16769732,24,.95,512),J(0,2.03,-6.26,13623538,4.5,1.5),Y(.62,2.005,-6.3,.1,2.3,-4.92,14214902,13,.8,1024),J(-.52,.4,-6,16753509,5.4,2.8),J(1.46,1.06,-5.78,13163760,3.4,2.8),J(-1.48,.86,-6.12,16762780,3,2.6);for(let e=0;e<9;e++){let t=-.62+e*.155;j(K(.14,.018,.026,U(14083316,.24),t,2.05,-6.222)),j(K(.132,.013,.017,U(15003386,.74),t,2.044,-6.226)),j(K(.132,.009,.011,U(15923455,1.85),t,2.038,-6.23))}}let Be=Math.cos(-.6),Ve=Math.sin(-.6),He=(e,t,n)=>[e,.805+t*Be+n*-Ve,-6.3+t*Ve+n*Be];for(let e=0;e<6;e++){let t=He(-.26+e*.104,.252,.032);j(K(.062,.016,.005,U(e===2?16756832:6275327,2.4),t[0],t[1],t[2]))}for(let e of[-1,1]){let t=e>0?5:4;for(let n=0;n<t;n++){let t=.642+n*.078+(e>0?0:.026),r=[16742986,8378623,8378623,6487946,16760896][(n+(e>0?2:0))%5];j(K(.026,.018,.006,U(r,3),e*.513,t,-6.311))}}for(let[e,t]of[[-1,.42],[1,-.42]]){let n=Math.cos(-.6),r=Math.sin(-.6),i=Math.cos(t),a=Math.sin(t),o=(t,o,s)=>[e*.735+i*t+a*s,.775+r*a*t+n*o+-r*i*s,-6.24+-n*a*t+r*o+n*i*s];for(let t=0;t<8;t++){let n=o(-.147+t%4*.048,-.296+Math.floor(t/4)*.048,.052),r=[16734778,6487946,6487946,16760896][(t+ +(e>0))%4];j(K(.02,.02,.005,U(r,3.2),n[0],n[1],n[2]))}}let Ue=Math.cos(-.534),We=Math.sin(-.534),Ge=(e,t,n)=>[e,.858+t*Ue+n*-We,-5.4625+t*We+n*Ue];for(let e=0;e<2;e++)for(let t=0;t<5;t++){let n=Ge(-.268+t*.0372,-.0627+e*.0366,.0135),r=e*5+t===6;j(K(.018,.016,.003,U(r?16754784:8378623,r?2.4:1.7),n[0],n[1],n[2]))}for(let e=0;e<3;e++){let t=Ge(.106+e*.068,-.0523,.0275);j(K(.007,.007,.003,U(16765088,2.6),t[0],t[1],t[2]))}{let e=Ge(-.065,-.0487,.0295);j(K(.012,.012,.003,U(16742986,2.6),e[0],e[1],e[2]))}F&&J(0,.9,-6.12,9425151,4.2,1.35);{let e=new E(new S(.146,.005,8,48),U(8378623,1.1));e.rotation.x=Math.PI/2,e.position.set(0,.764,-5.8),j(e)}j(K(1.52,.01,.02,U(10475775,1.8),0,2.332,-4.66));for(let e=0;e<6;e++)j(K(.036,.004,.01,U(8378623,1),-.352,.8865,-5.8385+e*.021));j(K(.014,.006,.004,U(16742986,2),.362,1.005,-5.7895)),j(K(.01,.003,.01,U(6487946,1.6),.348,1.0595,-5.722)),j(K(.014,.008,.003,U(16760896,2),-.323,.94,-5.7025));{let e=new n;e.position.set(.352,.93,-5.735),j(e),x.push({kind:`stick`,obj:e,side:1});let t=new n;t.position.set(-.352,.906,-5.79),j(t),x.push({kind:`throttle`,obj:t,side:-1});for(let e of[-1,1]){let t=new n;t.position.set(e*.2,.25,-5.75),j(t),x.push({kind:`pedal`,obj:t,side:e})}}let X=(e,t,n,r,i,a,o,s,c,l)=>{p.push({name:e,w:t,h:n,pos:[r,i,a],rot:[o,s,c],...l})};X(`main`,.86,.42,0,.805,-6.3,-.6,0,0,{res:620,ss:3,spillZ:.041}),X(`left`,.44,.28,-.735,.775,-6.24,-.6,.42,0,{res:430,ss:3,spillZ:.041}),X(`right`,.44,.28,.735,.775,-6.24,-.6,-.42,0,{res:430,ss:3,spillZ:.041}),X(`radarLabel`,.3,.088,0,.762,-5.62,-1.3,0,0,{res:300,ss:3,spill:.026,spillZ:.028,spillGain:.9}),X(`lower`,.28,.044,.125,.87212,-5.48991,-.534,0,0,{res:480,ss:3,spill:.02,spillZ:.028,spillGain:.85}),v.push({id:`seat`,label:`TAKE THE HELM`,hint:`Fly the ship`,pos:new o(.62,1,-4.72),radius:1.25,look:new o(0,.8,-6.2),seatEye:new o(0,1.34,-5.26)});let Z=new n;Z.position.set(0,0,2.6),j(Z),Z.add(q(.26,.4,.62,28,i.dark,0,.31,0));{let e=new E(new d(.8,.74,.1,44,1,!0),i.panel);e.position.y=.67,Z.add(e);let t=new E(new f(.7,.8,44),i.panel);t.rotation.x=-Math.PI/2,t.position.y=.72,Z.add(t)}let Ke=new E(new S(.8,.018,8,64),U(9430271,.7));Ke.rotation.x=Math.PI/2,Ke.position.y=.72,Z.add(Ke);{let e=new E(new d(.705,.685,.062,48,1,!0),i.dark);e.position.set(0,.689,0),e.scale.x=-1,Z.add(e),Z.add(q(.7,.7,.012,48,i.rubber,0,.652,0)),Z.add(q(.1,.15,.052,24,i.dark,0,.684,0)),Z.add(q(.105,.105,.008,24,i.rail,0,.712,0));for(let e=0;e<12;e++){let t=e/12*Math.PI*2+.13,n=Math.cos(t)*.575,r=Math.sin(t)*.575,a=q(.028,.034,.038,14,i.dark,n,.678,r);a.rotation.z=-Math.cos(t)*.5,a.rotation.x=Math.sin(t)*.5,Z.add(a),Z.add(q(.02,.02,.005,12,U(3042438,1.1),n,.694,r))}for(let[e,t,n]of[[.26,.0035,.42],[.47,.003,.3]]){let r=new E(new S(e,t,6,72),U(2843768,n));r.rotation.x=Math.PI/2,r.position.y=.66,Z.add(r)}for(let e=0;e<24;e++){let t=e/24*Math.PI*2,n=e%6==0;Z.add(K(n?.048:.024,.0028,.005,U(2843768,n?.46:.26),Math.cos(t)*.545,.66,Math.sin(t)*.545))}let t=new E(new _(.7,56),i.navPlate);t.rotation.x=-Math.PI/2,t.position.y=.7215,t.renderOrder=14,pe(t,i.navPlate),Z.add(t)}for(let e=0;e<6;e++){let t=e/6*Math.PI*2;Z.add(G(.1,.02,.16,i.accent,Math.cos(t)*.62,.735,Math.sin(t)*.62))}J(.58,1.34,2.6,9427184,2.6,2.2),Me(Z),v.push({id:`nav`,label:`STELLAR CARTOGRAPHY`,hint:`Plot a fold`,pos:new o(0,1,1.55),radius:1.15,look:new o(0,1.1,2.6),holo:Z});let qe=-2.05+.3;if(F)P(`archive`,qe,0,.95,Math.PI/2);else{let e=new n;e.position.set(qe,0,.95),e.rotation.y=Math.PI/2,j(e),e.add(G(1.15,.85,.12,i.panel,0,1.35,0)),e.add(G(1.02,.06,.16,i.accent,0,.9,.02)),e.add(G(.86,.3,.34,i.dark,0,.86,.16))}if(X(`archive`,.98,.62,-1.6899999999999997,1.36,.95,0,Math.PI/2,0,{res:768,spill:.055,spillZ:F?.038:.006,spillGain:1}),J(-2.05+.62,1.52,.95,10475775,3.4,1.9),F){let e=(e,t,n)=>[qe+n,t,.95-e];j(K(.004,.014,.13,U(9427199,1.4),...e(.408,1.61,.008))),j(K(.003,.008,.22,U(3042438,.9),...e(.409,1.203,.079)));for(let t=0;t<2;t++)j(K(.002,.108,.088,U(t?16756832:8378623,t?.9:1.3),...e(.351+t*.116,1.258,.0765-t*.004)));for(let t=0;t<4;t++)j(K(.003,.006,.016,U(t===2?16742986:6487946,1.8),...e(-.47+t*.058,1.592,-.05)));for(let t=0;t<6;t++)j(K(.003,.006,.03,U(t%3==1?16760896:3042438,1.5),...e(-.5+t*.112,1.932,.089-(t===1||t===4?.016:0))));j(K(.024,.004,.64,U(10475775,.75),...e(-.145,.766,.069)))}v.push({id:`archive`,label:`ARCHIVE`,hint:`Review discoveries and records`,pos:new o(-2.05+1.15,1,.95),radius:1,look:new o(-2.05+.3,1.35,.95)});let Q=new n;Q.position.set(0,0,6.9),j(Q),F?P(`resonance`,0,0,0):(Q.add(G(3.4,2.4,.14,i.panel,0,1.2,.2)),Q.add(G(1.9,1.6,.1,i.dark,0,1.3,.1)));let Je=[];for(let e=0;e<7;e++){let t=-Math.PI/2+e/7*Math.PI*2,n=Math.cos(t)*.52,r=1.3+Math.sin(t)*.52,i=new E(new S(F?.068:.075,F?.01:.012,8,24),U(2767428,1));i.position.set(n,r,F?.104:.06),Q.add(i);let a=new E(new b(.045,0),U(1318954,1));a.position.set(n,r,F?.124:.06),Q.add(a),Je.push({ring:i,core:a,index:e})}let Ye=new E(new l(F?.062:.13,1),U(1714740,1));Ye.position.set(0,1.3,F?-.045:.05),Q.add(Ye),J(-.66,1.36,6.62,7329023,2.4,1.5),Y(-.95,2.16,6.05,-.1,1.1,6.95,16766640,30,.85,1024),v.push({id:`resonance`,label:`RESONANCE CHAMBER`,hint:`The Cantos`,pos:new o(0,1,5.85),radius:1.1,look:new o(0,1.3,6.9)});let $=new n;$.position.set(2.03,1.35,4.3),$.rotation.y=-Math.PI/2,j($),F?P(`port`,2.03,1.35,4.3,-Math.PI/2):$.add(new E(new S(.56,.07,10,40),i.dark));let Xe=new E(new _(F?.448:.55,48),i.portGlass);if(Xe.position.z=F?-.044:0,Xe.renderOrder=14,pe(Xe,i.portGlass),$.add(Xe),F){let e=(e,t,n)=>[2.03-n,1.35+t,4.3+e];for(let t of[-1,1])j(K(.012,.008,.23,U(12574975,.24),...e(0,t*.42,.058)));j(K(.004,.012,.022,U(6487946,2),...e(-.058,-.606,.06))),j(K(.004,.012,.022,U(16760896,1.8),...e(.058,-.606,.06))),j(K(.004,.01,.16,U(8378623,1.2),...e(0,.906,.11))),J(1.5099999999999998,.96,4.66,12376304,2.2,1.6)}if(v.push({id:`port`,label:`OBSERVATION PORT`,hint:`Look outside`,pos:new o(1.0499999999999998,1,4.3),radius:.9,look:new o(6.05,1.35,4.3)}),F){P(`locker`,-1.88,0,3.3,Math.PI/2),P(`locker_d`,-1.88,0,4.16,Math.PI/2),P(`locker_b`,-1.88,0,5.02,Math.PI/2),P(`locker_c`,-1.88,0,5.88,Math.PI/2),P(`stowbay`,2.02,1.02,1.62,-Math.PI/2),P(`netcargo`,1.44,k,6.02,-.34),P(`crate_a`,1.5,k,1.4,.5),P(`crate_b`,1.35,k,1.95,-.7),P(`crate_b`,1.55,.44,1.4,1.2),P(`wallbox`,2.02,1.42,2.3,Math.PI/2),P(`wallbox`,-1.15+.03,1.46,-2.3,-Math.PI/2),P(`wallbox`,2.02,1.38,5.3,Math.PI/2);for(let e of[-2.35,-1.35,-.45])P(`pipe_run`,0,2.09,e);P(`cable_drape`,0,2.05,-1.86),P(`toolboard`,1.115,.86,-2.62,Math.PI/2),P(`stack`,-1.15+.3,k,-.3,.42),P(`coverall`,-1.075,.55,-3.02,-Math.PI/2),P(`crate_b`,.8699999999999999,k,-3.05,-.35),P(`pinboard`,2.0149999999999997,1.62,5.62,-Math.PI/2),P(`helmet`,-2.05+.2,1.585,5.02,.62),P(`slates`,1.9349999999999998,1.2,3.02,-Math.PI/2)}else{for(let e=0;e<4;e++){let t=3.3+e*.86;j(G(.3,1.5,.8,i.panel,-2.05+.18,.85,t)),j(G(.03,.05,.3,i.accent,-2.05+.34,.85,t)),j(G(.26,.02,.72,i.dark,-2.05+.19,1.61,t))}for(let[e,t,n,r]of[[1.5,.3,1.4,.5],[1.35,.3,1.95,.42],[1.55,.78,1.4,.34]]){let a=G(r,r*.9,r,i.dark,e,t,n);a.rotation.y=(e+n)*.7,j(a)}for(let e=0;e<4;e++){let t=q(.03,.03,2.1,12,i.dark,0,2.11,-2.9+e*.95);t.rotation.z=Math.PI/2,j(t)}}return Me(u),u.traverse(e=>{e.frustumCulled=!1,e.layers.set(1),e.isMesh&&(e.castShadow=!e.userData.noShadow,e.receiveShadow=!0)}),{root:u,materials:i,screens:p,stations:v,lights:y,animated:x,sockets:Je,resCore:Ye,navTable:Z,metresToWorld:_e,glazing:L,seesSky(e,t,n){return!n||L.length===0||(ye.set(e,t,.5).unproject(n),be.subVectors(ye,n.position).normalize(),ve.set(n.position,be),ve.intersectObjects(L,!1).length>0)},volumes:[[-1.19,1.19,-7.15,-6.6],[-1.43,1.43,-6.6,-6.05],[-1.56,1.56,-6.05,-5.4],[-1.62,1.62,-5.4,-3.42],[-.86,.86,-3.42,.62],[-1.68,1.68,.62,6.55]],blockers:[[-.66,.66,-5.66,-4.72],[-1.55,1.55,-6.6,-5.72],[-.86,.86,1.76,3.44],[-2.05,-1.72,2.85,6.35],[1.05,1.85,1.05,2.3],[1.12,1.78,5.66,6.38],[-1.16,-.56,-.62,.02],[.6,1.16,-3.3,-2.8]]}}function Me(t){let n=new Map,r=[];for(let e of[...t.children]){if(!e.isMesh||!e.geometry||!e.material||e.userData.dynamic||e.material.transparent){r.push(e);continue}e.updateMatrix();let t=!!e.material.aoMap,i=e.geometry.clone().applyMatrix4(e.matrix);i.index&&(i=i.toNonIndexed());for(let e of Object.keys(i.attributes))e!==`position`&&e!==`normal`&&(t&&e===`uv`||i.deleteAttribute(e));i.attributes.normal||i.computeVertexNormals();let a=e.material.userData.emissiveTint;if(a){let e=i.attributes.position.count,t=new Float32Array(e*3);for(let n=0;n<e;n++)t[n*3]=a.r,t[n*3+1]=a.g,t[n*3+2]=a.b;i.setAttribute(`color`,new D(t,3))}let o=a?ge():e.material,s=o.uuid;n.has(s)||n.set(s,{mat:o,geos:[]}),n.get(s).geos.push(i)}t.clear();for(let e of r)t.add(e);for(let{mat:r,geos:i}of n.values()){let n=i.length===1?i[0]:e(i,!1);if(!n){i.forEach((e,n)=>t.add(new E(e,r)));continue}i.forEach(e=>{e!==n&&e.dispose()}),t.add(new E(n,r))}}export{j as INTERIOR_LAYER,je as buildInterior};