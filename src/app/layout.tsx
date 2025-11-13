import AnalyticsScripts, {
  GoogleTagManagerNoscript,
} from "@/components/analytics-scripts";
import Navigation from "@/components/navigation";
import SiteFooter from "@/components/site-footer";
import VisitorBadge from "@/components/visitor-badge";
import RecaptchaProvider from "@/providers/recaptcha-provider";
import AppThemeProvider from "@/providers/theme-provider";
import { Box, Container, Stack } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { inter, robotoMono } from "./fonts";
import "./globals.css";

const siteUrl = "https://ehgp.github.io";
const title = "EHGP – Web Developer · Data Scientist · Cybersecurity";
const description =
  "Portfolio website for EHGP highlighting work in web development, data science, and cybersecurity.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · EHGP",
  },
  description,
  applicationName: "EHGP Portfolio",
  category: "portfolio",
  generator: "Next.js 16",
  keywords: [
    "EHGP",
    "Web Developer",
    "Data Scientist",
    "Cybersecurity",
    "Portfolio",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    type: "website",
    siteName: "EHGP",
    images: [
      {
        url: "/apple-touch-icon.png",
        width: 512,
        height: 512,
        alt: "EHGP logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    site: "@ehgp93",
    creator: "@ehgp93",
    description,
    title,
    images: ["/apple-touch-icon.png"],
  },
  icons: {
    icon: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "mwjiOyBJB-bKxNz2qBLF0K_6Jyk8MbEdobAOBgcmuGg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>
        <GoogleTagManagerNoscript />
        <AnalyticsScripts />
        <AppRouterCacheProvider options={{ key: "mui" }}>
          <RecaptchaProvider>
            <AppThemeProvider>
              <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
                  <Box sx={{ width: { xs: "100%", md: 260 } }}>
                    <Navigation />
                  </Box>
                  <Stack spacing={4} flex={1}>
                    {children}
                    <SiteFooter />
                    <VisitorBadge />
                  </Stack>
                </Stack>
              </Container>
            </AppThemeProvider>
          </RecaptchaProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
