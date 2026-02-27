'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { optimizeLinkedInProfile } from '@/app/actions/ai-linkedin-optimizer';
import type { OptimizeLinkedInOutput } from '@/ai/flows/ai-linkedin-optimizer';
import { Loader2, Sparkles, Linkedin, Copy, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ResumeData } from './types';

interface LinkedInOptimizerTabProps {
    resumeData: ResumeData;
}

export function LinkedInOptimizerTab({ resumeData }: LinkedInOptimizerTabProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<OptimizeLinkedInOutput | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const { toast } = useToast();

    const handleOptimize = async () => {
        setIsLoading(true);
        setResult(null);
        try {
            const response = await optimizeLinkedInProfile({
                resumeContent: JSON.stringify(resumeData),
            });

            if (response.success && response.data) {
                setResult(response.data);
            } else {
                toast({ variant: 'destructive', title: 'Optimization Failed', description: response.error });
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="space-y-6">
            <Card variant="neuro">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Linkedin className="text-[#0A66C2] w-6 h-6" />
                        LinkedIn Optimizer
                    </CardTitle>
                    <CardDescription>
                        Turn your resume into a powerful professional brand.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        We&apos;ll use your current resume data to craft a headline and &apos;About&apos; section designed to catch the eye of recruiters on LinkedIn.
                    </p>
                    <Button onClick={handleOptimize} disabled={isLoading} className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate LinkedIn Strategy
                    </Button>
                </CardContent>
            </Card>

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card variant="neuro" className="border-l-4 border-l-[#0A66C2]">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs font-bold uppercase tracking-wider text-[#0A66C2]">Optimized Headline</Label>
                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.headline, 'headline')}>
                                    {copiedField === 'headline' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-semibold leading-relaxed">{result.headline}</p>
                        </CardContent>
                    </Card>

                    <Card variant="neuro" className="border-l-4 border-l-[#0A66C2]">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs font-bold uppercase tracking-wider text-[#0A66C2]">Optimized &apos;About&apos; Section</Label>
                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.about, 'about')}>
                                    {copiedField === 'about' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                {result.about}
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="neuro">
                        <CardHeader>
                            <Label className="text-xs font-bold uppercase tracking-wider text-[#0A66C2]">Strategic Keywords</Label>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {result.topSkills.map((skill, i) => (
                                    <Badge key={i} variant="secondary" className="bg-[#0A66C2]/10 text-[#0A66C2] border-transparent">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
