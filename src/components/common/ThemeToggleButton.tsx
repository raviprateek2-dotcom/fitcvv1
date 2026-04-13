'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

function triggerThemeTransition() {
  if (typeof document === 'undefined') return;
  document.body.classList.add('theme-transition');
  window.setTimeout(() => {
    document.body.classList.remove('theme-transition');
  }, 250);
}

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const onSelect = (value: 'light' | 'dark' | 'system') => {
    triggerThemeTransition();
    setTheme(value);
  };

  if (!mounted) {
    return (
      <div
        className="inline-flex h-[52px] md:h-9 items-center rounded-md border border-border bg-muted/30 p-0.5 gap-0.5"
        aria-hidden
      >
        <span className="h-11 w-11 md:h-8 md:w-8 rounded-sm bg-muted/50" />
        <span className="h-11 w-11 md:h-8 md:w-8 rounded-sm bg-muted/50" />
        <span className="h-11 w-11 md:h-8 md:w-8 rounded-sm bg-muted/50" />
      </div>
    );
  }

  const options = [
    { value: 'light' as const, icon: Sun, label: 'Light theme' },
    { value: 'system' as const, icon: Monitor, label: 'System theme' },
    { value: 'dark' as const, icon: Moon, label: 'Dark theme' },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="inline-flex h-[52px] md:h-9 items-center rounded-md border border-border bg-muted/40 p-0.5 gap-0.5"
    >
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value ? 'true' : 'false'}
          onClick={() => onSelect(value)}
          aria-label={label}
          className={cn(
            'flex h-11 w-11 min-h-[44px] min-w-[44px] md:h-8 md:w-8 md:min-h-0 md:min-w-0 items-center justify-center rounded-sm transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            theme === value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
          )}
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}
