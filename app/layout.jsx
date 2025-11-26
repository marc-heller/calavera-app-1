// import { Inter } from 'next/font/google';
import StyledComponentsRegistry from '@/app/registry';
// import LayoutClient from '../components/layoutClient';
import { GlobalStyle } from '@/app/globalStyles';

export default function RootLayout({ children }) {
  return (
    <StyledComponentsRegistry>
      <GlobalStyle />
      <html lang="en">
        <body> {/* id="layoutBody" className={`${inter.variable}`} */}

          {children}

          {/*
          <div id="div-gpt-ad-123456789"></div>
          <div className="flex min-h-screen flex-col">
            <div className="flex flex-grow flex-col justify-center">
              {NEXT_PUBLIC_BRAND === 'ere' && <TopPromotion />}
              <Nav />
              <LayoutClient>{children}</LayoutClient>
            </div>
            <Footer />
          </div>
          */}
        </body>
      </html>
    </StyledComponentsRegistry>
  );
}

/*
export const metadata = {
  title: {
    default: `${NEXT_PUBLIC_BRAND_DISPLAY_NAME} | ${NEXT_PUBLIC_TAGLINE}`,
    template: `%s | ${NEXT_PUBLIC_BRAND_DISPLAY_NAME}`,
  },
  description: NEXT_PUBLIC_BRAND_DESCRIPTION,
  icons: {
    icon: faviconUrl,
  },
  keywords,
  metadataBase: new URL(NEXT_PUBLIC_BASE_URL),
  alternates: {
    canonical: NEXT_PUBLIC_BASE_URL,
  },
  openGraph: {
    title: `${NEXT_PUBLIC_BRAND_DISPLAY_NAME} | ${NEXT_PUBLIC_TAGLINE}`,
    url: NEXT_PUBLIC_BASE_URL,
    description: NEXT_PUBLIC_BRAND_DESCRIPTION,
    siteName: NEXT_PUBLIC_BRAND_DISPLAY_NAME,
    locale: 'en-US',
    images: {
      url: imageUrl,
      width: 1200,
      height: 627,
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${NEXT_PUBLIC_BRAND_DISPLAY_NAME} | ${NEXT_PUBLIC_TAGLINE}`,
    description: NEXT_PUBLIC_BRAND_DESCRIPTION,
    images: {
      url: imageUrl,
      width: 1200,
      height: 627,
    },
  },
};
*/
