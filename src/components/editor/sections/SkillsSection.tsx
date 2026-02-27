'use client';
import React from 'react';

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MinusCircle, PlusCircle, Trash2, Code, Lightbulb, Info, CheckCircle2, AlertCircle, Zap, Cpu } from "lucide-react";
import type { ResumeData } from "../types";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useResumeEditorStore } from "@/store/resume-editor-store";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

export const SkillsSection = React.memo(function SkillsSection() {
    const { resumeData, setResumeData } = useResumeEditorStore();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleNestedChange = (
        section: 'skills',
        id: number,
        field: 'name' | 'level',
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
    
    const addSkillSection = () => {
        setResumeData(prev => ({
            ...prev,
            skills: []
        }));
    };

    const removeSkillSection = () => {
        setResumeData(prev => {
            const { skills, ...rest } = prev;
            return rest as ResumeData;
        });
    };

    const addSkill = () => {
        setResumeData(prev => ({
            ...prev,
            skills: [{ id: Date.now(), name: '', level: 'Advanced' }, ...(prev.skills || [])]
        }));
    };

    const removeSkill = (id: number) => {
        setResumeData(prev => {
            if (!prev.skills) return prev;
            const updatedSkills = prev.skills.filter(skill => skill.id !== id);
            return { ...prev, skills: updatedSkills };
        });
    };

    if (!resumeData) return null;

    const hasSkillsSection = resumeData.skills !== undefined;
    const skillsCount = resumeData.skills?.length || 0;
    const isUnderloaded = skillsCount > 0 && skillsCount < 8;
    const isOptimal = skillsCount >= 8 && skillsCount <= 15;
    const isOverloaded = skillsCount > 15;

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setResumeData((prev) => {
                if (!prev.skills) return prev;
                const oldIndex = prev.skills.findIndex((item) => item.id === active.id);
                const newIndex = prev.skills.findIndex((item) => item.id === over.id);
                return {
                    ...prev,
                    skills: arrayMove(prev.skills, oldIndex, newIndex),
                };
            });
        }
    };

    return (
        <AccordionItem value="skills" className="border-none mb-6">
            <AccordionTrigger className="hover:no-underline py-0 group">
                <div className="flex items-center gap-4 transition-all group-data-[state=open]:translate-x-1">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/20 group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground group-data-[state=open]:scale-110 transition-all duration-300">
                        <Cpu className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold font-headline transition-all group-data-[state=open]:text-primary text-gradient">Competencies & Tech Stack</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-8 space-y-8 border-none px-1">
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4 shadow-inner">
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/20 p-2 rounded-xl">
                            <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/80">Calibration Protocol</p>
                            <p className="text-sm text-muted-foreground/90 leading-relaxed font-medium">
                                Target <span className="text-foreground font-bold">8–15 high-signal skills</span>. Organize by primary domains (e.g., "Fullstack: React, Node.js"). ATS crawlers prioritize relevant matches with semantic proximity.
                            </p>
                        </div>
                    </div>
                </div>

                {hasSkillsSection && (
                    <div className="px-1 space-y-3">
                        <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                            <span>Stack Density</span>
                            <span className={cn(isOptimal ? "text-green-500" : "text-primary")}>{skillsCount} / 15 Optimized</span>
                        </div>
                        <Progress value={Math.min((skillsCount / 15) * 100, 100)} className="h-2 bg-white/10 rounded-full" />
                        <div className="flex items-center gap-2">
                            {isUnderloaded && <p className="text-[10px] text-amber-500 flex items-center gap-1.5 font-bold animate-pulse"><AlertCircle className="w-3.5 h-3.5" /> Signal too low - amplify your technical footprint.</p>}
                            {isOptimal && <p className="text-[10px] text-green-500 flex items-center gap-1.5 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Optimal stack density achieved.</p>}
                            {isOverloaded && <p className="text-[10px] text-destructive flex items-center gap-1.5 font-bold"><AlertCircle className="w-3.5 h-3.5" /> Critical density reached - prune for clarity.</p>}
                        </div>
                    </div>
                )}

                {!hasSkillsSection ? (
                     <Button variant="glass" onClick={addSkillSection} className="w-full border-dashed border-2 py-8 rounded-2xl hover:bg-white/5 hover:border-primary/40 transition-all font-bold text-sm">
                        <PlusCircle className="mr-2 h-5 w-5" /> Initialize Skills Module
                    </Button>
                ) : (
                    <div className="space-y-6">
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={(resumeData.skills || []).map(s => s.id)} strategy={verticalListSortingStrategy}>
                                <div className="grid grid-cols-1 gap-4">
                                    {(resumeData.skills || []).map((skill) => (
                                        <div key={skill.id}>
                                            <SortableItem id={skill.id}>
                                                <div className="p-4 border border-white/10 bg-white/5 rounded-2xl flex items-center gap-4 shadow-sm transition-all hover:bg-white/[0.07] hover:border-white/20 group/item">
                                                    <div className="flex-grow">
                                                        <Input 
                                                            value={skill.name} 
                                                            onChange={e => handleNestedChange('skills', skill.id, 'name', e.target.value)} 
                                                            placeholder="e.g. Distributed Architectures"
                                                            className="h-10 text-sm bg-transparent border-none focus-visible:ring-0 p-0 font-medium placeholder:text-muted-foreground/30"
                                                        />
                                                    </div>
                                                    <div className="shrink-0">
                                                        <Select value={skill.level} onValueChange={value => handleNestedChange('skills', skill.id, 'level', value)}>
                                                            <SelectTrigger className="h-8 w-[120px] text-[10px] font-black uppercase tracking-widest bg-white/5 border-white/10 rounded-lg">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-glass backdrop-blur-3xl border-white/10">
                                                                <SelectItem value="Beginner" className="text-[10px] font-bold uppercase">Beginner</SelectItem>
                                                                <SelectItem value="Intermediate" className="text-[10px] font-bold uppercase">Intermediate</SelectItem>
                                                                <SelectItem value="Advanced" className="text-[10px] font-bold uppercase">Advanced</SelectItem>
                                                                <SelectItem value="Expert" className="text-[10px] font-bold uppercase">Expert</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <Button variant="ghost" size="icon" onClick={() => removeSkill(skill.id)} className="h-8 w-8 rounded-lg text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </SortableItem>
                                        </div>
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                        <div className="flex flex-col gap-3">
                            <Button variant="glass" onClick={addSkill} className="w-full border-dashed border-2 py-6 rounded-2xl hover:bg-white/5 hover:border-primary/40 transition-all font-bold text-sm">
                                <PlusCircle className="mr-2 h-5 w-5" /> Integrate Functional Competency
                            </Button>
                            <Button variant="ghost" size="sm" onClick={removeSkillSection} className="w-full h-10 text-destructive/60 hover:text-destructive hover:bg-destructive/5 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all">
                                <MinusCircle className="mr-2 h-4 w-4" /> Decommission Skills Module
                            </Button>
                        </div>
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    );
});
