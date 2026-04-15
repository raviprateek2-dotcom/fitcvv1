
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mockInterview } from '@/app/actions/ai-mock-interviewer';
import type { MockInterviewOutput } from '@/app/actions/schemas/ai-mock-interviewer';
import { Loader2, Sparkles, RefreshCw, Bot, Lightbulb, Volume2, UserCheck, ShieldAlert, Binary, Terminal, Database, Layers, Rocket, ChartLine, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiNarrate } from '@/app/actions/ai-narrator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics-events';

const interviewQuestions: Record<string, string[]> = {
    general: [
        "Tell me about yourself.",
        "What are your biggest strengths?",
        "What are your biggest weaknesses?",
        "Where do you see yourself in 5 years?",
        "Why do you want to work for this company?",
        "Why should we hire you?",
        "What is your greatest professional achievement?",
        "How do you handle stress and pressure?",
        "Describe a difficult work situation and how you overcame it.",
        "What are your salary expectations?"
    ],
    frontend: [
        "Explain the virtual DOM in React.",
        "How do you optimize web performance?",
        "What is the difference between relative, absolute, and fixed positioning?",
        "How do you handle state management in a large-scale application?",
        "What are your thoughts on CSS-in-JS vs utility-first CSS?"
    ],
    backend: [
        "Describe the differences between SQL and NoSQL databases.",
        "How do you design a system for high availability?",
        "What is REST vs GraphQL, and when would you use each?",
        "Explain how a microservices architecture handles communication.",
        "How do you ensure data integrity across distributed systems?"
    ],
    fullstack: [
        "Walk me through how you would architect a real-time chat application.",
        "How do you balance server-side vs client-side rendering?",
        "Describe your ideal deployment pipeline from code commit to production.",
        "How do you handle authentication and authorization across the stack?",
        "What criteria do you use to choose a tech stack for a new project?"
    ],
    pm: [
        "How do you prioritize features when resources are limited?",
        "Tell me about a time you had to pivot a product strategy based on data.",
        "How do you handle a conflict between design and engineering teams?",
        "What metrics would you track for a new social media app's launch?",
        "Explain a technical concept to a non-technical stakeholder."
    ],
    'data-science': [
        "What is the difference between supervised and unsupervised learning?",
        "Explain the bias-variance tradeoff.",
        "How do you handle missing or noisy data in your analysis?",
        "Describe a project where you used data to drive a business decision.",
        "What are the assumptions of a linear regression model?"
    ]
};

const personas = [
    { id: 'friendly', name: 'Friendly Peer', icon: <UserCheck className="w-4 h-4" />, description: 'Supportive and encouraging feedback.' },
    { id: 'strict', name: 'Strict Recruiter', icon: <ShieldAlert className="w-4 h-4" />, description: 'Direct and rigorous evaluation.' },
    { id: 'technical', name: 'Lead Architect', icon: <Binary className="w-4 h-4" />, description: 'Focuses on depth and logic.' },
] as const;

const tracks = [
    { id: 'general', name: 'General Career', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'frontend', name: 'Frontend Eng', icon: <Terminal className="w-4 h-4" /> },
    { id: 'backend', name: 'Backend Eng', icon: <Database className="w-4 h-4" /> },
    { id: 'fullstack', name: 'Fullstack Eng', icon: <Layers className="w-4 h-4" /> },
    { id: 'pm', name: 'Product Management', icon: <Rocket className="w-4 h-4" /> },
    { id: 'data-science', name: 'Data Science', icon: <ChartLine className="w-4 h-4" /> },
] as const;

interface MockInterviewProps {
    initialQuestion?: string;
}

