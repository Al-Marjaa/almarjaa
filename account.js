/* =====================================================================
   Client accounts — Google only (Apps Script + Drive + Sheets)
   Log in / sign up, "My files" dashboard, office view for admins.
   Turned on when SITE.googleScriptUrl is set in data.js.
   ===================================================================== */
(() => {
  const AM = window.AM, S = AM.S, SV = AM.SV, t = AM.t, esc = AM.esc;
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const STATUSES = ["received", "review", "missing", "progress", "ready", "completed", "cancelled"];
  const STEPS = ["received", "review", "progress", "ready", "completed"];
  const URL_ = S.googleScriptUrl || S.driveScriptUrl || "";

  const enabled = !!URL_;
  const Account = window.Account = { enabled };
  if (!enabled) return;   // site keeps working (email fallback) until the script is connected

  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem("am_" + k)); } catch { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem("am_" + k) : localStorage.setItem("am_" + k, JSON.stringify(v)); } catch {} }
  };
  let token = store.get("token"), user = store.get("user");
  let rows = [], scope = "mine", pending = null, resetEmail = "";
  const isAdmin = () => !!(user && user.role === "admin");
  Account.isAdmin = isAdmin;
  Account.onChange = [];          // newsroom listens here: fn(isAdmin)

  /* ---------- talk to the Google script ---------- */
  async function api(action, data = {}) {
    let res;
    try {
      res = await fetch(URL_, { method: "POST", body: JSON.stringify({ action, token, lang: AM.lang(), ...data }) });
    } catch (e) { throw Object.assign(new Error("network"), { code: "network" }); }
    const out = await res.json().catch(() => ({ ok: false, error: "server" }));
    if (!out.ok) {
      if (out.error === "auth" && action !== "login") signedOut();
      throw Object.assign(new Error(out.error || "server"), { code: out.error || "server" });
    }
    return out;
  }
  Account.api = api;
  Account.login = () => openAuth("login");
  const toB64 = f => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(",")[1] || "");
    r.onerror = () => rej(r.error);
    r.readAsDataURL(f);
  });
  async function packFiles(list, progress = () => {}) {
    const files = [];
    for (let i = 0; i < list.length; i++) {
      const it = list[i];
      files.push({ name: it.name, type: it.f.type || "application/octet-stream", data: await toB64(it.f),
        docIndex: it.docIndex, label: it.label[0], labelAr: it.label[1] });
      progress((i + 1) / list.length);
    }
    return files;
  }

  /* ---------- helpers ---------- */
  const firstName = () => ((user && (user.name || user.email)) || "").split(/[\s@]/)[0];
  const fileNo = id => String(id).startsWith("AM-") ? id : "AM-" + String(id).slice(0, 6).toUpperCase();
  const fmtDate = d => d ? new Intl.DateTimeFormat(AM.isAR() ? "ar-LB" : AM.isFR() ? "fr-FR" : "en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d)) : "";
  const fmtSize = b => b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB";
  /* ---------- money (office only) ---------- */
  const CURS = ["USD", "LBP"], METHODS = ["cash", "transfer", "omt", "whish", "card", "cheque", "other"];
  const money = (n, cur) => {
    try { return new Intl.NumberFormat(AM.isAR() ? "ar-LB-u-nu-latn" : AM.isFR() ? "fr-FR" : "en-US", { style: "currency", currency: cur || "USD", maximumFractionDigits: cur === "LBP" ? 0 : 2 }).format(+n || 0); }
    catch { return (+n || 0) + " " + cur; }
  };
  const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${AM.pad(d.getMonth() + 1)}-${AM.pad(d.getDate())}`; };
  const payInfo = r => {
    const cur = r.fee_currency || "USD", pays = (r.payments || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const paid = pays.filter(p => p.currency === cur).reduce((a, p) => a + p.amount, 0);
    const fee = r.fee == null ? null : +r.fee;
    return { cur, pays, paid, fee, bal: fee == null ? null : Math.max(0, Math.round((fee - paid) * 100) / 100) };
  };
  const svcOf = r => SV.find(s => s.id === r.service_id);
  const svcName = r => { const s = svcOf(r); return s ? AM.title(s) : AM.pick(r.service, r.service_ar); };
  const txName = r => { const s = svcOf(r), u = s && r.sub_index !== "" && r.sub_index != null ? s.subs[+r.sub_index] : null; return u ? AM.subName(u) : AM.pick(r.transaction, r.transaction_ar); };
  const statusLabel = s => t("status." + s);
  const ERR = { invalid: "auth.err.invalid", exists: "auth.err.exists", short: "auth.err.short", many: "auth.err.many",
    code: "auth.err.code", email: "auth.err.email", network: "auth.err.network" };
  const errText = e => t(ERR[e && e.code] || "auth.err.generic");

  /* ---------- session ---------- */
  function signedIn(out) {
    token = out.token || token; user = out.user;
    store.set("token", token); store.set("user", user); store.set("had", true);
    prefill(); paintNav();
    if (pending) { const p = pending; pending = null; closeAuth(true); AM.toast(t("auth.welcome", { name: firstName() })); p.res(user); }
    else if (auth.classList.contains("open")) { closeAuth(true); AM.toast(t("auth.welcome", { name: firstName() })); openDashboard(); }
  }
  function signedOut() {
    token = null; user = null; rows = [];
    store.set("token", null); store.set("user", null);
    if (dash.classList.contains("open")) closeDashboard();
    paintNav();
  }
  // refresh the saved session quietly (role / name may have changed in the sheet)
  if (token) api("me").then(o => { user = o.user; store.set("user", user); paintNav(); prefill(); }).catch(() => {});

  /* ---------- nav button ---------- */
  const cta = $("#navCta"), ctaText = $("#navCtaText");
  cta.addEventListener("click", e => {
    e.preventDefault();
    if (user) openDashboard(); else openAuth(store.get("had") ? "login" : "signup");
  });
  function paintNav() {
    ctaText.dataset.i18n = user ? "nav.myfiles" : "nav.cta";
    ctaText.textContent = t(ctaText.dataset.i18n);
    const av = $("#navAvatar");
    av.hidden = !user;
    if (user) av.textContent = (firstName()[0] || "•").toUpperCase();
    cta.classList.toggle("is-user", !!user);
    const adm = isAdmin();
    if (adm !== lastAdmin) { lastAdmin = adm; Account.onChange.forEach(f => { try { f(adm); } catch (e) { console.error(e); } }); }
  }
  let lastAdmin = null;

  function prefill() {
    if (!user) return;
    const f = $("#inquiryForm");
    if (!f) return;
    if (!f.Name.value) f.Name.value = user.name || "";
    if (!f.Phone.value) f.Phone.value = user.phone || "";
    if (!f.email.value) f.email.value = user.email || "";
  }
  Account.prefill = prefill;

  /* =====================================================================
     AUTH MODAL
     ===================================================================== */
  const auth = $("#authModal"), aForm = $("#authForm"), aMsg = $("#aMsg");
  let view = "login";

  function openAuth(v, need) {
    setView(v || "login");
    $("#aNeed").hidden = !need;
    auth.classList.add("open"); auth.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => { const first = $$("input", aForm).find(i => !i.closest("[hidden]")); first && first.focus(); }, 250);
  }
  function closeAuth(silent) {
    auth.classList.remove("open"); auth.setAttribute("aria-hidden", "true");
    if (!dash.classList.contains("open")) document.body.style.overflow = "";
    if (!silent && pending) { pending.rej(new Error("cancelled")); pending = null; }
  }
  function setView(v, keepMsg) {
    view = v;
    $$("[data-only]", auth).forEach(el => el.hidden = !el.dataset.only.split(" ").includes(v));
    $$("#aTabs button").forEach(b => b.classList.toggle("active", b.dataset.v === v));
    $("#aTabs").hidden = !(v === "login" || v === "signup");
    const titles = { login: "auth.title.login", signup: "auth.title.signup", reset: "auth.reset.title", code: "auth.newpass.title" };
    const btns = { login: "auth.login", signup: "auth.signup", reset: "auth.reset.btn", code: "auth.newpass.btn" };
    $("#aTitle").textContent = t(titles[v]);
    $("#aSub").textContent = t(v === "reset" ? "auth.reset.sub" : v === "code" ? "auth.code.sub" : "auth.sub");
    $("#aSubmit").textContent = t(btns[v]);
    aForm.password.autocomplete = v === "login" ? "current-password" : "new-password";
    if (!keepMsg) msg("");
  }
  function msg(text, ok) { aMsg.hidden = !text; aMsg.textContent = text || ""; aMsg.classList.toggle("ok", !!ok); }

  $("#aTabs").addEventListener("click", e => { const b = e.target.closest("button"); b && setView(b.dataset.v); });
  $("#aForgot").addEventListener("click", () => { setView("reset"); });
  $("#aBack").addEventListener("click", () => setView("login"));
  $$("[data-aclose]").forEach(b => b.addEventListener("click", () => closeAuth()));

  aForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = aForm.email.value.trim(), password = aForm.password.value;
    if ((view === "signup" || view === "code") && password.length < 8) return msg(t("auth.err.short"));
    const btn = $("#aSubmit"); btn.disabled = true; btn.classList.add("busy"); msg("");
    try {
      if (view === "login") signedIn(await api("login", { email, password }));
      else if (view === "signup") signedIn(await api("signup", { email, password, name: aForm.name.value.trim(), phone: aForm.phone.value.trim() }));
      else if (view === "reset") {
        await api("forgot", { email });
        resetEmail = email; setView("code", true); msg(t("auth.reset.sent"), true);
      } else if (view === "code") {
        const out = await api("reset", { email: resetEmail, code: aForm.code.value.trim(), password });
        signedIn(out); AM.toast(t("auth.newpass.ok"));
      }
    } catch (err) { console.warn(err); msg(errText(err)); }
    finally { btn.disabled = false; btn.classList.remove("busy"); }
  });

  /* used by the inquiry form: resolves once the visitor is logged in */
  Account.requireUser = async () => {
    if (user && token) return user;
    return new Promise((res, rej) => { pending = { res, rej }; openAuth(store.get("had") ? "login" : "signup", true); });
  };

  /* save a new inquiry + files → Drive folder + tracking sheet */
  Account.saveInquiry = async (m, list, progress = () => {}) => {
    const files = await packFiles(list, p => progress(p * 60));
    progress(65);
    const out = await api("submit", { ...m, files });
    progress(100);
    return out;
  };

  /* =====================================================================
     DASHBOARD
     ===================================================================== */
  const dash = $("#dash"), list = $("#dList");

  function openDashboard() {
    if (!user) return openAuth("login");
    scope = isAdmin() ? (scope === "mine" && dash.dataset.picked ? "mine" : "all") : "mine";
    dash.classList.add("open"); dash.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    paintHead();
    load();
  }
  Account.openDashboard = openDashboard;
  function closeDashboard() {
    dash.classList.remove("open"); dash.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  $("#dClose").addEventListener("click", closeDashboard);
  $("#dLogout").addEventListener("click", async () => { api("logout").catch(() => {}); signedOut(); });
  $("#dRefresh").addEventListener("click", () => load());
  $("#dNew").addEventListener("click", () => {
    closeDashboard();
    AM.openFile();
  });
  addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (auth.classList.contains("open")) closeAuth();
    else if (dash.classList.contains("open")) closeDashboard();
  });

  function paintHead() {
    $("#dHello").textContent = t("dash.hello", { name: firstName() });
    $("#dSub").textContent = t(isAdmin() && scope === "income" ? "inc.sub" : isAdmin() && scope === "all" ? "dash.subAdmin" : "dash.sub");
    dash.classList.toggle("is-income", isAdmin() && scope === "income");
    $("#dTools").hidden = !isAdmin();
    $$("#dScope button").forEach(b => b.classList.toggle("active", b.dataset.v === scope));
    const f = $("#dFilter"), v = f.value;
    f.innerHTML = `<option value="">${t("dash.filter.all")}</option>` + STATUSES.map(s => `<option value="${s}">${statusLabel(s)}</option>`).join("");
    f.value = v;
  }
  $("#dScope").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { scope = b.dataset.v; dash.dataset.picked = "1"; paintHead(); load(); } });
  $("#dFilter").addEventListener("change", render);
  $("#dSearch").addEventListener("input", render);

  async function load() {
    const keepOpen = new Set(rows.filter(r => r._open).map(r => r.id));
    list.innerHTML = `<div class="dash-empty"><span class="spinner"></span><p>${t("dash.loading")}</p></div>`;
    try {
      const out = await api("list", { scope: isAdmin() && (scope === "all" || scope === "income") ? "all" : "mine" });
      rows = out.rows || [];
      rows.forEach(r => r._open = keepOpen.has(r.id));
      render();
    } catch (err) {
      console.error(err);
      list.innerHTML = `<p class="dash-empty">${errText(err)}</p>`;
    }
  }

  function render() {
    if (isAdmin() && scope === "income") { $("#dStats").innerHTML = ""; return renderIncome(); }
    const fs = $("#dFilter").value, qs = $("#dSearch").value.trim().toLowerCase();
    const shown = rows.filter(r =>
      (!fs || r.status === fs) &&
      (!qs || [r.name, r.phone, r.email, r.service, r.service_ar, r.transaction, r.transaction_ar, fileNo(r.id)].join(" ").toLowerCase().includes(qs)));
    const counts = {}; rows.forEach(r => counts[r.status] = (counts[r.status] || 0) + 1);
    $("#dStats").innerHTML = STATUSES.filter(s => counts[s]).map(s =>
      `<button type="button" class="chip s-${s}${fs === s ? " active" : ""}" data-s="${s}"><b>${counts[s]}</b> ${statusLabel(s)}</button>`).join("");
    if (!shown.length) {
      list.innerHTML = `<div class="dash-empty"><p>${rows.length ? "—" : t("dash.empty")}</p>${rows.length ? "" : `<button class="btn" type="button" data-new>${t("dash.new")}</button>`}</div>`;
      return;
    }
    list.innerHTML = shown.map(card).join("");
  }
  $("#dStats").addEventListener("click", e => {
    const c = e.target.closest(".chip"); if (!c) return;
    const f = $("#dFilter"); f.value = f.value === c.dataset.s ? "" : c.dataset.s; render();
  });

  function stepper(status) {
    if (status === "cancelled") return "";
    const at = status === "missing" ? 1 : STEPS.indexOf(status);
    return `<ol class="stepper">${STEPS.map((s, i) => {
      const cls = i < at ? "done" : i === at ? (status === "missing" ? "warn" : "now") : "";
      const label = i === 1 && status === "missing" ? statusLabel("missing") : statusLabel(s);
      return `<li class="${cls}"><span></span><em>${label}</em></li>`;
    }).join("")}</ol>`;
  }

  function payPill(r) {
    const p = payInfo(r);
    if (p.fee == null && !p.pays.length) return "";
    if (p.fee != null && p.bal === 0) return `<span class="pay-pill ok">${t("pay.full")}</span>`;
    if (p.fee != null) return `<span class="pay-pill due">${t("pay.due", { a: money(p.bal, p.cur) })}</span>`;
    return `<span class="pay-pill">${t("pay.paid")}: ${money(p.paid, p.cur)}</span>`;
  }
  function payBox(r) {
    const p = payInfo(r), pct = p.fee ? Math.min(100, Math.round(p.paid / p.fee * 100)) : 0;
    const opt = (list, v, lab) => list.map(x => `<option value="${x}"${x === v ? " selected" : ""}>${lab ? lab(x) : x}</option>`).join("");
    return `
      <section class="pay-box" data-paybox>
        <div class="pay-head"><h5>${t("pay.title")}</h5>${p.fee == null ? `<span class="pay-pill">${t("pay.noFee")}</span>` : p.bal === 0 ? `<span class="pay-pill ok">${t("pay.full")}</span>` : `<span class="pay-pill due">${t("pay.due", { a: money(p.bal, p.cur) })}</span>`}</div>
        <div class="pay-figs">
          <div><small>${t("pay.fee")}</small><b>${p.fee == null ? "—" : money(p.fee, p.cur)}</b></div>
          <div><small>${t("pay.paid")}</small><b class="ok">${money(p.paid, p.cur)}</b></div>
          <div><small>${t("pay.balance")}</small><b class="${p.bal ? "due" : ""}">${p.bal == null ? "—" : money(p.bal, p.cur)}</b></div>
        </div>
        <div class="pay-meter" aria-hidden="true"><span style="width:${pct}%"></span></div>
        <div class="pay-row">
          <label class="field"><span>${t("pay.fee")}</span><input type="number" min="0" step="any" inputmode="decimal" dir="ltr" data-fee value="${p.fee == null ? "" : p.fee}" /></label>
          <label class="field pay-cur"><span>${t("pay.currency")}</span><select data-feecur>${opt(CURS, p.cur)}</select></label>
          <button type="button" class="btn btn-ghost btn-small" data-feesave>${t("pay.feeSave")}</button>
        </div>
        ${p.pays.length ? `<ul class="pay-list">${p.pays.map(x => `
          <li><span class="pay-date">${fmtDate(x.date)}</span><span class="pay-m">${t("pay.m." + x.method)}</span><b>${money(x.amount, x.currency)}</b>${x.note ? `<em dir="auto">${esc(x.note)}</em>` : "<em></em>"}<button type="button" class="linkbtn pay-del" data-paydel="${esc(x.id)}" aria-label="${t("pay.del")}">×</button></li>`).join("")}</ul>`
          : `<p class="muted small">${t("pay.none")}</p>`}
        <div class="pay-add">
          <p class="pay-add-t">${t("pay.add")}</p>
          <div class="pay-row">
            <label class="field"><span>${t("pay.amount")}</span><input type="number" min="0" step="any" inputmode="decimal" dir="ltr" data-pamount /></label>
            <label class="field pay-cur"><span>${t("pay.currency")}</span><select data-pcur>${opt(CURS, p.cur)}</select></label>
            <label class="field"><span>${t("pay.method")}</span><select data-pmethod>${opt(METHODS, "cash", m => t("pay.m." + m))}</select></label>
            <label class="field"><span>${t("pay.date")}</span><input type="date" data-pdate value="${todayISO()}" /></label>
          </div>
          <div class="pay-row">
            <label class="field pay-note"><span>${t("pay.note")}</span><input data-pnote dir="auto" maxlength="300" /></label>
            <button type="button" class="btn btn-small" data-payadd>${t("pay.add")}</button>
          </div>
        </div>
      </section>`;
  }

  /* ---------- Income view (office) ---------- */
  let incCur = null;
  function renderIncome() {
    const all = [];
    rows.forEach(r => (r.payments || []).forEach(p => all.push({ ...p, r })));
    const curs = CURS.filter(c => all.some(p => p.currency === c) || rows.some(r => r.fee != null && (r.fee_currency || "USD") === c));
    if (!curs.length) curs.push("USD");
    if (!curs.includes(incCur)) incCur = curs[0];
    const C = incCur, inC = all.filter(p => p.currency === C);
    const now = new Date(), ym = d => String(d).slice(0, 7);
    const key = (y, m) => `${y}-${AM.pad(m + 1)}`;
    const thisM = key(now.getFullYear(), now.getMonth()), lastD = new Date(now.getFullYear(), now.getMonth() - 1, 1), lastM = key(lastD.getFullYear(), lastD.getMonth());
    const sum = list => list.reduce((a, p) => a + p.amount, 0);
    const owing = rows.map(r => ({ r, ...payInfo(r) })).filter(x => x.fee != null && x.cur === C && x.bal > 0).sort((a, b) => b.bal - a.bal);
    const months = []; for (let i = 11; i >= 0; i--) { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); months.push({ k: key(d.getFullYear(), d.getMonth()), d }); }
    months.forEach(m => m.v = sum(inC.filter(p => ym(p.date) === m.k)));
    const max = Math.max(1, ...months.map(m => m.v));
    const monthName = d => new Intl.DateTimeFormat(AM.isAR() ? "ar-LB" : AM.isFR() ? "fr-FR" : "en-GB", { month: "short" }).format(d);
    const bySvc = {}; inC.forEach(p => { const s = svcOf(p.r); const k = s ? s.id : "other"; bySvc[k] = (bySvc[k] || 0) + p.amount; });
    const svcRows = Object.entries(bySvc).sort((a, b) => b[1] - a[1]);
    const svcMax = Math.max(1, ...svcRows.map(x => x[1]));
    const recent = all.slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 15);
    const cnt = n => t(n === 1 ? "inc.count1" : "inc.count", { n });
    const kpi = (lab, v, sub, cls = "") => `<div class="inc-kpi ${cls}"><small>${lab}</small><b>${money(v, C)}</b>${sub ? `<span>${sub}</span>` : ""}</div>`;
    list.innerHTML = `
    <div class="inc">
      <div class="inc-top">
        ${curs.length > 1 ? `<div class="seg inc-cur">${curs.map(c => `<button type="button" data-cur="${c}" class="${c === C ? "active" : ""}">${c}</button>`).join("")}</div>` : `<span></span>`}
        <button type="button" class="btn btn-ghost btn-small" data-csv>${t("inc.export")}</button>
      </div>
      <div class="inc-kpis">
        ${kpi(t("inc.month"), sum(inC.filter(p => ym(p.date) === thisM)), cnt(inC.filter(p => ym(p.date) === thisM).length))}
        ${kpi(t("inc.last"), sum(inC.filter(p => ym(p.date) === lastM)), cnt(inC.filter(p => ym(p.date) === lastM).length))}
        ${kpi(t("inc.year"), sum(inC.filter(p => String(p.date).slice(0, 4) === String(now.getFullYear()))), "")}
        ${kpi(t("inc.out"), owing.reduce((a, x) => a + x.bal, 0), t(owing.length === 1 ? "inc.files1" : "inc.files", { n: owing.length }), "due")}
      </div>
      ${all.length ? `
      <div class="inc-grid">
        <section class="inc-card inc-chart"><h5>${t("inc.chart")}</h5>
          <div class="bars">${months.map(m => `<div class="bar${m.k === thisM ? " now" : ""}" title="${esc(AM.plain(monthName(m.d)))} · ${esc(money(m.v, C))}"><span style="height:${Math.round(m.v / max * 100)}%"><i>${m.v ? esc(money(m.v, C)) : ""}</i></span><em>${esc(monthName(m.d))}</em></div>`).join("")}</div>
        </section>
        <section class="inc-card"><h5>${t("inc.bySvc")}</h5>
          ${svcRows.length ? `<ul class="hbars">${svcRows.map(([id, v]) => { const s = AM.svcById(id); return `<li style="--c:${s ? s.color : "var(--muted)"}"><span>${esc(s ? AM.title(s) : t("f.other"))}</span><b>${money(v, C)}</b><i style="width:${Math.round(v / svcMax * 100)}%"></i></li>`; }).join("")}</ul>` : `<p class="muted small">—</p>`}
        </section>
      </div>
      <section class="inc-card"><h5>${t("inc.recent")}</h5>
        <div class="pay-table">${recent.map(p => `
          <div class="pt-row"><span class="pay-date">${fmtDate(p.date)}</span><span class="pt-who"><b>${esc(p.r.name || "")}</b><small>${esc(fileNo(p.r.id))} · ${esc(svcName(p.r))}</small></span><span class="pay-m">${t("pay.m." + p.method)}</span><b class="pt-amt">${money(p.amount, p.currency)}</b><button type="button" class="linkbtn" data-goto="${esc(p.r.id)}">${t("inc.open")}</button></div>`).join("")}</div>
      </section>` : `<div class="dash-empty"><p>${t("inc.none")}</p></div>`}
      <section class="inc-card"><h5>${t("inc.unpaid")}</h5>
        ${owing.length ? `<div class="pay-table">${owing.map(x => `
          <div class="pt-row"><span class="pt-who"><b>${esc(x.r.name || "")}</b><small>${esc(fileNo(x.r.id))} · ${esc(svcName(x.r))}</small></span><span class="pt-prog"><i style="width:${Math.min(100, Math.round(x.paid / x.fee * 100))}%"></i></span><b class="pt-amt due">${money(x.bal, x.cur)}</b>
            <span class="pt-acts">${x.r.phone ? `<a class="linkbtn" target="_blank" rel="noopener" href="https://wa.me/${esc(String(x.r.phone).replace(/\D/g, ""))}?text=${encodeURIComponent(AM.plain(t("inc.remindMsg", { name: x.r.name || "", file: fileNo(x.r.id), amount: money(x.bal, x.cur) })))}">${t("inc.remind")}</a>` : ""}<button type="button" class="linkbtn" data-goto="${esc(x.r.id)}">${t("inc.open")}</button></span></div>`).join("")}</div>`
          : `<p class="muted small">${t("inc.allPaid")}</p>`}
      </section>
    </div>`;
  }
  function downloadCSV() {
    const q = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [["date", "file", "client", "service", "method", "amount", "currency", "note"].join(",")];
    rows.forEach(r => (r.payments || []).forEach(p => lines.push([p.date, fileNo(r.id), r.name, r.service, p.method, p.amount, p.currency, p.note].map(q).join(","))));
    const blob = new Blob(["\ufeff" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `al-marjaa-payments-${todayISO()}.csv`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 30000);
  }

  function card(r) {
    const s = svcOf(r), color = s ? s.color : "var(--em)";
    const icon = s ? (AM.ICONS[s.icon] || "") : AM.ICONS.register;
    const files = (r.inquiry_files || []).slice().sort((a, b) => (a.doc_index ?? 99) - (b.doc_index ?? 99) || String(a.created_at).localeCompare(String(b.created_at)));
    const sub = s && r.sub_index != null ? s.subs[r.sub_index] : null;
    const have = new Set(files.map(f => f.doc_index));
    const adminView = isAdmin() && scope === "all";
    const open = rows.length === 1 || r._open;

    const checklist = sub ? `<div class="inq-col"><h5>${t("dash.checklist")}</h5><ul class="check">${sub.docs.map((d, i) =>
      `<li class="${have.has(i) ? "ok" : ""}"><span></span>${esc(AM.doc(d))}</li>`).join("")}</ul></div>` : "";

    const fileRows = files.length ? `<ul class="files">${files.map(f => `
      <li><span class="f-ic">${f.doc_index != null ? AM.pad(f.doc_index + 1) : "+"}</span>
        <span class="f-txt"><b>${esc(AM.pick(f.label, f.label_ar))}</b><small>${esc(f.file_name || "")} · ${fmtSize(f.size || 0)} · ${fmtDate(f.created_at)}</small></span>
        <button type="button" class="linkbtn" data-file="${esc(f.id)}">${t("dash.open")}</button></li>`).join("")}</ul>`
      : `<p class="muted small">${t("dash.noFiles")}</p>`;

    const addOpts = (sub ? sub.docs.map((d, i) => `<option value="${i}">${AM.pad(i + 1)} — ${esc(AM.doc(d))}</option>`).join("") : "") +
      `<option value="extra">${t("extra.file")}</option>`;

    const adminBox = adminView ? `
      <div class="admin-box">
        <div class="admin-contact">
          <b>${t("dash.client")}: ${esc(r.name)}</b>
          ${r.phone ? `<a href="tel:${esc(r.phone.replace(/\s/g, ""))}" dir="ltr">${esc(r.phone)}</a>
          <a href="https://wa.me/${esc(r.phone.replace(/\D/g, ""))}" target="_blank" rel="noopener">WhatsApp</a>` : ""}
          ${r.email ? `<a href="mailto:${esc(r.email)}" dir="ltr">${esc(r.email)}</a>` : ""}
          ${r.folder_url ? `<a href="${esc(r.folder_url)}" target="_blank" rel="noopener">${t("dash.drive")}</a>` : ""}
        </div>
        <div class="row">
          <label class="field"><span>${t("dash.admin.status")}</span>
            <select data-status>${STATUSES.map(s => `<option value="${s}"${s === r.status ? " selected" : ""}>${statusLabel(s)}</option>`).join("")}</select></label>
          <label class="field"><span>${t("dash.admin.note")}</span><textarea rows="2" data-note dir="auto">${esc(r.status_note || "")}</textarea></label>
        </div>
        <button type="button" class="btn btn-small" data-save>${t("dash.admin.save")}</button>
        <p class="muted small">${t("dash.admin.emailHint")}</p>
        ${payBox(r)}
      </div>` : "";

    return `
    <article class="inq s-${r.status}${open ? " open" : ""}" style="--c:${color}" data-id="${esc(r.id)}">
      <button type="button" class="inq-head" aria-expanded="${open}">
        <span class="inq-icon">${icon}</span>
        <span class="inq-main">
          <b>${esc(svcName(r))}</b>
          <small>${adminView ? `${esc(r.name)} · ` : ""}${esc(txName(r) || "")} · ${t("dash.ref")} ${esc(fileNo(r.id))} · ${t("dash.sent", { date: fmtDate(r.created_at) })}</small>
        </span>
        ${adminView ? payPill(r) : ""}
        <span class="badge">${statusLabel(r.status)}</span>
        <span class="chev" aria-hidden="true"></span>
      </button>
      <div class="inq-body">
        ${stepper(r.status)}
        ${r.status_note ? `<div class="office-note"><h5>${t("dash.note")}</h5><p dir="auto">${esc(r.status_note)}</p><small>${t("dash.updated", { date: fmtDate(r.updated_at) })}</small></div>` : ""}
        ${r.status === "missing" ? `<p class="missing-hint">${t("dash.missingHint")}</p>` : ""}
        <div class="inq-cols">
          <div class="inq-col"><h5>${t("dash.files", { n: files.length })}</h5>${fileRows}
            <div class="add-docs">
              <select data-adddoc>${addOpts}</select>
              <label class="btn btn-ghost btn-small add-btn"><span>${t("dash.add")}</span><input type="file" multiple data-addfile accept=".pdf,.jpg,.jpeg,.png,.heic,.doc,.docx" /></label>
            </div>
          </div>
          ${checklist}
        </div>
        ${r.notes ? `<div class="client-note"><h5>${t("dash.yourNotes")}</h5><p dir="auto">${esc(r.notes)}</p></div>` : ""}
        ${adminBox}
      </div>
    </article>`;
  }

  // card interactions
  list.addEventListener("click", async e => {
    if (e.target.closest("[data-new]")) return $("#dNew").click();
    const head = e.target.closest(".inq-head");
    if (head) {
      const art = head.closest(".inq"), r = rows.find(x => x.id === art.dataset.id);
      art.classList.toggle("open"); r._open = art.classList.contains("open");
      head.setAttribute("aria-expanded", r._open);
      return;
    }
    const fileBtn = e.target.closest("[data-file]");
    if (fileBtn) {
      // open a placeholder tab right away (pop-up blockers), then fill it
      const w = window.open("", "_blank");
      fileBtn.classList.add("busy");
      try {
        const f = await api("file", { fileId: fileBtn.dataset.file });
        const bytes = Uint8Array.from(atob(f.data), c => c.charCodeAt(0));
        const url = URL.createObjectURL(new Blob([bytes], { type: f.type }));
        if (w) w.location = url;
        else { const a = document.createElement("a"); a.href = url; a.download = f.name; a.click(); }
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      } catch (err) { w && w.close(); AM.toast(errText(err), true); }
      fileBtn.classList.remove("busy");
      return;
    }
    if (e.target.closest("[data-csv]")) return downloadCSV();
    const cur = e.target.closest("[data-cur]");
    if (cur) { incCur = cur.dataset.cur; return renderIncome(); }
    const go = e.target.closest("[data-goto]");
    if (go) {
      const r = rows.find(x => x.id === go.dataset.goto); if (!r) return;
      scope = "all"; r._open = true; $("#dSearch").value = fileNo(r.id); paintHead(); render();
      const art = list.querySelector(`.inq[data-id="${CSS.escape(r.id)}"]`); art && art.scrollIntoView({ block: "start" });
      return;
    }
    const feeBtn = e.target.closest("[data-feesave]");
    if (feeBtn) {
      const art = feeBtn.closest(".inq"), r = rows.find(x => x.id === art.dataset.id);
      feeBtn.disabled = true;
      try {
        await api("feeSet", { id: r.id, fee: $("[data-fee]", art).value.trim(), currency: $("[data-feecur]", art).value });
        AM.toast(t("pay.feeSaved")); r._open = true; await load();
      } catch (err) { AM.toast(errText(err), true); feeBtn.disabled = false; }
      return;
    }
    const addBtn = e.target.closest("[data-payadd]");
    if (addBtn) {
      const art = addBtn.closest(".inq"), r = rows.find(x => x.id === art.dataset.id);
      const amount = parseFloat(String($("[data-pamount]", art).value).replace(",", "."));
      if (!(amount > 0)) { AM.toast(t("pay.badAmount"), true); $("[data-pamount]", art).focus(); return; }
      addBtn.disabled = true;
      try {
        await api("payAdd", { id: r.id, amount, currency: $("[data-pcur]", art).value, method: $("[data-pmethod]", art).value,
          date: $("[data-pdate]", art).value, note: $("[data-pnote]", art).value.trim() });
        AM.toast(t("pay.added")); r._open = true; await load();
      } catch (err) { AM.toast(errText(err), true); addBtn.disabled = false; }
      return;
    }
    const del = e.target.closest("[data-paydel]");
    if (del) {
      if (!del.classList.contains("armed")) {
        del.classList.add("armed"); del.textContent = AM.plain(t("pay.sure"));
        setTimeout(() => { if (del.isConnected) { del.classList.remove("armed"); del.textContent = "×"; } }, 3200);
        return;
      }
      const art = del.closest(".inq"), r = rows.find(x => x.id === art.dataset.id);
      del.disabled = true;
      try { await api("payDelete", { id: del.dataset.paydel }); AM.toast(t("pay.deleted")); r._open = true; await load(); }
      catch (err) { AM.toast(errText(err), true); del.disabled = false; }
      return;
    }
    const save = e.target.closest("[data-save]");
    if (save) {
      const art = save.closest(".inq");
      save.disabled = true;
      try {
        await api("update", { id: art.dataset.id, status: $("[data-status]", art).value, note: $("[data-note]", art).value.trim() });
        AM.toast(t("dash.admin.saved"));
        rows.find(x => x.id === art.dataset.id)._open = true;
        await load();
      } catch (err) { AM.toast(errText(err), true); save.disabled = false; }
    }
  });

  // add more documents to an existing inquiry
  list.addEventListener("change", async e => {
    const inp = e.target.closest("[data-addfile]");
    if (!inp || !inp.files.length) return;
    const art = inp.closest(".inq"), r = rows.find(x => x.id === art.dataset.id);
    const s = svcOf(r), sub = s && r.sub_index != null ? s.subs[r.sub_index] : null;
    const pick = $("[data-adddoc]", art).value;
    const docIndex = pick === "extra" ? null : +pick;
    const label = docIndex == null || !sub ? ["Extra file", "ملف إضافي"] : (Array.isArray(sub.docs[docIndex]) ? sub.docs[docIndex] : [sub.docs[docIndex], sub.docs[docIndex]]);
    const base = docIndex == null ? "Extra" : `${AM.pad(docIndex + 1)} - ${AM.safe(label[0]).slice(0, 60)}`;
    const items = [...inp.files].map((f, k) => ({ f, docIndex, label, name: docIndex == null ? `Extra - ${AM.safe(f.name)}` : `${base}${inp.files.length > 1 ? ` (${k + 1})` : ""}${AM.ext(f.name)}` }));
    const total = items.reduce((a, x) => a + x.f.size, 0) / 1048576;
    if (total > S.maxUploadMB) { inp.value = ""; return AM.toast(t("toast.big", { b: S.maxUploadMB }), true); }
    const btn = inp.closest(".add-btn"), lbl = $("span", btn);
    lbl.textContent = t("dash.adding"); btn.classList.add("busy");
    try {
      await api("addFiles", { inquiryId: r.id, files: await packFiles(items) });
      AM.toast(t("dash.added"));
      r._open = true;
      await load();
    } catch (err) {
      console.error(err); AM.toast(t("toast.fail"), true);
      lbl.textContent = t("dash.add"); btn.classList.remove("busy");
    }
  });

  // keep everything in the current language
  AM.onLang.push(() => {
    paintNav();
    setView(view, true);
    if (dash.classList.contains("open")) { paintHead(); render(); }
  });
  paintNav();
  prefill();
})();
