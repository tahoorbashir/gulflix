import "@/styles/globals.scss";
import "@/styles/checkbox.scss";
import "@/styles/nprogress.scss";
import "react-tooltip/dist/react-tooltip.css";
import "react-loading-skeleton/dist/skeleton.css";

import { useEffect, useState } from "react";
import Router from "next/router";
import Head from "next/head";
import Script from "next/script";
import NProgress from "nprogress";
import { Toaster } from "sonner";
import { Tooltip } from "react-tooltip";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }: any) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleStart = () => {
      setIsLoading(true);
      NProgress.start();
    };
    const handleComplete = () => {
      setIsLoading(false);
      NProgress.done();
    };
    const handleError = () => {
      setIsLoading(false);
      NProgress.done();
    };

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleComplete);
    Router.events.on("routeChangeError", handleError);

    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleComplete);
      Router.events.off("routeChangeError", handleError);
    };
  }, []);

  return (
    <>
      <Head>
        <title>GulFlix</title>
        <meta name="description" content="Your Personal Streaming Oasis" />
        <meta
          name="keywords"
          content="movie, streaming, tv, GulFlix, stream, movie app, tv shows, movie download"
        />
        <meta
          name="google-site-verification"
          content="J0QUeScQSxufPJqGTaszgnI35U2jN98vVWSOkVR4HrI"
        />
        <link rel="manifest" href="manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f4f7fe" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GulFlix" />
        <link rel="icon" href="/images/logo512.png" />
        <link rel="apple-touch-icon" href="/images/logo512.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="shortcut icon" href="/images/logo512.png" />
      </Head>

      {/* ✅ Hilltop Ads Script */}
      <Script
        id="hilltop-ads"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(slw){
              var d = document,
                  s = d.createElement('script'),
                  l = d.scripts[d.scripts.length - 1];
              s.settings = slw || {};
              s.src = "//impeccable-sense.com/c.Da9-6ybr2H5nlNS/WCQY9DNijjY/5-OfTlk/5pOfCI0j2ENojVkp5rOITMkr5O";
              s.async = true;
              s.referrerPolicy = 'no-referrer-when-downgrade';
              l.parentNode.insertBefore(s, l);
            })({});
          `,
        }}
      />

      {/* ✅ Monetag Ads Script */}
      <Script
        id="monetag-ads"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(){
              var d = document,
                  s = d.createElement('script');
              s.dataset.zone = '10172587';
              s.src = 'https://al5sm.com/tag.min.js';
              s.async = true;
              d.body.appendChild(s);
            })();
          `,
        }}
      />

      <Layout>
        {/* Toasts */}
        <Toaster
          toastOptions={{
            className: "sooner-toast-desktop",
          }}
          position="bottom-right"
        />
        <Toaster
          toastOptions={{
            className: "sooner-toast-mobile",
          }}
          position="top-center"
        />

        {/* Tooltip */}
        <Tooltip id="tooltip" className="react-tooltip" />

        {/* Page Component */}
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
