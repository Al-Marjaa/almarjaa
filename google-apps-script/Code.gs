/**
 * =====================================================================
 *  Al Marjaa — Google-only backend
 *  Accounts + uploads + tracking, using only your Google account:
 *    • Google Drive  → Al Marjaa — Client Files / <Client Name> / <Service> / files
 *    • Google Sheet  → "Al Marjaa — Tracking" (Inquiries, Files, Users tabs)
 *    • Gmail         → notifications + password-reset codes
 *    • Payments      → fee agreed + money received per file (Payments tab), office only
 *    • News          → your own posts (News tab) + headlines read every hour
 *                      from the Presidency of the Council of Ministers (PCM tab)
 *
 *  Setup (details in README):
 *    1. Paste this file into script.google.com (signed in as the office account)
 *    2. Run  setup  once and allow the permissions
 *    3. Deploy → New deployment → Web app → Execute as: Me, Access: Anyone
 *    4. Paste the /exec URL into data.js → googleScriptUrl
 * =====================================================================
 */

const CONFIG = {
  SITE_NAME: "Al Marjaa",
  ROOT_FOLDER_NAME: "Al Marjaa — Client Files",
  SHEET_NAME: "Al Marjaa — Tracking",
  OFFICE_EMAIL: "oliviadiaasayah@gmail.com",   // gets notifications; becomes admin when it signs up
  TIME_ZONE: "Asia/Beirut",
  SESSION_DAYS: 30,
  EMAIL_CLIENT_ON_STATUS_CHANGE: true
};

// Official news: the listing page read every hour (headlines + links only)
const PCM = {
  URL: "https://www.pcm.gov.lb/arabic/listingandpdf.aspx?pageid=21173",
  NAME_AR: "رئاسة مجلس الوزراء",
  KEEP: 80,          // rows kept in the PCM tab
  SHOW: 30,          // newest published rows sent to the website
  TRANSLATE: true    // add English + French titles with Google Translate
};

const STATUSES = ["received", "review", "missing", "progress", "ready", "completed", "cancelled"];
const STATUS_TEXT = {
  received:  ["Received", "تم الاستلام"],
  review:    ["Under review", "قيد المراجعة"],
  missing:   ["Missing documents", "مستندات ناقصة"],
  progress:  ["In progress", "قيد التنفيذ"],
  ready:     ["Ready for pickup", "جاهز للاستلام"],
  completed: ["Completed", "مُنجز"],
  cancelled: ["Cancelled", "ملغى"]
};
const INQ_COLS  = ["id", "created_at", "updated_at", "status", "status_note", "name", "phone", "email", "contact",
                   "service", "service_ar", "service_id", "transaction", "transaction_ar", "sub_index", "notes",
                   "user_id", "folder_id", "folder_url", "fee", "fee_currency"];
// money received for each file (office only)
const PAY_COLS  = ["id", "inquiry_id", "date", "amount", "currency", "method", "note", "client", "service", "created_at", "created_by"];
const PAY_METHODS = ["cash", "transfer", "omt", "whish", "card", "cheque", "other"];
const CURRENCIES = ["USD", "LBP"];
const FILE_COLS = ["id", "inquiry_id", "user_id", "doc_index", "label", "label_ar", "file_name", "file_id", "size", "created_at"];
const NEWS_COLS = ["id", "date", "category", "service_id", "title", "title_ar", "summary", "summary_ar",
                   "body", "body_ar", "source_name", "source_url", "published", "image",
                   "title_fr", "summary_fr", "body_fr"];
const PCM_COLS  = ["id", "date", "title_ar", "title_en", "title_fr", "url", "image", "fetched_at", "published"];
const USER_COLS = ["id", "email", "name", "phone", "role", "created_at", "last_login", "salt", "hash"];

/* =====================================================================
   ONE-TIME SETUP — run this from the editor
   ===================================================================== */
