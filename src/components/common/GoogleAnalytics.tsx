import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

/**
 * Loads gtag when NEXT_PUBLIC_GA_MEASUREMENT_ID is set. Works with {@link trackEvent} in analytics-events.
 */
export function GoogleAnalytics() {
  if (!GA_ID) return null;

  const idJson = JSON.stringify(GA_ID);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', ${idJson}, { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