export function MockInterview({ initialQuestion }: MockInterviewProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MockInterviewOutput | null>(null);
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion || '');
  const [persona, setPersona] = useState<typeof personas[number]['id']>('friendly');
  const [track, setTrack] = useState<typeof tracks[number]['id']>('general');
  const [isNarrating, setIsNarrating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!initialQuestion) {
        getNewQuestion(track);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  const getNewQuestion = (selectedTrack: typeof tracks[number]['id']) => {
    const questions = interviewQuestions[selectedTrack] || interviewQuestions.general;
    let nextQuestion;
    do {
      nextQuestion = questions[Math.floor(Math.random() * questions.length)];
    } while (nextQuestion === currentQuestion && questions.length > 1);
    setCurrentQuestion(nextQuestion);
    setUserAnswer('');
    setResult(null);
  };

  const handleTrackChange = (newTrack: typeof tracks[number]['id']) => {
      setTrack(newTrack);
      getNewQuestion(newTrack);
  }

  const handleAnalyze = async () => {
    if (!userAnswer) {
      toast({ variant: 'destructive', title: 'Answer Required', description: "Please provide your answer before requesting feedback." });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await mockInterview({ userAnswer, question: currentQuestion, persona, track });
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        throw new Error(response.error);
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNarrateFeedback = async () => {
    if (!result) return;
    setIsNarrating(true);
    try {
      const response = await aiNarrate(`${result.feedback}. Suggested improvement: ${result.suggestedImprovement}`);
      if (response.success && response.data && audioRef.current) {
        audioRef.current.src = response.data.audioDataUri;
        audioRef.current.play();
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Narration Failed', description: "Could not generate audio for this feedback." });
    } finally {
      setIsNarrating(false);
    }
  };

  return (
    <section id="mock-interviewer">
        <audio ref={audioRef} className="hidden" />
        <Card variant='neuro' className="bg-background">
            <CardHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
                <CardTitle className="text-xl sm:text-2xl font-headline font-bold flex items-center gap-2">
                    <Bot className="text-primary h-6 w-6 shrink-0" aria-hidden />
                    AI Mock Interviewer
                </CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                    Choose a persona and track. Type an answer here or use voice practice above for spoken rehearsal.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-4 pb-4 sm:px-6 sm:pb-6">
                 <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-muted-foreground">1. Select Interview Track</Label>
                            <Select value={track} onValueChange={(v: any) => handleTrackChange(v)}>
                                <SelectTrigger className="min-h-[48px] text-base md:text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {tracks.map(t => (
                                        <SelectItem key={t.id} value={t.id}>
                                            <div className="flex items-center gap-2">
                                                {t.icon}
                                                <span>{t.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-muted-foreground">2. Question context</Label>
                            <p
                              className="p-4 bg-secondary rounded-xl text-lg md:text-base font-semibold min-h-[6.5rem] flex items-center justify-center text-center leading-snug text-foreground"
                              role="status"
                            >
                                &ldquo;{currentQuestion}&rdquo;
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => getNewQuestion(track)}
                              className="w-full min-h-[44px] text-base md:text-sm"
                            >
                                <RefreshCw className="mr-2 h-4 w-4 shrink-0" aria-hidden />
                                New question
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">3. Interviewer Persona</Label>
                        <Select value={persona} onValueChange={(v: any) => setPersona(v)}>
                            <SelectTrigger className="min-h-[140px] h-auto md:h-[188px] py-3 md:py-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {personas.map(p => (
                                    <SelectItem key={p.id} value={p.id}>
                                        <div className="flex items-center gap-3 py-2">
                                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                                {p.icon}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-sm">{p.name}</p>
                                                <p className="text-[10px] text-muted-foreground max-w-[180px] whitespace-normal">{p.description}</p>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label htmlFor="user-answer" className="font-semibold">Your Answer:</Label>
                    <Textarea
                        id="user-answer"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your answer here or use the voice mode above for real-time practice..."
                        rows={6}
                        disabled={isLoading}
                        className="min-h-[160px] text-base md:text-sm"
                    />
                 </div>
                 <Button onClick={handleAnalyze} disabled={isLoading} className="w-full min-h-[52px] h-auto py-3 text-base font-semibold">
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                    {isLoading ? 'Consulting Coach...' : 'Get Personalized Feedback'}
                 </Button>
            </CardContent>

            <AnimatePresence mode="wait">
                {result && (
                     <CardFooter>
                        <motion.div
                            className="w-full space-y-6 pt-6 border-t"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="text-yellow-500" /> {personas.find(p => p.id === persona)?.name}'s Review</h3>
                                <Button size="icon" variant="ghost" onClick={handleNarrateFeedback} disabled={isNarrating}>
                                    {isNarrating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
                                </Button>
                            </div>
                             <div className="p-4 bg-secondary/50 rounded-xl text-sm leading-relaxed border border-primary/10">{result.feedback}</div>
                             <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2 text-primary"><Sparkles className="w-4 h-4" /> Strategic Phrasing</h3>
                                <p className="text-sm p-4 border rounded-xl italic bg-primary/5 border-primary/20">"{result.suggestedImprovement}"</p>
                            </div>
                            <Button asChild variant="outline" className="w-full sm:w-auto">
                              <Link
                                href="/dashboard/jobs?source=interview_completion"
                                onClick={() => trackEvent('job_tracker_open', { source: 'interview_completion' })}
                              >
                                Track this interview in Job Board
                              </Link>
                            </Button>
                        </motion.div>
                     </CardFooter>
                )}
            </AnimatePresence>
        </Card>
    </section>
  );
}
