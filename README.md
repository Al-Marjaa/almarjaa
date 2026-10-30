# Al Marjaa — المرجع

A 3D website in five language modes — **English + العربية** (the default), **Français + العربية**, English, Français or العربية — with light and dark modes, for a Lebanese government-transactions office. The site is hosted free on **GitHub Pages**. Everything else runs on **your Google account**:

| What | Where it lives |
|---|---|
| Client files | Google Drive → `Al Marjaa — Client Files / <Client Name> / <Service> / files` |
| Inquiries + statuses | Google Sheet **"Al Marjaa — Tracking"** (tabs: Inquiries, Files, Users, News, PCM) |
| Payments | **Payments** tab: every amount Olivia records against a file (office only) |
| Official news | Read every hour from the Presidency of the Council of Ministers into the **PCM** tab |
| Accounts (log in / sign up) | The same Sheet (passwords stored scrambled, never readable) |
| Emails | Your Gmail: new-file alerts to you, status updates and reset codes to clients |

## Files
| File | Upload to GitHub? |
|---|---|
| **Pages:** `index.html`, `services.html`, `service.html`, `news.html`, `article.html`, `about.html` | **Yes** |
| **Style and scripts:** `style.css`, `core.js`, `scene.js`, `home.js`, `pages.js`, `apply.js`, `account.js`, `i18n.js`, `data.js`, `news.js`, `newsroom.js` | **Yes** |
| **Icons:** `favicon.svg`, `favicon-32.png`, `favicon-16.png`, `apple-touch-icon.png`, `icon-512.png` | **Yes** |
| `google-apps-script/Code.gs` | No — pasted into Google (step 2) |

> Seeing the old name or a broken layout? GitHub still has old files. Delete everything in the repo, upload all 22 files (and delete the old `app.js`), wait 1–2 minutes, then hard-refresh (Ctrl+Shift+R / Cmd+Shift+R).

## 1. Publish on GitHub Pages
1. Create a public repository on github.com and upload all 22 files.
2. Settings → Pages → Source: **Deploy from a branch** → `main` / `(root)` → Save.
3. The site appears at `https://<username>.github.io/<repo>/`.

## 2. Connect Google (about 5 minutes)
Do all of this signed in as **oliviadiaasayah@gmail.com**.
1. Open https://script.google.com → **New project**. Rename it "Al Marjaa".
2. Delete the sample code, paste everything from `google-apps-script/Code.gs`, then press **Save**.
3. In the function dropdown at the top choose **setup** → **Run**. Allow the permissions (Drive, Sheets, Gmail). If Google says the app isn't verified, click **Advanced → Go to Al Marjaa**; it's your own script.
   This creates the **Al Marjaa — Client Files** folder in your Drive with the **Al Marjaa — Tracking** sheet inside it.
4. **Deploy → New deployment** → gear icon → **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   → **Deploy** → copy the **Web app URL** (ends in `/exec`).
5. Paste it into `data.js`:
   ```js
   googleScriptUrl: "https://script.google.com/macros/s/…/exec",
   ```
   and upload `data.js` to GitHub again.
6. **Right away, sign up on your live website with oliviadiaasayah@gmail.com.** That address automatically becomes the office (admin) account. Do this before you share the site.

**Updating from an earlier version?** Paste the new `Code.gs` over the old one → Save → run **setup** again. It keeps your data, adds any new tabs (News, PCM) and the hourly news reader. Google will ask for one new permission, *connect to an external service*, so the script can read the official news page; allow it. Then do the redeploy below.

Changed `Code.gs` later? Use **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. The URL stays the same.

## 3. Daily use
**Clients:** click **Start a file** → sign up → fill the form and attach documents → follow everything in **My files**: status timeline, your messages, their documents, and a checklist of what's still missing. They can add documents at any time.

**You (office):** log in on the website → **My files** shows **All clients**. Open a file to:
- call or WhatsApp the client, or open their Drive folder
- set the **status** and write a **message** → **Save update**. The client sees it in the dashboard and gets an email.

You can also work straight in the **Tracking sheet**: change the `status` dropdown or type in `status_note`. The update time is stamped and the client is emailed automatically.

| Status (sheet value) | Client sees |
|---|---|
| `received` | Received |
| `review` | Under review |
| `missing` | Missing documents. When the client uploads, it moves back to `review` by itself |
| `progress` | In progress |
| `ready` | Ready for pickup |
| `completed` / `cancelled` | Closed |

To make another staff member an office admin, have them sign up on the site, then in the sheet's **Users** tab change their `role` from `client` to `admin`.

