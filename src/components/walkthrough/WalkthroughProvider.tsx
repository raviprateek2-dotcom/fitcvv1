'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { User } from 'firebase/auth';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { collection, doc, type DocumentReference } from 'firebase/firestore';
import { useUser, useMemoFirebase, useCollection } from '@/firebase';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { UserProfile, WalkthroughState } from '@/firebase/provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SNOOZE_KEY = 'fitcv-walkthrough-snoozed';

type Step = {
  id: number;
  selector: string | null;
  title: string;
  body: string;
  /** Step 6: no skip / later */
  final?: boolean;
};

const STEPS: Step[] = [
  {
    id: 1,
    selector: null,
    title: 'Welcome to FitCV',
    body: "Your resume is about to get a lot better. Let us show you around — it takes less than two minutes.",
  },
  {
    id: 2,
    selector: '[data-tour="nav-templates"]',
    title: 'Templates',
    body: 'Start here. Browse templates by profession, pick one that fits — or upload a resume and we will help you match it.',
  },
  {
    id: 3,
    selector: '[data-tour="editor-split"]',
    title: 'Live editor',
    body: 'Everything updates as you type. Change your name and watch it appear on the preview — no refresh.',
  },
  {
    id: 4,
    selector: '[data-tour="ai-suggestion"]',
    title: 'AI writing help',
    body: 'Struggling with wording? Use AI suggestions on a section to sharpen bullets — right inside the editor.',
  },
  {
    id: 5,
    selector: '[data-tour="editor-download"]',
    title: 'Export',
    body: 'When you are ready — PDF or Word in one click. Free. No paywall on exports.',
  },
  {
    id: 6,
    selector: '[data-tour="nav-interview"]',
    title: 'Interview practice',
    body: 'When your resume is ready, practice answering questions with AI — like a real screen. First sessions are free.',
    final: true,
  },
];

type Ctx = {
  openWalkthrough: () => void;
  isWalkthroughOpen: boolean;
};

const WalkthroughCtx = createContext<Ctx>({
  openWalkthrough: () => {},
  isWalkthroughOpen: false,
});

export function useWalkthrough() {
  return useContext(WalkthroughCtx);
}

function mergeWalkthrough(
  prev: UserProfile['walkthrough'],
  next: Partial<WalkthroughState>
): WalkthroughState {
  return {
    status: next.status ?? prev?.status ?? 'pending',
    deferrals: next.deferrals ?? prev?.deferrals ?? 0,
  };
}

function findVisibleTourTarget(selector: string): HTMLElement | null {
  const nodes = document.querySelectorAll(selector);
  for (let i = 0; i < nodes.length; i++) {
    const el = nodes[i] as HTMLElement;
    const r = el.getBoundingClientRect();
    if (r.width >= 4 && r.height >= 4) return el;
  }
  return null;
}