function setup() {
  const props = PropertiesService.getScriptProperties();
  const root = rootFolder_();
  let ss = null;
  const id = props.getProperty("SHEET_ID");
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
  if (!ss) {
    ss = SpreadsheetApp.create(CONFIG.SHEET_NAME);
    DriveApp.getFileById(ss.getId()).moveTo(root);
    props.setProperty("SHEET_ID", ss.getId());
  }
  ensureSheet_(ss, "Inquiries", INQ_COLS);
  ensureSheet_(ss, "Files", FILE_COLS);
  ensureSheet_(ss, "Users", USER_COLS);
  const paySh = ensureSheet_(ss, "Payments", PAY_COLS);
  const prow = Math.max(paySh.getMaxRows() - 1, 1);
  paySh.getRange(2, PAY_COLS.indexOf("currency") + 1, prow, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(CURRENCIES, true).build());
  paySh.getRange(2, PAY_COLS.indexOf("method") + 1, prow, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(PAY_METHODS, true).build());
  paySh.setColumnWidth(PAY_COLS.indexOf("note") + 1, 260);
  const newsSh = ensureSheet_(ss, "News", NEWS_COLS);
  const nrows = Math.max(newsSh.getMaxRows() - 1, 1);
  newsSh.getRange(2, NEWS_COLS.indexOf("category") + 1, nrows, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(["news", "guide", "announcement"], true).build());
  newsSh.getRange(2, NEWS_COLS.indexOf("published") + 1, nrows, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
  ["body", "body_ar", "summary", "summary_ar"].forEach(c => newsSh.setColumnWidth(NEWS_COLS.indexOf(c) + 1, 320));
  const pcmSh = ensureSheet_(ss, "PCM", PCM_COLS);
  pcmSh.getRange(2, PCM_COLS.indexOf("published") + 1, Math.max(pcmSh.getMaxRows() - 1, 1), 1)
    .setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
  ["title_ar", "title_en", "title_fr"].forEach(c => pcmSh.setColumnWidth(PCM_COLS.indexOf(c) + 1, 340));
  const def = ss.getSheetByName("Sheet1"); if (def && ss.getSheets().length > 1) ss.deleteSheet(def);

  // status dropdown + colours on the Inquiries tab
  const inq = ss.getSheetByName("Inquiries");
  const sc = INQ_COLS.indexOf("status") + 1;
  const range = inq.getRange(2, sc, Math.max(inq.getMaxRows() - 1, 1), 1);
  range.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build());
  const colours = { received: "#dbeafe", review: "#ede9fe", missing: "#ffedd5", progress: "#d1fae5", ready: "#fef3c7", completed: "#dcfce7", cancelled: "#e5e7eb" };
  inq.setConditionalFormatRules(STATUSES.map(s =>
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(s).setBackground(colours[s]).setRanges([range]).build()));
  inq.setColumnWidth(INQ_COLS.indexOf("status_note") + 1, 320);
  // hide technical columns from day-to-day view
  ["user_id", "folder_id"].forEach(c => inq.hideColumns(INQ_COLS.indexOf(c) + 1));
  const users = ss.getSheetByName("Users");
  ["salt", "hash"].forEach(c => users.hideColumns(USER_COLS.indexOf(c) + 1));

  if (!props.getProperty("PEPPER")) props.setProperty("PEPPER", Utilities.getUuid() + Utilities.getUuid());

  // when you edit a status in the sheet: stamp the update time (+ email the client)
  if (!ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === "onSheetEdit")) {
    ScriptApp.newTrigger("onSheetEdit").forSpreadsheet(ss).onEdit().create();
  }
  // read the official news every hour
  if (!ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === "refreshPcm")) {
    ScriptApp.newTrigger("refreshPcm").timeBased().everyHours(1).create();
  }
  try { const r = refreshPcm(); Logger.log("Official news: " + r.found + " headlines found, " + r.added + " new."); }
  catch (e) { Logger.log("Official news could not be read yet: " + e); }
  MailApp.getRemainingDailyQuota();   // asks for the Gmail permission now
  Logger.log("Ready. Tracking sheet: " + ss.getUrl());
  Logger.log("Drive folder: " + root.getUrl());
}

/* =====================================================================
   WEB API
   ===================================================================== */
function doGet() { return out_({ ok: true, message: CONFIG.SITE_NAME + " API is running." }); }

function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (x) { return out_({ ok: false, error: "bad_request" }); }
  try {
    const fn = ACTIONS[d.action];
    if (!fn) throw fail_("unknown_action");
    return out_(Object.assign({ ok: true }, fn(d) || {}));
  } catch (err) {
    console.error(err);
    return out_({ ok: false, error: err.code || "server", message: String(err.message || err) });
  }
}

