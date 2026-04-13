'use client';
import React from 'react';

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Sparkles, XCircle, User, Globe, Mail, MapPin, Phone, Info, AlertTriangle, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { suggestTitle as suggestTitleAction } from '@/app/actions/ai-title-suggester';
import type { ResumeData } from "../types";
import { ProFeatureWrapper } from "../ProFeatureWrapper";
import { useResumeEditorStore } from "@/store/resume-editor-store";

interface PersonalInfoSectionProps {
    isProUser: boolean;
}

export const PersonalInfoSection = React.memo(function PersonalInfoSection({ isProUser }: PersonalInfoSectionProps) {
    const { resumeData, setResumeData } = useResumeEditorStore();
    const { toast } = useToast();
    const [isTitleSuggesting, setIsTitleSuggesting] = useState(false);
    const [titleSuggestion, setTitleSuggestion] = useState<string | null>(null);

    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [name]: value } }));
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
            setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, title: titleSuggestion } }));
            setTitleSuggestion(null);
        }
    }

    const hasMissingLinks = !resumeData?.personalInfo?.website;

    if (!resumeData) return null;

    return (
        <AccordionItem value="personal-info" className="border-none mb-6">
            <AccordionTrigger className="hover:no-underline py-0 group">
                <div className="flex items-center gap-4 transition-all group-data-[state=open]:translate-x-1">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/20 group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground group-data-[state=open]:scale-110 transition-all duration-300">
                        <User className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold font-headline transition-all group-data-[state=open]:text-primary text-gradient">Personal Identity</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-8 space-y-8 border-none px-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <User className="w-3.5 h-3.5" /> Full Name
                        </Label>
                        <Input name="name" value={resumeData.personalInfo.name} onChange={handlePersonalInfoChange} className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-primary/20 transition-all shadow-inner" placeholder="E.g. Alexander Pierce" />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5" /> Professional Title
                        </Label>
                        <div className="flex items-center gap-2 relative">
                            <Input name="title" value={resumeData.personalInfo.title} onChange={handlePersonalInfoChange} className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-primary/20 transition-all shadow-inner pr-12" placeholder="E.g. Senior Product Architect" />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <ProFeatureWrapper isPro={isProUser}>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="glass" size="icon" className="h-8 w-8 rounded-lg shadow-lg border border-white/10" onClick={handleSuggestTitle} disabled={isTitleSuggesting}>
                                                    {isTitleSuggesting ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Sparkles className="h-4 w-4 text-primary" />}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-glass backdrop-blur-3xl border border-white/10">
                                                <p className="font-bold text-xs">AI Standardize Title</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </ProFeatureWrapper>
                            </div>
                        </div>
                        {titleSuggestion && (
                            <div className="bg-primary/5 p-3 rounded-xl flex items-center justify-between border border-primary/20 mt-3 animate-in fade-in slide-in-from-top-2 shadow-inner">
                                <p className="text-[11px] leading-tight font-medium">AI Optimization: <span className="font-bold text-primary">{titleSuggestion}</span></p>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="premium" onClick={applyTitleSuggestion} className="h-7 px-3 text-[10px] rounded-lg">Apply</Button>
                                    <Button size="icon" variant="ghost" onClick={() => setTitleSuggestion(null)} className="h-7 w-7 rounded-lg"><XCircle className="h-4 w-4 text-muted-foreground" /></Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5" /> Secure Email
                        </Label>
                        <Input name="email" type="email" autoComplete="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange} className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-primary/20 transition-all shadow-inner" placeholder="you@example.com" />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5" /> Contact Number
                        </Label>
                        <Input name="phone" type="tel" inputMode="tel" autoComplete="tel" value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange} className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-primary/20 transition-all shadow-inner" placeholder="+91 98765 43210" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" /> Geographic Location
                        </Label>
                        <Input name="location" value={resumeData.personalInfo.location} onChange={handlePersonalInfoChange} placeholder="E.g. San Francisco, CA" className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-primary/20 transition-all shadow-inner" />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5" /> Digital Identity
                        </Label>
                        <Input name="website" value={resumeData.personalInfo.website} onChange={handlePersonalInfoChange} placeholder="linkedin.com/in/alex-pierce" className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-primary/20 transition-all shadow-inner" />
                        {hasMissingLinks && (
                            <p className="text-[10px] text-amber-500 flex items-center gap-1.5 font-bold mt-2 animate-pulse">
                                <AlertTriangle className="w-3.5 h-3.5" /> Opportunity: Adding a LinkedIn increases reach-back by 32%.
                            </p>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4 shadow-inner">
                    <div className="bg-primary/10 p-2 rounded-xl">
                        <Info className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">
                        <strong className="text-foreground">Recruiter Intelligence:</strong> High-stakes hiring managers spend <strong className="text-primary font-black">7 seconds</strong> on the first pass. Ensure your digital footprints are high-signal and professional.
                    </p>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
});
