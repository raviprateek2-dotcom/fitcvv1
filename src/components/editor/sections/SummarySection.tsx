
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/componentsui/textarea";
import { Bot, Sparkles } from "lucide-react";
import AIContentDialog from "../AIContentDialog";
import AISectionWriterDialog from "../AISectionWriterDialog";
import { ProFeatureWrapper } from "../ProFeatureWrapper";
import type { ResumeData } from "../types";

interface SummarySectionProps {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>;
    isProUser: boolean;
}

export function SummarySection({ resumeData, setResumeData, isProUser }: SummarySectionProps) {

    const handleFieldChange = <T extends keyof ResumeData>(field: T, value: ResumeData[T]) => {
        setResumeData(prev => prev ? { ...prev, [field]: value } : null);
    };

    return (
        <AccordionItem value="summary">
            <AccordionTrigger className="font-semibold text-lg">Professional Summary</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-4 border bg-secondary/30 rounded-b-lg p-4">
                <Textarea value={resumeData.summary} onChange={e => handleFieldChange('summary', e.target.value)} rows={5} />
                <div className="flex gap-2">
                    <ProFeatureWrapper isPro={isProUser}>
                        <AISectionWriterDialog
                            sectionName="Professional Summary"
                            jobDescription={resumeData.jobDescription}
                            existingContent={resumeData.summary}
                            onApply={(newContent) => handleFieldChange('summary', newContent)}
                        >
                            <Button variant="outline" size="sm">
                                <Bot className="mr-2 h-4 w-4" />
                                AI Writer
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

    