const ACTIONS = {
  /* ---------- accounts ---------- */
  signup(d) {
    const email = cleanEmail_(d.email), name = String(d.name || "").trim(), phone = String(d.phone || "").trim();
    if (!email) throw fail_("email");
    if (String(d.password || "").length < 8) throw fail_("short");
    return withLock_(() => {
      if (findUser_(email)) throw fail_("exists");
      const salt = Utilities.getUuid();
      const user = {
        id: Utilities.getUuid(), email, name: name || email.split("@")[0], phone,
        role: email === CONFIG.OFFICE_EMAIL.toLowerCase() ? "admin" : "client",
        created_at: new Date(), last_login: new Date(), salt, hash: hash_(d.password, salt)
      };
      append_("Users", user);
      return { token: newSession_(user.id), user: publicUser_(user) };
    });
  },

  login(d) {
    const email = cleanEmail_(d.email);
    const cache = CacheService.getScriptCache(), key = "fail_" + email;
    if (+(cache.get(key) || 0) >= 8) throw fail_("many");
    const u = findUser_(email);
    if (!u || hash_(String(d.password || ""), u.salt) !== u.hash) {
      cache.put(key, String(+(cache.get(key) || 0) + 1), 900);
      throw fail_("invalid");
    }
    cache.remove(key);
    update_("Users", u._row, { last_login: new Date() });
    cleanupSessions_();
    return { token: newSession_(u.id), user: publicUser_(u) };
  },

  me(d) { return { user: publicUser_(auth_(d.token)) }; },

  logout(d) {
    if (d.token) PropertiesService.getScriptProperties().deleteProperty(sessKey_(d.token));
    return {};
  },

  forgot(d) {
    const email = cleanEmail_(d.email), u = findUser_(email);
    if (u) {   // same answer either way, so nobody can test which emails have accounts
      const code = String(Math.floor(100000 + Math.random() * 900000));
      CacheService.getScriptCache().put("reset_" + email, JSON.stringify({ code, tries: 0 }), 1800);
      MailApp.sendEmail({
        to: email, name: CONFIG.SITE_NAME,
        subject: CONFIG.SITE_NAME + " — password code / رمز كلمة المرور: " + code,
        body: "Your password reset code is: " + code + "\nIt expires in 30 minutes.\n\n" +
              "رمز إعادة تعيين كلمة المرور: " + code + "\nصالح لمدة 30 دقيقة.\n\n" +
              "If you didn't ask for this, ignore this email."
      });
    }
    return {};
  },

  reset(d) {
    const email = cleanEmail_(d.email), cache = CacheService.getScriptCache(), key = "reset_" + email;
    const rec = JSON.parse(cache.get(key) || "null");
    if (!rec || rec.tries >= 5) throw fail_("code");
    if (String(d.code || "").trim() !== rec.code) { rec.tries++; cache.put(key, JSON.stringify(rec), 1800); throw fail_("code"); }
    if (String(d.password || "").length < 8) throw fail_("short");
    const u = findUser_(email); if (!u) throw fail_("code");
    const salt = Utilities.getUuid();
    update_("Users", u._row, { salt, hash: hash_(d.password, salt), last_login: new Date() });
    cache.remove(key);
    return { token: newSession_(u.id), user: publicUser_(u) };
  },

  /* ---------- public: news rows from the "News" tab ---------- */
  news() {
    const all = rows_("News");
    const items = all.filter(r => truthy_(r.published) && (r.title || r.title_ar)).map(r => newsOut_(r));
    const hidden = all.filter(r => !truthy_(r.published)).map(r => String(r.id));   // hides built-in posts too
    return { items, hidden, pcm: pcmOut_() };
  },

  /* ---------- office: write news from the website ---------- */
  newsAll(d) {
    admin_(d.token);
    ensureSheet_(sheet_(), "News", NEWS_COLS);
    return { items: rows_("News").map(r => newsOut_(r, true)) };
  },

  newsSave(d) {
    admin_(d.token);
    const p = d.post || {};
    const txt = v => String(v == null ? "" : v).trim();
    if (!txt(p.title) && !txt(p.titleAr) && !txt(p.titleFr)) throw fail_("missing_fields");
    return withLock_(() => {
      ensureSheet_(sheet_(), "News", NEWS_COLS);
      const all = rows_("News");
      let id = slug_(p.id);
      if (!id) {
        const base = (slug_(p.title) || slug_(p.titleFr)).slice(0, 48) || "post";
        id = base; let n = 2;
        while (all.some(r => String(r.id) === id)) id = base + "-" + n++;
      }
      const existing = all.find(r => String(r.id) === id);
      let image = /^https:\/\//.test(txt(p.image)) ? txt(p.image) : "";
      if (p.imageData) image = saveNewsImage_(p.imageData, p.imageType, id);
      const paras = a => (Array.isArray(a) ? a : String(a || "").split(/\n\s*\n/)).map(txt).filter(Boolean).join("\n\n");
      const row = {
        id, date: /^\d{4}-\d{2}-\d{2}$/.test(txt(p.date)) ? txt(p.date) : today_(),
        category: ["news", "guide", "announcement"].indexOf(p.category) >= 0 ? p.category : "news",
        service_id: txt(p.service), title: txt(p.title), title_ar: txt(p.titleAr),
        summary: txt(p.summary), summary_ar: txt(p.summaryAr), body: paras(p.body), body_ar: paras(p.bodyAr),
        title_fr: txt(p.titleFr), summary_fr: txt(p.summaryFr), body_fr: paras(p.bodyFr),
        source_name: txt(p.sourceName), source_url: /^https?:\/\//.test(txt(p.sourceUrl)) ? txt(p.sourceUrl) : "",
        published: !!p.published, image
      };
      if (existing) update_("News", existing._row, row); else append_("News", row);
      return { item: newsOut_(row, true) };
    });
  },

  newsDelete(d) {
    admin_(d.token);
    return withLock_(() => {
      const r = rows_("News").find(x => String(x.id) === String(d.id));
      if (!r) throw fail_("not_found");
      sheet_().getSheetByName("News").deleteRow(r._row);
      return {};
    });
  },

  /* ---------- inquiries ---------- */
  submit(d) {
    const u = auth_(d.token);
    if (!d.service) throw fail_("missing_fields");
    return withLock_(() => {
      const clientName = clean_(d.name) || clean_(u.name) || "Client";
      const folder = sub_(sub_(rootFolder_(), clientName), clean_(d.service) || "Other");
      const id = newInquiryId_();
      const now = new Date();
      append_("Inquiries", {
        id, created_at: now, updated_at: now, status: "received", status_note: "",
        name: d.name || u.name, phone: d.phone || u.phone, email: d.email || u.email, contact: d.contact || "",
        service: d.service, service_ar: d.serviceAr || "", service_id: d.serviceId || "",
        transaction: d.transaction || "", transaction_ar: d.transactionAr || "",
        sub_index: d.subIndex == null ? "" : d.subIndex, notes: d.notes || "",
        user_id: u.id, folder_id: folder.getId(), folder_url: folder.getUrl()
      });
      const saved = saveFiles_(folder, d.files || [], id, u.id);
      writeDetails_(folder, id, d, saved);
      notifyOffice_("New file " + id + ": " + (d.name || u.name) + " — " + d.service + " / " + (d.transaction || ""),
        [ "Client: " + (d.name || u.name), "Phone: " + (d.phone || ""), "Email: " + (d.email || u.email),
          "Prefers: " + (d.contact || ""), "Service: " + d.service + " — " + (d.transaction || ""),
          "", "Notes:", d.notes || "-", "", "Files (" + saved.length + "):" ]
          .concat(saved.map(f => " • " + f.file_name)).concat(["", "Folder: " + folder.getUrl(), "Tracking sheet: " + sheet_().getUrl()]).join("\n"),
        d.email || u.email);
      return { id };
    });
  },

  addFiles(d) {
    const u = auth_(d.token);
    return withLock_(() => {
      const inq = findInquiry_(d.inquiryId);
      if (!inq) throw fail_("not_found");
      if (inq.user_id !== u.id && u.role !== "admin") throw fail_("forbidden");
      const folder = DriveApp.getFolderById(inq.folder_id);
      const saved = saveFiles_(folder, d.files || [], inq.id, inq.user_id);
      const patch = { updated_at: new Date() };
      if (inq.status === "missing" && u.role !== "admin") patch.status = "review";
      update_("Inquiries", inq._row, patch);
      if (u.role !== "admin") notifyOffice_("Documents added to " + inq.id + " — " + inq.name,
        "The client added " + saved.length + " document(s):\n" + saved.map(f => " • " + f.file_name).join("\n") +
        "\n\nFolder: " + inq.folder_url, inq.email);
      return { added: saved.length };
    });
  },

  list(d) {
    const u = auth_(d.token);
    const all = d.scope === "all" && u.role === "admin";
    const inqs = rows_("Inquiries").filter(r => all || r.user_id === u.id);
    const ids = {}; inqs.forEach(r => ids[r.id] = true);
    const files = rows_("Files").filter(f => ids[f.inquiry_id]);
    const admin = u.role === "admin";
    const pays = admin ? payRows_().filter(p => ids[p.inquiry_id]) : [];
    const out = inqs.map(r => ({
      id: r.id, created_at: iso_(r.created_at), updated_at: iso_(r.updated_at),
      status: STATUSES.indexOf(r.status) >= 0 ? r.status : "received", status_note: r.status_note,
      name: r.name, phone: String(r.phone || ""), email: r.email, contact: r.contact,
      service: r.service, service_ar: r.service_ar, service_id: r.service_id,
      transaction: r.transaction, transaction_ar: r.transaction_ar,
      sub_index: r.sub_index === "" ? null : +r.sub_index, notes: r.notes,
      folder_url: admin ? r.folder_url : undefined,
      fee: admin && r.fee !== "" && r.fee != null ? +r.fee || 0 : null,
      fee_currency: admin ? (CURRENCIES.indexOf(String(r.fee_currency)) >= 0 ? String(r.fee_currency) : "USD") : undefined,
      payments: admin ? pays.filter(p => p.inquiry_id === r.id) : undefined,
      inquiry_files: files.filter(f => f.inquiry_id === r.id).map(f => ({
        id: f.id, doc_index: f.doc_index === "" ? null : +f.doc_index, label: f.label, label_ar: f.label_ar,
        file_name: f.file_name, size: +f.size || 0, created_at: iso_(f.created_at)
      }))
    })).sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
    return { rows: out };
  },

  /* ---------- office: fees and payments ---------- */
  feeSet(d) {
    admin_(d.token);
    return withLock_(() => {
      ensureSheet_(sheet_(), "Inquiries", INQ_COLS);
      const inq = findInquiry_(d.id); if (!inq) throw fail_("not_found");
      const fee = d.fee === "" || d.fee == null ? "" : Math.max(0, +d.fee || 0);
      update_("Inquiries", inq._row, { fee: fee, fee_currency: CURRENCIES.indexOf(d.currency) >= 0 ? d.currency : "USD" });
      return {};
    });
  },

  payAdd(d) {
    const u = admin_(d.token);
    const amount = Math.round((+d.amount || 0) * 100) / 100;
    if (!(amount > 0)) throw fail_("missing_fields");
    return withLock_(() => {
      ensureSheet_(sheet_(), "Payments", PAY_COLS);
      const inq = findInquiry_(d.id); if (!inq) throw fail_("not_found");
      const row = {
        id: "PAY-" + Utilities.getUuid().replace(/-/g, "").slice(0, 8).toUpperCase(), inquiry_id: inq.id,
        date: /^\d{4}-\d{2}-\d{2}$/.test(String(d.date || "")) ? d.date : today_(),
        amount: amount, currency: CURRENCIES.indexOf(d.currency) >= 0 ? d.currency : "USD",
        method: PAY_METHODS.indexOf(d.method) >= 0 ? d.method : "cash", note: String(d.note || "").slice(0, 300),
        client: inq.name, service: inq.service, created_at: new Date(), created_by: u.email
      };
      append_("Payments", row);
      return { payment: payOut_(row) };
    });
  },

  payDelete(d) {
    admin_(d.token);
    return withLock_(() => {
      const p = rows_("Payments").find(x => String(x.id) === String(d.id));
      if (!p) throw fail_("not_found");
      sheet_().getSheetByName("Payments").deleteRow(p._row);
      return {};
    });
  },

  update(d) {
    const u = auth_(d.token);
    if (u.role !== "admin") throw fail_("forbidden");
    if (STATUSES.indexOf(d.status) < 0) throw fail_("missing_fields");
    return withLock_(() => {
      const inq = findInquiry_(d.id); if (!inq) throw fail_("not_found");
      update_("Inquiries", inq._row, { status: d.status, status_note: d.note || "", updated_at: new Date() });
      if (d.status !== inq.status || (d.note || "") !== String(inq.status_note || "")) emailClient_(Object.assign({}, inq, { status: d.status, status_note: d.note || "" }));
      return {};
    });
  },

  file(d) {
    const u = auth_(d.token);
    const f = rows_("Files").find(x => x.id === d.fileId);
    if (!f) throw fail_("not_found");
    if (f.user_id !== u.id && u.role !== "admin") throw fail_("forbidden");
    const blob = DriveApp.getFileById(f.file_id).getBlob();
    return { name: f.file_name, type: blob.getContentType(), data: Utilities.base64Encode(blob.getBytes()) };
  }
};