**Forgot password:** clients click *Forgot password?*, get a 6-digit code by email (valid 30 minutes), and choose a new password.

## 4. Posting news (from the website)
Log in on the site with the office account (oliviadiaasayah@gmail.com, or any account whose role is `admin`). You'll see:
- a gold **Newsroom** button at the bottom of every page
- a **New post** button on the News page
- an **Edit post** button on every news card and article

In the Newsroom you can:
- **Write** a post in English, French and Arabic (switch with the language tabs; a green dot means that version is filled in; any language left empty shows another version to those readers), pick the type and related service, set the date, add a cover picture (drag it in, click to choose, or paste it) and a source.
- Watch the **live preview** as a card or as the full article, in either language.
- **Save draft** (only you see it) or **Publish** (goes live straight away). Ctrl/⌘+S saves.
- From **Posts**: search, filter, switch a post on/off the site, edit, view or delete. Built-in posts can be **hidden** or **edited** (your edited copy replaces them; *Restore original* brings the built-in one back).

Pictures are stored in Drive under `Al Marjaa — Client Files / _News images` and shared "view only" so the website can show them. Posts are stored in the **News** tab of the Tracking sheet, so you can still edit them there if you prefer (blank line between paragraphs, tick `published`).

Tip: `yoursite/news.html#newsroom` opens the Newsroom directly (it asks you to log in first).

## 5. Languages and first visit
- Every new visit opens in **English + العربية** and in **light mode**.
- The language button in the header (`EN·ع`) offers: English + العربية, Français + العربية, English only, Français only, العربية only. The sun/moon button switches to dark. Both choices last while the visitor browses the site, and reset on their next visit.
- A link can force a language: add `?lang=enar`, `?lang=frar`, `?lang=en`, `?lang=fr` or `?lang=ar` to any page address.

## 6. Official news (Presidency of the Council of Ministers)
- Every hour your Google script reads https://www.pcm.gov.lb/arabic/listingandpdf.aspx?pageid=21173, keeps each dated headline with its link, adds English and French titles with Google Translate, and stores them in the **PCM** tab. The website shows the newest 30 under the **Official** filter; each one opens the original page on pcm.gov.lb.
- **Check it once:** in script.google.com choose **testPcm** → **Run** → open the log. It lists the headlines it found with their dates. If the list looks wrong (menu links, missing dates), send the log to whoever maintains the site.
- **Hide a headline:** untick `published` in the PCM tab. To edit a translation, type over `title_en` / `title_fr`.
- Only headlines and links are copied, never the full articles. The hourly reader is installed by **setup**; to stop it, open **Triggers** (clock icon) in script.google.com and delete `refreshPcm`.
- Note: the pcm.gov.lb site asks automated tools not to crawl it. Reading one page once an hour for headlines is light, but it is your decision; to switch it off, delete the trigger above.

## 7. Payments and income (office only)
Log in as the office and open **My files → All clients**. Each file has a **Payments** box:
- **Agreed fee** — the price you agreed with the client (USD or LBP) → *Save fee*.
- **Add payment** — amount, currency, method (cash, bank transfer, OMT, Whish, card, cheque, other), date and an optional note. Each one is saved in the **Payments** tab of the sheet.
- The box shows **paid**, **balance** and a progress bar; the file's header shows *Paid in full* or *$… due*. To remove a payment typed by mistake, press × twice.

The **Income** tab shows this month, last month, this year and what is still to collect; a 12-month chart; income by service; the latest payments; and every file with a balance, with a one-tap **WhatsApp reminder**. **Download CSV** gives all payments for Excel or your accountant. Clients never see fees or payments.

If you already ran setup before, paste the new `Code.gs`, run **setup** once more (it adds the Payments tab and the fee columns) and deploy a new version.

## Limits to know
- Each upload can be up to **25 MB** in total (`maxUploadMB` in `data.js`). Bigger files can go by WhatsApp.
- A free Gmail account sends about **100 emails/day**, which covers alerts, status emails and codes. Turn off client status emails with `EMAIL_CLIENT_ON_STATUS_CHANGE: false` in `Code.gs`.
- Each action takes 1–3 seconds (Google's servers).
- Two clients with exactly the same name share a Drive folder; their files stay separate inside it, and the sheet shows who sent what.

Until `googleScriptUrl` is filled in, the form falls back to emailing inquiries through FormSubmit.

## Disclaimer
Document lists are a general guide from public sources (Dawlati, TMO, Invest in Lebanon, embassy legalisation pages, insurers). Requirements change, so review each list before going live.
