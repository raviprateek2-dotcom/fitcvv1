
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Bot, BrainCircuit, CalendarClock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { BehavioralQuestionAnalyzer } from '@/components/interview/BehavioralQuestionAnalyzer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { blogPosts } from '@/lib/blog-posts';
import { MockInterview } from '@/components/interview/MockInterview';
import { TypingAnimation } from '@/components/common/TypingAnimation';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceMockInterview } from '@/components/interview/VoiceMockInterview';
import { useUser } from '@/firebase';
import { ProFeatureWrapper } from '@/components/editor/ProFeatureWrapper';
import { useState, useEffect } from 'react';


const featuredBlogs = blogPosts.filter(p => [
    'job-interview-checklist',
    'answer-tell-me-about-yourself',
    'follow-up-email-guide'
].includes(p.slug));

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
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const noteVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};


export default function InterviewPage() {
    const { userProfile } = useUser();
    const isProUser = userProfile?.subscription === 'premium';
    const [noteIndex, setNoteIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setNoteIndex(prevIndex => (prevIndex + 1) % encouragingNotes.length);
        }, 15000); // Change note every 15 seconds

        return () => clearInterval(intervalId);
    }, []);

  return (
    <div className="bg-secondary">
        <motion.div 
            className="container mx-auto px-4 md:px-6 py-12 md:py-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
        <Card className="max-w-5xl mx-auto" variant="neuro">
            <CardHeader className="text-center p-8 md:p-12">
                <motion.div variants={itemVariants} className="flex justify-center mb-4">
                    <BrainCircuit className="h-16 w-16 text-primary" />
                </motion.div>
                <motion.h1 variants={itemVariants} className="text-4xl font-headline">Ace Your Next Interview</motion.h1>
                <motion.p variants={itemVariants} className="text-lg mt-2 min-h-[54px] sm:min-h-[28px] text-muted-foreground">
                    Tools, trends, and insights to help you{' '}
                    <span className="text-primary font-semibold">
                      <TypingAnimation phrases={['prepare.', 'perform.', 'persevere.']} />
                    </span>
                </motion.p>
            </CardHeader>
            <CardContent className="p-8 md:p-12 grid gap-12">
                
                <motion.div variants={itemVariants}>
                    <ProFeatureWrapper isPro={!!isProUser}>
                        <VoiceMockInterview />
                    </ProFeatureWrapper>
                </motion.div>

                <motion.div variants={itemVariants}><Separator /></motion.div>

                <motion.div variants={itemVariants}><MockInterview /></motion.div>

                <motion.div variants={itemVariants}><Separator /></motion.div>

                <motion.div variants={itemVariants}><BehavioralQuestionAnalyzer /></motion.div>

                <motion.div variants={itemVariants}><Separator /></motion.div>
                
                <motion.section variants={itemVariants}>
                    <h2 className="text-2xl font-headline font-bold mb-6 text-center">From Our Blog: Interview Insights</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {featuredBlogs.map(post => {
                            const image = PlaceHolderImages.find(img => img.id === post.imageId);
                            return (
                            <Card key={post.slug} className="group overflow-hidden flex flex-col h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl" variant="neuro">
                                <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                                    {image && (
                                    <Image
                                        src={image.imageUrl}
                                        alt={post.title}
                                        width={600}
                                        height={400}
                                        data-ai-hint={image.imageHint}
                                        className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                                    />
                                    )}
                                </Link>
                                <CardContent className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold font-headline mb-2 group-hover:text-primary transition-colors">
                                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                </h3>
                                <p className="text-muted-foreground text-sm mb-4 flex-grow">{post.description}</p>
                                <Button variant="link" asChild className="p-0 h-auto self-start">
                                    <Link href={`/blog/${post.slug}`}>
                                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                </CardContent>
                            </Card>
                        )})}
                    </div>
                     <div className="text-center mt-12">
                        <Button asChild size="lg" variant="outline">
                            <Link href="/blog">View All Articles</Link>
                        </Button>
                    </div>
                </motion.section>
                
                <motion.div variants={itemVariants}><Separator /></motion.div>

                <motion.section variants={itemVariants} className="text-center bg-primary/5 dark:bg-primary/10 p-8 rounded-2xl border border-primary/20 min-h-[240px]">
                    <AnimatePresence mode="wait">
                         <motion.div
                            key={noteIndex}
                            variants={noteVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                         >
                            <h2 className="text-2xl font-headline font-bold mb-4">{encouragingNotes[noteIndex].title}</h2>
                            <p className="max-w-3xl mx-auto text-muted-foreground leading-relaxed">
                                {encouragingNotes[noteIndex].text}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </motion.section>

            </CardContent>
        </Card>
        </motion.div>
    </div>
  );
}

    