/* =====================================================================
   SHEET EDITS (installed by setup): stamp time + tell the client
   ===================================================================== */
function onSheetEdit(e) {
  try {
    const sh = e.range.getSheet();
    if (sh.getName() !== "Inquiries" || e.range.getRow() < 2) return;
    const col = e.range.getColumn();
    const sCol = INQ_COLS.indexOf("status") + 1, nCol = INQ_COLS.indexOf("status_note") + 1;
    if (col !== sCol && col !== nCol) return;
    const row = e.range.getRow();
    sh.getRange(row, INQ_COLS.indexOf("updated_at") + 1).setValue(new Date());
    if (col === sCol) {
      const vals = sh.getRange(row, 1, 1, INQ_COLS.length).getValues()[0];
      const inq = {}; INQ_COLS.forEach((c, i) => inq[c] = vals[i]);
      emailClient_(inq);
    }
  } catch (err) { console.error(err); }
}

/* =====================================================================
   HELPERS
   ===================================================================== */
function out_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function fail_(code) { const e = new Error(code); e.code = code; return e; }
function withLock_(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try { return fn(); } finally { lock.releaseLock(); }
}
function clean_(s) { return String(s || "").replace(/[\\\/:*?"<>|#%]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 120); }
function cleanEmail_(s) { s = String(s || "").trim().toLowerCase(); return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : ""; }
function iso_(v) { return v instanceof Date ? v.toISOString() : (v ? new Date(v).toISOString() : ""); }

function rootFolder_() { return sub_(DriveApp.getRootFolder(), CONFIG.ROOT_FOLDER_NAME); }
function sub_(parent, name) { const it = parent.getFoldersByName(name); return it.hasNext() ? it.next() : parent.createFolder(name); }

/* =====================================================================
   OFFICIAL NEWS — Presidency of the Council of Ministers
   refreshPcm runs every hour (installed by setup). It reads the listing
   page, keeps dated headlines + links, adds English / French titles and
   stores them in the PCM tab. Untick "published" to hide a headline.
   Run testPcm from the editor to see what the reader finds right now.
   ===================================================================== */
function refreshPcm() {
  const res = UrlFetchApp.fetch(PCM.URL, { muteHttpExceptions: true, followRedirects: true,
    headers: { "User-Agent": "Mozilla/5.0 (compatible; AlMarjaaNews/1.0; hourly headline reader)" } });
  if (res.getResponseCode() !== 200) throw new Error("PCM page answered " + res.getResponseCode());
  const found = parsePcm_(res.getContentText("UTF-8"), PCM.URL);
  return withLock_(() => {
    const sh = ensureSheet_(sheet_(), "PCM", PCM_COLS);
    const have = {}; rows_("PCM").forEach(r => have[String(r.url)] = true);
    let added = 0;
    found.slice().reverse().forEach(it => {               // oldest first, so the newest ends at the bottom
      if (have[it.url]) return;
      let en = "", fr = "";
      if (PCM.TRANSLATE) {
        try { en = LanguageApp.translate(it.title, "ar", "en"); } catch (e) {}
        try { fr = LanguageApp.translate(it.title, "ar", "fr"); } catch (e) {}
      }
      append_("PCM", { id: "pcm-" + hashId_(it.url), date: it.date || today_(), title_ar: it.title, title_en: en, title_fr: fr,
        url: it.url, image: it.image || "", fetched_at: new Date(), published: true });
      have[it.url] = true; added++;
    });
    // keep the tab short: drop the oldest rows beyond PCM.KEEP
    const extra = sh.getLastRow() - 1 - PCM.KEEP;
    if (extra > 0) sh.deleteRows(2, extra);
    return { found: found.length, added };
  });
}

function testPcm() {
  const res = UrlFetchApp.fetch(PCM.URL, { muteHttpExceptions: true, followRedirects: true });
  Logger.log("HTTP " + res.getResponseCode() + ", " + res.getContentText("UTF-8").length + " characters");
  const items = parsePcm_(res.getContentText("UTF-8"), PCM.URL);
  Logger.log(items.length + " headlines found. First 10:");
  items.slice(0, 10).forEach((it, i) => Logger.log((i + 1) + ". [" + (it.date || "no date") + "] " + it.title + "\n    " + it.url));
}

function pcmOut_() {
  let rows = [];
  try { rows = rows_("PCM"); } catch (e) { return []; }
  return rows.filter(r => truthy_(r.published) && r.title_ar && r.url).map(r => ({
    id: String(r.id), date: r.date instanceof Date ? Utilities.formatDate(r.date, CONFIG.TIME_ZONE, "yyyy-MM-dd").slice(0, 10) : String(r.date || "").slice(0, 10),
    titleAr: String(r.title_ar), title: String(r.title_en || ""), titleFr: String(r.title_fr || ""),
    url: String(r.url), image: /^https:\/\//.test(String(r.image || "")) ? String(r.image) : ""
  })).sort((a, b) => b.date.localeCompare(a.date)).slice(0, PCM.SHOW);
}

/* Reads any listing page: finds links whose text is an Arabic headline,
   the date printed next to each one, and a picture if there is one. */
function parsePcm_(html, pageUrl) {
  const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
  html = String(html).replace(/[٠-٩]/g, d => String(AR_DIGITS.indexOf(d)))
    .replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ");
  const decode = t => t.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
  const text = h => decode(h.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  const months = { "كانون الثاني": 1, "شباط": 2, "آذار": 3, "اذار": 3, "نيسان": 4, "أيار": 5, "ايار": 5, "حزيران": 6, "تموز": 7, "آب": 8, "اب": 8,
    "أيلول": 9, "ايلول": 9, "تشرين الأول": 10, "تشرين الاول": 10, "تشرين الثاني": 11, "كانون الأول": 12, "كانون الاول": 12,
    "يناير": 1, "فبراير": 2, "مارس": 3, "أبريل": 4, "ابريل": 4, "مايو": 5, "يونيو": 6, "يوليو": 7, "أغسطس": 8, "اغسطس": 8, "سبتمبر": 9, "أكتوبر": 10, "اكتوبر": 10, "نوفمبر": 11, "ديسمبر": 12 };
  const pad2 = n => ("0" + n).slice(-2);
  const ok = (y, m, d) => y > 1990 && y < 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31 ? y + "-" + pad2(m) + "-" + pad2(d) : "";
  const monthRe = Object.keys(months).sort((a, b) => b.length - a.length).join("|");
  function dates(t) {
    const out = [];
    let m; const r1 = /(\d{1,2})\s*[\/.\-]\s*(\d{1,2})\s*[\/.\-]\s*(\d{4})/g, r2 = /(\d{4})\s*[\/.\-]\s*(\d{1,2})\s*[\/.\-]\s*(\d{1,2})/g,
      r3 = new RegExp("(\\d{1,2})\\s+(" + monthRe + ")\\s+(\\d{4})", "g");
    while ((m = r1.exec(t))) { const v = ok(+m[3], +m[2], +m[1]); if (v) out.push({ i: m.index, n: m[0].length, v }); }
    while ((m = r2.exec(t))) { const v = ok(+m[1], +m[2], +m[3]); if (v) out.push({ i: m.index, n: m[0].length, v }); }
    while ((m = r3.exec(t))) { const v = ok(+m[3], months[m[2]], +m[1]); if (v) out.push({ i: m.index, n: m[0].length, v }); }
    return out;
  }
  function abs(href) {
    href = decode(href.trim());
    if (/^https?:\/\//i.test(href)) return href;
    if (href.indexOf("//") === 0) return "https:" + href;
    const origin = pageUrl.match(/^https?:\/\/[^\/]+/)[0];
    if (href.charAt(0) === "/") return origin + href;
    if (href.charAt(0) === "?") return pageUrl.split("?")[0] + href;
    const dir = pageUrl.split("?")[0].replace(/[^\/]*$/, "");
    let u = dir + href; while (/\/[^\/]+\/\.\.\//.test(u)) u = u.replace(/\/[^\/]+\/\.\.\//, "/");
    return u.replace(/\/\.\//g, "/");
  }
  // 1) every link whose text is an Arabic headline
  const cands = [];
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const hm = m[1].match(/href\s*=\s*["']([^"']+)["']/i);
    if (!hm || /^(#|javascript:|mailto:|tel:)/i.test(hm[1].trim())) continue;
    let title = text(m[2]);
    if (title.length < 18) { const tm = m[1].match(/title\s*=\s*["']([^"']{18,})["']/i); if (tm) title = decode(tm[1]).trim(); }
    if (title.length < 18 || !/[؀-ۿ]/.test(title)) continue;
    const url = abs(hm[1]);
    if (url.split("#")[0] === pageUrl) continue;
    cands.push({ start: m.index, end: m.index + m[0].length, title: title.replace(/^\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{4}\s*/, ""), url });
  }
  // 2) cut the page into rows (table rows, list items, articles) and read the date inside each row
  const bounds = [0];
  const br = /<\/?(tr|li|article|dd|dt)\b[^>]*>|<hr\b[^>]*>/gi;
  while ((m = br.exec(html))) bounds.push(m.index);
  bounds.push(html.length);
  const rowOf = pos => { let lo = 0; for (let i = 0; i < bounds.length - 1; i++) if (bounds[i] <= pos) lo = i; return [bounds[lo], bounds[lo + 1]]; };
  const firstDate = t => { const d = dates(t).sort((x, y) => x.i - y.i)[0]; return d ? d.v : ""; };
  const perRow = {};
  cands.forEach(c => { const [r0, r1] = rowOf(c.start); c.row = r0; c.rowEnd = r1; perRow[r0] = (perRow[r0] || 0) + 1; });
  // for pages without rows: are dates printed before or after each headline?
  const gaps = cands.map((c, k) => {
    const prevEnd = k ? cands[k - 1].end : Math.max(0, c.start - 400), nextStart = k < cands.length - 1 ? cands[k + 1].start : c.end + 300;
    const before = text(html.slice(Math.max(prevEnd, c.start - 400), c.start)), after = text(html.slice(c.end, Math.min(nextStart, c.end + 300)));
    const db = dates(before).sort((x, y) => y.i - x.i)[0], da = dates(after).sort((x, y) => x.i - y.i)[0];
    return { b: db && db.v, bd: db ? before.length - db.i - db.n : 0, a: da && da.v, ad: da ? da.i : 0 };
  });
  const avg = xs => xs.length ? xs.reduce((p, q) => p + q, 0) / xs.length : Infinity;
  const nb = gaps.filter(g => g.b), na = gaps.filter(g => g.a);
  const after = na.length > nb.length || (na.length === nb.length && avg(na.map(g => g.ad)) < avg(nb.map(g => g.bd)));
  cands.forEach((c, k) => {
    const rowLen = c.rowEnd - c.row, ownRow = rowLen < 2500 && perRow[c.row] <= 3;
    if (ownRow) c.date = firstDate(text(html.slice(c.row, c.rowEnd)));
    else c.date = (after ? gaps[k].a : gaps[k].b) || firstDate(c.title);
    const im = ownRow ? html.slice(c.row, c.end).match(/<img[^>]+src\s*=\s*["']([^"']+)["']/i) : null;
    c.image = im ? abs(im[1]) : "";
  });
  // 3) one headline per row (the longest link), no duplicates
  const best = {};
  cands.forEach(c => { const key = perRow[c.row] <= 3 && c.rowEnd - c.row < 2500 ? c.row + "|" + c.date : "a" + c.start; if (!best[key] || c.title.length > best[key].title.length) best[key] = c; });
  const seen = {}, items = [];
  Object.keys(best).map(k => best[k]).sort((a, b) => a.start - b.start).forEach(c => {
    if (seen[c.url] || seen[c.title]) return; seen[c.url] = seen[c.title] = true;
    items.push({ title: c.title, url: c.url, date: c.date || "", image: c.image || "" });
  });
  // a real news listing prints a date with each headline; menus and footers do not
  const dated = items.filter(it => it.date);
  const list = dated.length >= 3 ? dated : items.filter(it => it.title.length >= 30);
  return list.sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 40);
}
function hashId_(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, String(s), Utilities.Charset.UTF_8)
    .slice(0, 6).map(b => ("0" + (b & 255).toString(16)).slice(-2)).join("");
}

/* ---------- payment helpers ---------- */
function payOut_(p) {
  return { id: String(p.id), inquiry_id: String(p.inquiry_id),
    date: p.date instanceof Date ? Utilities.formatDate(p.date, CONFIG.TIME_ZONE, "yyyy-MM-dd").slice(0, 10) : String(p.date || "").slice(0, 10),
    amount: +p.amount || 0, currency: CURRENCIES.indexOf(String(p.currency)) >= 0 ? String(p.currency) : "USD",
    method: PAY_METHODS.indexOf(String(p.method)) >= 0 ? String(p.method) : "other", note: String(p.note || "") };
}
function payRows_() {
  let r = []; try { r = rows_("Payments"); } catch (e) { return []; }
  return r.filter(p => p.inquiry_id).map(payOut_);
}

/* ---------- news helpers ---------- */
function truthy_(v) { return v === true || /^(true|yes|y|1|نعم)$/i.test(String(v).trim()); }
function today_() { return Utilities.formatDate(new Date(), CONFIG.TIME_ZONE, "yyyy-MM-dd").slice(0, 10); }
function slug_(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60); }
function admin_(token) { const u = auth_(token); if (u.role !== "admin") throw fail_("forbidden"); return u; }
function newsOut_(r, withState) {
  const paras = v => String(v || "").split(/\n\s*\n|\r\n\s*\r\n/).map(x => x.trim()).filter(Boolean);
  const o = {
    id: String(r.id), date: r.date instanceof Date ? Utilities.formatDate(r.date, CONFIG.TIME_ZONE, "yyyy-MM-dd").slice(0, 10) : String(r.date || "").slice(0, 10),
    category: ["news", "guide", "announcement"].indexOf(r.category) >= 0 ? r.category : "news",
    service: String(r.service_id || ""),
    title: String(r.title || ""), titleAr: String(r.title_ar || ""),
    summary: String(r.summary || ""), summaryAr: String(r.summary_ar || ""),
    body: paras(r.body), bodyAr: paras(r.body_ar),
    titleFr: String(r.title_fr || ""), summaryFr: String(r.summary_fr || ""), bodyFr: paras(r.body_fr),
    image: /^https:\/\//.test(String(r.image || "")) ? String(r.image) : "",
    source: r.source_url ? { name: String(r.source_name || r.source_url), url: String(r.source_url) } : null
  };
  if (withState) o.published = truthy_(r.published);
  return o;
}
/* cover photos go to "Al Marjaa — Client Files / _News images", shared view-only so the site can show them */
function saveNewsImage_(b64, type, id) {
  const folder = sub_(rootFolder_(), "_News images");
  const ext = /png/.test(type) ? ".png" : /webp/.test(type) ? ".webp" : ".jpg";
  const f = folder.createFile(Utilities.newBlob(Utilities.base64Decode(b64), type || "image/jpeg", id + "-" + Date.now() + ext));
  try { f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) { throw fail_("image_share"); }
  return "https://drive.google.com/thumbnail?id=" + f.getId() + "&sz=w1600";
}

function sheet_() {
  const id = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
  if (!id) throw fail_("not_setup");
  return SpreadsheetApp.openById(id);
}
function ensureSheet_(ss, name, cols) {
  const sh = ss.getSheetByName(name) || ss.insertSheet(name);
  const have = sh.getLastColumn() ? sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0] : [];
  if (have.join() !== cols.join()) sh.getRange(1, 1, 1, cols.length).setValues([cols]);
  sh.getRange(1, 1, 1, cols.length).setFontWeight("bold").setBackground("#0e1528").setFontColor("#ffffff");
  sh.setFrozenRows(1);
  return sh;
}
function rows_(name) {
  const sh = sheet_().getSheetByName(name);
  const vals = sh.getDataRange().getValues();
  const cols = vals.shift() || [];
  return vals.map((v, i) => { const o = { _row: i + 2 }; cols.forEach((c, j) => o[c] = v[j]); return o; })
             .filter(o => o.id !== "" && o.id != null);
}
function append_(name, obj) {
  const sh = sheet_().getSheetByName(name);
  const cols = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  // force phone numbers / ids to stay text
  sh.appendRow(cols.map(c => {
    const v = obj[c];
    if (v === undefined || v === null) return "";
    if (typeof v === "string" && /^[+0-9]/.test(v) && c !== "created_at") return "'" + v;
    return v;
  }));
}
function update_(name, row, patch) {
  const sh = sheet_().getSheetByName(name);
  const cols = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  Object.keys(patch).forEach(k => { const c = cols.indexOf(k); if (c >= 0) sh.getRange(row, c + 1).setValue(patch[k]); });
}
function findUser_(email) { return email ? rows_("Users").find(u => String(u.email).toLowerCase() === email) : null; }
function findInquiry_(id) { return rows_("Inquiries").find(r => r.id === id); }
function publicUser_(u) { return { id: u.id, email: u.email, name: u.name, phone: String(u.phone || ""), role: u.role || "client" }; }
function newInquiryId_() {
  const taken = {}; rows_("Inquiries").forEach(r => taken[r.id] = true);
  let id; do { id = "AM-" + Utilities.getUuid().replace(/-/g, "").slice(0, 6).toUpperCase(); } while (taken[id]);
  return id;
}

/* passwords: salted + peppered SHA-256, stretched */
function hash_(pw, salt) {
  const pepper = PropertiesService.getScriptProperties().getProperty("PEPPER") || "";
  let digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, pw + "|" + salt + "|" + pepper, Utilities.Charset.UTF_8);
  for (let i = 0; i < 800; i++) {
    digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, Utilities.base64Encode(digest) + salt, Utilities.Charset.UTF_8);
  }
  return Utilities.base64Encode(digest);
}

/* sessions: random token for the browser, only its hash is stored */
function sessKey_(token) {
  return "sess_" + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(token))).slice(0, 40);
}
function newSession_(userId) {
  const token = Utilities.getUuid() + Utilities.getUuid().replace(/-/g, "");
  PropertiesService.getScriptProperties().setProperty(sessKey_(token),
    JSON.stringify({ uid: userId, exp: Date.now() + CONFIG.SESSION_DAYS * 864e5 }));
  return token;
}
function auth_(token) {
  if (!token) throw fail_("auth");
  const props = PropertiesService.getScriptProperties();
  const s = JSON.parse(props.getProperty(sessKey_(token)) || "null");
  if (!s || s.exp < Date.now()) throw fail_("auth");
  const u = rows_("Users").find(x => x.id === s.uid);
  if (!u) throw fail_("auth");
  return u;
}
function cleanupSessions_() {
  const props = PropertiesService.getScriptProperties(), all = props.getProperties(), now = Date.now();
  Object.keys(all).forEach(k => {
    if (k.indexOf("sess_") !== 0) return;
    try { if (JSON.parse(all[k]).exp < now) props.deleteProperty(k); } catch (e) { props.deleteProperty(k); }
  });
}

