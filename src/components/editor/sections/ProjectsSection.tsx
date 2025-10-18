
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import type { ResumeData } from "../types";

interface ProjectsSectionProps {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData | null>>;
}

export function ProjectsSection({ resumeData, setResumeData }: ProjectsSectionProps) {

    const handleNestedChange = (
        section: 'projects',
        id: number,
        field: 'name' | 'description' | 'link',
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

    const addProjectSection = () => {
        setResumeData(prev => (prev ? {
            ...prev,
            projects: []
        } : null));
    };

    const removeProjectSection = () => {
        setResumeData(prev => {
            if (!prev) return null;
            const { projects, ...rest } = prev;
            return rest as ResumeData;
        });
    }

    const addProject = () => {
        setResumeData(prev => (prev ? {
            ...prev,
            projects: [...(prev.projects || []), { id: Date.now(), name: '', description: '', link: '' }]
        } : null));
    };

    const removeProject = (id: number) => {
        setResumeData(prev => (prev ? {
            ...prev,
            projects: (prev.projects || []).filter(p => p.id !== id)
        } : null));
    };

    return (
        <AccordionItem value="projects">
            <div className="flex items-center">
                <AccordionTrigger className="font-semibold text-lg flex-grow">Projects</AccordionTrigger>
                {resumeData.projects === undefined ? (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={addProjectSection} className="h-7 w-7">
                                    <PlusCircle className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Add Projects Section</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={removeProjectSection} className="text-destructive hover:text-destructive-foreground hover:bg-destructive h-7 w-7">
                                    <MinusCircle className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remove Projects Section</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
            {resumeData.projects !== undefined && (
                <AccordionContent className="space-y-4 pt-4 border bg-secondary/30 rounded-b-lg p-4">
                    <>
                        {resumeData.projects.map((proj) => (
                            <div key={proj.id} className="p-4 border rounded-lg space-y-4 relative bg-background">
                                <div className="space-y-2"><Label>Project Name</Label><Input value={proj.name} onChange={e => handleNestedChange('projects', proj.id, 'name', e.target.value)} /></div>
                                <div className="space-y-2"><Label>Description (use bullet points)</Label><Textarea rows={3} value={proj.description} onChange={e => handleNestedChange('projects', proj.id, 'description', e.target.value)} /></div>
                                <div className="space-y-2"><Label>Link (Optional)</Label><Input value={proj.link} onChange={e => handleNestedChange('projects', proj.id, 'link', e.target.value)} /></div>
                                <div className="flex justify-end">
                                    <Button variant="ghost" size="icon" onClick={() => removeProject(proj.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" onClick={addProject} className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                        </Button>
                    </>
                </AccordionContent>
            )}
        </AccordionItem>
    );
}
