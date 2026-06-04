# Human TODO — hook up the contact function to Vercel

The code is done. The contact form now posts to a standalone Vercel function
(`contact-api/`) that verifies reCAPTCHA v3 and emails you the inquiry via
Resend. These are the manual steps only you can do (accounts, secrets, deploy).

Do them in order. Steps 1–2 gather credentials, 3 deploys the function, 4 wires
the site to it, 5 verifies.

---

## 1. reCAPTCHA keys (Google)

- [ ] Go to https://www.google.com/recaptcha/admin → your site (or create one).
- [ ] Confirm it is **reCAPTCHA v3** (score-based). v2 keys will not work.
- [ ] Under **Domains**, make sure `ehgp.github.io` is listed (add `localhost`
      too if you want to test locally).
- [ ] Copy the **Site key** (public) and the **Secret key** (private). You need
      both. The site key goes in the static build; the secret key goes in Vercel.

## 2. Resend (email)

- [ ] Create an API key at https://resend.com/api-keys → copy it (`re_...`).
- [ ] Decide the sender:
  - **Sandbox (no DNS):** keep `RESEND_FROM_EMAIL=onboarding@resend.dev`.
    Resend will only deliver to **your own Resend account email**, so set
    `ADMIN_NOTIFICATION_EMAIL` to that exact address.
  - **Your domain (recommended later):** verify a domain at
    https://resend.com/domains (add the DNS records it shows), then set
    `RESEND_FROM_EMAIL` to something like `Contact <contact@yourdomain.com>`.
    Then `ADMIN_NOTIFICATION_EMAIL` can be any inbox you want.

## 3. Deploy the function to Vercel

- [ ] Push this repo to GitHub (the `contact-api/` folder must be committed).
- [ ] At https://vercel.com/new, **Import** this Git repository.
- [ ] In project setup, set **Root Directory = `contact-api`** (click Edit and
      pick the folder). Framework preset: **Other**. Leave build/output empty —
      Vercel auto-detects the `api/` function.
- [ ] Before the first deploy (or under **Settings → Environment Variables**
      after), add these for the **Production** environment:

  | Name | Value |
  |------|-------|
  | `RESEND_API_KEY` | your `re_...` key |
  | `RESEND_FROM_EMAIL` | `onboarding@resend.dev` (sandbox) or your verified sender |
  | `ADMIN_NOTIFICATION_EMAIL` | inbox that receives inquiries (sandbox: your Resend account email) |
  | `RECAPTCHA_SECRET_KEY` | reCAPTCHA **secret** key from step 1 |
  | `ALLOWED_ORIGIN` | `https://ehgp.github.io` |
  | `RECAPTCHA_MIN_SCORE` | `0.5` (optional) |

- [ ] Deploy. Note the production URL, e.g. `https://ehgp-contact-api.vercel.app`.
- [ ] Your endpoint is that URL **+ `/api/contact`**, e.g.
      `https://ehgp-contact-api.vercel.app/api/contact`.

## 4. Point the site at the function

The site reads two `NEXT_PUBLIC_*` values at **build time** (they get baked into
the static bundle), so they must be GitHub repo secrets and you must rebuild.

- [ ] In GitHub: **Settings → Secrets and variables → Actions → New repository
      secret**, add:
  - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` = reCAPTCHA **site** key (step 1)
  - `NEXT_PUBLIC_CONTACT_ENDPOINT` = the full `/api/contact` URL (step 3)
- [ ] (Optional cleanup) delete the old `NEXT_PUBLIC_FORMSPREE` secret if present.
- [ ] Trigger a redeploy of the site: push to `main`, or run the
      **next-static-export** workflow manually (Actions tab → Run workflow).
      The new endpoint URL only takes effect after this rebuild.

## 5. Verify end to end

- [ ] Open https://ehgp.github.io/contact, fill the form, submit.
- [ ] Confirm the inquiry lands in `ADMIN_NOTIFICATION_EMAIL`. Replying to it
      should go to the visitor's address (reply-to is set).
- [ ] If it fails, check **Vercel → your project → Logs** and **Resend → Logs**.

---

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Form shows "Contact endpoint is missing" | `NEXT_PUBLIC_CONTACT_ENDPOINT` not set, or site not rebuilt after setting it |
| Browser console CORS error | `ALLOWED_ORIGIN` doesn't exactly match `https://ehgp.github.io` (no trailing slash) |
| 403 "Origin not allowed" | Same as above — origin not in `ALLOWED_ORIGIN` |
| 400 "reCAPTCHA verification failed" | Wrong `RECAPTCHA_SECRET_KEY`, key isn't v3, or `ehgp.github.io` not in the reCAPTCHA domain list; or score below `RECAPTCHA_MIN_SCORE` |
| 200 OK but no email | Sandbox sender + `ADMIN_NOTIFICATION_EMAIL` is not your Resend account email; or sending domain not verified (Resend 403 in logs) |
| 500 "Server is missing…" | A required env var is unset in Vercel |

## Local testing (optional)

```bash
cd contact-api
npm install
cp .env.example .env   # fill in real values
npx vercel dev         # http://localhost:3000/api/contact
```
Add `http://localhost:3000` to `ALLOWED_ORIGIN` and to the reCAPTCHA domain list
if you also run the site locally with `npm run dev`.
