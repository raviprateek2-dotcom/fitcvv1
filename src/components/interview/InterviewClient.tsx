
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Bot, BrainCircuit, CalendarClock, Sparkles, Volume2, Loader2, Ear, Target, ShieldCheck, Zap, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';
import { BehavioralQuestionAnalyzer } from '@/components/interview/BehavioralQuestionAnalyzer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import type { BlogPost } from '@/lib/blog-posts';
import { MockInterview } from '@/components/interview/MockInterview';
import { TypingAnimation } from '@/components/common/TypingAnimation';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceMockInterview } from '@/components/interview/VoiceMockInterview';
import { useUser } from '@/firebase';
import { ProFeatureWrapper } from '@/components/editor/ProFeatureWrapper';
import { useState, useEffect, useRef, Suspense } from 'react';
import { VideoPitchGenerator } from '@/components/interview/VideoPitchGenerator';
import { aiNarrate } from '@/app/actions/ai-narrator';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import { isPlaceholderCoUrl } from '@/lib/utils';

const encouragingNotes = [
    {
        title: "A Note on Making Space for Grace",
        text: "The job search is a journey filled with ups and downs. It's easy to be hard on yourself after a tough interview or a rejection. Remember to give yourself grace. Every interview is a learning experience, not a final judgment. Celebrate the small wins, learn from the challenges, and trust in your process and your worth. Your career is a marathon, not a sprint. Be kind to yourself along the way."
    },
    {
        title: "Embrace the 'Not Yets'",
        text: "Every rejection is not a 'no,' but a 'not yet.' It's a redirection towards a better-fitting opportunity. Each application and interview sharpens your skills and clarifies what you truly want. Stay open, stay resilient, and trust that the right door will open at the right time. Your persistence is your greatest asset."
    },
    {
        title: "You Are More Than Your Job Title",
        text: "It's important to remember that your job does not define your worth. You are a whole person with unique talents, passions, and relationships. The job search is just one part of your life. Take time to do things that bring you joy and connect with people who support you. A balanced life fuels a more effective job search."
    },
    {
        title: "Focus on What You Can Control",
        text: "You can't control the hiring manager's decision, but you can control your effort, your attitude, and your preparation. Focus on crafting a great resume, networking genuinely, and preparing thoroughly for each interview. Celebrate your efforts, not just the outcomes. By focusing on your actions, you build momentum and confidence."
    }
];

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const noteVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
};

