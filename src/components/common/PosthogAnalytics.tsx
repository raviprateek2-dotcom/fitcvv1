import Script from 'next/script';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || 'https://app.posthog.com';

export function PosthogAnalytics() {
  if (!POSTHOG_KEY) return null;

  const keyJson = JSON.stringify(POSTHOG_KEY);
  const hostJson = JSON.stringify(POSTHOG_HOST);

  return (
    <>
      <Script src={`${POSTHOG_HOST}/static/array.js`} strategy="afterInteractive" />
      <Script id="posthog-init" strategy="afterInteractive">
        {`
          !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");
          2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",
          p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",
          (r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],
          u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},
          o="init capture register register_once unregister identify alias set_config reset opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing".split(" "),
          n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
          window.posthog.init(${keyJson}, { api_host: ${hostJson}, capture_pageview: true, autocapture: true });
        `}
      </Script>
    </>
  );
}
