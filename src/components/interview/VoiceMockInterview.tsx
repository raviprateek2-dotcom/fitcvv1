
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { mockInterview } from '@/app/actions/ai-mock-interviewer';
import { aiNarrate } from '@/app/actions/ai-narrator';
import { Loader2, Mic, MicOff, RefreshCw, Volume2, Ear, AlertCircle, Terminal, Database, Layers, Rocket, ChartLine, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const interviewQuestions: Record<string, string[]> = {
  general: [
    "Tell me about yourself.",
    "What are your biggest strengths?",
    "What are your biggest weaknesses?",
    "Where do you see yourself in 5 years?",
    "Why do you want to work for this company?",
    "Why should we hire you?",
  ],
  frontend: [
    "How do you handle responsive design across complex layouts?",
    "What is your approach to testing frontend components?",
    "Explain how you would improve the perceived performance of a web app.",
  ],
  backend: [
    "How do you manage database migrations in a production environment?",
    "Describe your experience with containerization and orchestration.",
    "What is your strategy for handling API rate limiting?",
  ],
  fullstack: [
    "How do you decide between a relational and a non-relational database?",
    "Explain the security considerations when building a full-stack app.",
    "Walk me through your debugging process for an issue that spans the stack.",
  ],
  pm: [
    "How do you translate customer feedback into product requirements?",
    "Describe your experience with agile product development.",
    "How do you measure the success of a newly launched feature?",
  ],
  'data-science': [
    "What criteria do you use to evaluate a machine learning model's performance?",
    "Explain a complex statistical concept to a business stakeholder.",
    "How do you approach a dataset with significant class imbalance?",
  ]
};

const tracks = [
    { id: 'general', name: 'General', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'frontend', name: 'Frontend', icon: <Terminal className="w-4 h-4" /> },
    { id: 'backend', name: 'Backend', icon: <Database className="w-4 h-4" /> },
    { id: 'fullstack', name: 'Fullstack', icon: <Layers className="w-4 h-4" /> },
    { id: 'pm', name: 'Product', icon: <Rocket className="w-4 h-4" /> },
    { id: 'data-science', name: 'Data Sci', icon: <ChartLine className="w-4 h-4" /> },
] as const;

type InterviewState = 'idle' | 'listening' | 'processing' | 'speaking' | 'generatingQuestionAudio' | 'unsupported';

type MicPlatform = 'ios' | 'android' | 'desktop';

function detectMicPlatform(): MicPlatform {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'desktop';
}

function micPermissionHint(platform: MicPlatform): string {
  if (platform === 'ios') {
    return 'On iPhone or iPad, Safari will ask for the microphone. If nothing happens, open Settings → Safari → Microphone and choose Ask or Allow, then reload this page.';
  }
  if (platform === 'android') {
    return 'On Android, tap the lock or site icon in Chrome’s address bar → Permissions → Microphone → Allow, then try the mic again.';
  }
  return 'Your browser may prompt for microphone access when you tap the mic. If you blocked it earlier, use the lock icon in the address bar to allow the microphone for this site.';
}

function micPermissionBrief(platform: MicPlatform): string {
  if (platform === 'ios') {
    return 'Tap the mic, then allow access. If it’s blocked: Settings → Safari → Microphone for this site.';
  }
  if (platform === 'android') {
    return 'Tap the mic, then allow access. If it’s blocked: Chrome lock icon → Site settings → Microphone.';
  }
  return 'Tap the mic and allow access when your browser asks. You can change this via the address bar lock icon.';
}

export function VoiceMockInterview() {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [micPlatform, setMicPlatform] = useState<MicPlatform>('desktop');
  const [interviewState, setInterviewState] = useState<InterviewState>('idle');
  const [transcript, setTranscript] = useState('');
  const [feedbackAudio, setFeedbackAudio] = useState<string | null>(null);
  const [questionAudio, setQuestionAudio] = useState<string | null>(null);
  const [track, setTrack] = useState<typeof tracks[number]['id']>('general');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { toast } = useToast();

  const getNewQuestion = useCallback((selectedTrack: typeof tracks[number]['id'] = track) => {
    const questions = interviewQuestions[selectedTrack] || interviewQuestions.general;
    let nextQuestion;
    do {
      nextQuestion = questions[Math.floor(Math.random() * questions.length)];
    } while (nextQuestion === currentQuestion && questions.length > 1);
    setCurrentQuestion(nextQuestion);
    setTranscript('');
    setFeedbackAudio(null);
    setQuestionAudio(null);
    if (interviewState !== 'unsupported') {
      setInterviewState('idle');
    }
  }, [currentQuestion, interviewState, track]);

  const handleTrackChange = (newTrack: typeof tracks[number]['id']) => {
      setTrack(newTrack);
      getNewQuestion(newTrack);
  }

  // Initialize component and select first question
  useEffect(() => {
    setIsMounted(true);
    getNewQuestion('general');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMicPlatform(detectMicPlatform());
  }, []);

  const processTranscript = useCallback(async () => {
    if (!transcript.trim()) {
      toast({ variant: 'destructive', title: 'No answer detected', description: 'Please provide a spoken answer before stopping.' });
      setInterviewState('idle');
      return;
    }
    
    try {
      const feedbackResponse = await mockInterview({ userAnswer: transcript, question: currentQuestion, track, persona: 'friendly' });
      if (!feedbackResponse.success || !feedbackResponse.data) {
        throw new Error(feedbackResponse.error || 'Failed to get interview feedback.');
      }
      const fullFeedbackText = `Coach here. ${feedbackResponse.data.feedback}. For a stronger answer, you could try: ${feedbackResponse.data.suggestedImprovement}`;

      const audioResponse = await aiNarrate(fullFeedbackText);
      if (!audioResponse.success || !audioResponse.data) {
        throw new Error(audioResponse.error || 'Failed to generate audio feedback.');
      }
      
      setFeedbackAudio(audioResponse.data.audioDataUri);
      setInterviewState('speaking');

    } catch (error: unknown) {
      toast({ variant: 'destructive', title: 'Processing Failed', description: error instanceof Error ? error.message : 'Processing failed' });
      setInterviewState('idle');
    }
  }, [transcript, currentQuestion, toast, track]);


  // Main effect for Speech Recognition and state processing
  useEffect(() => {
    if (typeof window !== 'undefined' && !recognitionRef.current) {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognitionAPI) {
            recognitionRef.current = new SpeechRecognitionAPI();
            const recognition = recognitionRef.current;

            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event: Event) => {
                const se = event as unknown as { resultIndex: number; results: SpeechRecognitionResultList };
                let finalTranscript = '';
                for (let i = se.resultIndex; i < se.results.length; ++i) {
                  if (se.results[i].isFinal) {
                    finalTranscript += se.results[i][0].transcript;
                  }
                }
                if (finalTranscript) {
                  setTranscript(prev => prev + finalTranscript + ' ');
                }
            };

            recognition.onerror = (event: Event) => {
                const errorEvent = event as unknown as { error: string };
                if (errorEvent.error === 'not-allowed' || errorEvent.error === 'service-not-allowed') {
                    toast({
                      variant: 'destructive',
                      title: 'Microphone blocked',
                      description: micPermissionHint(detectMicPlatform()),
                    });
                } else if (errorEvent.error !== 'no-speech') {
                    toast({ variant: 'destructive', title: 'Recognition Error', description: `Voice system error: ${errorEvent.error}` });
                }
                setInterviewState('idle');
            };
            
            recognition.onend = () => {
                if (interviewState === 'listening') {
                    setInterviewState('processing');
                }
            };
        } else {
            setInterviewState('unsupported');
        }
    }
    
    if (interviewState === 'processing') {
      processTranscript();
    }
  }, [toast, interviewState, processTranscript]);
  
  const readQuestionAloud = async () => {
    if (questionAudio && audioRef.current) {
        audioRef.current.src = questionAudio;
        audioRef.current.play();
        return;
    }

    setInterviewState('generatingQuestionAudio');
    try {
        const audioResponse = await aiNarrate(currentQuestion);
        if (audioResponse.success && audioResponse.data && audioRef.current) {
            setQuestionAudio(audioResponse.data.audioDataUri);
            audioRef.current.src = audioResponse.data.audioDataUri;
            audioRef.current.play();
        } else {
            throw new Error(audioResponse.error || 'Failed to generate question audio.');
        }
    } catch (error: unknown) {
        toast({ variant: 'destructive', title: 'Narration Failed', description: "Could not read the question aloud." });
    } finally {
        setInterviewState('idle');
    }
  };


  const handleToggleListening = () => {
    if (interviewState === 'listening') {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current || interviewState === 'unsupported') {
        toast({ variant: 'destructive', title: 'Not Supported', description: 'Voice features are not available in your current browser.' });
        return;
      }
      try {
        recognitionRef.current.start();
      } catch {
        toast({
          variant: 'destructive',
          title: 'Could not start microphone',
          description: micPermissionHint(detectMicPlatform()),
        });
        setInterviewState('idle');
        return;
      }
      setTranscript('');
      setFeedbackAudio(null);
      setInterviewState('listening');
    }
  };

  useEffect(() => {
    if (interviewState === 'speaking' && feedbackAudio && audioRef.current) {
        audioRef.current.src = feedbackAudio;
        audioRef.current.play().catch(e => console.error("Audio playback failed", e));
        
        const handleAudioEnd = () => setInterviewState('idle');
        audioRef.current.addEventListener('ended', handleAudioEnd);

        return () => {
            if (audioRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                audioRef.current.removeEventListener('ended', handleAudioEnd);
            }
        }
    }
  }, [interviewState, feedbackAudio])

  if (!isMounted) return null;

  return (
    <section>
        <Card variant='neuro' className="bg-background">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline font-bold flex items-center justify-center gap-2">
                    <Volume2 className="text-primary"/>
                    Voice Mock Interview
                </CardTitle>
                <CardDescription>
                    Practice speaking your answers and get audio feedback from our AI coach.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex flex-col items-center">
                <div className="w-full max-w-xs space-y-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground block text-center">Practice Track</Label>
                    <Select value={track}
                        onValueChange={(v) => handleTrackChange(v as typeof tracks[number]['id'])}>
                        <SelectTrigger>
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

                <div className="text-center space-y-2 w-full max-w-lg mx-auto">
                    <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">Current question</p>
                    <p
                      className="p-4 sm:p-5 bg-secondary rounded-xl text-lg sm:text-base font-semibold border border-primary/10 leading-snug text-foreground"
                      role="status"
                    >
                        &ldquo;{currentQuestion}&rdquo;
                    </p>
                </div>
                 <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md mx-auto">
                    <Button
                      variant="outline"
                      className="min-h-[48px] flex-1 sm:flex-none text-base sm:text-sm px-4"
                      onClick={readQuestionAloud}
                      disabled={interviewState !== 'idle'}
                    >
                        {interviewState === 'generatingQuestionAudio' ? (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin shrink-0" aria-hidden />
                        ) : (
                          <Ear className="mr-2 h-5 w-5 shrink-0" aria-hidden />
                        )}
                        Hear question
                    </Button>
                    <Button
                      variant="ghost"
                      className="min-h-[48px] flex-1 sm:flex-none text-base sm:text-sm px-4"
                      onClick={() => getNewQuestion()}
                      disabled={interviewState !== 'idle'}
                    >
                        <RefreshCw className="mr-2 h-4 w-4 shrink-0" aria-hidden />
                        New question
                    </Button>
                </div>

                {interviewState !== 'unsupported' && (
                  <p
                    className="text-xs sm:text-sm text-muted-foreground text-center max-w-md leading-relaxed px-3"
                    role="note"
                  >
                    {micPermissionBrief(micPlatform)}
                  </p>
                )}
                
                 <motion.div
                   className="relative"
                   animate={{ scale: interviewState === 'listening' ? 1.04 : 1 }}
                   transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                 >
                    {interviewState === 'listening' && (
                      <span
                        className="absolute inset-0 rounded-full bg-primary/25 animate-ping pointer-events-none scale-110"
                        aria-hidden
                      />
                    )}
                     <Button 
                        size="lg" 
                        className="relative rounded-full w-[7.5rem] h-[7.5rem] min-w-[60px] min-h-[60px] text-lg shadow-xl"
                        onClick={handleToggleListening}
                        disabled={interviewState === 'processing' || interviewState === 'speaking' || interviewState === 'generatingQuestionAudio' || interviewState === 'unsupported'}
                        variant={interviewState === 'listening' ? 'destructive' : 'default'}
                        aria-pressed={interviewState === 'listening'}
                        aria-label={interviewState === 'listening' ? 'Stop recording answer' : 'Start recording answer'}
                    >
                         {interviewState === 'listening' && <MicOff className="w-9 h-9 sm:w-8 sm:h-8" aria-hidden />}
                         {interviewState === 'idle' && <Mic className="w-9 h-9 sm:w-8 sm:h-8" aria-hidden />}
                         {interviewState === 'unsupported' && <MicOff className="w-9 h-9 sm:w-8 sm:h-8" aria-hidden />}
                         {interviewState === 'processing' && <Loader2 className="w-9 h-9 sm:w-8 sm:h-8 animate-spin" aria-hidden />}
                         {interviewState === 'speaking' && <Volume2 className="w-9 h-9 sm:w-8 sm:h-8" aria-hidden />}
                          {interviewState === 'generatingQuestionAudio' && <Loader2 className="w-9 h-9 sm:w-8 sm:h-8 animate-spin" aria-hidden />}
                     </Button>
                 </motion.div>
                
                 <div className="text-base sm:text-sm text-muted-foreground min-h-[3rem] text-center px-4 max-w-md mx-auto leading-snug">
                    {interviewState === 'idle' && "Click the mic to start recording your answer."}
                    {interviewState === 'listening' && "Listening... Click to stop and get technical feedback."}
                    {interviewState === 'processing' && "Analyzing your technical answer..."}
                    {interviewState === 'speaking' && "Providing strategic feedback..."}
                    {interviewState === 'generatingQuestionAudio' && "Generating audio prompt..."}
                    {interviewState === 'unsupported' && (
                        <div className="flex items-center gap-2 p-2 rounded-md border border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400">
                            <AlertCircle className="h-4 w-4" />
                            <p>Voice features are not supported in your browser.</p>
                        </div>
                    )}
                 </div>
                
                {transcript && (
                    <div className="w-full p-4 bg-secondary rounded-xl max-h-40 overflow-y-auto border border-dashed">
                        <p className="text-sm text-muted-foreground italic">"{transcript}"</p>
                    </div>
                )}
                
                <audio ref={audioRef} className="hidden" />

            </CardContent>
        </Card>
    </section>
  );
}
