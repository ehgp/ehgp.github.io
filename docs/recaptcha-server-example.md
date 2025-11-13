# reCAPTCHA v3 Verification Example

The contact form sends `{ name, email, message, token }` to `NEXT_PUBLIC_CONTACT_ENDPOINT`. On the server, verify the token with Google before processing:

```ts
// app/api/contact/route.ts
import { NextResponse } from 'next/server';

const secret = process.env.RECAPTCHA_SECRET_KEY!;

export async function POST(request: Request) {
  const { name, email, message, token } = await request.json();

  const verify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token })
  }).then((res) => res.json());

  if (!verify.success || verify.score < 0.5) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
  }

  // TODO: send email, write to CRM, etc.
  return NextResponse.json({ ok: true });
}
```

- Store `RECAPTCHA_SECRET_KEY` on the server (never expose it to the client).
- Consider logging `verify.score` so you can adjust thresholds.
- If deploying to a static host (GitHub Pages), point `NEXT_PUBLIC_CONTACT_ENDPOINT` to a serverless function (Vercel, Cloudflare, AWS Lambda) running the same logic.
