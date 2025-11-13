'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { ReactNode } from 'react';

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function RecaptchaProvider({ children }: { children: ReactNode }) {
  if (!siteKey) {
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey} scriptProps={{ async: true, defer: true }}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