function InterviewContent({ featuredBlogs }: { featuredBlogs: BlogPost[] }) {
    const { userProfile } = useUser();
    const isProUser = userProfile?.subscription === 'premium';
    const [noteIndex, setNoteIndex] = useState(0);
    const [isNarratingNote, setIsNarratingNote] = useState(false);
    const noteAudioRef = useRef<HTMLAudioElement | null>(null);
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const initialQuestion = searchParams.get('q') || undefined;

    useEffect(() => {
        const intervalId = setInterval(() => {
            setNoteIndex(prevIndex => (prevIndex + 1) % encouragingNotes.length);
        }, 15000);
        return () => clearInterval(intervalId);
    }, []);

    const handleNarrateNote = async () => {
        const note = encouragingNotes[noteIndex];
        if (!note) return;
        setIsNarratingNote(true);
        try {
            const response = await aiNarrate(note.text);
            if (response.success && response.data && noteAudioRef.current) {
                noteAudioRef.current.src = response.data.audioDataUri;
                noteAudioRef.current.play();
            } else {
                throw new Error(response.error || 'Failed to generate audio for note.');
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Narration Failed', description: error.message });
        } finally {
            setIsNarratingNote(false);
        }
    };

  return (
    <div className="relative min-h-screen overflow-hidden">
        {/* Animated Mesh Background */}
        <div className="fixed inset-0 -z-10 bg-background">
            <div className="absolute inset-0 animate-mesh opacity-[0.08] dark:opacity-[0.12]" />
        </div>

        <audio ref={noteAudioRef} className="hidden" />
        
        <motion.div 
            className="container mx-auto px-4 md:px-6 py-10 sm:py-12 md:py-24 pb-12 sm:pb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-5xl mx-auto space-y-12">
                {/* Header Section */}
                <header className="text-center space-y-4 sm:space-y-6 mb-10 sm:mb-14 md:mb-16">
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                        <Zap className="w-3.5 h-3.5" />
                        Live Training Mode
                    </motion.div>
                    <motion.h1 variants={itemVariants} className="text-[1.65rem] leading-tight sm:text-4xl md:text-6xl lg:text-7xl font-headline font-extrabold tracking-tight px-1">
                        Ace Your Next <span className="text-gradient">Interview</span>
                    </motion.h1>
                    <motion.p variants={itemVariants} className="text-base sm:text-lg md:text-xl text-muted-foreground flex flex-wrap justify-center gap-x-2 gap-y-1 max-w-xl mx-auto leading-snug">
                        Advanced tools to help you
                        <span className="text-primary font-bold">
                            <TypingAnimation phrases={['simulate real pressure.', 'master behavioral cues.', 'build unshakeable confidence.']} />
                        </span>
                    </motion.p>
                </header>

                {/* Main Command Center */}
                <div className="grid gap-8 sm:gap-10 md:gap-12">
                    <motion.div variants={itemVariants}>
                        <div className="premium-card bg-glass p-5 sm:p-8 md:p-12 border-white/10">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
                                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 shrink-0 self-start">
                                    <BrainCircuit className="w-7 h-7 sm:w-8 sm:h-8" />
                                </div>
                                <div className="text-left min-w-0">
                                    <h2 className="text-xl sm:text-2xl font-bold font-headline">Neural Voice Simulation</h2>
                                    <p className="text-sm text-muted-foreground italic mt-1">Practice with real-time AI audio feedback.</p>
                                </div>
                            </div>
                            <ProFeatureWrapper isPro={!!isProUser}>
                                <VoiceMockInterview />
                            </ProFeatureWrapper>
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                        <motion.div variants={itemVariants} className="premium-card bg-glass border-white/5 h-full p-4 sm:p-6 md:p-8">
                            <h3 className="text-lg sm:text-xl font-bold font-headline mb-4 sm:mb-6 flex items-center gap-2">
                                <Target className="w-5 h-5 text-primary" />
                                Interactive Mock Interview
                            </h3>
                            <MockInterview initialQuestion={initialQuestion} />
                        </motion.div>

                        <motion.div variants={itemVariants} className="premium-card bg-glass border-white/5 h-full p-4 sm:p-6 md:p-8">
                            <h3 className="text-lg sm:text-xl font-bold font-headline mb-4 sm:mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-green-500" />
                                Behavioral Analysis
                            </h3>
                            <BehavioralQuestionAnalyzer />
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants}>
                        <div className="premium-card bg-glass p-5 sm:p-8 md:p-12 border-white/10">
                            <h3 className="text-base sm:text-xl font-bold font-headline mb-6 sm:mb-8 text-center uppercase tracking-widest text-muted-foreground px-2">Expert Pitch Engineering</h3>
                            <ProFeatureWrapper isPro={!!isProUser}>
                                <VideoPitchGenerator />
                            </ProFeatureWrapper>
                        </div>
                    </motion.div>

                    {/* Blog Insights Section */}
                    <motion.section variants={itemVariants} className="pt-8 sm:pt-12">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 sm:gap-6 mb-8 sm:mb-12">
                            <div className="text-left">
                                <h2 className="text-2xl sm:text-3xl font-headline font-extrabold mb-2">Strategy <span className="text-gradient">Registry</span></h2>
                                <p className="text-muted-foreground text-sm sm:text-base">Deep dives from our career engineering team.</p>
                            </div>
                            <Button asChild variant="outline" size="sm" className="bg-glass min-h-[44px] md:min-h-0 w-full md:w-auto shrink-0">
                                <Link href="/blog">Expand Library <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
                            {featuredBlogs.map(post => {
                                const image = PlaceHolderImages.find(img => img.id === post.imageId);
                                const wordCount = post.content.trim().split(/\s+/).length;
                                const readingTime = Math.ceil(wordCount / 200);
                                const src = image?.imageUrl ?? '';
                                const unopt = src ? isPlaceholderCoUrl(src) : false;

                                return (
                                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                                        <div className="premium-card bg-glass h-full flex flex-col p-0 overflow-hidden border-white/5 group-hover:border-primary/30 transition-all duration-500">
                                            <div className="relative aspect-video sm:h-40 sm:aspect-auto overflow-hidden">
                                                {image && (
                                                    <Image
                                                        src={image.imageUrl}
                                                        alt=""
                                                        fill
                                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                                        unoptimized={unopt}
                                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            </div>
                                            <div className="p-5 flex flex-col flex-grow">
                                                <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readingTime}m Read</span>
                                                </div>
                                                <h3 className="text-base sm:text-lg font-bold font-headline mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                    {post.title}
                                                </h3>
                                                <p className="text-sm sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                    {post.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </motion.section>

                    {/* Support Section */}
                    <motion.section variants={itemVariants} className="max-w-4xl mx-auto w-full">
                        <div className="premium-card bg-glass/60 border-primary/20 p-5 sm:p-8 md:p-12 text-center min-h-[260px] sm:min-h-[300px] flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={noteIndex}
                                    variants={noteVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="h-px w-12 bg-primary/20 hidden sm:block" />
                                        <h2 className="text-lg sm:text-2xl font-headline font-extrabold text-gradient px-2">{encouragingNotes[noteIndex].title}</h2>
                                        <div className="h-px w-12 bg-primary/20 hidden sm:block" />
                                    </div>
                                    <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed italic px-1">
                                        "{encouragingNotes[noteIndex].text}"
                                    </p>
                                    <div className="pt-4 flex justify-center">
                                        <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            onClick={handleNarrateNote} 
                                            disabled={isNarratingNote}
                                            className="rounded-full bg-primary/5 hover:bg-primary/20 transition-all px-6 border border-primary/10 min-h-[44px] sm:min-h-9"
                                        >
                                            {isNarratingNote ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Ear className="h-4 w-4 mr-2" />}
                                            {isNarratingNote ? 'Synthesizing...' : 'Play Perspective'}
                                        </Button>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.section>
                </div>
            </div>
        </motion.div>
    </div>
  );
}

export default function InterviewClient({ featuredBlogs }: { featuredBlogs: BlogPost[] }) {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>}>
            <InterviewContent featuredBlogs={featuredBlogs} />
        </Suspense>
    );
}