/* files arrive as base64 from the website */
function saveFiles_(folder, files, inquiryId, userId) {
  const saved = [];
  files.forEach(f => {
    const name = clean_(f.name) || "file";
    const blob = Utilities.newBlob(Utilities.base64Decode(f.data), f.type || "application/octet-stream", name);
    const file = folder.createFile(blob);
    const rec = {
      id: Utilities.getUuid(), inquiry_id: inquiryId, user_id: userId,
      doc_index: f.docIndex == null ? "" : f.docIndex, label: f.label || "", label_ar: f.labelAr || "",
      file_name: name, file_id: file.getId(), size: file.getSize(), created_at: new Date()
    };
    append_("Files", rec);
    saved.push(rec);
  });
  return saved;
}
function writeDetails_(folder, id, d, saved) {
  const stamp = Utilities.formatDate(new Date(), CONFIG.TIME_ZONE, "yyyy-MM-dd HH-mm");
  const txt = [
    "File no.:      " + id, "Date:          " + stamp,
    "Name:          " + (d.name || ""), "Phone:         " + (d.phone || ""), "Email:         " + (d.email || ""),
    "Contact by:    " + (d.contact || ""),
    "Service:       " + (d.service || "") + (d.serviceAr ? "  /  " + d.serviceAr : ""),
    "Transaction:   " + (d.transaction || "") + (d.transactionAr ? "  /  " + d.transactionAr : ""),
    "", "Notes:", d.notes || "-", "", "Files:"
  ].concat(saved.map(f => " • " + f.file_name)).join("\n");
  folder.createFile(id + " — " + stamp + ".txt", txt, MimeType.PLAIN_TEXT);
}
function notifyOffice_(subject, body, replyTo) {
  try {
    const m = { to: CONFIG.OFFICE_EMAIL, subject: subject, body: body, name: CONFIG.SITE_NAME + " website" };
    if (replyTo && cleanEmail_(replyTo)) m.replyTo = replyTo;
    MailApp.sendEmail(m);
  } catch (err) { console.error("notify failed", err); }
}
function emailClient_(inq) {
  if (!CONFIG.EMAIL_CLIENT_ON_STATUS_CHANGE) return;
  const to = cleanEmail_(inq.email); if (!to) return;
  const st = STATUS_TEXT[inq.status] || [inq.status, inq.status];
  try {
    MailApp.sendEmail({
      to, name: CONFIG.SITE_NAME,
      subject: CONFIG.SITE_NAME + " — " + inq.id + ": " + st[0] + " / " + st[1],
      body: [
        "Hello " + (inq.name || "") + ",", "",
        "Your file " + inq.id + " (" + inq.service + (inq.transaction ? " — " + inq.transaction : "") + ") is now: " + st[0] + ".",
        inq.status_note ? "Message from our office: " + inq.status_note : null,
        "Log in to the website and open “My files” to see the details.", "",
        "مرحباً " + (inq.name || "") + "،",
        "أصبحت حالة ملفك " + inq.id + " (" + (inq.service_ar || inq.service) + "): " + st[1] + ".",
        inq.status_note ? "رسالة من مكتبنا: " + inq.status_note : null,
        "سجّل الدخول إلى الموقع وافتح «ملفاتي» لرؤية التفاصيل.", "", "— " + CONFIG.SITE_NAME
      ].filter(x => x !== null).join("\n")
    });
  } catch (err) { console.error("client email failed", err); }
}
