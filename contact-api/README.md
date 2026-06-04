# contact-api

Standalone [Vercel](https://vercel.com) serverless function that backs the
contact form on the static `ehgp.github.io` site (which is hosted on GitHub
Pages and cannot run server code).

## What it does

`POST /api/contact` accepts JSON `{ name, email, message, token }` from the
browser, then:

1. Verifies the reCAPTCHA v3 `token` server-side with Google
   (`RECAPTCHA_SECRET_KEY`, score threshold `RECAPTCHA_MIN_SCORE`).
2. Emails the inquiry to the site owner via Resend — admin-notify only, with
   `reply-to` set to the visitor so you can reply directly.

CORS is restricted to the origins in `ALLOWED_ORIGIN`. The same list is also
enforced server-side so non-browser clients can't bypass it.

## Environment variables

See [`.env.example`](./.env.example). Set them in the Vercel project, never in
the static site build.

## Local development

```bash
cd contact-api
npm install
cp .env.example .env   # fill in real values
npx vercel dev         # serves http://localhost:3000/api/contact
```

## Deploy

Step-by-step hookup instructions live in [`../human-todo.md`](../human-todo.md).
The short version: import this folder as its own Vercel project (Root Directory
= `contact-api`), set the env vars, deploy, then point the site's
`NEXT_PUBLIC_CONTACT_ENDPOINT` at `https://<project>.vercel.app/api/contact`.
