'use client';

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bot, PlusCircle, Sparkles, Trash2 } from "lucide-react";
import type { ResumeData } from "../types";
import AIContentDialog from "../AIContentDialog";
import AISectionWriterDialog from "../AISectionWriterDialog";
import { ProFeatureWrapper } from "../ProFeatureWrapper";

interface ExperienceSectionProps {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>;
    isProUser: boolean;
}

export function ExperienceSection({ resumeData, setResumeData, isProUser }: ExperienceSectionProps) {

    const handleNestedChange = (
        section: 'experience',
        id: number,
        field: 'company' | 'role' | 'date' | 'description',
        value: string
    ) => {
        setResumeData(prev => {
            if (!prev) return null;
            const list = prev[section] || [];
            const updatedList = (list as any[]).map(item =>
                item.id === id ? { ...item, [field]: value } : item
            );
            return { ...prev, [section]: updatedList };
        });
    };

    const addExperience = () => {
        setResumeData(prev => (prev ? {
            ...prev,
            experience: [...prev.experience, { id: Date.now(), company: '', role: '', date: '', description: '' }]
        } : null));
    };

    const removeExperience = (id: number) => {
        setResumeData(prev => (prev ? {
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        } : null));
    };

    return (
        <AccordionItem value="experience">
            <AccordionTrigger className="font-semibold text-lg">Work Experience</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4 border bg-secondary/30 rounded-b-lg p-4">
                {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="p-4 border rounded-lg space-y-4 relative bg-background">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Company</Label><Input value={exp.company} onChange={e => handleNestedChange('experience', exp.id, 'company', e.target.value)} /></div>
                            <div className="space-y-2"><Label>Role</Label><Input value={exp.role} onChange={e => handleNestedChange('experience', exp.id, 'role', e.target.value)} /></div>
                        </div>
                        <div className="space-y-2"><Label>Date</Label><Input value={exp.date} onChange={e => handleNestedChange('experience', exp.id, 'date', e.target.value)} /></div>
                        <div className="space-y-2"><Label>Description</Label><Textarea rows={4} value={exp.description} onChange={e => handleNestedChange('experience', exp.id, 'description', e.target.value)} /></div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                                <ProFeatureWrapper isPro={isProUser}>
                                    <AISectionWriterDialog
                                        sectionName={`Work Experience at ${exp.company}`}
                                        jobDescription={resumeData.jobDescription}
                                        existingContent={exp.description}
                                        onApply={(newContent) => handleNestedChange('experience', exp.id, 'description', newContent)}
                                    >
                                        <Button variant="outline" size="sm">
                                            <Bot className="mr-2 h-4 w-4" />
                                            AI Writer
                                        </Button>
                                    </AISectionWriterDialog>
                                </ProFeatureWrapper>
                                <ProFeatureWrapper isPro={isProUser}>
                                    <AIContentDialog
                                        sectionName={`Experience at ${exp.company}`}
                                        currentContent={exp.description}
                                        jobDescription={resumeData.jobDescription}
                                        onApply={(newContent) => handleNestedChange('experience', exp.id, 'description', newContent)}
                                    />
                                </ProFeatureWrapper>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeExperience(exp.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                <Button variant="outline" onClick={addExperience} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
                </Button>
            </AccordionContent>
        </AccordionItem>
    );
}