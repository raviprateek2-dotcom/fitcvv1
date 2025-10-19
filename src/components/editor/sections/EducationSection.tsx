'use client';

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import type { ResumeData } from "../types";

interface EducationSectionProps {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>;
}

export function EducationSection({ resumeData, setResumeData }: EducationSectionProps) {

    const handleNestedChange = (
        section: 'education',
        id: number,
        field: 'institution' | 'degree' | 'date',
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

    const addEducation = () => {
        setResumeData(prev => (prev ? {
            ...prev,
            education: [...prev.education, { id: Date.now(), institution: '', degree: '', date: '' }]
        } : null));
    };

    const removeEducation = (id: number) => {
        setResumeData(prev => (prev ? {
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        } : null));
    };

    return (
        <AccordionItem value="education">
            <AccordionTrigger className="font-semibold text-lg">Education</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4 border bg-secondary/30 rounded-b-lg p-4">
                {resumeData.education.map((edu) => (
                    <div key={edu.id} className="p-4 border rounded-lg space-y-4 relative bg-background">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Institution</Label><Input value={edu.institution} onChange={e => handleNestedChange('education', edu.id, 'institution', e.target.value)} /></div>
                            <div className="space-y-2"><Label>Degree/Certificate</Label><Input value={edu.degree} onChange={e => handleNestedChange('education', edu.id, 'degree', e.target.value)} /></div>
                        </div>
                        <div className="space-y-2"><Label>Date</Label><Input value={edu.date} onChange={e => handleNestedChange('education', edu.id, 'date', e.target.value)} /></div>
                        <div className="flex justify-end">
                            <Button variant="ghost" size="icon" onClick={() => removeEducation(edu.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                <Button variant="outline" onClick={addEducation} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Education
                </Button>
            </AccordionContent>
        </AccordionItem>
    );
}