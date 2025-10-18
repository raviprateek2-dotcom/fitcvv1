'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mockInterview } from '@/app/actions/ai-mock-interviewer';
import type { MockInterviewOutput } from '@/app/actions/schemas/ai-mock-interviewer';
import { Loader2, Sparkles, RefreshCw, Bot, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export function MockInterview() {
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MockInterviewOutput | null>(null);
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState('');

  useEffect(() => {
    // Set an initial question on component mount
    getNewQuestion();
  }, []);

  const getNewQuestion = () => {
    let nextQuestion;
    do {
      nextQuestion = interviewQuestions[Math.floor(Math.random() * interviewQuestions.length)];
    } while (nextQuestion === currentQuestion); // Ensure new question is different
    setCurrentQuestion(nextQuestion);
    setUserAnswer('');
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!userAnswer) {
      toast({
        variant: 'destructive',
        title: 'An Answer is Required',
        description: 'Please provide an answer before analyzing.',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await mockInterview({ userAnswer, question: currentQuestion });
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: response.error || 'An unexpected error occurred.',
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
        <Card variant='neuro' className="bg-gradient-to-br from-background to-secondary/30">
            <CardHeader>
                <CardTitle className="text-2xl font-headline font-bold flex items-center gap-2">
                    <Bot className="text-primary"/>
                    AI Mock Interviewer
                </CardTitle>
                <CardDescription>
                    Practice your answers to common interview questions and get instant feedback.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="user-answer" className="font-semibold">Question:</Label>
                        <Button variant="ghost" size="sm" onClick={getNewQuestion}>
                            <RefreshCw className="mr-2 h-3 w-3"/>
                            New Question
                        </Button>
                    </div>
                    <p className="p-3 bg-secondary rounded-md text-sm font-medium text-center">"{currentQuestion}"</p>
                    <Label htmlFor="user-answer" className="font-semibold pt-4 block">Your Answer:</Label>
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
                    {isLoading ? 'Getting Feedback...' : 'Get Feedback'}
                 </Button>
            </CardContent>

            <AnimatePresence>
                {result && (
                     <CardFooter>
                        <motion.div
                            className="w-full space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                             <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="text-yellow-500" /> General Feedback</h3>
                                <p className="text-sm text-muted-foreground p-4 bg-secondary rounded-md">{result.feedback}</p>
                            </div>
                             <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2"><Sparkles className="text-primary" /> Suggested Improvement</h3>
                                <p className="text-sm text-muted-foreground p-4 border rounded-md italic">"{result.suggestedImprovement}"</p>
                            </div>
                        </motion.div>
                     </CardFooter>
                )}
            </AnimatePresence>
        </Card>
    </section>
  );
}
