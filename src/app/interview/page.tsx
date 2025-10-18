
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

const featuredBlogs = blogPosts.filter(p => [
    'job-interview-checklist',
    'answer-tell-me-about-yourself',
    'follow-up-email-guide'
].includes(p.slug));


export default function InterviewPage() {
  return (
    <div className="bg-secondary">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <Card className="max-w-5xl mx-auto" variant="neuro">
            <CardHeader className="text-center p-8 md:p-12">
                <div className="flex justify-center mb-4">
                    <BrainCircuit className="h-16 w-16 text-primary" />
                </div>
                <CardTitle className="text-4xl font-headline">Ace Your Next Interview</CardTitle>
                <CardDescription className="text-lg mt-2">
                    Tools, trends, and insights to help you prepare, perform, and persevere.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 md:p-12 grid gap-12">

                <MockInterview />

                <Separator />

                <BehavioralQuestionAnalyzer />

                <Separator />
                
                {/* Featured Blogs Section */}
                <section>
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
                </section>
                
                <Separator />

                {/* A Note on Grace Section */}
                <section className="text-center bg-primary/5 dark:bg-primary/10 p-8 rounded-2xl border border-primary/20">
                     <h2 className="text-2xl font-headline font-bold mb-4">A Note on Making Space for Grace</h2>
                     <p className="max-w-3xl mx-auto text-muted-foreground leading-relaxed">
                        The job search is a journey filled with ups and downs. It's easy to be hard on yourself after a tough interview or a rejection. Remember to give yourself grace. Every interview is a learning experience, not a final judgment. Celebrate the small wins, learn from the challenges, and trust in your process and your worth. Your career is a marathon, not a sprint. Be kind to yourself along the way.
                     </p>
                </section>

            </CardContent>
        </Card>
        </div>
    </div>
  );
}
