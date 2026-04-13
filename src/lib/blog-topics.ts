export const BLOG_TOPIC_SLUGS = ['ats-resumes', 'interviews', 'job-search', 'career-moves'] as const;

export type BlogTopicSlug = (typeof BLOG_TOPIC_SLUGS)[number];

export const BLOG_TOPICS: {
  slug: BlogTopicSlug;
  title: string;
  shortTitle: string;
  description: string;
}[] = [
  {
    slug: 'ats-resumes',
    shortTitle: 'ATS & resumes',
    title: 'ATS-friendly resumes & writing',
    description:
      'Beat parsers, tighten bullets, and structure a resume humans and systems both understand.',
  },
  {
    slug: 'interviews',
    shortTitle: 'Interviews',
    title: 'Interview prep & follow-up',
    description:
      'Questions, frameworks, and follow-ups so you walk in prepared and leave a clear impression.',
  },
  {
    slug: 'job-search',
    shortTitle: 'Job search',
    title: 'Job search strategy & visibility',
    description:
      'LinkedIn, networking, skills, and cover letters — practical moves for a crowded market.',
  },
  {
    slug: 'career-moves',
    shortTitle: 'Career moves',
    title: 'Career transitions & workplace',
    description:
      'Gaps, moves, and professional exits — how to tell the story without sinking the application.',
  },
];

export function isBlogTopicSlug(value: string): value is BlogTopicSlug {
  return (BLOG_TOPIC_SLUGS as readonly string[]).includes(value);
}

/** Maps frontmatter `topic` to a known pillar; invalid/missing values become `job-search`. */
export function normalizePostTopic(raw: unknown): BlogTopicSlug {
  const s = typeof raw === 'string' ? raw.trim() : '';
  if (isBlogTopicSlug(s)) return s;
  return 'job-search';
}

export function topicMeta(slug: BlogTopicSlug) {
  return BLOG_TOPICS.find((t) => t.slug === slug)!;
}
