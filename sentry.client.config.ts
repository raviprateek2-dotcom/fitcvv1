import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // Use a placeholder DSN, or the environment variable
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
