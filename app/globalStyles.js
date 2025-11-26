'use client';

import { createGlobalStyle } from "styled-components";
import { inter } from './fonts';
// import theme from '@/theme';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    -webkit-touch-callout: none;                  /* prevent callout to copy image, etc when tap to hold */
    -webkit-text-size-adjust: none;               /* prevent webkit from resizing text to fit */
    -webkit-tap-highlight-color: rgba(0,0,0,0);   /* prevent tap highlight color / shadow */
    -webkit-tap-highlight-color: transparent;
    /* -webkit-user-select: none; /* This prevent input fields from working in Safari and iOs *//* prevent copy paste, to allow, change 'none' to 'text' */
  }

  html {
    font-family: ${inter.style.fontFamily};
    scroll-behavior: smooth;
  }

  html,
  body {
    max-width: 100vw;
    overflow-x: hidden;
  }

  html {
    font-size: 16px;
    background-color:#ffffff;
  }
  
  body {
    min-height: 100vh;
    margin: 0;
    padding: 0;
    background-color: #ffffff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

/*
  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    src: url("https://fonts.gstatic.com/s/inter/v19/UcCo3FwrK3iLTcviYwYZ90A2N58.woff2") format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
*/

  :root {
    --heading-font-family: 'Inter', sans-serif !important;
  }

  .page-content { /* Shopify class */
    padding-top: 0 !important;
  }

  .page-width {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  cart-drawer {
    z-index: 99999 !important; /* Must be above header */
  }
`;
