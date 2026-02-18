
'use client';

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Sparkles, XCircle } from "lucide-react";
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
                    toast({
                        title: 'AI Title Suggestion Ready',
                        description: 'We have a suggestion for your job title.',
                    });
                } else {
                    toast({ title: 'Title Looks Good!', description: 'Your job title is already professional and clear.' });
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
                        <div className="flex items-center gap-2">
                            <Input name="title" value={resumeData.personalInfo.title} onChange={handlePersonalInfoChange} className="flex-grow" />
                            <ProFeatureWrapper isPro={isProUser}>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="icon" onClick={handleSuggestTitle} disabled={isTitleSuggesting}>
                                                {isTitleSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>AI Suggest Professional Title</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </ProFeatureWrapper>
                        </div>
                        {titleSuggestion && (
                            <div className="bg-secondary p-2 rounded-md flex items-center justify-between">
                                <p className="text-sm">Suggestion: <span className="font-semibold">{titleSuggestion}</span></p>
                                <div className="flex gap-1">
                                    <Button size="sm" variant="ghost" onClick={applyTitleSuggestion} className="h-7">Apply</Button>
                                    <Button size="icon" variant="ghost" onClick={() => setTitleSuggestion(null)} className="h-7 w-7"><XCircle className="h-4 w-4" /></Button>
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
