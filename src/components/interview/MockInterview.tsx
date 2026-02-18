
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mockInterview } from '@/app/actions/ai-mock-interviewer';
import type { MockInterviewOutput } from '@/app/actions/schemas/ai-mock-interviewer';
import { Loader2, Sparkles, RefreshCw, Bot, Lightbulb, Volume2, UserCheck, ShieldAlert, Binary } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiNarrate } from '@/app/actions/ai-narrator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const interviewQuestions = [
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
];

const personas = [
    { id: 'friendly', name: 'Friendly Peer', icon: <UserCheck className="w-4 h-4" />, description: 'Supportive and encouraging feedback.' },
    { id: 'strict', name: 'Strict Recruiter', icon: <ShieldAlert className="w-4 h-4" />, description: 'Direct and rigorous evaluation.' },
    { id: 'technical', name: 'Lead Architect', icon: <Binary className="w-4 h-4" />, description: 'Focuses on depth and logic.' },
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
  const [isNarrating, setIsNarrating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!initialQuestion) {
        getNewQuestion();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  const getNewQuestion = () => {
    let nextQuestion;
    do {
      nextQuestion = interviewQuestions[Math.floor(Math.random() * interviewQuestions.length)];
    } while (nextQuestion === currentQuestion);
    setCurrentQuestion(nextQuestion);
    setUserAnswer('');
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!userAnswer) {
      toast({ variant: 'destructive', title: 'Answer Required' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await mockInterview({ userAnswer, question: currentQuestion, persona });
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
      toast({ variant: 'destructive', title: 'Narration Failed' });
    } finally {
      setIsNarrating(false);
    }
  };

  return (
    <section id="mock-interviewer">
        <audio ref={audioRef} className="hidden" />
        <Card variant='neuro' className="bg-background">
            <CardHeader>
                <CardTitle className="text-2xl font-headline font-bold flex items-center gap-2">
                    <Bot className="text-primary"/>
                    AI Mock Interviewer
                </CardTitle>
                <CardDescription>
                    Choose a persona and practice your answers.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="font-semibold">Question Context:</Label>
                        <p className="p-3 bg-secondary rounded-md text-sm font-medium h-20 flex items-center justify-center text-center">"{currentQuestion}"</p>
                        <Button variant="ghost" size="sm" onClick={getNewQuestion} className="w-full">
                            <RefreshCw className="mr-2 h-3 w-3"/> New Question
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <Label className="font-semibold">Interviewer Persona:</Label>
                        <Select value={persona} onValueChange={(v: any) => setPersona(v)}>
                            <SelectTrigger className="h-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {personas.map(p => (
                                    <SelectItem key={p.id} value={p.id}>
                                        <div className="flex items-center gap-2">
                                            {p.icon}
                                            <div className="text-left">
                                                <p className="font-bold">{p.name}</p>
                                                <p className="text-[10px] text-muted-foreground">{p.description}</p>
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
                        placeholder="Type your answer here..."
                        rows={6}
                        disabled={isLoading}
                    />
                 </div>
                 <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Consulting Coach...' : 'Get Personalized Feedback'}
                 </Button>
            </CardContent>

            <AnimatePresence>
                {result && (
                     <CardFooter>
                        <motion.div
                            className="w-full space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="text-yellow-500" /> {personas.find(p => p.id === persona)?.name}'s Review</h3>
                                <Button size="icon" variant="ghost" onClick={handleNarrateFeedback} disabled={isNarrating}>
                                    {isNarrating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
                                </Button>
                            </div>
                             <div className="p-4 bg-secondary rounded-md text-sm leading-relaxed">{result.feedback}</div>
                             <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2 text-primary"><Sparkles className="w-4 h-4" /> Better Way to Phrase It</h3>
                                <p className="text-sm p-4 border rounded-md italic bg-primary/5">"{result.suggestedImprovement}"</p>
                            </div>
                        </motion.div>
                     </CardFooter>
                )}
            </AnimatePresence>
        </Card>
    </section>
  );
}
