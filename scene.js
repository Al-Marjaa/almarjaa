/* =====================================================================
   3D SCENE — a Lebanese citadel on a hill, gold-trimmed stone,
   lit windows, cedars, and the Lebanese flag waving over the keep.
   body[data-scene="full"]  home hero, big and interactive
   body[data-scene="soft"]  inner pages, smaller, to the side
   ===================================================================== */
(() => {
  if (!window.THREE || !window.AM) return;
  const AM = window.AM, reduced = AM.reduced;
  const mode = document.body.dataset.scene || "soft";
  const canvas = document.getElementById("scene");
  if (!canvas) return;

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: false }); }
  catch (e) { return; }
  const small = innerWidth < 760;
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const shadows = mode === "full" && !small;
  if (shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }

  const lin = h => new THREE.Color(h).convertSRGBToLinear();   // hex colours are sRGB; the renderer works in linear
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0c0b09, 0.028);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 2.6, 12.5);
  camera.lookAt(0, 0.2, 0);
  const world = new THREE.Group(); scene.add(world);
  const castle = new THREE.Group(); world.add(castle);

  /* ---------- a warm studio environment so the gold actually shines ---------- */
  (function env() {
    const pm = new THREE.PMREMGenerator(renderer);
    const es = new THREE.Scene();
    const c = document.createElement("canvas"); c.width = 16; c.height = 256;
    const g = c.getContext("2d"), gr = g.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, "#fff4dc"); gr.addColorStop(.35, "#b8925a"); gr.addColorStop(.6, "#2a2016"); gr.addColorStop(1, "#0a0806");
    g.fillStyle = gr; g.fillRect(0, 0, 16, 256);
    const sky = new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), side: THREE.BackSide }));
    es.add(sky);
    [[-6, 5, 6, 6, 3], [7, 3, -4, 4, 6], [0, 9, 0, 8, 2]].forEach(([x, y, z, w, h]) => {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: lin(0xfff1d0), side: THREE.DoubleSide }));
      p.position.set(x, y, z); p.lookAt(0, 0, 0); es.add(p);
    });
    scene.environment = pm.fromScene(es, 0.04).texture;
    pm.dispose();
  })();

  /* ---------- materials ---------- */
  function stoneTexture(rx, ry) {
    const c = document.createElement("canvas"); c.width = c.height = 256;
    const g = c.getContext("2d");
    g.fillStyle = "#b9ab92"; g.fillRect(0, 0, 256, 256);
    const rows = 8, h = 256 / rows;
    for (let r = 0; r < rows; r++) {
      const w = 64, off = (r % 2) * w / 2;
      for (let x = -off; x < 256; x += w) {
        const v = 200 + Math.random() * 40 | 0;
        g.fillStyle = `rgb(${v},${v - 14},${v - 36})`;
        g.fillRect(x + 1.5, r * h + 1.5, w - 3, h - 3);
        g.fillStyle = "rgba(0,0,0,.06)";
        for (let k = 0; k < 6; k++) g.fillRect(x + Math.random() * w, r * h + Math.random() * h, 3, 2);
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 4; t.encoding = THREE.sRGBEncoding;
    return t;
  }
  const stoneMats = [];
  const stone = (rx, ry) => { const m = new THREE.MeshStandardMaterial({ map: stoneTexture(rx, ry), roughness: .92, metalness: 0, envMapIntensity: .35 }); stoneMats.push(m); return m; };
  const mWall = stone(4, 1.3), mTower = stone(3, 2.2), mKeep = stone(2, 3.2), mMerlon = stone(.5, .5);
  const mGold = new THREE.MeshStandardMaterial({ color: lin(0xd4b06a), metalness: 1, roughness: .26, envMapIntensity: 1.5 });
  const mRock = new THREE.MeshStandardMaterial({ color: lin(0x2b261f), roughness: 1, flatShading: true, envMapIntensity: .3 });
  const mWin = new THREE.MeshBasicMaterial({ color: lin(0xffc66e) });
  const mDark = new THREE.MeshStandardMaterial({ color: lin(0x120f0b), roughness: .9 });
  const mCedar = new THREE.MeshStandardMaterial({ color: lin(0x23432f), roughness: .85, flatShading: true, envMapIntensity: .4 });
  const mTrunk = new THREE.MeshStandardMaterial({ color: lin(0x3b2a1d), roughness: 1 });

  const add = (geo, mat, x, y, z, parent = castle) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z);
    if (shadows) { m.castShadow = true; m.receiveShadow = true; }
    parent.add(m); return m;
  };

  /* ---------- the hill ---------- */
  const hillGeo = new THREE.CylinderGeometry(3.5, 4.4, 1.3, 11, 2);
  const hp = hillGeo.attributes.position;
  for (let i = 0; i < hp.count; i++) {
    const y = hp.getY(i);
    if (y < .6) { hp.setX(i, hp.getX(i) * (1 + (Math.random() - .5) * .12)); hp.setZ(i, hp.getZ(i) * (1 + (Math.random() - .5) * .12)); hp.setY(i, y + (Math.random() - .5) * .18); }
  }
  hillGeo.computeVertexNormals();
  add(hillGeo, mRock, 0, -2.2, 0);
  const plinth = new THREE.Mesh(new THREE.TorusGeometry(3.52, .03, 8, 180), mGold);
  plinth.rotation.x = Math.PI / 2; plinth.position.y = -1.54; castle.add(plinth);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(4.9, .012, 6, 220), new THREE.MeshBasicMaterial({ color: lin(0xc9a96e), transparent: true, opacity: .55 }));
  halo.rotation.set(Math.PI / 2 + .18, 0, .1); halo.position.y = -1.4; world.add(halo);

  /* ---------- curtain walls with crenellations ---------- */
  const W = 2.15, base = -1.55, wallH = 1.15, top = base + wallH;
  const merlonGeo = new THREE.BoxGeometry(.2, .22, .26);
  function wall(x, z, len, rotY, gate) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY; castle.add(g);
    add(new THREE.BoxGeometry(len, wallH, .26), mWall, 0, base + wallH / 2, 0, g);
    add(new THREE.BoxGeometry(len, .035, .3), mGold, 0, top + .01, 0, g);
    const n = Math.round(len / .36);
    for (let i = 0; i < n; i++) if (i % 2 === 0) add(merlonGeo, mMerlon, -len / 2 + (i + .5) * (len / n), top + .13, 0, g);
    if (gate) {
      add(new THREE.BoxGeometry(.62, .72, .08), mDark, 0, base + .36, .12, g);
      const arch = add(new THREE.CylinderGeometry(.31, .31, .08, 20, 1, false, 0, Math.PI), mDark, 0, base + .72, .12, g);
      arch.rotation.set(Math.PI / 2, 0, Math.PI / 2);
      const frame = add(new THREE.TorusGeometry(.34, .025, 8, 28, Math.PI), mGold, 0, base + .72, .17, g);
      frame.rotation.z = 0;
      add(new THREE.BoxGeometry(.03, .72, .03), mGold, -.34, base + .36, .17, g);
      add(new THREE.BoxGeometry(.03, .72, .03), mGold, .34, base + .36, .17, g);
    }
  }
  wall(0, W, 2 * W, 0, true);
  wall(0, -W, 2 * W, Math.PI);
  wall(W, 0, 2 * W, -Math.PI / 2);
  wall(-W, 0, 2 * W, Math.PI / 2);

  /* ---------- corner towers ---------- */
  const towerH = 1.75;
  [[W, W], [-W, W], [W, -W], [-W, -W]].forEach(([x, z]) => {
    add(new THREE.CylinderGeometry(.46, .52, towerH, 14), mTower, x, base + towerH / 2, z);
    const ring = add(new THREE.TorusGeometry(.5, .03, 8, 40), mGold, x, base + towerH, z); ring.rotation.x = Math.PI / 2;
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2;
      const m = add(new THREE.BoxGeometry(.18, .22, .14), mMerlon, x + Math.cos(a) * .42, base + towerH + .12, z + Math.sin(a) * .42);
      m.rotation.y = -a;
    }
    // arrow-slit windows
    for (let k = 0; k < 2; k++) {
      const a = Math.atan2(z, x) + (k ? .9 : -.9);
      const s = add(new THREE.PlaneGeometry(.07, .26), mWin, x + Math.cos(a) * .53, base + .95, z + Math.sin(a) * .53);
      s.lookAt(x + Math.cos(a) * 3, base + .95, z + Math.sin(a) * 3);
    }
  });

  /* ---------- the keep ---------- */
  const kW = 1.45, kH = 2.65, kTop = base + kH;
  add(new THREE.BoxGeometry(kW, kH, kW), mKeep, 0, base + kH / 2, -.15);
  add(new THREE.BoxGeometry(kW + .1, .05, kW + .1), mGold, 0, kTop + .02, -.15);
  add(new THREE.BoxGeometry(kW + .1, .04, kW + .1), mGold, 0, base + 1.55, -.15);
  for (let side = 0; side < 4; side++) {
    const g = new THREE.Group(); g.position.set(0, 0, -.15); g.rotation.y = side * Math.PI / 2; castle.add(g);
    for (let i = 0; i < 5; i++) if (i % 2 === 0) add(new THREE.BoxGeometry(.24, .26, .2), mMerlon, -kW / 2 + (i + .5) * (kW / 5), kTop + .16, kW / 2 - .1, g);
    [[-.3, .6], [.3, .6], [-.3, 1.75], [.3, 1.75]].forEach(([x, y]) => {
      add(new THREE.PlaneGeometry(.16, .34), mWin, x, base + y + .17, kW / 2 + .006, g);
      const a = add(new THREE.CircleGeometry(.08, 12, 0, Math.PI), mWin, x, base + y + .34, kW / 2 + .006, g);
      a.rotation.z = 0;
    });
  }
  const glow = new THREE.PointLight(0xffb85c, 1.2, 6, 2); glow.position.set(0, base + 1, 1.2); castle.add(glow);

  /* ---------- flag pole + the Lebanese flag ---------- */
  const poleX = 0, poleBase = kTop + .05, poleTop = poleBase + 1.85;
  add(new THREE.CylinderGeometry(.025, .035, poleTop - poleBase, 10), mGold, poleX, (poleBase + poleTop) / 2, -.15);
  add(new THREE.SphereGeometry(.07, 16, 12), mGold, poleX, poleTop + .05, -.15);

  function flagTexture() {
    const c = document.createElement("canvas"); c.width = 900; c.height = 600;
    const g = c.getContext("2d");
    g.fillStyle = "#e3131f"; g.fillRect(0, 0, 900, 150); g.fillRect(0, 450, 900, 150);
    g.fillStyle = "#ffffff"; g.fillRect(0, 150, 900, 300);
    // the cedar: tiers of drooping branches, as wide as a third of the flag
    const cx = 450; g.fillStyle = "#00a651";
    const tiers = [[160, 205, 38], [190, 240, 62], [222, 280, 92], [258, 322, 122], [296, 370, 148]];
    tiers.forEach(([y0, y1, hw]) => {
      g.beginPath(); g.moveTo(cx, y0);
      g.quadraticCurveTo(cx + hw * .55, y0 + (y1 - y0) * .35, cx + hw, y1);
      g.quadraticCurveTo(cx + hw * .5, y1 - 14, cx + hw * .2, y1 - 2);
      g.lineTo(cx - hw * .2, y1 - 2);
      g.quadraticCurveTo(cx - hw * .5, y1 - 14, cx - hw, y1);
      g.quadraticCurveTo(cx - hw * .55, y0 + (y1 - y0) * .35, cx, y0);
      g.fill();
    });
    g.beginPath(); g.moveTo(cx, 150); g.lineTo(cx + 22, 200); g.lineTo(cx - 22, 200); g.fill();
    g.fillRect(cx - 14, 360, 28, 90);
    const t = new THREE.CanvasTexture(c); t.anisotropy = 8; t.encoding = THREE.sRGBEncoding; return t;
  }
  const FW = 1.35, FH = .9;
  const flagGeo = new THREE.PlaneGeometry(FW, FH, 30, 16);
  flagGeo.translate(FW / 2, 0, 0);
  const flagRest = Float32Array.from(flagGeo.attributes.position.array);
  const flag = new THREE.Mesh(flagGeo, new THREE.MeshStandardMaterial({ map: flagTexture(), side: THREE.DoubleSide, roughness: .92, envMapIntensity: .12 }));
  flag.position.set(poleX + .03, poleTop - FH / 2 - .05, -.15);
  if (shadows) flag.castShadow = true;
  castle.add(flag);

  /* ---------- cedars around the hill ---------- */
  function cedar(x, z, s) {
    const g = new THREE.Group(); g.position.set(x, -1.55, z); g.scale.setScalar(s); castle.add(g);
    add(new THREE.CylinderGeometry(.04, .06, .5, 6), mTrunk, 0, .25, 0, g);
    [[.5, .32, .2], [.4, .5, .18], [.3, .66, .16], [.18, .8, .14]].forEach(([r, y, h]) => add(new THREE.ConeGeometry(r, h, 9), mCedar, 0, y, 0, g));
    g.rotation.y = Math.random() * 6;
  }
  [[2.95, 1.2, 1], [-3.05, .9, .85], [2.7, -1.9, .9], [-2.6, -2.2, 1.05], [.95, 3.05, .75], [-1.25, 3.0, .9]].forEach(([x, z, s]) => cedar(x, z, s));

  /* ---------- official documents flying around the keep ---------- */
  const SV = AM.SV, focus = AM.qs("id") && AM.svcById(AM.qs("id"));
  function docTexture(svc, i, light) {
    const c = document.createElement("canvas"); c.width = 256; c.height = 340;
    const g = c.getContext("2d");
    const gr = g.createLinearGradient(0, 0, 256, 340);
    if (light) { gr.addColorStop(0, "#f6ecd8"); gr.addColorStop(1, "#dcc8a2"); } else { gr.addColorStop(0, "#211d16"); gr.addColorStop(1, "#0e0c09"); }
    g.fillStyle = gr; g.fillRect(0, 0, 256, 340);
    g.strokeStyle = light ? "#9a7533" : "#c9a96e"; g.lineWidth = 3; g.strokeRect(9, 9, 238, 322);
    g.lineWidth = 1; g.strokeRect(16, 16, 224, 308);
    g.fillStyle = svc.color; g.fillRect(170, 32, 52, 5);
    g.fillStyle = light ? "#2a2216" : "#f3ede1";
    g.font = "700 30px Amiri, 'IBM Plex Sans Arabic', serif"; g.textAlign = "right"; g.direction = "rtl";
    let y = 86, line = "";
    svc.ar.split(" ").forEach(w => { const t = line ? line + " " + w : w; if (g.measureText(t).width > 196 && line) { g.fillText(line, 222, y); line = w; y += 38; } else line = t; });
    g.fillText(line, 222, y);
    g.direction = "ltr"; g.textAlign = "left";
    g.fillStyle = light ? "rgba(60,45,20,.18)" : "rgba(243,228,196,.16)";
    for (let k = 0; k < 5; k++) g.fillRect(32, 196 + k * 19, 192 - (k % 3) * 38, 5);
    g.strokeStyle = "#c9a96e"; g.lineWidth = 2.5;
    g.beginPath(); g.arc(196, 288, 21, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.arc(196, 288, 14, 0, Math.PI * 2); g.stroke();
    g.font = "italic 600 16px 'Cormorant Garamond', serif"; g.fillStyle = "#c9a96e";
    g.fillText("N\u00ba " + AM.pad(i + 1), 32, 296);
    const t = new THREE.CanvasTexture(c); t.anisotropy = 4; t.encoding = THREE.sRGBEncoding; return t;
  }
  const docs = [];
  const docGeo = new THREE.BoxGeometry(.78, 1.04, .02);
  const docList = focus ? [focus, ...SV.filter(x => x !== focus)].slice(0, 8) : SV.slice(0, mode === "full" ? 12 : 8);
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => {
    docList.forEach((svc, i) => {
      const idx = SV.indexOf(svc);
      const tex = { dark: docTexture(svc, idx, false), light: docTexture(svc, idx, true) };
      const face = new THREE.MeshStandardMaterial({ map: tex.dark, emissive: 0xffffff, emissiveMap: tex.dark, emissiveIntensity: .32, roughness: .6, envMapIntensity: .3 });
      const m = new THREE.Mesh(docGeo, [mGold, mGold, mGold, mGold, face, face]);
      m.userData = { tex, face, a: (i / docList.length) * Math.PI * 2, speed: .07 + Math.random() * .06,
        r: 2.45 + (i % 3) * .55, h: .75 + (i % 4) * .42, bob: Math.random() * 6, spin: (Math.random() - .5) * .5 };
      if (focus && i === 0) { m.scale.setScalar(1.3); m.userData.r = 2.6; m.userData.h = 1.6; }
      if (shadows) m.castShadow = true;
      castle.add(m); docs.push(m);
    });
    paintDocs();
  });
  function paintDocs() {
    const L = AM.isLight();
    docs.forEach(m => { const u = m.userData, t = L ? u.tex.light : u.tex.dark; u.face.map = t; u.face.emissiveMap = t; u.face.emissiveIntensity = L ? .05 : .32; u.face.needsUpdate = true; });
  }

  /* ---------- light ---------- */
  const hemi = new THREE.HemisphereLight(0xffe9c4, 0x1a140c, .55); scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff0d8, 1.6); key.position.set(-6, 9, 7); scene.add(key);
  const rim = new THREE.DirectionalLight(0xd4a85a, 1.4); rim.position.set(6, 4, -8); scene.add(rim);
  if (shadows) {
    key.castShadow = true; key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 30 });
    key.shadow.bias = -.0006; key.shadow.radius = 3;
    key.target = world;
  }

  /* ---------- gold dust ---------- */
  const N = small ? 260 : (mode === "full" ? 700 : 420);
  const pos = new Float32Array(N * 3), spd = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const r = 1.5 + Math.random() * 9, a = Math.random() * Math.PI * 2;
    pos.set([Math.cos(a) * r, -3 + Math.random() * 9, Math.sin(a) * r - 1], i * 3); spd[i] = .15 + Math.random() * .35;
  }
  const dGeo = new THREE.BufferGeometry(); dGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dot = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d");
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,240,205,1)"); gr.addColorStop(.35, "rgba(226,190,120,.6)"); gr.addColorStop(1, "rgba(201,169,110,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
  const dust = new THREE.Points(dGeo, new THREE.PointsMaterial({ size: .09, map: dot, transparent: true, opacity: .8, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffe2a8 }));
  scene.add(dust);

  /* ---------- placement: opposite the text (right in English, left in Arabic) ---------- */
  let baseX = 0, baseY = 0, baseS = 1;
  const side = () => {
    const wide = innerWidth > 960, AR = AM.isAR();
    if (mode === "full") { baseX = wide ? (AR ? -3.95 : 3.95) : 0; baseY = wide ? -.35 : .4; baseS = wide ? .7 : .58; }
    else { baseX = wide ? (AR ? -5.3 : 5.3) : 0; baseY = wide ? .1 : 1.2; baseS = wide ? .52 : .45; }
    world.scale.setScalar(baseS);
  };
  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    side();
  }
  addEventListener("resize", resize); resize();
  AM.onLang.push(side);

  function sceneTheme() {
    const L = AM.isLight();
    scene.fog.color.copy(lin(L ? 0xf6f1e6 : 0x0c0b09));
    scene.fog.density = L ? .008 : .026;
    stoneMats.forEach(m => m.color.copy(lin(L ? 0xfff3df : 0xa89a84)));
    mRock.color.copy(lin(L ? 0xb4a283 : 0x3a3228));
    mWin.color.copy(lin(L ? 0xe2a64c : 0xffc66e));
    mCedar.color.copy(lin(L ? 0x355f40 : 0x24452f));
    hemi.intensity = L ? .45 : .32;
    key.intensity = L ? 1.25 : 1.35;
    rim.intensity = L ? 1.1 : 1.9;
    glow.intensity = L ? .4 : 1.2;
    halo.material.color.copy(lin(L ? 0x9a7533 : 0xc9a96e));
    dust.material.blending = L ? THREE.NormalBlending : THREE.AdditiveBlending;
    dust.material.color.copy(lin(L ? 0xa8823c : 0xffe2a8));
    dust.material.opacity = L ? .35 : .8;
    dust.material.needsUpdate = true;
    renderer.toneMappingExposure = L ? .92 : 1.05;
    paintDocs();
  }
  AM.onTheme.push(sceneTheme); sceneTheme();

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener("pointermove", e => { mouse.tx = e.clientX / innerWidth - .5; mouse.ty = e.clientY / innerHeight - .5; }, { passive: true });
  let scrollP = 0;
  addEventListener("scroll", () => { scrollP = Math.min(1, scrollY / (mode === "full" ? innerHeight : innerHeight * .6)); }, { passive: true });

  const clock = new THREE.Clock();
  let visible = true;
  document.addEventListener("visibilitychange", () => (visible = !document.hidden));
  let wx = baseX;
  const strength = () => (innerWidth > 960 ? 1 : .22) * (mode === "full" ? 1 : (AM.isLight() ? .8 : .6));
  const fp = flagGeo.attributes.position;

  (function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    const tm = clock.getElapsedTime(), sp = reduced ? .2 : 1, dt = .016;
    mouse.x += (mouse.tx - mouse.x) * .045; mouse.y += (mouse.ty - mouse.y) * .045;
    wx += (baseX * (1 - scrollP * .5) - wx) * .06;
    world.position.x = wx;
    world.position.y = baseY + scrollP * 1.4 + Math.sin(tm * .6) * .06 * sp;
    world.rotation.y = -.55 + mouse.x * .5 + tm * .07 * sp + scrollP * 1.1;
    world.rotation.x = mouse.y * .12 + scrollP * .18;
    halo.rotation.z = tm * .05 * sp;

    // the flag waves more toward its free edge
    for (let i = 0; i < fp.count; i++) {
      const x = flagRest[i * 3], y = flagRest[i * 3 + 1], k = x / FW;
      fp.setZ(i, (Math.sin(x * 4.2 - tm * 3.2 * sp) * .11 + Math.sin(y * 3 + tm * 2.1 * sp) * .03) * k);
      fp.setY(i, y - k * k * .05 + Math.sin(x * 3 - tm * 2.4 * sp) * .015 * k);
    }
    fp.needsUpdate = true; flagGeo.computeVertexNormals();

    // gold dust drifts upward and loops
    const p = dGeo.attributes.position;
    for (let i = 0; i < N; i++) {
      let y = p.getY(i) + spd[i] * dt * sp;
      if (y > 6) y = -3;
      p.setY(i, y);
      p.setX(i, p.getX(i) + Math.sin(tm * .3 + i) * .0015 * sp);
    }
    p.needsUpdate = true;
    dust.rotation.y = tm * .015 * sp;

    // documents circle the keep above the walls, always turning to face you
    docs.forEach(m => {
      const u = m.userData;
      u.a += u.speed * .01 * sp;
      m.position.set(Math.cos(u.a) * u.r, u.h + Math.sin(tm * .8 + u.bob) * .18, Math.sin(u.a) * u.r - .15);
      m.lookAt(camera.position);   // lookAt takes world coordinates
      m.rotateY(Math.sin(tm * .5 + u.bob) * .3 + u.spin);
      m.rotateZ(Math.sin(tm * .7 + u.bob) * .06);
    });

    canvas.style.opacity = strength() * (1 - scrollP * .88);
    renderer.render(scene, camera);
  })();
})();
