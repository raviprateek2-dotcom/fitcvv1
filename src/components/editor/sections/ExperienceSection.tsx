
'use client';

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bot, PlusCircle, Sparkles, Trash2, Briefcase, Lightbulb, Target, TrendingUp, Zap } from "lucide-react";
import type { ResumeData } from "../types";
import AIContentDialog from "../AIContentDialog";
import AISectionWriterDialog from "../AISectionWriterDialog";
import { ProFeatureWrapper } from "../ProFeatureWrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ExperienceSectionProps {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>;
    isProUser: boolean;
}

const strongVerbs = ['Spearheaded', 'Orchestrated', 'Quantified', 'Engineered', 'Pioneered', 'Accelerated', 'Executed', 'Optimized'];

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
            experience: [{ id: Date.now(), company: '', role: '', date: '', description: '' }, ...prev.experience]
        } : null));
    };

    const removeExperience = (id: number) => {
        setResumeData(prev => (prev ? {
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        } : null));
    };

    const checkImpact = (text: string) => {
        const numbers = (text.match(/\d+/g) || []).length;
        const hasActionVerb = strongVerbs.some(v => text.toLowerCase().includes(v.toLowerCase()));
        
        if (numbers >= 2 && hasActionVerb) return { score: 100, label: 'High Impact', color: 'text-green-600 bg-green-50 border-green-100', icon: <TrendingUp className="w-3 h-3" /> };
        if (numbers >= 1 || hasActionVerb) return { score: 60, label: 'Good Start', color: 'text-amber-600 bg-amber-50 border-amber-100', icon: <Target className="w-3 h-3" /> };
        return { score: 30, label: 'Low Impact', color: 'text-muted-foreground bg-secondary/50 border-transparent', icon: <Lightbulb className="w-3 h-3" /> };
    };

    return (
        <AccordionItem value="experience" className="border-none mb-4">
            <AccordionTrigger className="font-semibold text-lg hover:no-underline py-2 px-4 rounded-xl hover:bg-secondary/50 transition-all data-[state=open]:bg-secondary/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <span>Work Experience</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4 px-4 pb-6 border-x border-b rounded-b-xl bg-secondary/20">
                
                <div className="p-4 bg-background/50 border border-primary/10 rounded-xl space-y-3">
                    <div className="flex items-start gap-3">
                        <TrendingUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Strategic Impact Tip</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Use the <strong className="text-foreground">STAR Method</strong>: Situation, Task, Action, Result. Always try to include numbers (e.g., "Increased sales by 20%" or "Led a team of 10").
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {resumeData.experience.map((exp) => {
                        const impact = checkImpact(exp.description);
                        return (
                            <div key={exp.id} className="p-5 border bg-background rounded-xl space-y-4 shadow-sm group transition-all hover:border-primary/20">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Company Name</Label>
                                        <Input value={exp.company} onChange={e => handleNestedChange('experience', exp.id, 'company', e.target.value)} className="h-9" placeholder="e.g. Google" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Your Role</Label>
                                        <Input value={exp.role} onChange={e => handleNestedChange('experience', exp.id, 'role', e.target.value)} className="h-9" placeholder="e.g. Senior Product Manager" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Employment Period</Label>
                                    <Input value={exp.date} onChange={e => handleNestedChange('experience', exp.id, 'date', e.target.value)} className="h-9" placeholder="e.g. Jan 2020 - Present" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Description & Key Achievements</Label>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0 h-5 flex items-center gap-1 font-medium transition-colors", impact.color)}>
                                                {impact.icon}
                                                {impact.label}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Textarea rows={5} value={exp.description} onChange={e => handleNestedChange('experience', exp.id, 'description', e.target.value)} className="bg-secondary/10 text-sm resize-none" placeholder="• Led a cross-functional team...&#10;• Increased revenue by 15% through..." />
                                    
                                    {impact.score < 60 && (
                                        <div className="p-3 bg-primary/5 rounded-lg border border-dashed border-primary/20">
                                            <p className="text-[10px] font-bold text-primary uppercase mb-2 flex items-center gap-1"><Zap className="w-3 h-3" /> Impact Boosters:</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {strongVerbs.slice(0, 5).map(verb => (
                                                    <Badge key={verb} variant="secondary" className="text-[9px] cursor-help bg-background hover:bg-primary hover:text-white transition-colors" onClick={() => handleNestedChange('experience', exp.id, 'description', exp.description + `\n• ${verb} `)}>
                                                        {verb}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <div className="flex gap-2">
                                        <ProFeatureWrapper isPro={isProUser}>
                                            <AISectionWriterDialog
                                                sectionName={`Experience at ${exp.company || 'Company'}`}
                                                jobDescription={resumeData.jobDescription}
                                                existingContent={exp.description}
                                                onApply={(newContent) => handleNestedChange('experience', exp.id, 'description', newContent)}
                                            >
                                                <Button variant="outline" size="sm" className="h-8 text-xs">
                                                    <Bot className="mr-2 h-3.5 w-3.5" />
                                                    AI Writer
                                                </Button>
                                            </AISectionWriterDialog>
                                        </ProFeatureWrapper>
                                        <ProFeatureWrapper isPro={isProUser}>
                                            <AIContentDialog
                                                sectionName={`Experience at ${exp.company || 'Company'}`}
                                                currentContent={exp.description}
                                                jobDescription={resumeData.jobDescription}
                                                onApply={(newContent) => handleNestedChange('experience', exp.id, 'description', newContent)}
                                            />
                                        </ProFeatureWrapper>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeExperience(exp.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Button variant="outline" onClick={addExperience} className="w-full border-dashed border-2 py-6 rounded-xl hover:bg-primary/5 hover:border-primary/20">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Experience Entry
                </Button>
            </AccordionContent>
        </AccordionItem>
    );
}
