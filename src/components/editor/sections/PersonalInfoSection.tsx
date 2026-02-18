'use client';

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Sparkles, XCircle, CheckCircle2, User, Globe, Mail, MapPin, Phone, Info } from "lucide-react";
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
        <AccordionItem value="personal-info" className="border-none mb-4">
            <AccordionTrigger className="font-semibold text-lg hover:no-underline py-2 px-4 rounded-xl hover:bg-secondary/50 transition-all data-[state=open]:bg-secondary/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <User className="w-5 h-5" />
                    </div>
                    <span>Personal Information</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4 px-4 pb-6 border-x border-b rounded-b-xl bg-secondary/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                            <User className="w-3 h-3" /> Full Name
                        </Label>
                        <Input name="name" value={resumeData.personalInfo.name} onChange={handlePersonalInfoChange} className="bg-background" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                            <Sparkles className="w-3 h-3" /> Job Title
                        </Label>
                        <div className="flex items-center gap-2 relative">
                            <Input name="title" value={resumeData.personalInfo.title} onChange={handlePersonalInfoChange} className="flex-grow pr-10 bg-background" />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <ProFeatureWrapper isPro={isProUser}>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-primary/10" onClick={handleSuggestTitle} disabled={isTitleSuggesting}>
                                                    {isTitleSuggesting ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Sparkles className="h-4 w-4 text-primary" />}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>AI Suggest Standardized Title</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </ProFeatureWrapper>
                            </div>
                        </div>
                        {titleSuggestion && (
                            <div className="bg-background p-2 rounded-lg flex items-center justify-between border border-primary/20 mt-2 animate-in fade-in slide-in-from-top-1 shadow-sm">
                                <p className="text-[10px] leading-tight">AI suggests: <span className="font-bold text-primary">{titleSuggestion}</span></p>
                                <div className="flex gap-1">
                                    <Button size="sm" variant="link" onClick={applyTitleSuggestion} className="h-6 p-0 px-2 text-[10px] text-primary font-bold">Apply</Button>
                                    <Button size="icon" variant="ghost" onClick={() => setTitleSuggestion(null)} className="h-6 w-6"><XCircle className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                            <Mail className="w-3 h-3" /> Email Address
                        </Label>
                        <Input name="email" type="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange} className="bg-background" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                            <Phone className="w-3 h-3" /> Phone Number
                        </Label>
                        <Input name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange} className="bg-background" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> Location
                        </Label>
                        <Input name="location" value={resumeData.personalInfo.location} onChange={handlePersonalInfoChange} placeholder="City, State" className="bg-background" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                            <Globe className="w-3 h-3" /> Website / Portfolio
                        </Label>
                        <Input name="website" value={resumeData.personalInfo.website} onChange={handlePersonalInfoChange} placeholder="linkedin.com/in/you" className="bg-background" />
                    </div>
                </div>

                <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 flex items-start gap-3">
                    <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">Pro Tip:</strong> Ensure your LinkedIn profile is up to date and your location matches the target market if you're applying for remote or local-only roles.
                    </p>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
