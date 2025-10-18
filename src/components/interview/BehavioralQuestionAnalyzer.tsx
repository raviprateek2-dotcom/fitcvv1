
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { analyzeBehavioralAnswer } from '@/app/actions/ai-behavioral-question-analyzer';
import type { AnalyzeBehavioralAnswerOutput } from '@/app/actions/schemas/ai-behavioral-question-analyzer';
import { Loader2, Sparkles, CheckCircle, XCircle, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../ui/badge';

const ResultCard = ({ title, content, isEmpty }: { title: string; content: string; isEmpty: boolean; }) => (
    <Card className={isEmpty ? 'border-dashed' : ''}>
      <CardHeader>
        <CardTitle className="text-md font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-sm ${isEmpty ? 'text-muted-foreground' : ''}`}>{content}</p>
      </CardContent>
    </Card>
  );

export function BehavioralQuestionAnalyzer() {
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeBehavioralAnswerOutput | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!userAnswer) {
      toast({
        variant: 'destructive',
        title: 'An Answer is Required',
        description: 'Please enter your story in the text area before analyzing.',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await analyzeBehavioralAnswer({ userAnswer });
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
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline font-bold flex items-center justify-center gap-2">
                    <BrainCircuit className="text-primary"/>
                    Behavioral Question Analyzer
                </CardTitle>
                <CardDescription>
                    Practice the STAR method (Situation, Task, Action, Result) for behavioral questions.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="user-answer">Enter your story for a question like "Tell me about a time when..."</Label>
                    <Textarea
                        id="user-answer"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Describe a situation where you faced a challenge and how you handled it..."
                        rows={6}
                        disabled={isLoading}
                    />
                 </div>
                 <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Analyzing...' : 'Analyze My Answer'}
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
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold font-headline">Analysis Result</h3>
                                <Badge variant={result.isSTAR ? 'default' : 'destructive'} className="text-sm">
                                    {result.isSTAR ? <CheckCircle className="mr-2" /> : <XCircle className="mr-2" />}
                                    {result.isSTAR ? 'Successfully uses STAR method' : 'Needs Improvement on STAR method'}
                                </Badge>
                                <p className="text-muted-foreground text-sm px-4">{result.feedback}</p>
                            </div>
                           
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ResultCard title="Situation" content={result.situation} isEmpty={!result.situation} />
                                <ResultCard title="Task" content={result.task} isEmpty={!result.task} />
                                <ResultCard title="Action" content={result.action} isEmpty={!result.action} />
                                <ResultCard title="Result" content={result.result} isEmpty={!result.result} />
                            </div>
                        </motion.div>
                     </CardFooter>
                )}
            </AnimatePresence>
        </Card>
    </section>
  );
}
