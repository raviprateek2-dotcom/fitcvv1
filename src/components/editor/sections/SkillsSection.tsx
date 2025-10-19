'use client';

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
        setResumeData(prev => {
            if (!prev || !prev.skills) return prev;
            
            const updatedSkills = prev.skills.filter(skill => skill.id !== id);

            if (updatedSkills.length === 0) {
                // If the last skill is removed, remove the whole section
                const { skills, ...rest } = prev;
                return rest as ResumeData;
            }

            return { ...prev, skills: updatedSkills };
        });
    };

    const hasSkillsSection = resumeData.skills !== undefined;

    return (
        <AccordionItem value="skills">
            <AccordionTrigger className="font-semibold text-lg">Skills</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4 border bg-secondary/30 rounded-b-lg p-4">
                {!hasSkillsSection ? (
                     <Button variant="outline" onClick={addSkillSection} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Skills Section
                    </Button>
                ) : (
                    <>
                        {(resumeData.skills || []).map((skill) => (
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
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Another Skill
                        </Button>
                        <Button variant="ghost" onClick={removeSkillSection} className="w-full text-destructive hover:text-destructive">
                            <MinusCircle className="mr-2 h-4 w-4" /> Remove Skills Section
                        </Button>
                    </>
                )}
            </AccordionContent>
        </AccordionItem>
    );
}
