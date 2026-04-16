'use client';

import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Loader2, RotateCcw, Send, Share2, Sparkles, Lock, PanelRightOpen, PanelRightClose, Settings2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const STEPS = [
  {
    title: 'Pick Your Role',
    text: 'Choose from SWE, PM, Design, Marketing, Finance, or Operations and tailor the interview flow to your goals.',
  },
  {
    title: "Answer Like It's Real",
    text: 'Practice with realistic, role-aware prompts that mirror high-stakes screening and hiring manager rounds.',
  },
  {
    title: 'Get Brutally Honest Feedback',
    text: 'See where your answers land, where you drift, and what to say instead to improve your offer odds.',
  },
];

const FEATURES = [
  'AI That Thinks Like a Hiring Manager',
  'Role-Specific Question Banks',
  'Answer Scoring (Clarity, Depth, Relevance, Confidence)',
  'Follow-up Questions Like Real Interviewers',
  'Behavioral + Technical + Case modes',
  'Session Summary with Improvement Tips',
];

const TESTIMONIALS = [
  {
    quote:
      'I bombed 3 interviews before FitCV. After 2 weeks of practice, I cleared Razorpay in the first round.',
    person: 'Priya S., SWE at Flipkart',
  },
  {
    quote:
      'The follow-up questions are what got me. It trained me to think on my feet.',
    person: 'Arjun M., PM at Zepto',
  },
  {
    quote:
      'I was changing from ops to product. The case interview mode was exactly what I needed.',
    person: 'Sneha R., Career switcher',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Is this free to use?',
    answer:
      'Yes. You can start with free sessions immediately and upgrade when you want unlimited depth and session memory.',
  },
  {
    question: 'How is this different from just Googling interview questions?',
    answer:
      'You do not just read prompts — you respond under pressure, receive targeted scoring, and get concrete rewrites for stronger delivery.',
  },
  {
    question: 'Does it work for non-tech roles?',
    answer:
      'Absolutely. The role selector supports technical and non-technical tracks including PM, marketing, finance, and operations.',
  },
  {
    question: 'Can I practice for a specific company like Google or Swiggy?',
    answer:
      'Yes. You can tune the context and difficulty so the question style mirrors top-tier or high-growth company interview expectations.',
  },
  {
    question: 'How does the AI score my answers?',
    answer:
      'It evaluates clarity, depth, relevance, and confidence, then gives a practical next-step rewrite so you can improve quickly.',
  },
];

