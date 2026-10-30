/* =====================================================================
   HOME — service cards, service finder, live tracking demo,
   latest news, and the inquiry form (uploads → Google Drive)
   ===================================================================== */
(() => {
  const AM = window.AM, S = AM.S, SV = AM.SV, t = AM.t, esc = AM.esc, pad = AM.pad;
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];

  /* ---------- counters + marquee ---------- */
  const stats = $$("[data-count]");
  stats[0].dataset.count = SV.length;
  stats[1].dataset.count = SV.reduce((n, s) => n + s.subs.length, 0);
  const marquee = () => {
    const mq = SV.map(s => `<a href="service.html?id=${s.id}">${esc(AM.isFR() ? s.fr : s.title)} <span class="ar">${esc(s.ar)}</span><i></i></a>`).join("");
    $("#marquee").innerHTML = mq + mq;
  };
  marquee(); AM.onLang.push(marquee);
  /* merged mode: big English headline, then the French and Arabic sentences beneath it */
  const heroTri = () => {
    const h1 = $(".hero-title"); if (!h1) return;
    let box = $(".hero-tri");
    if (!AM.isMX()) { box && box.remove(); return; }
    $$(".hero-title .line").forEach(l => l.textContent = AM.part(t(l.dataset.i18n), AM.lead()));
    const line = i => ["hero.l1", "hero.l2", "hero.l3"].map(k => AM.part(t(k), i)).join(" ");
    if (!box) { box = document.createElement("div"); box.className = "hero-tri"; h1.after(box); }
    box.innerHTML = `<p class="ht-ar" lang="ar" dir="rtl">${esc(line(2))}</p>`;
  };
  AM.onLang.push(heroTri);
  function countUp() {
    stats.forEach(el => {
      const end = +el.dataset.count, t0 = performance.now();
      const step = now => {
        const p = Math.min(1, (now - t0) / 1400);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        p < 1 && requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
  setTimeout(countUp, 700);

  /* ---------- service cards → full service pages ---------- */
  const grid = $("#servicesGrid");
  function renderCards() {
    grid.innerHTML = SV.map((s, i) => `
      <a class="card tilt reveal" data-delay="${(i % 4) * 70}" style="--c:${s.color}" data-id="${s.id}" href="service.html?id=${s.id}">
        <span class="card-num">${pad(i + 1)}</span>
        <span class="card-icon">${AM.ICONS[s.icon] || AM.ICONS.register}</span>
        <h3>${esc(AM.title(s))}</h3>
        <span class="alt ${AM.isAR() ? "" : "ar"}">${esc(AM.altTitle(s))}</span>
        <p>${esc(AM.blurb(s))}</p>
        <span class="card-foot"><span>${t("card.tx", { n: s.subs.length })}</span><b>${t("common.details")} ${AM.ICONS.arrow}</b></span>
      </a>`).join("") + `<p class="no-results" hidden>${t("svc.none")}</p>`;
    filterCards();
  }
  function filterCards() {
    const q = $("#search").value.trim().toLowerCase();
    let shown = 0;
    $$(".card", grid).forEach(c => {
      const s = AM.svcById(c.dataset.id);
      const hay = [s.title, s.ar, s.fr, s.blurb, s.blurbAr, s.blurbFr, s.goal, s.goalAr, s.goalFr, ...s.subs.flatMap(u => [u.name, u.ar, u.fr, ...u.docs.flat()])].join(" ").toLowerCase();
      const ok = !q || hay.includes(q);
      c.classList.toggle("hidden", !ok); ok && shown++;
    });
    const nr = $(".no-results", grid); if (nr) nr.hidden = shown > 0;
  }
  $("#search").addEventListener("input", filterCards);

  /* ---------- service finder (two taps) ---------- */
  const wz = $("#wz");
  let wzSvc = null, wzSub = null;
  function renderWizard() {
    const step = wzSvc == null ? 1 : wzSub == null ? 2 : 3;
    const dots = `<div class="wz-dots" aria-hidden="true">${[1, 2, 3].map(n => `<span class="${n <= step ? "on" : ""}"></span>`).join("")}</div>`;
    if (step === 1) {
      wz.innerHTML = `${dots}<p class="wz-q">${t("wz.q1")}<small>${t("wz.step", { n: 1 })}</small></p>
        <div class="wz-grid">${SV.map((s, i) => `
          <button type="button" class="wz-opt tilt" style="--c:${s.color}; --i:${i}" data-s="${s.id}">
            <span class="wz-ic">${AM.ICONS[s.icon]}</span>
            <span class="wz-txt"><b>${esc(AM.pick(s.goal, s.goalAr, s.goalFr))}</b><small>${esc(AM.title(s))}</small></span>
          </button>`).join("")}</div>`;
    } else if (step === 2) {
      const s = AM.svcById(wzSvc);
      wz.innerHTML = `${dots}<p class="wz-q"><button type="button" class="wz-back" data-back="1" aria-label="${t("common.back")}">${AM.ICONS.arrow}</button>${t("wz.q2")}<small>${esc(AM.title(s))}</small></p>
        <div class="wz-grid wz-subs">${s.subs.map((u, i) => `
          <button type="button" class="wz-opt tilt" style="--c:${s.color}; --i:${i}" data-u="${i}">
            <span class="wz-num">${pad(i + 1)}</span>
            <span class="wz-txt"><b>${esc(AM.subName(u))}</b><small>${t("common.docs", { n: u.docs.length })}</small></span>
          </button>`).join("")}</div>`;
    } else {
      const s = AM.svcById(wzSvc), u = s.subs[wzSub];
      wz.innerHTML = `${dots}
        <div class="wz-result" style="--c:${s.color}">
          <div class="wz-res-head">
            <span class="wz-ic big">${AM.ICONS[s.icon]}</span>
            <div><p class="eyebrow">${t("wz.result")}</p><h3>${esc(AM.subName(u))}</h3><p class="muted">${esc(AM.per(i => `${AM.part(AM.title(s), i)} · ${AM.part(t("common.handledAt"), i)}: ${AM.part(AM.pick(s.authority, s.authorityAr, s.authorityFr), i)}`))}</p></div>
          </div>
          <ol class="wz-docs">${u.docs.map((d, i) => `<li style="--i:${i}"><span>${pad(i + 1)}</span>${esc(AM.doc(d))}</li>`).join("")}</ol>
          <div class="wz-actions">
            <button type="button" class="btn" data-start>${t("common.startFile")}</button>
            <a class="btn btn-ghost" href="service.html?id=${s.id}#tx-${wzSub}">${t("common.details")}</a>
            <button type="button" class="linkbtn" data-restart>${t("wz.restart")}</button>
          </div>
        </div>`;
    }
  }
  wz.addEventListener("click", e => {
    const o = e.target.closest(".wz-opt");
    if (e.target.closest("[data-back]")) { wzSvc = null; wzSub = null; }
    else if (e.target.closest("[data-restart]")) { wzSvc = null; wzSub = null; }
    else if (e.target.closest("[data-start]")) { AM.openFile(wzSvc, wzSub); return; }
    else if (o && o.dataset.s) wzSvc = o.dataset.s;
    else if (o && o.dataset.u != null) wzSub = +o.dataset.u;
    else return;
    wz.classList.remove("swap"); void wz.offsetWidth; wz.classList.add("swap");
    renderWizard();
  });

  /* ---------- live tracking demo ---------- */
  const STEPS = ["received", "review", "progress", "ready", "completed"];
  let trkAt = 0, trkTimer = null;
  function renderTracker() {
    const box = $("#trkSteps"); if (!box) return;
    box.innerHTML = STEPS.map((s, i) => `<li class="${i < trkAt ? "done" : i === trkAt ? "now" : ""}"><span></span><em>${t("status." + s)}</em></li>`).join("");
    $("#trkBadge").textContent = t("status." + STEPS[trkAt]);
    $("#trkBadge").className = "badge s-" + STEPS[trkAt];
  }
  const trkObs = new IntersectionObserver(es => es.forEach(en => {
    clearInterval(trkTimer);
    if (en.isIntersecting && !AM.reduced) trkTimer = setInterval(() => { trkAt = (trkAt + 1) % STEPS.length; renderTracker(); }, 1700);
  }), { threshold: .3 });
  trkObs.observe($("#tracker"));
  $("#trkCta").addEventListener("click", e => { e.preventDefault(); $("#navCta").click(); });

  /* ---------- latest news ---------- */
  function renderNews() {
    AM.news().then(list => {
      $("#homeNews").innerHTML = list.slice(0, 3).map(AM.newsCard).join("") || `<p class="muted">${t("news.empty")}</p>`;
      AM.reveal($("#homeNews"));
    });
  }
  AM.onNews.push(renderNews);

  /* ---------- language hook ---------- */
  AM.onLang.push(() => { renderCards(); renderWizard(); renderTracker(); renderNews(); });
})();
