export default function Head() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fitcv.in';
  const canonical = `${siteUrl.replace(/\/$/, '')}/interview`;
  const ogImage = `${siteUrl.replace(/\/$/, '')}/og-interview.png`;

  return (
    <>
      <title>AI Mock Interview Practice | FitCV</title>
      <meta
        name="description"
        content="Practice real interview questions for any role. Get instant AI feedback on your answers. Free to start — built for India's job market."
      />
      <meta property="og:title" content="AI Mock Interview Practice | FitCV" />
      <meta
        property="og:description"
        content="Practice real interview questions for any role. Get instant AI feedback on your answers. Free to start — built for India's job market."
      />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <link rel="canonical" href={canonical} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </>
  );
}

