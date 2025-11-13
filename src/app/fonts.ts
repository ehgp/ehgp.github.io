import { Inter, Roboto_Mono } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto-mono',
  display: 'swap'
});
