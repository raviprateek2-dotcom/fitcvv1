'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generateCareerGoals } from '@/app/actions/ai-goal-setter';
import { Loader2, Target, Sparkles, Network, Zap, BookOpen, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useUser, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';

type Goal = {
    id: string;
    title: string;
    description: string;
    type: 'networking' | 'optimization' | 'skill-building' | 'other';
};

const typeIcons = {
    'networking': <Network className="w-4 h-4" />,
    'optimization': <Zap className="w-4 h-4" />,
    'skill-building': <BookOpen className="w-4 h-4" />,
    'other': <Target className="w-4 h-4" />
};

export function GoalSetter() {
    const { user, userProfile, firestore } = useUser();
    const [jobTitle, setJobTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [goals, setGoals] = useState<Goal[]>([]);
    const { toast } = useToast();

    // Initialize goals from user profile
    useEffect(() => {
        if (userProfile?.careerGoals) {
            setGoals(userProfile.careerGoals);
        }
    }, [userProfile]);

    const handleGenerate = async () => {
        if (!jobTitle) {
            toast({ variant: 'destructive', title: 'Job Title Required', description: 'Tell us what role you are aiming for!' });
            return;
        }

        setIsLoading(true);
        try {
            const response = await generateCareerGoals({ jobTitle });
            if (response.success && response.data) {
                const newGoals = response.data.goals as Goal[];
                setGoals(newGoals);
                
                // Persist to Firestore
                if (user && firestore) {
                    const userRef = doc(firestore, `users/${user.uid}`);
                    updateDocumentNonBlocking(userRef, { careerGoals: newGoals });
                }
            } else {
                throw new Error(response.error || 'Failed to generate strategic goals.');
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setGoals([]);
        if (user && firestore) {
            const userRef = doc(firestore, `users/${user.uid}`);
            updateDocumentNonBlocking(userRef, { careerGoals: [] });
        }
    }

    return (
        <Card variant="neuro" className="mb-12 border-primary/10 bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    AI Application Strategy
                </CardTitle>
                <CardDescription>Enter your target job title to generate specific application goals.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex-grow">
                        <Label htmlFor="target-job" className="sr-only">Target Job Title</Label>
                        <Input 
                            id="target-job"
                            placeholder="e.g. Senior Frontend Engineer" 
                            value={jobTitle} 
                            onChange={(e) => setJobTitle(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <Button onClick={handleGenerate} disabled={isLoading || !jobTitle} className="shrink-0">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                        Generate Plan
                    </Button>
                </div>

                <AnimatePresence mode="wait">
                    {goals.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                            {goals.map((goal, index) => (
                                <motion.div
                                    key={goal.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 rounded-xl border bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-all group"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            {typeIcons[goal.type]}
                                        </div>
                                        <Badge variant="secondary" className="capitalize text-[10px]">{goal.type.replace('-', ' ')}</Badge>
                                    </div>
                                    <h4 className="font-bold text-sm mb-1">{goal.title}</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{goal.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
            {goals.length > 0 && (
                <CardFooter className="bg-secondary/30 rounded-b-2xl py-3 px-6 flex justify-between items-center">
                    <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Goals are saved to your profile and automatically optimized.
                    </p>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={handleClear}>Clear Strategy</Button>
                </CardFooter>
            )}
        </Card>
    );
}
