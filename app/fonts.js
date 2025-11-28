import localFont from "next/font/local";
import { Inter } from 'next/font/google';
// import avenirFont from '@/app/assets/avenir-regular.ttf';
// If loading a variable font, you don't need to specify the font weight

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600']
})

export const avenircloud = localFont({
  src: [
    {
      path: '../public/fonts/avenir-regular.ttf',
      weight: "400",
      style: "normal",
    }
  ],
  variable: "--font-avenircloud", // optional CSS variable
});
