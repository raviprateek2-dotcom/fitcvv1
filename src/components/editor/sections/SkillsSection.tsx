
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import type { ResumeData } from "../types";

interface SkillsSectionProps {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>;
}

export function SkillsSection({ resumeData, setResumeData }: SkillsSectionProps) {
    
    const handleNestedChange = (
        section: 'skills',
        id: number,
        field: 'name' | 'level',
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
    
    const addSkillSection = () => {
        setResumeData(prev => (prev ? {
            ...prev,
            skills: []
        } : null));
    };

    const removeSkillSection = () => {
        setResumeData(prev => {
            if (!prev) return null;
            const { skills, ...rest } = prev;
            return rest as ResumeData;
        });
    }

    const addSkill = () => {
        setResumeData(prev => (prev ? {
            ...prev,
            skills: [...(prev.skills || []), { id: Date.now(), name: '', level: 'Advanced' }]
        } : null));
    };

    const removeSkill = (id: number) => {
        setResumeData(prev => (prev ? {
            ...prev,
            skills: (prev.skills || []).filter(skill => skill.id !== id)
        } : null));
    };

    return (
        <AccordionItem value="skills">
            <div className="flex items-center">
                <AccordionTrigger className="font-semibold text-lg flex-grow">Skills</AccordionTrigger>
                {resumeData.skills === undefined ? (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={addSkillSection} className="h-7 w-7">
                                    <PlusCircle className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Add Skills Section</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={removeSkillSection} className="text-destructive hover:text-destructive-foreground hover:bg-destructive h-7 w-7">
                                    <MinusCircle className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remove Skills Section</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
            {resumeData.skills !== undefined && (
                <AccordionContent className="space-y-4 pt-4 border bg-secondary/30 rounded-b-lg p-4">
                    <>
                        {resumeData.skills.map((skill) => (
                            <div key={skill.id} className="p-4 border rounded-lg space-y-4 bg-background">
                                <div className="flex items-center gap-4">
                                    <div className="flex-grow space-y-2">
                                        <Label>Skill</Label>
                                        <Input value={skill.name} onChange={e => handleNestedChange('skills', skill.id, 'name', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Level</Label>
                                        <Select value={skill.level} onValueChange={value => handleNestedChange('skills', skill.id, 'level', value)}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Beginner">Beginner</SelectItem>
                                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                <SelectItem value="Advanced">Advanced</SelectItem>
                                                <SelectItem value="Expert">Expert</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeSkill(skill.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive self-end">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" onClick={addSkill} className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
                        </Button>
                    </>
                </AccordionContent>
            )}
        </AccordionItem>
    );
}
    