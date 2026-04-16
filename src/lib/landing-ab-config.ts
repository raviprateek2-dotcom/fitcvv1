import type { AnalyticsEventParams } from '@/lib/analytics-events';

export type HeroPrimaryAbVariant = 'control' | 'ats_picker';
export type HeroSecondaryAbVariant = 'control' | 'demo_anchor';

function parseHeroPrimary(raw: string | undefined): HeroPrimaryAbVariant {
  const v = (raw ?? '').trim().toLowerCase();
  if (v === 'ats' || v === 'ats_picker' || v === 'variant') return 'ats_picker';
  return 'control';
}

function parseHeroSecondary(raw: string | undefined): HeroSecondaryAbVariant {
  const v = (raw ?? '').trim().toLowerCase();
  if (v === 'demo' || v === 'demo_anchor' || v === 'variant') return 'demo_anchor';
  return 'control';
}

export function getLandingHeroAb(): {
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  experiment: {
    hero_primary_ab: HeroPrimaryAbVariant;
    hero_secondary_ab: HeroSecondaryAbVariant;
  };
} {
  const hero_primary_ab = parseHeroPrimary(process.env.NEXT_PUBLIC_LANDING_AB_HERO_PRIMARY);
  const hero_secondary_ab = parseHeroSecondary(process.env.NEXT_PUBLIC_LANDING_AB_HERO_SECONDARY);

  const primary =
    hero_primary_ab === 'ats_picker'
      ? { href: '/templates/ats', label: 'Start with ATS layouts' }
      : { href: '/templates', label: 'Choose a template — start free' };

  const secondary =
    hero_secondary_ab === 'demo_anchor'
      ? { href: '#how-it-works', label: 'See a 60-second demo' }
      : { href: '/editor/new', label: 'Quick start (blank editor)' };

  return {
    primary,
    secondary,
    experiment: { hero_primary_ab, hero_secondary_ab },
  };
}

/** Attach to landing `trackEvent` calls so downstream funnels can segment by assignment. */
export function landingAbParams(): AnalyticsEventParams {
  const { experiment } = getLandingHeroAb();
  return {
    hero_primary_ab: experiment.hero_primary_ab,
    hero_secondary_ab: experiment.hero_secondary_ab,
  };
}
