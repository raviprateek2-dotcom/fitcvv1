'use client';
import React from 'react';

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, GraduationCap, School, Award, Calendar } from "lucide-react";
import type { ResumeData } from "../types";
import { useResumeEditorStore } from "@/store/resume-editor-store";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

export const EducationSection = React.memo(function EducationSection() {
    const { resumeData, setResumeData } = useResumeEditorStore();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleNestedChange = (
        section: 'education',
        id: number,
        field: 'institution' | 'degree' | 'date',
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

    const addEducation = () => {
        setResumeData(prev => ({
            ...prev,
            education: [{ id: Date.now(), institution: '', degree: '', date: '' }, ...prev.education]
        }));
    };

    const removeEducation = (id: number) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        }));
    };

    if (!resumeData) return null;

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setResumeData((prev) => {
                const oldIndex = prev.education.findIndex((item) => item.id === active.id);
                const newIndex = prev.education.findIndex((item) => item.id === over.id);
                return {
                    ...prev,
                    education: arrayMove(prev.education, oldIndex, newIndex),
                };
            });
        }
    };

    return (
        <AccordionItem value="education" className="border-none mb-6">
            <AccordionTrigger className="hover:no-underline py-0 group">
                <div className="flex items-center gap-4 transition-all group-data-[state=open]:translate-x-1">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/20 group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground group-data-[state=open]:scale-110 transition-all duration-300">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold font-headline transition-all group-data-[state=open]:text-primary text-gradient">Educational Background</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-8 space-y-8 border-none px-1">
                <div className="space-y-6">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={resumeData.education.map(e => e.id)} strategy={verticalListSortingStrategy}>
                            {resumeData.education.map((edu) => (
                                <div key={edu.id}>
                                    <SortableItem id={edu.id}>
                                        <div className="p-6 border border-white/10 bg-white/5 rounded-2xl space-y-6 shadow-sm transition-all hover:bg-white/[0.07] hover:border-white/20 group/item">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                        <School className="w-3.5 h-3.5" /> Academic Institution
                                                    </Label>
                                                    <Input value={edu.institution} onChange={e => handleNestedChange('education', edu.id, 'institution', e.target.value)} className="bg-white/5 border-white/10 h-11 rounded-xl focus:ring-primary/20 transition-all" placeholder="e.g. Stanford University" />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                        <Award className="w-3.5 h-3.5" /> Degree / Specification
                                                    </Label>
                                                    <Input value={edu.degree} onChange={e => handleNestedChange('education', edu.id, 'degree', e.target.value)} className="bg-white/5 border-white/10 h-11 rounded-xl focus:ring-primary/20 transition-all" placeholder="e.g. M.Sc. Computer Science" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5" /> Graduation Date / Horizon
                                                </Label>
                                                <Input value={edu.date} onChange={e => handleNestedChange('education', edu.id, 'date', e.target.value)} className="bg-white/5 border-white/10 h-11 rounded-xl focus:ring-primary/20 transition-all" placeholder="e.g. Class of 2022" />
                                            </div>
                                            <div className="flex justify-end pt-2 border-t border-white/5">
                                                <Button variant="ghost" size="icon" onClick={() => removeEducation(edu.id)} className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10 transition-colors">
                                                    <Trash2 className="h-4.5 w-4.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </SortableItem>
                                </div>
                            ))}
                        </SortableContext>
                    </DndContext>
                    
                    <Button variant="glass" onClick={addEducation} className="w-full border-dashed border-2 py-8 rounded-2xl hover:bg-white/5 hover:border-primary/40 transition-all font-bold text-sm">
                        <PlusCircle className="mr-2 h-5 w-5" /> Integrate Educational Milestone
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
});
