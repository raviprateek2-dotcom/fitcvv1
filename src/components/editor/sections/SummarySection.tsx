'use client';
import React from 'react';

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Sparkles, Lightbulb, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import AIContentDialog from "../AIContentDialog";
import AISectionWriterDialog from "../AISectionWriterDialog";
import { ProFeatureWrapper } from "../ProFeatureWrapper";
import type { ResumeData } from "../types";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useResumeEditorStore } from "@/store/resume-editor-store";

interface SummarySectionProps {
    isProUser: boolean;
}

export const SummarySection = React.memo(function SummarySection({ isProUser }: SummarySectionProps) {
    const { resumeData, setResumeData } = useResumeEditorStore();
    
    if (!resumeData) return null;

    const summaryLength = resumeData.summary?.length || 0;
    const isTooShort = summaryLength > 0 && summaryLength < 150;
    const isOptimal = summaryLength >= 150 && summaryLength <= 350;
    const isTooLong = summaryLength > 350;

    function handleFieldChange<T extends keyof ResumeData>(field: T, value: ResumeData[T]) {
        setResumeData(prev => ({ ...prev, [field]: value }));
    }

    return (
        <AccordionItem value="summary" className="border-none mb-6">
            <AccordionTrigger className="hover:no-underline py-0 group">
                <div className="flex items-center gap-4 transition-all group-data-[state=open]:translate-x-1">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/20 group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground group-data-[state=open]:scale-110 transition-all duration-300">
                        <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold font-headline transition-all group-data-[state=open]:text-primary text-gradient">Executive Summary</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-8 space-y-8 border-none px-1">
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4 shadow-inner">
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/20 p-2 rounded-xl">
                            <Lightbulb className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/80">Strategist's Protocol</p>
                            <p className="text-sm text-muted-foreground/90 leading-relaxed font-medium">
                                Craft your <span className="text-foreground font-bold">30-second digital pitch</span>. Synchronize your core tenure, specialized tech-stack, and a high-impact outcome. Target: <strong className="text-primary font-black">150–350 characters</strong>.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="relative group">
                        <Textarea 
                            value={resumeData.summary} 
                            onChange={e => handleFieldChange('summary', e.target.value)} 
                            rows={6}
                            placeholder="e.g. Architecting scalable distributed systems for Fortune 500 tech..."
                            className="bg-white/5 border-white/10 rounded-2xl resize-none focus-visible:ring-primary/20 text-sm leading-relaxed p-4 transition-all hover:bg-white/[0.07] min-h-[160px]"
                        />
                    </div>
                    
                    <div className="space-y-3 px-1">
                        <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                            <span>Density Calibration</span>
                            <span className={cn(isTooLong ? "text-destructive" : isOptimal ? "text-green-500" : "text-primary")}>{summaryLength} / 350 optimized</span>
                        </div>
                        <Progress 
                            value={Math.min((summaryLength / 350) * 100, 100)} 
                            className="h-2 bg-white/10 rounded-full"
                        />
                        <div className="flex items-center gap-2">
                            {isTooShort && <p className="text-[10px] text-amber-500 flex items-center gap-1.5 font-bold animate-pulse"><AlertCircle className="w-3.5 h-3.5" /> Signal too low - amplify your professional impact.</p>}
                            {isOptimal && <p className="text-[10px] text-green-500 flex items-center gap-1.5 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Optimal density achieved for high-stakes roles.</p>}
                            {isTooLong && <p className="text-[10px] text-destructive flex items-center gap-1.5 font-bold"><AlertCircle className="w-3.5 h-3.5" /> Critical density exceeded - prune for maximum legibility.</p>}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <ProFeatureWrapper isPro={isProUser}>
                        <AISectionWriterDialog
                            sectionName="Professional Summary"
                            jobDescription={resumeData.jobDescription}
                            existingContent={resumeData.summary}
                            onApply={(newContent) => handleFieldChange('summary', newContent)}
                        >
                            <Button variant="premium" size="sm" className="h-9 px-4 rounded-xl shadow-lg">
                                <Sparkles className="mr-2 h-4 w-4" />
                                AI Generation
                            </Button>
                        </AISectionWriterDialog>
                    </ProFeatureWrapper>
                    <ProFeatureWrapper isPro={isProUser}>
                        <AIContentDialog
                            sectionName="Professional Summary"
                            currentContent={resumeData.summary}
                            jobDescription={resumeData.jobDescription}
                            onApply={(newContent) => handleFieldChange('summary', newContent)}
                        />
                    </ProFeatureWrapper>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
});
