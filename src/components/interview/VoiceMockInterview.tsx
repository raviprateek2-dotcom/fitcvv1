
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { mockInterview } from '@/app/actions/ai-mock-interviewer';
import { aiNarrate } from '@/app/actions/ai-narrator';
import { Loader2, Mic, MicOff, RefreshCw, Volume2, Ear } from 'lucide-react';
import { motion } from 'framer-motion';

const interviewQuestions = [
  "Tell me about yourself.",
  "What are your biggest strengths?",
  "What are your biggest weaknesses?",
  "Where do you see yourself in 5 years?",
  "Why do you want to work for this company?",
  "Why should we hire you?",
];

type InterviewState = 'idle' | 'listening' | 'processing' | 'speaking' | 'generatingQuestionAudio';

export function VoiceMockInterview() {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [interviewState, setInterviewState] = useState<InterviewState>('idle');
  const [transcript, setTranscript] = useState('');
  const [feedbackAudio, setFeedbackAudio] = useState<string | null>(null);
  const [questionAudio, setQuestionAudio] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { toast } = useToast();

  // Initialize component and select first question
  useEffect(() => {
    setIsMounted(true);
    getNewQuestion();
  }, []);

  // Initialize Speech Recognition API
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript + ' ');
        }
      };

      recognition.onerror = (event) => {
        toast({ variant: 'destructive', title: 'Speech Recognition Error', description: event.error });
        setInterviewState('idle');
      };
    }
  }, [toast]);
  
  const getNewQuestion = () => {
    let nextQuestion;
    do {
      nextQuestion = interviewQuestions[Math.floor(Math.random() * interviewQuestions.length)];
    } while (nextQuestion === currentQuestion);
    setCurrentQuestion(nextQuestion);
    setTranscript('');
    setFeedbackAudio(null);
    setQuestionAudio(null);
    setInterviewState('idle');
  };

  const readQuestionAloud = async () => {
    if (interviewState !== 'idle') return;

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
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error Reading Question', description: error.message });
    } finally {
        setInterviewState('idle');
    }
  };


  const handleToggleListening = () => {
    if (interviewState === 'listening') {
      recognitionRef.current?.stop();
      setInterviewState('processing');
      processTranscript();
    } else {
      if (!recognitionRef.current) {
        toast({ variant: 'destructive', title: 'Browser Not Supported', description: 'Speech recognition is not supported in this browser.' });
        return;
      }
      setTranscript('');
      setFeedbackAudio(null);
      recognitionRef.current.start();
      setInterviewState('listening');
    }
  };

  const processTranscript = async () => {
    if (!transcript.trim()) {
      toast({ title: 'No answer detected', description: 'Please provide an answer before stopping.' });
      setInterviewState('idle');
      return;
    }
    
    try {
      // 1. Get text feedback from the mock interviewer AI
      const feedbackResponse = await mockInterview({ userAnswer: transcript, question: currentQuestion });
      if (!feedbackResponse.success || !feedbackResponse.data) {
        throw new Error(feedbackResponse.error || 'Failed to get interview feedback.');
      }
      const fullFeedbackText = `Here is some feedback on your answer: ${feedbackResponse.data.feedback}. As a suggestion for improvement, you could say: ${feedbackResponse.data.suggestedImprovement}`;

      // 2. Convert the feedback text to audio using the narrator AI
      const audioResponse = await aiNarrate(fullFeedbackText);
      if (!audioResponse.success || !audioResponse.data) {
        throw new Error(audioResponse.error || 'Failed to generate audio feedback.');
      }
      
      setFeedbackAudio(audioResponse.data.audioDataUri);
      setInterviewState('speaking');

    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error processing feedback', description: error.message });
      setInterviewState('idle');
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

  if (!isMounted) return null; // Prevents SSR issues with window object

  return (
    <section>
        <Card variant='neuro' className="bg-gradient-to-br from-background to-secondary/30">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline font-bold flex items-center justify-center gap-2">
                    <Volume2 className="text-primary"/>
                    Voice Mock Interview (Pro)
                </CardTitle>
                <CardDescription>
                    Practice speaking your answers and get audio feedback from our AI coach.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex flex-col items-center">
                <div className="text-center space-y-2">
                    <p className="font-semibold">Your Question:</p>
                    <p className="p-3 bg-secondary rounded-md text-sm font-medium">"{currentQuestion}"</p>
                </div>
                 <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={readQuestionAloud} disabled={interviewState !== 'idle'}>
                        {interviewState === 'generatingQuestionAudio' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Ear className="mr-2 h-4 w-4"/>}
                        Read Question
                    </Button>
                    <Button variant="ghost" size="sm" onClick={getNewQuestion} disabled={interviewState !== 'idle'}>
                        <RefreshCw className="mr-2 h-3 w-3"/> New Question
                    </Button>
                </div>
                
                 <motion.div animate={{ scale: interviewState === 'listening' ? 1.1 : 1 }} transition={{ type: 'spring' }}>
                     <Button 
                        size="lg" 
                        className="rounded-full w-24 h-24 text-lg"
                        onClick={handleToggleListening}
                        disabled={interviewState === 'processing' || interviewState === 'speaking' || interviewState === 'generatingQuestionAudio'}
                        variant={interviewState === 'listening' ? 'destructive' : 'default'}
                    >
                         {interviewState === 'listening' && <MicOff />}
                         {interviewState === 'idle' && <Mic />}
                         {interviewState === 'processing' && <Loader2 className="animate-spin" />}
                         {interviewState === 'speaking' && <Volume2 />}
                          {interviewState === 'generatingQuestionAudio' && <Loader2 className="animate-spin" />}
                     </Button>
                 </motion.div>
                
                 <p className="text-sm text-muted-foreground min-h-[20px]">
                    {interviewState === 'idle' && "Click the mic to start recording"}
                    {interviewState === 'listening' && "Listening... Click to stop."}
                    {interviewState === 'processing' && "Analyzing your answer..."}
                    {interviewState === 'speaking' && "Providing feedback..."}
                    {interviewState === 'generatingQuestionAudio' && "Generating question audio..."}
                 </p>
                
                {transcript && (
                    <div className="w-full p-4 bg-secondary rounded-md max-h-40 overflow-y-auto">
                        <p className="text-sm text-muted-foreground italic">"{transcript}"</p>
                    </div>
                )}
                
                {/* Hidden audio element for playback */}
                <audio ref={audioRef} className="hidden" />

            </CardContent>
        </Card>
    </section>
  );
}
