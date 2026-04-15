export function slugifyHeading(text: string): string {
  const s = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  return s || 'section';
}

export function createHeadingIdFactory() {
  const slugCount = new Map<string, number>();
  return (text: string) => {
    const base = slugifyHeading(text.trim()) || 'section';
    const n = (slugCount.get(base) ?? 0) + 1;
    slugCount.set(base, n);
    return n > 1 ? `${base}-${n}` : base;
  };
}

export type BlogTocItem = { id: string; level: 2 | 3; text: string };

/** Headings for table of contents — IDs must match MarkdownRenderer output. */
export function buildTocFromMarkdown(content: string): BlogTocItem[] {
  const nextId = createHeadingIdFactory();
  const toc: BlogTocItem[] = [];
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (t.startsWith('### ')) {
      const text = t.slice(4).trim();
      toc.push({ level: 3, text, id: nextId(text) });
    } else if (t.startsWith('## ')) {
      const text = t.slice(3).trim();
      toc.push({ level: 2, text, id: nextId(text) });
    }
  }
  return toc;
}

export function readingMinutesFromContent(content: string, wpm = 200): number {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / wpm));
}

export function blogShareTwitterUrl(pageUrl: string, title: string): string {
  const text = `${title}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`;
}

export function blogShareLinkedInUrl(pageUrl: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
}

export function blogShareWhatsAppUrl(pageUrl: string, title: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`${title} ${pageUrl}`)}`;
}
