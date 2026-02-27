'use client';
import React from 'react';

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MinusCircle, PlusCircle, Trash2, Rocket, ExternalLink, FileCode, TextQuote } from "lucide-react";
import type { ResumeData } from "../types";
import { useResumeEditorStore } from "@/store/resume-editor-store";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

export const ProjectsSection = React.memo(function ProjectsSection() {
    const { resumeData, setResumeData } = useResumeEditorStore();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleNestedChange = (
        section: 'projects',
        id: number,
        field: 'name' | 'description' | 'link',
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

    const addProjectSection = () => {
        setResumeData(prev => ({
            ...prev,
            projects: []
        }));
    };

    const removeProjectSection = () => {
        setResumeData(prev => {
            const { projects, ...rest } = prev;
            return rest as ResumeData;
        });
    };

    const addProject = () => {
        setResumeData(prev => ({
            ...prev,
            projects: [...(prev.projects || []), { id: Date.now(), name: '', description: '', link: '' }]
        }));
    };

    const removeProject = (id: number) => {
        setResumeData(prev => {
            if (!prev.projects) return prev;
            const updatedProjects = prev.projects.filter(p => p.id !== id);
            return { ...prev, projects: updatedProjects };
        });
    };

    if (!resumeData) return null;
    
    const hasProjectsSection = resumeData.projects !== undefined;

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setResumeData((prev) => {
                if (!prev.projects) return prev;
                const oldIndex = prev.projects.findIndex((item) => item.id === active.id);
                const newIndex = prev.projects.findIndex((item) => item.id === over.id);
                return {
                    ...prev,
                    projects: arrayMove(prev.projects, oldIndex, newIndex),
                };
            });
        }
    };

    return (
        <AccordionItem value="projects" className="border-none mb-6">
            <AccordionTrigger className="hover:no-underline py-0 group">
                <div className="flex items-center gap-4 transition-all group-data-[state=open]:translate-x-1">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/20 group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground group-data-[state=open]:scale-110 transition-all duration-300">
                        <Rocket className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold font-headline transition-all group-data-[state=open]:text-primary text-gradient">Ventures & Projects</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-8 space-y-8 border-none px-1">
                {!hasProjectsSection ? (
                    <Button variant="glass" onClick={addProjectSection} className="w-full border-dashed border-2 py-8 rounded-2xl hover:bg-white/5 hover:border-primary/40 transition-all font-bold text-sm">
                        <PlusCircle className="mr-2 h-5 w-5" /> Initialize Projects Module
                    </Button>
                ) : (
                    <div className="space-y-6">
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={(resumeData.projects || []).map(p => p.id)} strategy={verticalListSortingStrategy}>
                                {(resumeData.projects || []).map((proj) => (
                                    <div key={proj.id}>
                                        <SortableItem id={proj.id}>
                                            <div className="p-6 border border-white/10 bg-white/5 rounded-2xl space-y-6 shadow-sm transition-all hover:bg-white/[0.07] hover:border-white/20 group/item">
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                        <FileCode className="w-3.5 h-3.5" /> Project Designation
                                                    </Label>
                                                    <Input value={proj.name} onChange={e => handleNestedChange('projects', proj.id, 'name', e.target.value)} className="bg-white/5 border-white/10 h-11 rounded-xl focus:ring-primary/20 transition-all" placeholder="e.g. Distributed Ledger Implementation" />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                        <TextQuote className="w-3.5 h-3.5" /> Narrative & Technical Architecture
                                                    </Label>
                                                    <Textarea rows={4} value={proj.description} onChange={e => handleNestedChange('projects', proj.id, 'description', e.target.value)} className="bg-white/5 border-white/10 rounded-2xl text-sm leading-relaxed p-4 resize-none focus:ring-primary/20 transition-all" placeholder="• Engineered a high-throughput consensus algorithm...&#10;• Reduced synchronization overhead by 30%..." />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                        <ExternalLink className="w-3.5 h-3.5" /> Digital footprint / Repository
                                                    </Label>
                                                    <Input value={proj.link} onChange={e => handleNestedChange('projects', proj.id, 'link', e.target.value)} className="bg-white/5 border-white/10 h-11 rounded-xl focus:ring-primary/20 transition-all" placeholder="e.g. github.com/profile/repo" />
                                                </div>
                                                <div className="flex justify-end pt-2 border-t border-white/5">
                                                    <Button variant="ghost" size="icon" onClick={() => removeProject(proj.id)} className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10 transition-colors">
                                                        <Trash2 className="h-4.5 w-4.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </SortableItem>
                                    </div>
                                ))}
                            </SortableContext>
                        </DndContext>
                        <div className="flex flex-col gap-3">
                            <Button variant="glass" onClick={addProject} className="w-full border-dashed border-2 py-6 rounded-2xl hover:bg-white/5 hover:border-primary/40 transition-all font-bold text-sm">
                                <PlusCircle className="mr-2 h-5 w-5" /> Expand Portfolio Entry
                            </Button>
                            <Button variant="ghost" onClick={removeProjectSection} className="w-full h-10 text-destructive/60 hover:text-destructive hover:bg-destructive/5 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all">
                                <MinusCircle className="mr-2 h-4 w-4" /> Decommission Projects Module
                            </Button>
                        </div>
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    );
});
