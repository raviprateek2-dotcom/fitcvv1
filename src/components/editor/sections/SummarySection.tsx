
'use client';

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

interface SummarySectionProps {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>;
    isProUser: boolean;
}

export function SummarySection({ resumeData, setResumeData, isProUser }: SummarySectionProps) {
    const summaryLength = resumeData.summary?.length || 0;
    const isTooShort = summaryLength > 0 && summaryLength < 150;
    const isOptimal = summaryLength >= 150 && summaryLength <= 350;
    const isTooLong = summaryLength > 350;

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
                                Think of this as your 30-second elevator pitch. Mention your years of experience, top 3 skills, and a major career goal. Aim for <strong className="text-foreground">150–350 characters</strong>.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Textarea 
                        value={resumeData.summary} 
                        onChange={e => handleFieldChange('summary', e.target.value)} 
                        rows={5}
                        placeholder="e.g. Results-driven Software Engineer with 5+ years of experience in..."
                        className="bg-background resize-none focus-visible:ring-primary/20 text-sm"
                    />
                    
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground">
                            <span>Length Gauge</span>
                            <span className={cn(isTooLong && "text-destructive")}>{summaryLength} / 350 recommended</span>
                        </div>
                        <Progress 
                            value={Math.min((summaryLength / 350) * 100, 100)} 
                            className="h-1.5 bg-secondary"
                            indicatorClassName={cn(
                                isOptimal ? "bg-green-500" : isTooShort ? "bg-amber-400" : "bg-destructive"
                            )}
                        />
                        <div className="flex items-center gap-2 pt-1">
                            {isTooShort && <p className="text-[10px] text-amber-600 flex items-center gap-1 font-medium"><AlertCircle className="w-3 h-3" /> A bit short - add more specific impact.</p>}
                            {isOptimal && <p className="text-[10px] text-green-600 flex items-center gap-1 font-medium"><CheckCircle2 className="w-3 h-3" /> Impact is optimal for high-stakes roles.</p>}
                            {isTooLong && <p className="text-[10px] text-destructive flex items-center gap-1 font-medium"><AlertCircle className="w-3 h-3" /> Too dense - keep it concise for recruiters.</p>}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
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
