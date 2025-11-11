import "@/styles/globals.scss";
import Layout from "@/components/Layout";
import Head from "next/head";
import { Toaster } from "sonner";
import "@/styles/checkbox.scss";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import Router from "next/router";
import { useState, useEffect } from "react";
import NProgress from "nprogress";
import "@/styles/nprogress.scss";
import "react-loading-skeleton/dist/skeleton.css";
import Script from "next/script"; // ✅ Import Next.js Script component

export default function App({ Component, pageProps }: any) {
  const [isLoading, setIsLoading] = useState(false);
  NProgress.configure({ showSpinner: false });

  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      setIsLoading(true);
      NProgress.start();
    });

    Router.events.on("routeChangeComplete", (url) => {
      setIsLoading(false);
      NProgress.done(false);
    });

    Router.events.on("routeChangeError", (url) => {
      setIsLoading(false);
    });
  }, [Router]);

  return (
    <>
      <Head>
        <title>Velzorix</title>
        <meta name="description" content="Your Personal Streaming Oasis" />
        <meta
          name="keywords"
          content="movie, streaming, tv, Velzorix, stream. movie app, tv shows, movie download"
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
        <meta name="apple-mobile-web-app-title" content="Velzorix" />
        <link rel="icon" href="/images/logo512.png" />
        <link rel="apple-touch-icon" href="/images/logo512.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="shortcut icon" href="/images/logo512.png" />
      </Head>

      {/* ✅ Monetag Global Ad Script */}
      <script>
(function(slw){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = slw || {};
s.src = "\/\/impeccable-sense.com\/c.Da9-6ybr2H5nlNS\/WCQY9DNijjY\/5-OfTlk\/5pOfCI0j2ENojVkp5rOITMkr5O";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})
</script>
      {/* This loads the Monetag advertising tag (zone ID 10172587) once the page is interactive */}
      <Script
        id="monetag-ads"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(s){
              s.dataset.zone='10172587';
              s.src='https://al5sm.com/tag.min.js';
            })
            ([document.documentElement, document.body]
              .filter(Boolean)
              .pop()
              .appendChild(document.createElement('script')));
          `,
        }}
      />
      {/* ✅ End Monetag Script */}

      <Layout>
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
        <Tooltip id="tooltip" className="react-tooltip" />
        <Component {...pageProps} />
      </Layout>
    </>
  );
}