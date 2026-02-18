'use client';

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Sparkles, Lightbulb, CheckCircle2, AlertCircle } from "lucide-react";
import AIContentDialog from "../AIContentDialog";
import AISectionWriterDialog from "../AISectionWriterDialog";
import { ProFeatureWrapper } from "../ProFeatureWrapper";
import type { ResumeData } from "../types";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface SummarySectionProps {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>;
    isProUser: boolean;
}

export function SummarySection({ resumeData, setResumeData, isProUser }: SummarySectionProps) {
    const summaryLength = resumeData.summary?.length || 0;
    const isTooShort = summaryLength > 0 && summaryLength < 100;
    const isOptimal = summaryLength >= 100 && summaryLength <= 400;
    const isTooLong = summaryLength > 400;

    const handleFieldChange = <T extends keyof ResumeData>(field: T, value: ResumeData[T]) => {
        setResumeData(prev => prev ? { ...prev, [field]: value } : null);
    };

    return (
        <AccordionItem value="summary" className="border-none mb-4">
            <AccordionTrigger className="font-semibold text-lg hover:no-underline py-2 px-4 rounded-xl hover:bg-secondary/50 transition-all data-[state=open]:bg-secondary/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <FileText className="w-5 h-5" />
                    </div>
                    <span>Professional Summary</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4 px-4 pb-6 border-x border-b rounded-b-xl bg-secondary/20">
                <div className="p-4 bg-background/50 border border-primary/10 rounded-xl space-y-3">
                    <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Coach's Tip</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Think of this as your 30-second elevator pitch. Mention your years of experience, top 3 skills, and a major career goal. Keep it under 4 sentences.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Textarea 
                        value={resumeData.summary} 
                        onChange={e => handleFieldChange('summary', e.target.value)} 
                        rows={5}
                        placeholder="e.g. Results-driven Software Engineer with 5+ years of experience in..."
                        className="bg-background resize-none focus-visible:ring-primary/20"
                    />
                    <div className="flex justify-between items-center px-1">
                        <div className="flex items-center gap-2">
                            {isTooShort && <p className="text-[10px] text-amber-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> A bit short - add more impact.</p>}
                            {isOptimal && <p className="text-[10px] text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Length is optimal.</p>}
                            {isTooLong && <p className="text-[10px] text-amber-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> A bit long - keep it concise.</p>}
                        </div>
                        <p className={cn("text-[10px]", isTooLong ? "text-destructive font-bold" : "text-muted-foreground")}>
                            {summaryLength} / 400 chars recommended
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <ProFeatureWrapper isPro={isProUser}>
                        <AISectionWriterDialog
                            sectionName="Professional Summary"
                            jobDescription={resumeData.jobDescription}
                            existingContent={resumeData.summary}
                            onApply={(newContent) => handleFieldChange('summary', newContent)}
                        >
                            <Button variant="neuro" size="sm" className="h-8">
                                <Bot className="mr-2 h-3.5 w-3.5" />
                                AI Write
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
}

import { FileText } from "lucide-react";
