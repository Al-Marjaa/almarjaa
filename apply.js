/* =====================================================================
   START A FILE — one slide-in panel, available on every page.
   Opens in place (no trip to the home page), with the service and
   transaction already chosen when it is opened from a service.
     AM.openFile(serviceId?, transactionIndex?)
   Any link to index.html#apply / ?service=… and any [data-open-file]
   element opens it too.
   ===================================================================== */
(() => {
  const AM = window.AM; if (!AM) return;
  const S = AM.S, SV = AM.SV, t = AM.t, esc = AM.esc, pad = AM.pad;
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];

  /* ---------- markup ---------- */
  document.body.insertAdjacentHTML("beforeend", `
  <div class="fs" id="fileSheet" aria-hidden="true">
    <div class="fs-backdrop" data-fsclose></div>
    <aside class="fs-panel" role="dialog" aria-modal="true" aria-labelledby="fsTitle">
      <div class="fs-glow" aria-hidden="true"></div>
      <header class="fs-head">
        <div class="fs-seal" aria-hidden="true"><span class="logo-mark"></span></div>
        <div class="fs-titles"><p class="eyebrow" data-i18n="apply.eyebrow"></p><h3 id="fsTitle" data-i18n="apply.title"></h3></div>
        <button type="button" class="dash-x fs-x" data-fsclose aria-label="Close">×</button>
      </header>
      <div class="fs-chip" id="fsChip" hidden></div>
      <div class="fs-scroll">
        <p class="muted fs-sub" data-i18n="apply.sub"></p>
        <form id="inquiryForm" class="form fs-form" method="POST" enctype="multipart/form-data" novalidate>
          <input type="hidden" name="_subject" id="fSubject" value="New inquiry" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" id="fNext" />
          <input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" />
          <div class="fs-step"><span>01</span><b data-i18n="fs.s1"></b></div>
          <div class="row">
            <label class="field"><span data-i18n="f.service"></span><select name="Service" id="fService" required></select></label>
            <label class="field"><span data-i18n="f.tx"></span><select name="Transaction" id="fSub" required></select></label>
          </div>
          <div class="fs-step"><span>02</span><b data-i18n="fs.s2"></b></div>
          <div class="row">
            <label class="field"><span data-i18n="f.name"></span><input name="Name" required autocomplete="name" /></label>
            <label class="field"><span data-i18n="f.phone"></span><input name="Phone" type="tel" required autocomplete="tel" placeholder="+961…" dir="ltr" /></label>
          </div>
          <div class="row">
            <label class="field"><span data-i18n="f.email"></span><input name="email" type="email" autocomplete="email" dir="ltr" /></label>
            <label class="field"><span data-i18n="f.pref"></span>
              <select name="Preferred contact" id="fPref">
                <option value="WhatsApp" data-i18n="f.pref.wa"></option>
                <option value="Phone call" data-i18n="f.pref.call"></option>
                <option value="Email" data-i18n="f.pref.email"></option>
              </select>
            </label>
          </div>
          <div class="fs-step"><span>03</span><b data-i18n="fs.s3"></b></div>
          <div class="uploads" id="uploads"></div>
          <div class="field"><span data-i18n="f.extra"></span>
            <label class="drop" data-drop>
              <input type="file" name="attachment" id="extraFiles" multiple accept=".pdf,.jpg,.jpeg,.png,.heic,.doc,.docx" />
              <p data-i18n="drop"></p>
            </label>
          </div>
          <label class="field"><span data-i18n="f.notes"></span><textarea name="Message" rows="3" data-i18n-ph="f.notesPh"></textarea></label>
          <p class="disclaimer small muted" data-i18n="disclaimer"></p>
        </form>
      </div>
      <footer class="fs-foot">
        <div class="progress" id="progress" hidden><span></span></div>
        <div class="fs-foot-row">
          <p class="small muted" id="sizeInfo"></p>
          <button type="submit" form="inquiryForm" class="btn" id="submitBtn" data-i18n="f.send"></button>
        </div>
        <p class="small muted fs-chat"><span data-i18n="f.chat"></span> <a href="#" data-wa data-i18n="f.chatLink"></a></p>
      </footer>
    </aside>
  </div>`);

  const sheet = $("#fileSheet"), form = $("#inquiryForm"), fService = $("#fService"), fSub = $("#fSub"), extra = $("#extraFiles");
  const svc = () => AM.svcById(fService.value);
  const sub = () => { const s = svc(); return s ? (s.subs[+fSub.value] || s.subs[0]) : null; };

  /* ---------- open / close ---------- */
  let lastFocus = null;
  function openFile(id, i) {
    if (id && AM.svcById(id) && (id !== fService.value || (i != null && String(i) !== fSub.value))) preselect(id, i);
    window.Account && Account.prefill && Account.prefill();
    lastFocus = document.activeElement;
    sheet.classList.add("open"); sheet.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("fs-lock");
    setTimeout(() => { const f = svc() ? form.Name : fService; f && !f.value && f.focus({ preventScroll: true }); }, 450);
  }
  function closeFile() {
    sheet.classList.remove("open"); sheet.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("fs-lock");
    if (location.hash === "#apply") history.replaceState(null, "", location.pathname + location.search.replace(/[?&](service|sub)=[^&]*/g, "").replace(/^&/, "?"));
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }
  AM.openFile = openFile; AM.closeFile = closeFile;
  sheet.addEventListener("click", e => { if (e.target.closest("[data-fsclose]")) closeFile(); });
  addEventListener("keydown", e => {
    if (e.key !== "Escape" || !sheet.classList.contains("open")) return;
    if (document.querySelector(".modal.open")) return;          // the login window closes first
    closeFile();
  });

  // every "Start a file" link or button on any page opens the panel instead of leaving the page
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-open-file]");
    if (b) { e.preventDefault(); e.stopPropagation(); openFile(b.dataset.svc, b.dataset.sub != null && b.dataset.sub !== "" ? +b.dataset.sub : null); return; }
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (a.id === "navCta") return;                                // the account button keeps its own job
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.hash !== "#apply" || !/(\/|index\.html)$/.test(url.pathname)) return;
    e.preventDefault(); e.stopPropagation();
    const q = url.searchParams;
    openFile(q.get("service"), q.get("sub") != null ? +q.get("sub") : null);
  }, true);

  document.addEventListener("keydown", e => {
    const b = (e.key === "Enter" || e.key === " ") && e.target.closest && e.target.closest("[data-open-file]:not(button)");
    if (b) { e.preventDefault(); b.click(); }
  });

  /* ---------- the form ---------- */
  function fillServiceOptions() {
    const v = fService.value;
    fService.innerHTML = `<option value="" disabled ${v ? "" : "selected"}>${t("f.choose")}</option>` +
      SV.map(s => `<option value="${s.id}">${esc(AM.title(s))}</option>`).join("") +
      `<option value="other">${t("f.other")}</option>`;
    if (v) fService.value = v;
  }
  function fillSubs() {
    const v = fSub.value, s = svc();
    fSub.innerHTML = s
      ? s.subs.map((u, i) => `<option value="${i}">${esc(AM.subName(u))}</option>`).join("")
      : `<option value="other">${t("f.general")}</option>`;
    if (v && [...fSub.options].some(o => o.value === v)) fSub.value = v;
  }
  function renderChip() {
    const chip = $("#fsChip"), s = svc(), u = sub();
    sheet.style.setProperty("--c", s ? s.color : "var(--em)");
    if (!s) { chip.hidden = true; return; }
    chip.hidden = false;
    chip.innerHTML = `<span class="fs-chip-ic">${AM.ICONS[s.icon]}</span><span class="fs-chip-txt"><b>${esc(AM.subName(u))}</b><small>${esc(AM.title(s))} · ${t("common.docs", { n: u.docs.length })}</small></span>`;
  }
  function renderUploads() {
    const box = $("#uploads"), u = sub();
    renderChip();
    if (!u) { box.innerHTML = `<p class="muted small">${t(fService.value === "other" ? "cl.other" : "cl.empty")}</p>`; updateSize(); return; }
    box.innerHTML = `<p class="uploads-title">${t("up.title")}</p>` +
      u.docs.map((d, i) => `
        <label class="up" data-i="${i}" style="--i:${i}">
          <span class="up-ic">${i + 1}</span>
          <span class="up-txt"><span class="up-label">${esc(AM.doc(d))}</span><small>${t("up.hint")}</small></span>
          <input type="file" name="Document ${i + 1}" data-i="${i}" multiple accept=".pdf,.jpg,.jpeg,.png,.heic,.doc,.docx" />
        </label>`).join("");
    updateSize();
  }
  function relabelUploads() {
    const u = sub(); renderChip(); if (!u) { renderUploads(); return; }
    const ttl = $(".uploads-title"); if (ttl) ttl.textContent = t("up.title");
    $$(".up").forEach(up => {
      const i = +up.dataset.i, inp = $("input", up);
      $(".up-label", up).textContent = AM.doc(u.docs[i]);
      $("small", up).textContent = fileHint(inp);
    });
    dropHint();
  }
  const fileHint = inp => !inp.files.length ? t("up.hint") : inp.files.length === 1 ? inp.files[0].name : t("up.n", { n: inp.files.length });
  const dropHint = () => $("[data-drop] p").textContent = extra.files.length ? t("drop.n", { n: extra.files.length }) : t("drop");

  function preselect(id, i) {
    if (!AM.svcById(id)) return;
    fService.value = id; fSub.value = ""; fillSubs();
    if (i != null && fSub.options[i]) fSub.value = String(i);
    renderUploads();
  }

  fService.addEventListener("change", () => { fSub.value = ""; fillSubs(); renderUploads(); });
  fSub.addEventListener("change", renderUploads);
  form.addEventListener("change", e => {
    const inp = e.target;
    if (inp.type !== "file") return;
    const up = inp.closest(".up");
    if (up) {
      up.classList.toggle("has", inp.files.length > 0);
      $("small", up).textContent = fileHint(inp);
      $(".up-ic", up).textContent = inp.files.length ? "✓" : +up.dataset.i + 1;
    }
    if (inp === extra) dropHint();
    updateSize();
  });
  const drop = $("[data-drop]");
  ["dragenter", "dragover"].forEach(ev => drop.addEventListener(ev, () => drop.classList.add("over")));
  ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, () => drop.classList.remove("over")));

  const allFiles = () => $$("input[type=file]", form).flatMap(i => [...i.files]);
  const totalMB = () => allFiles().reduce((a, f) => a + f.size, 0) / 1048576;
  function updateSize() {
    const mb = totalMB(), el = $("#sizeInfo");
    el.textContent = t("f.size", { a: mb.toFixed(1), b: S.maxUploadMB });
    el.style.color = mb > S.maxUploadMB ? "#ff6b6b" : "";
  }
  const shortLabel = s => { s = AM.safe(s); return s.length > 60 ? s.slice(0, 60).replace(/\s+\S*$/, "") : s; };
  function collectFiles() {
    const u = sub(), list = [];
    $$(".up input", form).forEach(inp => {
      const i = +inp.dataset.i;
      const label = u ? shortLabel(AM.docEn(u.docs[i])) : "Document";
      [...inp.files].forEach((f, k) => list.push({ f, docIndex: i, label: u ? u.docs[i] : ["Document", "مستند"],
        name: `${pad(i + 1)} - ${label}${inp.files.length > 1 ? ` (${k + 1})` : ""}${AM.ext(f.name)}` }));
    });
    [...extra.files].forEach(f => list.push({ f, docIndex: null, label: ["Extra file", "ملف إضافي"], name: `Extra - ${AM.safe(f.name)}` }));
    return list;
  }

  form.addEventListener("submit", async e => {
    if (!form.reportValidity()) { e.preventDefault(); return; }
    if (totalMB() > S.maxUploadMB) { e.preventDefault(); return AM.toast(t("toast.big", { b: S.maxUploadMB }), true); }
    const s = svc(), u = sub();
    const svcEn = s ? s.title : "Other";
    const subEn = u ? u.name : "General inquiry";
    const useAccount = !!(window.Account && Account.enabled);

    // fallback until the Google script is connected: email via FormSubmit
    if (!useAccount) {
      $("#fSubject").value = `New inquiry: ${svcEn} — ${subEn} (${form.Name.value})`;
      fService.options[fService.selectedIndex].value = svcEn;
      fSub.options[fSub.selectedIndex].value = subEn;
      $("#fNext").value = location.origin + location.pathname + "?sent=1";
      form.action = `https://formsubmit.co/${S.email}`;
      setBusy(true);
      return;
    }
    e.preventDefault();
    if (form._honey.value) return;
    let user;
    try { user = await Account.requireUser(); } catch { return; }
    const meta = {
      name: form.Name.value.trim(), phone: form.Phone.value.trim(),
      email: form.email.value.trim() || (user && user.email) || "",
      contact: $("#fPref").value,
      service: svcEn, serviceAr: s ? s.ar : "", serviceId: s ? s.id : "other",
      transaction: subEn, transactionAr: u ? u.ar : "", subIndex: s ? +fSub.value : null,
      notes: form.Message.value.trim(), lang: AM.lang(), account: user ? user.email : ""
    };
    const list = collectFiles();
    setBusy(true);
    try {
      await Account.saveInquiry(meta, list, progress);
      progress(100);
      AM.toast(t("toast.okAccount"));
      resetForm();
      closeFile();
      Account.openDashboard();
    } catch (err) {
      console.error(err);
      AM.toast(t("toast.fail"), true);
    } finally { setBusy(false); }
  });
  function setBusy(b) {
    const btn = $("#submitBtn");
    btn.disabled = b;
    btn.textContent = t(b ? "f.sending" : "f.send");
    $("#progress").hidden = !b || !(window.Account && Account.enabled);
    if (!b) progress(0);
  }
  const progress = p => $("#progress span").style.width = p + "%";
  function resetForm() {
    form.reset();
    fService.value = ""; fillServiceOptions(); fillSubs(); renderUploads(); dropHint(); updateSize();
    window.Account && Account.prefill && Account.prefill();
  }

  /* ---------- language + first render ---------- */
  AM.onLang.push(() => {
    fillServiceOptions(); fillSubs(); relabelUploads(); updateSize();
    if (!$("#submitBtn").disabled) $("#submitBtn").textContent = t("f.send");
  });
  fillServiceOptions(); fillSubs(); renderUploads();

  // old links (index.html?service=…&sub=…#apply) and the e-mail fallback's return
  document.addEventListener("DOMContentLoaded", () => {
    const q = AM.qs("service");
    if (q || location.hash === "#apply") setTimeout(() => openFile(q, AM.qs("sub") != null ? +AM.qs("sub") : null), AM.page === "home" ? 700 : 150);
    if (AM.qs("sent")) {
      setTimeout(() => AM.toast(t("toast.ok")), 900);
      history.replaceState(null, "", location.pathname);
    }
  });
})();