function WalkthroughOverlay({
  open,
  onClose,
  stepIndex,
  setStepIndex,
  userDocRef,
  userProfile,
  user,
  reduceMotion,
}: {
  open: boolean;
  onClose: () => void;
  stepIndex: number;
  setStepIndex: (n: number) => void;
  userDocRef: DocumentReference | null;
  userProfile: UserProfile | null;
  user: User | null;
  reduceMotion: boolean;
}) {
  const step = STEPS[stepIndex];
  const [rect, setRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const persistWalkthrough = useCallback(
    (patch: Partial<WalkthroughState>) => {
      if (!userDocRef || !userProfile) return;
      const next = mergeWalkthrough(userProfile.walkthrough, patch);
      updateDocumentNonBlocking(userDocRef, { walkthrough: next });
    },
    [userDocRef, userProfile]
  );

  const refreshRect = useCallback(() => {
    if (!step.selector) {
      setRect(null);
      return;
    }
    const el = findVisibleTourTarget(step.selector);
    if (!el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect(new DOMRect(r.left - 8, r.top - 8, r.width + 16, r.height + 16));
    if (!reduceMotion) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [step.selector, reduceMotion]);

  useLayoutEffect(() => {
    if (!open) return;
    refreshRect();
    const t = window.setTimeout(refreshRect, 400);
    return () => clearTimeout(t);
  }, [open, stepIndex, refreshRect]);

  useEffect(() => {
    if (!open) return;
    const onResize = () => refreshRect();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [open, refreshRect]);

  if (!open || !step) return null;

  const firstName =
    user?.displayName?.trim().split(/\s+/)[0] ||
    user?.email?.split('@')[0] ||
    '';
  const welcomeBody =
    step.id === 1 && firstName
      ? `Hi ${firstName}! ${step.body}`
      : step.body;

  const handleSkip = () => {
    persistWalkthrough({ status: 'skipped', deferrals: userProfile?.walkthrough?.deferrals ?? 0 });
    try {
      localStorage.setItem('fitcv-walkthrough-local', 'skipped');
    } catch {
      /* ignore */
    }
    onClose();
  };

  const handleLater = () => {
    const d = (userProfile?.walkthrough?.deferrals ?? 0) + 1;
    persistWalkthrough({ status: 'pending', deferrals: d });
    try {
      sessionStorage.setItem(SNOOZE_KEY, '1');
    } catch {
      /* ignore */
    }
    onClose();
  };

  const handleNext = () => {
    if (stepIndex >= STEPS.length - 1) return;
    setStepIndex(stepIndex + 1);
  };

  const handleFinal = () => {
    persistWalkthrough({ status: 'completed', deferrals: userProfile?.walkthrough?.deferrals ?? 0 });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex flex-col justify-end md:justify-center md:items-center p-0 md:p-6 pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="walkthrough-title"
      aria-describedby="walkthrough-desc"
    >
      <div className="absolute inset-0 bg-background/80 dark:bg-black/70 pointer-events-auto" aria-hidden />
      {rect && step.selector ? (
        <div
          className="absolute rounded-xl border-2 border-primary z-[2001] pointer-events-none shadow-[0_0_0_4px_hsl(var(--primary)/0.2)] transition-[top,left,width,height] duration-300 ease-out"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }}
        />
      ) : null}

      <div
        ref={tooltipRef}
        className={cn(
          'relative z-[2002] m-3 md:m-0 w-full max-w-lg rounded-2xl border border-border bg-card p-5 shadow-xl pointer-events-auto',
          'md:max-w-md'
        )}
      >
        <p className="text-xs font-medium text-muted-foreground mb-1">
          Step {step.id} of {STEPS.length}
        </p>
        <h2 id="walkthrough-title" className="text-xl font-headline font-bold text-foreground mb-2">
          {step.title}
        </h2>
        <p id="walkthrough-desc" className="text-sm text-muted-foreground leading-relaxed mb-6">
          {welcomeBody}
          {!rect && step.selector ? (
            <span className="block mt-2 text-xs text-primary">
              Tip: open the relevant page from the nav to see this highlighted on your next tour.
            </span>
          ) : null}
        </p>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-between sm:items-center">
          <div className="flex flex-wrap gap-2">
            {!step.final ? (
              <>
                <Button type="button" variant="ghost" size="sm" onClick={handleSkip}>
                  Skip for now
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={handleLater}>
                  Later
                </Button>
              </>
            ) : null}
          </div>
          <div className="flex gap-2 justify-end">
            {step.final ? (
              <Button type="button" size="lg" className="min-h-[48px] w-full sm:w-auto" asChild>
                <Link
                  href="/dashboard"
                  onClick={() => {
                    handleFinal();
                  }}
                >
                  Start building my resume
                </Link>
              </Button>
            ) : (
              <Button type="button" size="lg" className="min-h-[48px]" onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WalkthroughProvider({ children }: { children: React.ReactNode }) {
  const { user, userProfile, isUserLoading, isProfileLoading, firestore } = useUser();
  const pathname = usePathname();
  const [manualOpen, setManualOpen] = useState(false);
  const [autoOpen, setAutoOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  /** One automatic prompt per browser session (Later / next login resets). */
  const autoOfferedRef = useRef(false);

  const resumesQuery = useMemoFirebase(
    () => (user && firestore ? collection(firestore, `users/${user.uid}/resumes`) : null),
    [user, firestore]
  );
  const { data: resumes, isLoading: resumesLoading } = useCollection(resumesQuery);

  const userDocRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, `users/${user.uid}`) : null),
    [user, firestore]
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const fn = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  const resumeCount = resumes?.length ?? 0;

  useEffect(() => {
    if (manualOpen) return;
    if (isUserLoading || isProfileLoading || resumesLoading || !user || !userProfile) return;
    if (pathname !== '/dashboard') return;
    if (resumeCount > 0) return;
    if (userProfile.walkthrough?.status !== 'pending') return;
    if ((userProfile.walkthrough.deferrals ?? 0) >= 2) return;
    try {
      if (sessionStorage.getItem(SNOOZE_KEY)) return;
      if (localStorage.getItem('fitcv-walkthrough-local') === 'skipped') return;
    } catch {
      /* ignore */
    }
    if (autoOfferedRef.current) return;
    autoOfferedRef.current = true;
    setAutoOpen(true);
    setStepIndex(0);
  }, [
    manualOpen,
    isUserLoading,
    isProfileLoading,
    resumesLoading,
    user,
    userProfile,
    pathname,
    resumeCount,
  ]);

  const open = manualOpen || autoOpen;

  const handleClose = useCallback(() => {
    setManualOpen(false);
    setAutoOpen(false);
    setStepIndex(0);
  }, []);

  const openWalkthrough = useCallback(() => {
    setStepIndex(0);
    setManualOpen(true);
    setAutoOpen(false);
  }, []);

  const ctx = useMemo(
    () => ({
      openWalkthrough,
      isWalkthroughOpen: open,
    }),
    [openWalkthrough, open]
  );

  return (
    <WalkthroughCtx.Provider value={ctx}>
      {children}
      <WalkthroughOverlay
        open={open}
        onClose={handleClose}
        stepIndex={stepIndex}
        setStepIndex={setStepIndex}
        userDocRef={userDocRef}
        userProfile={userProfile}
        user={user}
        reduceMotion={reduceMotion}
      />
    </WalkthroughCtx.Provider>
  );
}