const ROLES = ['Software Engineer', 'Product Manager', 'Designer', 'Marketing', 'Finance', 'Operations'];
const QUESTION_TYPES = ['Behavioral', 'Technical', 'Case', 'HR', 'Salary Negotiation'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const FREE_QUESTION_LIMIT = 3;

type FeedbackPayload = {
  score: number;
  clarity: number;
  depth: number;
  relevance: number;
  summary: string;
  strength: string;
  improvement: string;
  betterAnswer: string;
};

type ChatMessage =
  | { role: 'ai'; content: string }
  | { role: 'user'; content: string }
  | { role: 'feedback'; content: FeedbackPayload };

type SessionState = 'idle' | 'active' | 'feedback' | 'done';

type InterviewState = {
  selectedRole: string;
  selectedType: string;
  selectedDifficulty: string;
  messages: ChatMessage[];
  sessionState: SessionState;
  questionCount: number;
};

type InterviewAction =
  | { type: 'set_role'; value: string }
  | { type: 'set_type'; value: string }
  | { type: 'set_difficulty'; value: string }
  | { type: 'start_session'; question: string }
  | { type: 'append_user'; answer: string }
  | { type: 'append_feedback'; feedback: FeedbackPayload }
  | { type: 'append_question'; question: string }
  | { type: 'set_feedback_state' }
  | { type: 'set_done' }
  | { type: 'reset' };

const INITIAL_STATE: InterviewState = {
  selectedRole: 'Software Engineer',
  selectedType: 'Behavioral',
  selectedDifficulty: 'Medium',
  messages: [],
  sessionState: 'idle',
  questionCount: 0,
};

function interviewReducer(state: InterviewState, action: InterviewAction): InterviewState {
  switch (action.type) {
    case 'set_role':
      return { ...state, selectedRole: action.value };
    case 'set_type':
      return { ...state, selectedType: action.value };
    case 'set_difficulty':
      return { ...state, selectedDifficulty: action.value };
    case 'start_session':
      return {
        ...state,
        messages: [{ role: 'ai', content: action.question }],
        sessionState: 'active',
        questionCount: 1,
      };
    case 'append_user':
      return {
        ...state,
        messages: [...state.messages, { role: 'user', content: action.answer }],
        sessionState: 'feedback',
      };
    case 'append_feedback':
      return {
        ...state,
        messages: [...state.messages, { role: 'feedback', content: action.feedback }],
        sessionState: state.questionCount >= 5 ? 'done' : 'active',
      };
    case 'append_question':
      return {
        ...state,
        messages: [...state.messages, { role: 'ai', content: action.question }],
        questionCount: state.questionCount + 1,
        sessionState: 'active',
      };
    case 'set_feedback_state':
      return { ...state, sessionState: 'feedback' };
    case 'set_done':
      return { ...state, sessionState: 'done' };
    case 'reset':
      return INITIAL_STATE;
    default:
      return state;
  }
}

function clampScore(value: number): number {
  return Math.max(1, Math.min(10, Number.isFinite(value) ? value : 1));
}

export default function InterviewPage() {
  const { toast } = useToast();
  const [state, dispatch] = useReducer(interviewReducer, INITIAL_STATE);
  const [draftAnswer, setDraftAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<'start' | 'answer' | null>(null);
  const [lastSubmittedAnswer, setLastSubmittedAnswer] = useState('');
  const [expandedBetterAnswer, setExpandedBetterAnswer] = useState<number | null>(null);
  const [showUpgradeGate, setShowUpgradeGate] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [exitIntentDismissed, setExitIntentDismissed] = useState(false);
  const [tipsCollapsed, setTipsCollapsed] = useState(false);
  const [isMobileConfigOpen, setIsMobileConfigOpen] = useState(false);
  const [disableAnimations, setDisableAnimations] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const progressValue = (state.questionCount / 5) * 100;
  const feedbackMessages = state.messages.filter((message): message is Extract<ChatMessage, { role: 'feedback' }> => message.role === 'feedback');
  const averageScore = feedbackMessages.length
    ? feedbackMessages.reduce((sum, item) => sum + item.content.score, 0) / feedbackMessages.length
    : 0;
  const topImprovementTip = feedbackMessages[feedbackMessages.length - 1]?.content.improvement ?? 'Tighten your structure and support every answer with specifics.';
  const isMidSession = state.messages.length > 0 && state.sessionState !== 'idle' && state.sessionState !== 'done';

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = '0px';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
  }, [draftAnswer]);

  useEffect(() => {
    if (!logRef.current) return;
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [state.messages, isLoading]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)');
    const apply = () => setDisableAnimations(media.matches || shouldReduceMotion);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [shouldReduceMotion]);

  useEffect(() => {
    function handleMouseOut(event: MouseEvent) {
      if (
        event.clientY <= 0 &&
        isMidSession &&
        !showUpgradeGate &&
        !showExitIntent &&
        !exitIntentDismissed &&
        window.innerWidth >= 1024
      ) {
        setShowExitIntent(true);
      }
    }

    document.addEventListener('mouseout', handleMouseOut);
    return () => document.removeEventListener('mouseout', handleMouseOut);
  }, [exitIntentDismissed, isMidSession, showExitIntent, showUpgradeGate]);

  async function callInterviewApi(
    mode: 'ask' | 'feedback',
    messages: Array<{ role: 'ai' | 'user' | 'feedback'; content: string }>
  ) {
    const response = await fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: state.selectedRole,
        questionType: state.selectedType,
        difficulty: state.selectedDifficulty,
        messages,
        mode,
      }),
    });

    if (!response.ok) {
      throw new Error('Something went wrong. Try again →');
    }

    return response.json();
  }

  async function requestFirstQuestion() {
    setIsLoading(true);
    setErrorMessage(null);
    setLastRequest('start');
    try {
      const result = await callInterviewApi('ask', []);
      dispatch({ type: 'start_session', question: result.data.question });
      setIsMobileConfigOpen(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Try again →');
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  }

  async function handleAnswerSubmit(answerOverride?: string) {
    const trimmed = (answerOverride ?? draftAnswer).trim();
    if (!trimmed || isLoading || state.sessionState === 'done' || showUpgradeGate) return;

    const currentMessages = [
      ...state.messages.map((message) => ({
        role: message.role,
        content: typeof message.content === 'string' ? message.content : JSON.stringify(message.content),
      })),
      { role: 'user' as const, content: trimmed },
    ];

    dispatch({ type: 'append_user', answer: trimmed });
    setDraftAnswer('');
    setLastSubmittedAnswer(trimmed);
    setExpandedBetterAnswer(null);
    setIsLoading(true);
    setErrorMessage(null);
    setLastRequest('answer');

    try {
      const feedbackResult = await callInterviewApi('feedback', currentMessages);
      const normalized: FeedbackPayload = {
        score: clampScore(feedbackResult.data.score),
        clarity: clampScore(feedbackResult.data.clarity),
        depth: clampScore(feedbackResult.data.depth),
        relevance: clampScore(feedbackResult.data.relevance),
        summary: String(feedbackResult.data.summary ?? ''),
        strength: String(feedbackResult.data.strength ?? ''),
        improvement: String(feedbackResult.data.improvement ?? ''),
        betterAnswer: String(feedbackResult.data.betterAnswer ?? ''),
      };

      dispatch({ type: 'append_feedback', feedback: normalized });

      if (state.questionCount >= 5) {
        dispatch({ type: 'set_done' });
        return;
      }

      if (state.questionCount >= FREE_QUESTION_LIMIT) {
        setShowUpgradeGate(true);
        return;
      }

      const askMessages = [
        ...currentMessages,
        { role: 'feedback' as const, content: JSON.stringify(normalized) },
      ];
      const askResult = await callInterviewApi('ask', askMessages);
      dispatch({ type: 'append_question', question: askResult.data.question });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Try again →');
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  }

  async function retryLastRequest() {
    if (lastRequest === 'start') {
      await requestFirstQuestion();
      return;
    }
    if (lastRequest === 'answer') {
      await handleAnswerSubmit(lastSubmittedAnswer);
    }
  }

  const tipText = useMemo(() => {
    if (state.selectedType === 'Behavioral') return 'Use STAR: situation, task, action, result.';
    if (state.selectedType === 'Technical') return 'Explain trade-offs, not just the final answer.';
    if (state.selectedType === 'Case') return 'Structure first, then walk through assumptions.';
    if (state.selectedType === 'HR') return 'Keep answers crisp, specific, and credible.';
    return 'Anchor your number, scope, and desired outcome with confidence.';
  }, [state.selectedType]);

  const quickTips = useMemo(() => {
    if (state.selectedType === 'Behavioral') {
      return [
        'Use the STAR method for behavioral questions',
        'Quantify your impact with numbers',
        'Ask a clarifying question if needed',
      ];
    }
    if (state.selectedType === 'Technical') {
      return [
        'State your assumptions clearly',
        'Explain trade-offs before conclusions',
        'Talk through constraints out loud',
      ];
    }
    if (state.selectedType === 'Case') {
      return [
        'Structure the problem before solving',
        'Show your assumptions and prioritization',
        'Drive toward a recommendation',
      ];
    }
    if (state.selectedType === 'HR') {
      return [
        'Keep the answer crisp and credible',
        'Support claims with one concrete example',
        'Tie your answer back to the role',
      ];
    }
    return [
      'Anchor your range with confidence',
      'Explain scope and impact behind your ask',
      'Stay flexible without sounding uncertain',
    ];
  }, [state.selectedType]);

  const motionSectionProps = disableAnimations
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'show',
        viewport: { once: true, amount: 0.2 },
      };

  async function handleShareScore() {
    const shareText = `Just scored ${averageScore.toFixed(1)}/10 in a mock ${state.selectedRole} interview on FitCV 🎯 Practice yours free at fitcv.in/interview`;

    try {
      if (navigator.share) {
        await navigator.share({ text: shareText, url: 'https://www.fitcv.in/interview' });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({ title: 'Score copied', description: 'Your share text is ready to paste.' });
      }
    } catch {
      toast({ variant: 'destructive', title: 'Share failed', description: 'Could not share your score.' });
    }
  }

  function resetFreeSession() {
    dispatch({ type: 'reset' });
    setDraftAnswer('');
    setLastSubmittedAnswer('');
    setErrorMessage(null);
    setExpandedBetterAnswer(null);
    setShowUpgradeGate(false);
    setShowExitIntent(false);
    setExitIntentDismissed(false);
  }

  return (
      <div className={cn(dmSans.className, 'min-h-screen bg-[#09090E] pb-24 text-[#F8F6F1] md:pb-0')}>
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-20">
        <motion.section
          {...motionSectionProps}
          transition={{ duration: 0.5 }}
          variants={FADE_UP}
          className="rounded-3xl border border-amber-300/20 bg-gradient-to-b from-amber-200/10 to-transparent px-6 py-12 md:px-10 md:py-16"
        >
          <h1 className={cn(playfair.className, 'max-w-4xl text-4xl font-bold leading-tight text-amber-100 md:text-6xl')}>
            Ace Every Interview.
          </h1>
          <p className="mt-5 max-w-3xl text-base text-slate-200/90 md:text-xl">
            AI-powered mock interviews tailored to your role. Real questions. Instant feedback. Land the offer.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="bg-amber-400 px-7 py-6 text-base font-semibold text-[#1A1304] hover:bg-amber-300">
              <Link href="#interview-lab">Start Free Practice →</Link>
            </Button>
            <Button asChild variant="outline" className="border-amber-200/40 bg-transparent px-7 py-6 text-base text-amber-100 hover:bg-amber-100/10">
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-amber-100/75">
            10,000+ interviews practiced · Free to start · No credit card
          </p>
        </motion.section>

        <motion.section
          id="how-it-works"
          {...motionSectionProps}
          transition={{ staggerChildren: 0.08, delayChildren: 0.05 }}
          className="mt-16"
        >
          <h2 className={cn(playfair.className, 'text-3xl font-semibold text-amber-100 md:text-4xl')}>How it works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {STEPS.map((step, idx) => (
              <motion.div key={step.title} variants={FADE_UP} transition={{ duration: 0.45, delay: idx * 0.08 }}>
                <Card className="h-full border border-amber-200/20 bg-[#11121A]">
                  <CardContent className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Step {idx + 1}</p>
                    <h3 className="mt-2 text-xl font-semibold text-amber-50">{step.title}</h3>
                    <p className="mt-3 text-sm text-slate-300">{step.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="interview-lab"
          {...motionSectionProps}
          transition={{ duration: 0.55 }}
          variants={FADE_UP}
          className="mt-16 rounded-3xl border border-amber-200/20 bg-[#0F1017] p-4 md:p-6"
        >
          <div className="mb-4 md:hidden">
            <Sheet open={isMobileConfigOpen} onOpenChange={setIsMobileConfigOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-amber-300/25 bg-transparent text-amber-100 hover:bg-amber-100/10"
                >
                  <Settings2 className="mr-2 h-4 w-4" />
                  Configure Interview
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto border-amber-300/20 bg-[#141624] text-slate-100">
                <SheetHeader>
                  <SheetTitle className="text-amber-100">Interview setup</SheetTitle>
                  <SheetDescription className="text-slate-300">
                    Pick your role, question type, and difficulty before you begin.
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-5">
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.18em] text-amber-300">Role</p>
                    <div className="flex flex-wrap gap-2">
                      {ROLES.map((item) => (
                        <button
                          key={`mobile-role-${item}`}
                          type="button"
                          aria-label={`Select role ${item}`}
                          onClick={() => dispatch({ type: 'set_role', value: item })}
                          className={cn(
                            'rounded-full border px-3 py-1.5 text-xs transition',
                            state.selectedRole === item
                              ? 'border-amber-300 bg-amber-300/15 text-amber-100'
                              : 'border-amber-200/25 text-slate-200 hover:border-amber-200/45'
                          )}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.18em] text-amber-300">Question Type</p>
                    <div className="flex flex-wrap gap-2">
                      {QUESTION_TYPES.map((item) => (
                        <button
                          key={`mobile-type-${item}`}
                          type="button"
                          aria-label={`Select question type ${item}`}
                          onClick={() => dispatch({ type: 'set_type', value: item })}
                          className={cn(
                            'rounded-full border px-3 py-1.5 text-xs transition',
                            state.selectedType === item
                              ? 'border-amber-300 bg-amber-300/15 text-amber-100'
                              : 'border-amber-200/25 text-slate-200 hover:border-amber-200/45'
                          )}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.18em] text-amber-300">Difficulty</p>
                    <div className="flex gap-2">
                      {DIFFICULTIES.map((item) => (
                        <button
                          key={`mobile-difficulty-${item}`}
                          type="button"
                          aria-label={`Select difficulty ${item}`}
                          onClick={() => dispatch({ type: 'set_difficulty', value: item })}
                          className={cn(
                            'rounded-full border px-3 py-1.5 text-xs transition',
                            state.selectedDifficulty === item
                              ? 'border-amber-300 bg-amber-300/15 text-amber-100'
                              : 'border-amber-200/25 text-slate-200 hover:border-amber-200/45'
                          )}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    aria-label="Start interview from mobile configuration drawer"
                    onClick={requestFirstQuestion}
                    disabled={isLoading}
                    className="w-full bg-amber-400 py-6 text-base font-semibold text-[#1A1304] hover:bg-amber-300"
                  >
                    {isLoading && state.sessionState === 'idle' ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#1A1304]" /> : null}
                    Start Interview
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="grid gap-4 xl:grid-cols-[330px_1fr_260px]">
            <aside className="hidden rounded-2xl border border-amber-200/20 bg-[#141624] p-5 md:block">
              <h3 className={cn(playfair.className, 'text-2xl font-semibold text-amber-100')}>Interview Lab</h3>
              <p className="mt-1 text-sm text-slate-300">Configure your role and session style.</p>

              <div className="mt-5">
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-amber-300">Role</p>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((item, idx) => (
                    <button
                      key={item}
                      type="button"
                      aria-label={`Select role ${item}`}
                      onClick={() => dispatch({ type: 'set_role', value: item })}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-xs transition',
                        state.selectedRole === item
                          ? 'border-amber-300 bg-amber-300/15 text-amber-100'
                          : 'border-amber-200/25 text-slate-200 hover:border-amber-200/45'
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-amber-300">Question Type</p>
                <div className="flex flex-wrap gap-2">
                  {QUESTION_TYPES.map((item) => {
                    const isPro = item === 'Salary Negotiation';
                    return (
                      <Tooltip key={item}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            aria-label={`Select question type ${item}`}
                            onClick={() => dispatch({ type: 'set_type', value: item })}
                            className={cn(
                              'rounded-full border px-3 py-1.5 text-xs transition',
                              state.selectedType === item
                                ? 'border-amber-300 bg-amber-300/15 text-amber-100'
                                : 'border-amber-200/25 text-slate-200 hover:border-amber-200/45'
                            )}
                          >
                            <span>{item}</span>
                            {isPro ? <Badge className="ml-2 bg-amber-400 text-[10px] text-[#1A1304]">Pro</Badge> : null}
                          </button>
                        </TooltipTrigger>
                        {isPro ? (
                          <TooltipContent className="border-amber-300/30 bg-[#171923] text-amber-50">
                            Unlock with Pro — ₹299/month
                          </TooltipContent>
                        ) : null}
                      </Tooltip>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-amber-300">Difficulty</p>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((item) => {
                    const isPro = item === 'Hard';
                    return (
                      <Tooltip key={item}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            aria-label={`Select difficulty ${item}`}
                            onClick={() => dispatch({ type: 'set_difficulty', value: item })}
                            className={cn(
                              'rounded-full border px-3 py-1.5 text-xs transition',
                              state.selectedDifficulty === item
                                ? 'border-amber-300 bg-amber-300/15 text-amber-100'
                                : 'border-amber-200/25 text-slate-200 hover:border-amber-200/45'
                            )}
                          >
                            <span>{item}</span>
                            {isPro ? <Badge className="ml-2 bg-amber-400 text-[10px] text-[#1A1304]">Pro</Badge> : null}
                          </button>
                        </TooltipTrigger>
                        {isPro ? (
                          <TooltipContent className="border-amber-300/30 bg-[#171923] text-amber-50">
                            Unlock with Pro — ₹299/month
                          </TooltipContent>
                        ) : null}
                      </Tooltip>
                    );
                  })}
                </div>
              </div>

              <Button
                aria-label="Start interview"
                onClick={requestFirstQuestion}
                disabled={isLoading}
                className="mt-8 w-full bg-amber-400 py-6 text-base font-semibold text-[#1A1304] hover:bg-amber-300"
              >
                {isLoading && state.sessionState === 'idle' ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#1A1304]" /> : null}
                Start Interview
              </Button>
            </aside>

            <div className="relative rounded-2xl border border-amber-200/20 bg-[#0C0D13] p-6 md:p-8">
              <div className="mb-4 rounded-xl border border-amber-300/15 bg-[#10121A] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-amber-100">Question {Math.max(state.questionCount, 0)} of 5</p>
                    <p className="text-xs text-slate-400">{state.selectedRole} · {state.selectedType} · {state.selectedDifficulty}</p>
                  </div>
                  <Badge variant="outline" className="border-amber-300/30 text-amber-200">Live practice</Badge>
                </div>
                <Progress value={progressValue} className="mt-3 h-2 bg-white/10" />
              </div>

              <div className={cn(showUpgradeGate && 'pointer-events-none select-none blur-sm transition')}>
                <div
                  ref={logRef}
                  role="log"
                  aria-live="polite"
                  className="h-full min-h-[420px] space-y-4 overflow-y-auto rounded-xl border border-dashed border-amber-200/20 bg-[#0A0B11] p-4"
                >
                {state.messages.length === 0 ? (
                  <div className="flex h-full min-h-[260px] items-center justify-center text-center">
                    <div>
                      <p className="text-lg font-medium text-amber-100">Configure your session and hit Start</p>
                      <p className="mt-2 text-sm text-slate-300">
                        Your AI interviewer will ask one sharp question at a time and score your answer quality.
                      </p>
                    </div>
                  </div>
                ) : (
                  state.messages.map((message, index) => {
                    if (message.role === 'ai') {
                      return (
                        <div key={`ai-${index}`} className="max-w-3xl rounded-2xl border border-amber-300/15 bg-[#171923] p-4">
                          <p className="mb-1 text-xs uppercase tracking-[0.18em] text-amber-300">AI Interviewer</p>
                          <p className="text-sm leading-relaxed text-slate-100">{message.content}</p>
                        </div>
                      );
                    }

                    if (message.role === 'user') {
                      return (
                        <div key={`user-${index}`} className="ml-auto max-w-3xl rounded-2xl border border-amber-200/15 bg-amber-200/8 p-4">
                          <p className="mb-1 text-xs uppercase tracking-[0.18em] text-amber-300">You</p>
                          <p className="text-sm leading-relaxed text-slate-100">{message.content}</p>
                        </div>
                      );
                    }

                    return (
                      <div key={`feedback-${index}`} className="max-w-3xl rounded-2xl border border-emerald-300/15 bg-[#121A18] p-4">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Feedback</p>
                          <Badge className="bg-emerald-300 text-[#09110E]">Score {message.content.score}/10</Badge>
                        </div>
                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                          {[
                            ['Clarity', message.content.clarity],
                            ['Depth', message.content.depth],
                            ['Relevance', message.content.relevance],
                          ].map(([label, value]) => (
                            <div key={label}>
                              <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                                <span>{label}</span>
                                <span>{value}/10</span>
                              </div>
                              <Progress value={(Number(value) / 10) * 100} className="h-2 bg-white/10" />
                            </div>
                          ))}
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-slate-100">{message.content.summary}</p>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          <div className="rounded-xl border border-white/10 bg-black/15 p-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Strength</p>
                            <p className="mt-2 text-sm text-slate-200">{message.content.strength}</p>
                          </div>
                          <div className="rounded-xl border border-white/10 bg-black/15 p-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-amber-300">Improve</p>
                            <p className="mt-2 text-sm text-slate-200">{message.content.improvement}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label="Toggle better answer example"
                          onClick={() => setExpandedBetterAnswer(expandedBetterAnswer === index ? null : index)}
                          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-200"
                        >
                          Better answer
                          <ChevronDown className={cn('h-4 w-4 transition-transform', expandedBetterAnswer === index && 'rotate-180')} />
                        </button>
                        {expandedBetterAnswer === index ? (
                          <div className="mt-3 rounded-xl border border-amber-200/15 bg-[#19150D] p-3 text-sm text-slate-100">
                            {message.content.betterAnswer}
                          </div>
                        ) : null}
                      </div>
                    );
                  })
                )}

                {isLoading ? (
                  <div className="max-w-3xl rounded-2xl border border-amber-300/15 bg-[#171923] p-4">
                    <p className="mb-1 text-xs uppercase tracking-[0.18em] text-amber-300">AI Interviewer</p>
                    <div className="flex gap-2">
                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-amber-300 [animation-delay:-0.2s]" />
                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-amber-300 [animation-delay:-0.1s]" />
                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-amber-300" />
                    </div>
                  </div>
                ) : null}

                {state.sessionState === 'done' ? (
                  <div className="max-w-3xl rounded-2xl border border-amber-300/20 bg-[#18150D] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-amber-300">Session Summary</p>
                        <h4 className="mt-1 text-xl font-semibold text-amber-100">Average score: {averageScore.toFixed(1)}/10</h4>
                      </div>
                      <Sparkles className="h-5 w-5 text-amber-300" />
                    </div>
                    <p className="mt-4 text-sm text-slate-200">Top improvement tip: {topImprovementTip}</p>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <Button
                        aria-label="Share your interview score"
                        onClick={handleShareScore}
                        variant="outline"
                        className="border-amber-300/25 text-amber-100 hover:bg-amber-100/10"
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share your score
                      </Button>
                    </div>
                    <div className="mt-4 rounded-2xl border border-amber-300/20 bg-[#141624] p-4">
                      <p className="text-sm font-semibold text-amber-100">📁 Save this session to review later</p>
                      <p className="mt-2 text-sm text-slate-300">
                        Pro users get full session history, answer transcripts, and improvement tracking.
                      </p>
                      <Button asChild className="mt-4 bg-amber-400 text-[#1A1304] hover:bg-amber-300">
                        <Link href="/pricing">Unlock Session History →</Link>
                      </Button>
                    </div>
                    <Button
                      aria-label="Start over interview session"
                      onClick={resetFreeSession}
                      variant="outline"
                      className="mt-4 border-amber-300/25 text-amber-100 hover:bg-amber-100/10"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Start Over
                    </Button>
                  </div>
                ) : null}

                {errorMessage ? (
                  <div className="max-w-3xl rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
                    <p className="text-sm text-red-100">{errorMessage}</p>
                    <Button
                      aria-label="Retry last interview request"
                      onClick={retryLastRequest}
                      variant="outline"
                      className="mt-3 border-red-300/30 text-red-100 hover:bg-red-100/10"
                    >
                      Try again →
                    </Button>
                  </div>
                ) : null}
                </div>

                <div className="mt-4 rounded-xl border border-amber-200/15 bg-[#10121A] p-4">
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-amber-300">Your answer</p>
                <Textarea
                  ref={textareaRef}
                  aria-label="Type your interview answer"
                  value={draftAnswer}
                  onChange={(event) => setDraftAnswer(event.target.value)}
                  onKeyDown={(event) => {
                    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                      event.preventDefault();
                      void handleAnswerSubmit();
                    }
                  }}
                  disabled={isLoading || state.sessionState === 'idle' || state.sessionState === 'done' || showUpgradeGate}
                  placeholder="Type your answer here. Be specific, structured, and persuasive."
                  className="min-h-[96px] resize-none border-amber-200/15 bg-[#0A0B11] text-slate-100 placeholder:text-slate-500"
                />
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-400">Cmd+Enter to send</p>
                  <div className="flex items-center gap-3">
                    <p className="hidden text-xs text-amber-200 md:block">Tip: {tipText}</p>
                    <Button
                      aria-label="Send interview answer"
                      onClick={() => void handleAnswerSubmit()}
                      disabled={isLoading || !draftAnswer.trim() || state.sessionState === 'idle' || state.sessionState === 'done' || showUpgradeGate}
                      className="bg-amber-400 text-[#1A1304] hover:bg-amber-300"
                    >
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#1A1304]" /> : <Send className="mr-2 h-4 w-4" />}
                      Send
                    </Button>
                  </div>
                </div>
              </div>

              {showUpgradeGate ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#09090E]/70 p-6">
                  <div className="w-full max-w-lg rounded-3xl border border-amber-300/30 bg-[#141624] p-6 text-center shadow-2xl">
                    <Lock className="mx-auto h-8 w-8 text-amber-300" />
                    <h4 className={cn(playfair.className, 'mt-4 text-3xl font-semibold text-amber-100')}>
                      You&apos;ve used your 3 free questions this session.
                    </h4>
                    <p className="mt-3 text-sm text-slate-300">
                      Upgrade to Pro to continue — unlimited interviews, deeper feedback, session history.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <Button asChild className="bg-amber-400 text-[#1A1304] hover:bg-amber-300">
                        <Link href="/pricing">Upgrade to Pro — ₹299/month</Link>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={resetFreeSession}
                        className="border-amber-300/30 text-amber-100 hover:bg-amber-100/10"
                      >
                        Start a new free session
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="hidden rounded-2xl border border-amber-200/20 bg-[#11131B] p-5 xl:block">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-amber-300">Quick Tips</p>
                  <h4 className="mt-1 text-lg font-semibold text-amber-100">Live coaching cues</h4>
                </div>
                <button
                  type="button"
                  aria-label={tipsCollapsed ? 'Expand tips sidebar' : 'Collapse tips sidebar'}
                  onClick={() => setTipsCollapsed((value) => !value)}
                  className="rounded-full border border-amber-300/20 p-2 text-amber-200"
                >
                  {tipsCollapsed ? <PanelRightOpen className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
                </button>
              </div>
              {!tipsCollapsed ? (
                <div className="mt-5 space-y-3">
                  {quickTips.map((tip) => (
                    <div key={tip} className="rounded-xl border border-amber-200/15 bg-[#0A0B11] p-3 text-sm text-slate-200">
                      {tip}
                    </div>
                  ))}
                </div>
              ) : null}
            </aside>
          </div>
        </motion.section>

        <motion.section
          {...motionSectionProps}
          transition={{ staggerChildren: 0.08 }}
          className="mt-16"
        >
          <h2 className={cn(playfair.className, 'text-3xl font-semibold text-amber-100 md:text-4xl')}>Why candidates convert faster</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, idx) => (
              <motion.div key={feature} variants={FADE_UP} transition={{ duration: 0.45, delay: idx * 0.08 }}>
                <Card className="h-full border border-amber-200/20 bg-[#10121C]">
                  <CardContent className="p-6">
                    <p className="text-base font-medium text-slate-100">{feature}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          {...motionSectionProps}
          transition={{ staggerChildren: 0.08 }}
          className="mt-16"
        >
          <h2 className={cn(playfair.className, 'text-3xl font-semibold text-amber-100 md:text-4xl')}>People who practiced, then converted</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial, idx) => (
              <motion.div key={testimonial.person} variants={FADE_UP} transition={{ duration: 0.45, delay: idx * 0.08 }}>
                <Card className="h-full border border-amber-200/20 bg-[#11131E]">
                  <CardContent className="p-6">
                    <p className="text-sm leading-relaxed text-slate-200">“{testimonial.quote}”</p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">{testimonial.person}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          {...motionSectionProps}
          transition={{ duration: 0.5 }}
          variants={FADE_UP}
          className="mt-16 rounded-3xl border border-amber-300/20 bg-gradient-to-r from-[#1B1608] to-[#111219] p-6 md:p-8"
        >
          <h3 className={cn(playfair.className, 'text-3xl font-semibold text-amber-100')}>Simple pricing while you scale</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-amber-100/20 bg-black/20 p-4">
              <p className="text-lg font-semibold text-amber-100">Free</p>
              <p className="mt-1 text-sm text-slate-200">3 mock interviews/month, basic feedback</p>
            </div>
            <div className="rounded-xl border border-amber-300/40 bg-amber-200/10 p-4">
              <p className="text-lg font-semibold text-amber-100">Pro (₹299/mo)</p>
              <p className="mt-1 text-sm text-slate-200">Unlimited interviews, deep scoring, session history, salary negotiation mode</p>
            </div>
          </div>
          <Button asChild className="mt-5 bg-amber-400 px-7 py-6 text-base font-semibold text-[#1A1304] hover:bg-amber-300">
            <Link href="/pricing">Upgrade to Pro — ₹299/month</Link>
          </Button>
        </motion.section>

        <motion.section
          {...motionSectionProps}
          transition={{ duration: 0.5 }}
          variants={FADE_UP}
          className="mt-16 rounded-3xl border border-amber-200/20 bg-[#11131B] p-6 md:p-8"
        >
          <h2 className={cn(playfair.className, 'text-3xl font-semibold text-amber-100 md:text-4xl')}>FAQ</h2>
          <Accordion type="single" collapsible className="mt-4">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem key={item.question} value={`q${index + 1}`} className="border-amber-200/20">
                <AccordionTrigger className="text-left text-amber-50">{item.question}</AccordionTrigger>
                <AccordionContent className="text-slate-300">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.section>

        <motion.section
          {...motionSectionProps}
          transition={{ duration: 0.5 }}
          variants={FADE_UP}
          className="mt-16 rounded-3xl border border-amber-300/30 bg-gradient-to-r from-amber-200/10 to-transparent p-8 text-center md:p-10"
        >
          <h2 className={cn(playfair.className, 'text-3xl font-semibold text-amber-100 md:text-5xl')}>
            Your next interview is closer than you think.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-200 md:text-base">
            Start practicing free today. No signup needed for your first session.
          </p>
          <Button asChild className="mt-7 bg-amber-400 px-8 py-6 text-base font-semibold text-[#1A1304] hover:bg-amber-300">
            <Link href="#interview-lab">Launch Interview Lab →</Link>
          </Button>
        </motion.section>
      </div>

      {isMidSession ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-amber-300/20 bg-[#11131B]/95 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-amber-100">🔥 You&apos;re on a roll — Go Pro for unlimited practice</p>
            <Button asChild className="shrink-0 bg-amber-400 px-4 text-[#1A1304] hover:bg-amber-300">
              <Link href="/pricing">Upgrade ₹299/mo</Link>
            </Button>
          </div>
        </div>
      ) : null}

      <Dialog open={showExitIntent} onOpenChange={setShowExitIntent}>
        <DialogContent className="max-w-md border-amber-300/20 bg-[#11131B] text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-amber-100">Wait — you&apos;re in the middle of an interview!</DialogTitle>
            <DialogDescription className="text-slate-300">
              Real interviews don&apos;t pause. Finish this session to get your full feedback report.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start sm:space-x-3">
            <Button
              onClick={() => {
                setShowExitIntent(false);
                setExitIntentDismissed(true);
                textareaRef.current?.focus();
              }}
              className="bg-amber-400 text-[#1A1304] hover:bg-amber-300"
            >
              Continue Interview
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowExitIntent(false);
                setExitIntentDismissed(true);
              }}
              className="border-amber-300/25 text-amber-100 hover:bg-amber-100/10"
            >
              Leave anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
  );
}
