'use client';

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MinusCircle, PlusCircle, Trash2, Code, Lightbulb, Info, CheckCircle2, AlertCircle } from "lucide-react";
import type { ResumeData } from "../types";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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
            return { ...prev, skills: updatedSkills };
        });
    };

    const hasSkillsSection = resumeData.skills !== undefined;
    const skillsCount = resumeData.skills?.length || 0;
    const isUnderloaded = skillsCount > 0 && skillsCount < 8;
    const isOptimal = skillsCount >= 8 && skillsCount <= 15;
    const isOverloaded = skillsCount > 15;

    return (
        <AccordionItem value="skills" className="border-none mb-4">
            <AccordionTrigger className="font-semibold text-lg hover:no-underline py-2 px-4 rounded-xl hover:bg-secondary/50 transition-all data-[state=open]:bg-secondary/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Code className="w-5 h-5" />
                    </div>
                    <span>Skills & Expertise</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4 px-4 pb-6 border-x border-b rounded-b-xl bg-secondary/20">
                
                <div className="p-4 bg-background/50 border border-primary/10 rounded-xl space-y-3">
                    <div className="flex items-start gap-3">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Expert Advice</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Aim for <strong className="text-foreground">8–15 relevant skills</strong>. Group them by category (e.g. "Cloud: AWS, GCP") to maximize space and ATS visibility.
                            </p>
                        </div>
                    </div>
                </div>

                {hasSkillsSection && (
                    <div className="px-1 space-y-2">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground">
                            <span>Skills Density</span>
                            <span>{skillsCount} / 15 Target</span>
                        </div>
                        <Progress value={Math.min((skillsCount / 15) * 100, 100)} className="h-1 bg-secondary" />
                        <div className="flex items-center gap-2">
                            {isUnderloaded && <p className="text-[9px] text-amber-600 flex items-center gap-1 font-bold"><AlertCircle className="w-3 h-3" /> Add more skills to increase ATS matching.</p>}
                            {isOptimal && <p className="text-[9px] text-green-600 flex items-center gap-1 font-bold"><CheckCircle2 className="w-3 h-3" /> Optimal skill density achieved.</p>}
                            {isOverloaded && <p className="text-[9px] text-amber-600 flex items-center gap-1 font-bold"><AlertCircle className="w-3 h-3" /> Too many? Group them to maintain readability.</p>}
                        </div>
                    </div>
                )}

                {!hasSkillsSection ? (
                     <Button variant="outline" onClick={addSkillSection} className="w-full border-dashed border-2 py-6 rounded-xl hover:bg-primary/5">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Skills Section
                    </Button>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-3">
                            {(resumeData.skills || []).map((skill) => (
                                <div key={skill.id} className="p-3 border bg-background rounded-xl flex items-center gap-3 shadow-sm group transition-all hover:border-primary/20">
                                    <div className="flex-grow">
                                        <Input 
                                            value={skill.name} 
                                            onChange={e => handleNestedChange('skills', skill.id, 'name', e.target.value)} 
                                            placeholder="e.g. TypeScript"
                                            className="h-8 text-sm bg-transparent border-none focus-visible:ring-0 p-0"
                                        />
                                    </div>
                                    <div className="shrink-0">
                                        <Select value={skill.level} onValueChange={value => handleNestedChange('skills', skill.id, 'level', value)}>
                                            <SelectTrigger className="h-7 w-[110px] text-[10px] font-bold uppercase">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Beginner">Beginner</SelectItem>
                                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                <SelectItem value="Advanced">Advanced</SelectItem>
                                                <SelectItem value="Expert">Expert</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeSkill(skill.id)} className="h-7 w-7 text-destructive hover:bg-destructive/10">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button variant="outline" size="sm" onClick={addSkill} className="w-full h-9">
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Another Skill
                            </Button>
                            <Button variant="ghost" size="sm" onClick={removeSkillSection} className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-9">
                                <MinusCircle className="mr-2 h-4 w-4" /> Remove Section
                            </Button>
                        </div>
                    </>
                )}
            </AccordionContent>
        </AccordionItem>
    );
}
