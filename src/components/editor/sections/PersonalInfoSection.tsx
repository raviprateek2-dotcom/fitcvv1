
'use client';

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Sparkles, XCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { suggestTitle as suggestTitleAction } from '@/app/actions/ai-title-suggester';
import type { ResumeData } from "../types";
import { ProFeatureWrapper } from "../ProFeatureWrapper";

interface PersonalInfoSectionProps {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>;
    isProUser: boolean;
}

export function PersonalInfoSection({ resumeData, setResumeData, isProUser }: PersonalInfoSectionProps) {
    const { toast } = useToast();
    const [isTitleSuggesting, setIsTitleSuggesting] = useState(false);
    const [titleSuggestion, setTitleSuggestion] = useState<string | null>(null);

    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!resumeData) return;
        const { name, value } = e.target;
        setResumeData(prev => prev ? { ...prev, personalInfo: { ...prev.personalInfo, [name]: value } } : null);
    };

    const handleSuggestTitle = async () => {
        if (!resumeData?.personalInfo.title) return;
        setIsTitleSuggesting(true);
        setTitleSuggestion(null);
        try {
            const result = await suggestTitleAction({ currentTitle: resumeData.personalInfo.title });
            if (result.success && result.data) {
                if (result.data.suggestedTitle.toLowerCase() !== resumeData.personalInfo.title.toLowerCase()) {
                    setTitleSuggestion(result.data.suggestedTitle);
                }
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.error });
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to get title suggestion.' });
        } finally {
            setIsTitleSuggesting(false);
        }
    }

    const applyTitleSuggestion = () => {
        if (titleSuggestion) {
            setResumeData(prev => prev ? { ...prev, personalInfo: { ...prev.personalInfo, title: titleSuggestion } } : null);
            setTitleSuggestion(null);
        }
    }

    return (
        <AccordionItem value="personal-info">
            <AccordionTrigger className="font-semibold text-lg">Personal Information</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4 border bg-secondary/30 rounded-b-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Full Name</Label><Input name="name" value={resumeData.personalInfo.name} onChange={handlePersonalInfoChange} /></div>
                    <div className="space-y-2">
                        <Label>Job Title</Label>
                        <div className="flex items-center gap-2 relative">
                            <Input name="title" value={resumeData.personalInfo.title} onChange={handlePersonalInfoChange} className="flex-grow pr-10" />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <ProFeatureWrapper isPro={isProUser}>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSuggestTitle} disabled={isTitleSuggesting}>
                                                    {isTitleSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-primary" />}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>AI Suggest Professional Title</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </ProFeatureWrapper>
                            </div>
                        </div>
                        {titleSuggestion && (
                            <div className="bg-secondary p-2 rounded-md flex items-center justify-between border border-primary/20 mt-2 animate-in fade-in slide-in-from-top-1">
                                <p className="text-xs">AI Suggestion: <span className="font-bold text-primary">{titleSuggestion}</span></p>
                                <div className="flex gap-1">
                                    <Button size="sm" variant="link" onClick={applyTitleSuggestion} className="h-7 p-0 px-2 text-primary font-bold">Apply</Button>
                                    <Button size="icon" variant="ghost" onClick={() => setTitleSuggestion(null)} className="h-7 w-7"><XCircle className="h-4 w-4 text-muted-foreground" /></Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange} /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Phone</Label><Input name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange} /></div>
                    <div className="space-y-2"><Label>Location</Label><Input name="location" value={resumeData.personalInfo.location} onChange={handlePersonalInfoChange} /></div>
                </div>
                <div className="space-y-2"><Label>Website/Portfolio</Label><Input name="website" value={resumeData.personalInfo.website} onChange={handlePersonalInfoChange} /></div>
            </AccordionContent>
        </AccordionItem>
    );
}
