import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Rocket, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us - ResumeAI',
  description: 'Learn about the mission of ResumeAI and its founder, Ravi Prateek.',
};

export default function AboutUsPage() {
  return (
    <div className="bg-secondary">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
            <Card className="max-w-4xl mx-auto" variant="neuro">
                <CardHeader className="text-center p-8 md:p-12">
                    <div className="flex justify-center mb-4">
                        <Rocket className="h-16 w-16 text-primary" />
                    </div>
                    <CardTitle className="text-4xl font-headline">About ResumeAI</CardTitle>
                    <CardDescription className="text-lg mt-2 text-muted-foreground">
                        Empowering professionals to build their dream careers.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8 md:p-12 prose prose-lg dark:prose-invert max-w-none">
                    <div className="text-center">
                        <h2>Our Mission</h2>
                        <p>
                            At ResumeAI, our mission is to level the playing field in the job market. We believe that everyone deserves a fair chance to land their dream job, regardless of their background or writing skills. We leverage the power of artificial intelligence to provide smart, intuitive tools that help you create professional, ATS-optimized resumes and cover letters that truly reflect your potential.
                        </p>
                    </div>

                    <div className="text-center mt-12">
                        <h2>Meet the Founder</h2>
                        <div className="flex flex-col items-center gap-4 mt-6">
                            <Avatar className="h-32 w-32 border-4 border-primary">
                                <AvatarImage src="https://i.pravatar.cc/150?u=ravi" alt="Ravi Prateek" />
                                <AvatarFallback>RP</AvatarFallback>
                            </Avatar>
                            <h3 className="text-2xl font-bold font-headline mb-0">Ravi Prateek</h3>
                            <p className="text-muted-foreground -mt-3">Founder & CEO</p>
                            <p className="max-w-2xl">
                                As a seasoned professional in the tech industry, Ravi experienced firsthand how a well-crafted resume can open doors. He founded ResumeAI with the vision of making expert career tools accessible to everyone. Ravi is passionate about technology, design, and helping people succeed.
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-16 p-8 bg-primary/10 rounded-2xl border border-primary/20 text-center">
                        <h2 className="flex items-center justify-center gap-2">
                           <Sparkles className="h-6 w-6 text-primary" />
                           Our Premium Experience
                        </h2>
                        <p>
                            While our core tools are available for free, our **Premium** subscription unlocks the full power of ResumeAI. This includes unlimited resumes, advanced AI features like our cover letter writer and in-depth analysis, and access to our full suite of executive templates—all designed to give you the ultimate competitive edge in your job search.
                        </p>
                        <Button asChild className="mt-6">
                            <Link href="/pricing">Explore Premium Features</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
