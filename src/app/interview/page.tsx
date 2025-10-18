
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Bot, BrainCircuit, CalendarClock, Sparkles } from 'lucide-react';
import Link from 'next/link';

const featuredBlogs = [
    {
        title: "The Ultimate Interview Checklist",
        description: "Walk into your interview with confidence by following our comprehensive preparation guide.",
        slug: "/blog/job-interview-checklist"
    },
    {
        title: "How to Answer 'Tell Me About Yourself'",
        description: "Craft the perfect, concise answer to this common opening question.",
        slug: "/blog/answer-tell-me-about-yourself"
    },
    {
        title: "The Art of the Follow-Up Email",
        description: "A great follow-up email can be the final touch that seals the deal. Learn how to write one that gets a response.",
        slug: "/blog/follow-up-email-guide"
    }
]

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

                {/* Featured Blogs Section */}
                <section>
                    <h2 className="text-2xl font-headline font-bold mb-6 text-center">From Our Blog: Interview Insights</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {featuredBlogs.map(post => (
                            <Card key={post.slug} className="flex flex-col group hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <CardTitle className="font-headline text-lg group-hover:text-primary">{post.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground">{post.description}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="link" asChild className="p-0">
                                        <Link href={post.slug}>Read More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </section>
                
                <Separator />

                {/* Tools & Trends Section */}
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <section>
                        <h2 className="text-2xl font-headline font-bold mb-6 flex items-center gap-2"><Sparkles className="text-yellow-500"/> AI Prep Tools (Coming Soon)</h2>
                        <div className="space-y-4">
                            <div className="p-4 border rounded-lg bg-background/50">
                                <h3 className="font-semibold flex items-center gap-2"><Bot /> AI Mock Interviewer</h3>
                                <p className="text-sm text-muted-foreground mt-1">Practice your answers with an AI that gives real-time feedback on your clarity, confidence, and content.</p>
                            </div>
                            <div className="p-4 border rounded-lg bg-background/50">
                                <h3 className="font-semibold flex items-center gap-2"><BrainCircuit /> Behavioral Question Analyzer</h3>
                                <p className="text-sm text-muted-foreground mt-1">Get AI-powered suggestions on how to structure your stories using the STAR method for maximum impact.</p>
                            </div>
                        </div>
                    </section>
                    <section>
                        <h2 className="text-2xl font-headline font-bold mb-6 flex items-center gap-2"><CalendarClock /> Today's Interview Trends</h2>
                        <ul className="space-y-4 text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <ArrowRight className="h-4 w-4 mt-1 text-primary flex-shrink-0"/>
                                <div><strong className="font-semibold text-foreground">Virtual Interviews:</strong> Be prepared for video calls. Test your tech, check your background, and practice looking at the camera.</div>
                            </li>
                             <li className="flex items-start gap-3">
                                <ArrowRight className="h-4 w-4 mt-1 text-primary flex-shrink-0"/>
                                <div><strong className="font-semibold text-foreground">Asynchronous Interviews:</strong> You may be asked to record your answers to questions on your own time. Be concise and energetic.</div>
                            </li>
                             <li className="flex items-start gap-3">
                                <ArrowRight className="h-4 w-4 mt-1 text-primary flex-shrink-0"/>
                                <div><strong className="font-semibold text-foreground">Behavioral Questions:</strong> Expect questions like "Tell me about a time when...". Have your STAR-method stories ready.</div>
                            </li>
                        </ul>
                    </section>
                </div>
                
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
