'use client';
import React from 'react';

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
import { useResumeEditorStore } from "@/store/resume-editor-store";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

interface ExperienceSectionProps {
    isProUser: boolean;
}

const strongVerbs = ['Spearheaded', 'Orchestrated', 'Quantified', 'Engineered', 'Pioneered', 'Accelerated', 'Executed', 'Optimized'];

export const ExperienceSection = React.memo(function ExperienceSection({ isProUser }: ExperienceSectionProps) {
    const { resumeData, setResumeData } = useResumeEditorStore();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleNestedChange = (
        section: 'experience',
        id: number,
        field: 'company' | 'role' | 'date' | 'description',
        value: string
    ) => {
        setResumeData(prev => {
            const list = prev[section] || [];
            const updatedList = (list as any[]).map(item =>
                item.id === id ? { ...item, [field]: value } : item
            );
            return { ...prev, [section]: updatedList };
        });
    };

    const addExperience = () => {
        setResumeData(prev => ({
            ...prev,
            experience: [{ id: Date.now(), company: '', role: '', date: '', description: '' }, ...prev.experience]
        }));
    };

    const removeExperience = (id: number) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        }));
    };

    const checkImpact = (text: string) => {
        const numbers = (text.match(/\d+/g) || []).length;
        const hasActionVerb = strongVerbs.some(v => text.toLowerCase().includes(v.toLowerCase()));
        
        if (numbers >= 2 && hasActionVerb) return { score: 100, label: 'High Velocity', color: 'text-green-500 bg-green-500/10 border-green-500/20', icon: <TrendingUp className="w-3 h-3" /> };
        if (numbers >= 1 || hasActionVerb) return { score: 60, label: 'Stable Impact', color: 'text-primary bg-primary/10 border-primary/20', icon: <Target className="w-3 h-3" /> };
        return { score: 30, label: 'Developing', color: 'text-muted-foreground bg-white/5 border-white/10', icon: <Lightbulb className="w-3 h-3" /> };
    };

    if (!resumeData) return null;

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setResumeData((prev) => {
                const oldIndex = prev.experience.findIndex((item) => item.id === active.id);
                const newIndex = prev.experience.findIndex((item) => item.id === over.id);
                return {
                    ...prev,
                    experience: arrayMove(prev.experience, oldIndex, newIndex),
                };
            });
        }
    };

    return (
        <AccordionItem value="experience" className="border-none mb-6">
            <AccordionTrigger className="hover:no-underline py-0 group">
                <div className="flex items-center gap-4 transition-all group-data-[state=open]:translate-x-1">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/20 group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground group-data-[state=open]:scale-110 transition-all duration-300">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold font-headline transition-all group-data-[state=open]:text-primary text-gradient">Career Trajectory</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-8 space-y-8 border-none px-1">
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4 shadow-inner">
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/20 p-2 rounded-xl">
                            <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/80">Velocity Protocol</p>
                            <p className="text-sm text-muted-foreground/90 leading-relaxed font-medium">
                                Deploy the <span className="text-foreground font-bold">STAR Framework</span>. Quantify results with precision (e.g., "Led 12+ stakeholders to realize 22% ARR growth"). Data-driven bullets outperform passive lists 3:1.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={resumeData.experience.map(e => e.id)} strategy={verticalListSortingStrategy}>
                            {resumeData.experience.map((exp) => {
                                const impact = checkImpact(exp.description);
                                return (
                                    <div key={exp.id}>
                                        <SortableItem id={exp.id}>
                                            <div className="p-6 border border-white/10 bg-white/5 rounded-2xl space-y-6 shadow-sm transition-all hover:bg-white/[0.07] hover:border-white/20 group/item">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Corporate Tier</Label>
                                                        <Input value={exp.company} onChange={e => handleNestedChange('experience', exp.id, 'company', e.target.value)} className="bg-white/5 border-white/10 h-11 rounded-xl focus:ring-primary/20 transition-all" placeholder="e.g. Google Cloud" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Functional Authority</Label>
                                                        <Input value={exp.role} onChange={e => handleNestedChange('experience', exp.id, 'role', e.target.value)} className="bg-white/5 border-white/10 h-11 rounded-xl focus:ring-primary/20 transition-all" placeholder="e.g. Principal Lead" />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tenure Horizon</Label>
                                                    <Input value={exp.date} onChange={e => handleNestedChange('experience', exp.id, 'date', e.target.value)} className="bg-white/5 border-white/10 h-11 rounded-xl focus:ring-primary/20 transition-all" placeholder="e.g. Jan 2020 - Present" />
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Impact Narrative & Key Results</Label>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className={cn("text-[9px] px-2 py-0.5 rounded-lg flex items-center gap-1.5 font-bold transition-all border shadow-sm", impact.color)}>
                                                                {impact.icon}
                                                                {impact.label}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <Textarea rows={6} value={exp.description} onChange={e => handleNestedChange('experience', exp.id, 'description', e.target.value)} className="bg-white/5 border-white/10 rounded-2xl text-sm leading-relaxed p-4 resize-none focus:ring-primary/20 transition-all" placeholder="• Orchestrated migration of legacy monolith to Kubernetes, reducing latency by 45%..." />
                                                    
                                                    {impact.score < 60 && (
                                                        <div className="p-4 bg-primary/5 rounded-xl border border-dashed border-primary/20 animate-in fade-in zoom-in-95 duration-500">
                                                            <p className="text-[10px] font-black text-primary uppercase mb-3 flex items-center gap-2"><Zap className="w-4 h-4" /> Performance Boosters:</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {strongVerbs.slice(0, 6).map(verb => (
                                                                    <Badge key={verb} variant="secondary" className="text-[9px] font-bold cursor-pointer bg-white/5 hover:bg-primary hover:text-white transition-all rounded-lg border border-white/10 px-2 py-1" onClick={() => handleNestedChange('experience', exp.id, 'description', exp.description + `\n• ${verb} `)}>
                                                                        {verb}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-4">
                                                    <div className="flex gap-3">
                                                        <ProFeatureWrapper isPro={isProUser}>
                                                            <AISectionWriterDialog
                                                                sectionName={`Experience at ${exp.company || 'Company'}`}
                                                                jobDescription={resumeData.jobDescription}
                                                                existingContent={exp.description}
                                                                onApply={(newContent) => handleNestedChange('experience', exp.id, 'description', newContent)}
                                                            >
                                                                <Button variant="premium" size="sm" className="h-9 px-4 rounded-xl shadow-lg">
                                                                    <Sparkles className="mr-2 h-4 w-4" />
                                                                    AI Optimized Rewrite
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
                                                    <Button variant="ghost" size="icon" onClick={() => removeExperience(exp.id)} className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors">
                                                        <Trash2 className="h-4.5 w-4.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </SortableItem>
                                    </div>
                                );
                            })}
                        </SortableContext>
                    </DndContext>

                    <Button variant="glass" onClick={addExperience} className="w-full border-dashed border-2 py-8 rounded-2xl hover:bg-white/5 hover:border-primary/40 transition-all font-bold text-sm">
                        <PlusCircle className="mr-2 h-5 w-5" /> Integrate New Experience Milestone
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
});
