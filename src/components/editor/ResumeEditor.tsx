
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Download, Eye, PlusCircle, Share2, Trash2, Sparkles, Bot } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import AIContentDialog from './AIContentDialog';
import AISectionWriterDialog from './AISectionWriterDialog';
import { ResumePreview } from './ResumePreview';
import { useDoc, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// Define types for resume structure
type PersonalInfo = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
};

type Experience = {
  id: number;
  company: string;
  role: string;
  date: string;
  description:string;
};

type Education = {
  id: number;
  institution: string;
  degree: string;
  date: string;
};

type Skill = {
  id: number;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
};

type ResumeData = {
  title?: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  jobDescription: string;
  templateId?: string;
};

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const EditorLoadingSkeleton = () => {
    return (
        <div className="grid md:grid-cols-2 h-[calc(100vh-4rem)]">
            <div className="p-6 space-y-6">
                 <Skeleton className="h-10 w-1/2" />
                 <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                 </div>
            </div>
            <div className="p-6">
                <Skeleton className="w-full h-full" />
            </div>
        </div>
    )
}

function SaveStatusIndicator({ status }: { status: SaveStatus }) {
  let text = 'Saved';
  if (status === 'saving') text = 'Saving...';
  if (status === 'error') text = 'Save Error';
  if (status === 'idle') text = 'Changes saved';

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className={
        `w-2 h-2 rounded-full ` +
        (status === 'saved' ? 'bg-green-500' :
         status === 'saving' ? 'bg-yellow-500 animate-pulse' :
         status === 'error' ? 'bg-red-500' :
         'bg-transparent')
      } />
      <span>{text}</span>
    </div>
  )
}

const ProFeatureWrapper: React.FC<{ isPro: boolean; children: React.ReactNode }> = ({ isPro, children }) => {
  if (isPro) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative w-full">
            <div className="w-full h-full absolute top-0 left-0 z-10"/>
            {children}
             <div className="absolute -top-2 -right-2 z-20">
                <div className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    Pro
                </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Upgrade to Pro to use this feature.</p>
          <Button size="sm" asChild className="mt-2 w-full">
            <Link href="/pricing">Upgrade</Link>
          </Button>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};


export function ResumeEditor({ resumeId }: { resumeId: string }) {
  const { user, userProfile } = useUser();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const isPrintMode = searchParams.get('print') === 'true';

  const resumeDocRef = useMemoFirebase(
    () => (user ? doc(firestore, `users/${user.uid}/resumes`, resumeId) : null),
    [firestore, user, resumeId]
  );
  const { data: initialResumeData, isLoading: isResumeLoading } = useDoc<ResumeData>(resumeDocRef);

  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const { toast } = useToast();

  useEffect(() => {
    if (initialResumeData) {
        // Migration for skills from string to Skill[]
        if (typeof initialResumeData.skills === 'string') {
            const skillsFromString = initialResumeData.skills.split(',').map(s => s.trim()).filter(Boolean);
            setResumeData({
                ...initialResumeData,
                skills: skillsFromString.map(name => ({ id: Date.now() + Math.random(), name, level: 'Advanced' }))
            });
        } else {
            setResumeData(initialResumeData);
        }
    }
  }, [initialResumeData]);

  useEffect(() => {
    if (isPrintMode && resumeData) {
      setTimeout(() => window.print(), 1000); // Wait for render
    }
  }, [isPrintMode, resumeData]);

  // Debounced save function
  const handleSave = useCallback(async (data: ResumeData) => {
    if (!resumeDocRef) return;
    setSaveStatus('saving');
    try {
      await setDoc(resumeDocRef, { 
        ...data,
        updatedAt: serverTimestamp() 
      }, { merge: true });
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save resume:', error);
      setSaveStatus('error');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save your resume.',
      });
    }
  }, [resumeDocRef, toast]);

  // Auto-save useEffect
  useEffect(() => {
    if (!resumeData || !initialResumeData || isPrintMode) return;
    
    // Create a comparable version of initial data to handle the migration
    let comparableInitial = initialResumeData;
    if (typeof initialResumeData.skills === 'string') {
        const skillsFromString = initialResumeData.skills.split(',').map(s => s.trim()).filter(Boolean);
        comparableInitial = {
            ...initialResumeData,
            skills: skillsFromString.map(name => ({ id: Date.now() + Math.random(), name, level: 'Advanced' }))
        }
    }

    // A simple deep-enough comparison to check for changes
    if (JSON.stringify(resumeData) === JSON.stringify(comparableInitial)) {
      return;
    }

    const handler = setTimeout(() => {
      handleSave(resumeData);
    }, 1500); // Save after 1.5 seconds of inactivity

    return () => {
      clearTimeout(handler);
    };
  }, [resumeData, initialResumeData, handleSave, isPrintMode]);


  const handleFieldChange = <T extends keyof ResumeData>(field: T, value: ResumeData[T]) => {
     setResumeData(prev => prev ? {...prev, [field]: value} : null);
  };
  
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!resumeData) return;
    const { name, value } = e.target;
    handleFieldChange('personalInfo', { ...resumeData.personalInfo, [name]: value });
  };
  
  const handleNestedChange = (
    section: 'experience' | 'education' | 'skills', 
    id: number, 
    field: keyof Experience | keyof Education | keyof Skill, 
    value: string
  ) => {
    setResumeData(prev => {
        if (!prev) return null;
        const list = prev[section];
        const updatedList = (list as any[]).map(item => 
            item.id === id ? { ...item, [field]: value } : item
        );
        return { ...prev, [section]: updatedList };
    });
  };

  const addExperience = () => {
    setResumeData(prev => (prev ? {
        ...prev,
        experience: [...prev.experience, { id: Date.now(), company: '', role: '', date: '', description: '' }]
    } : null));
  };

  const removeExperience = (id: number) => {
    setResumeData(prev => (prev ? {
        ...prev,
        experience: prev.experience.filter(exp => exp.id !== id)
    } : null));
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

  const addSkill = () => {
    setResumeData(prev => (prev ? {
        ...prev,
        skills: [...(prev.skills || []), { id: Date.now(), name: '', level: 'Advanced' }]
    } : null));
  };

  const removeSkill = (id: number) => {
      setResumeData(prev => (prev ? {
          ...prev,
          skills: prev.skills.filter(skill => skill.id !== id)
      } : null));
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const isProUser = userProfile?.subscription === 'premium';

  if (isResumeLoading || !resumeData) {
    return <EditorLoadingSkeleton />;
  }

  if (isPrintMode) {
      return (
        <div className="bg-white print:p-0">
          <ResumePreview resumeData={resumeData} templateId={resumeData.templateId}/>
        </div>
      );
  }

  return (
    <>
      <header className="bg-background border-b sticky top-0 z-10 no-print">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-grow min-w-0">
            <Input 
                value={resumeData.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Untitled Resume"
                className="text-xl font-headline font-semibold h-10 border-none shadow-none focus-visible:ring-0 p-0 flex-grow"
            />
            <SaveStatusIndicator status={saveStatus} />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
             <Button variant="outline" size="sm" onClick={handlePrint}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>
      <div className="grid print:block md:grid-cols-2 h-[calc(100vh-8rem)]">
        <ScrollArea className="h-full bg-background p-6 no-print">
          <div className="space-y-6">
            <Accordion type="multiple" defaultValue={['personal-info', 'summary']} className="w-full">
              <AccordionItem value="job-description">
                <AccordionTrigger className="font-semibold">Job Description (Optional)</AccordionTrigger>
                <AccordionContent className="space-y-2 pt-4">
                  <Label>Paste the job description here to get tailored AI suggestions.</Label>
                  <Textarea 
                    value={resumeData.jobDescription} 
                    onChange={e => handleFieldChange('jobDescription', e.target.value)} 
                    rows={6} 
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="personal-info">
                <AccordionTrigger className="font-semibold">Personal Information</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Full Name</Label><Input name="name" value={resumeData.personalInfo.name} onChange={handlePersonalInfoChange} /></div>
                      <div className="space-y-2"><Label>Job Title</Label><Input name="title" value={resumeData.personalInfo.title} onChange={handlePersonalInfoChange} /></div>
                  </div>
                  <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange} /></div>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Phone</Label><Input name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange} /></div>
                      <div className="space-y-2"><Label>Location</Label><Input name="location" value={resumeData.personalInfo.location} onChange={handlePersonalInfoChange} /></div>
                  </div>
                   <div className="space-y-2"><Label>Website/Portfolio</Label><Input name="website" value={resumeData.personalInfo.website} onChange={handlePersonalInfoChange} /></div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="summary">
                <AccordionTrigger className="font-semibold">Professional Summary</AccordionTrigger>
                <AccordionContent className="space-y-2 pt-4">
                  <Textarea value={resumeData.summary} onChange={e => handleFieldChange('summary', e.target.value)} rows={5} />
                  <div className="flex gap-2">
                    <ProFeatureWrapper isPro={isProUser}>
                      <AISectionWriterDialog
                        sectionName="Professional Summary"
                        jobDescription={resumeData.jobDescription}
                        existingContent={resumeData.summary}
                        onApply={(newContent) => handleFieldChange('summary', newContent)}
                      >
                        <Button variant="outline" size="sm">
                          <Bot className="mr-2 h-4 w-4" />
                          AI Writer
                        </Button>
                      </AISectionWriterDialog>
                    </ProFeatureWrapper>
                    <ProFeatureWrapper isPro={isProUser}>
                       <AIContentDialog 
                        sectionName="Professional Summary" 
                        currentContent={resumeData.summary}
                        jobDescription={resumeData.jobDescription}
                        onApply={(newContent) => handleFieldChange('summary', newContent)}
                      />
                    </ProFeatureWrapper>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="experience">
                <AccordionTrigger className="font-semibold">Work Experience</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="p-4 border rounded-lg space-y-4 relative">
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2"><Label>Company</Label><Input value={exp.company} onChange={e => handleNestedChange('experience', exp.id, 'company', e.target.value)} /></div>
                              <div className="space-y-2"><Label>Role</Label><Input value={exp.role} onChange={e => handleNestedChange('experience', exp.id, 'role', e.target.value)} /></div>
                          </div>
                          <div className="space-y-2"><Label>Date</Label><Input value={exp.date} onChange={e => handleNestedChange('experience', exp.id, 'date', e.target.value)} /></div>
                          <div className="space-y-2"><Label>Description</Label><Textarea rows={4} value={exp.description} onChange={e => handleNestedChange('experience', exp.id, 'description', e.target.value)} /></div>
                          <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                                <ProFeatureWrapper isPro={isProUser}>
                                  <AISectionWriterDialog
                                      sectionName={`Work Experience at ${exp.company}`}
                                      jobDescription={resumeData.jobDescription}
                                      existingContent={exp.description}
                                      onApply={(newContent) => handleNestedChange('experience', exp.id, 'description', newContent)}
                                  >
                                      <Button variant="outline" size="sm">
                                          <Bot className="mr-2 h-4 w-4" />
                                          AI Writer
                                      </Button>
                                  </AISectionWriterDialog>
                                </ProFeatureWrapper>
                                <ProFeatureWrapper isPro={isProUser}>
                                  <AIContentDialog 
                                      sectionName={`Experience at ${exp.company}`}
                                      currentContent={exp.description}
                                      jobDescription={resumeData.jobDescription}
                                      onApply={(newContent) => handleNestedChange('experience', exp.id, 'description', newContent)}
                                  />
                                </ProFeatureWrapper>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeExperience(exp.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                      </div>
                  ))}
                  <Button variant="outline" onClick={addExperience} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
                  </Button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="education">
                <AccordionTrigger className="font-semibold">Education</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  {resumeData.education.map((edu) => (
                      <div key={edu.id} className="p-4 border rounded-lg space-y-4 relative">
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

              <AccordionItem value="skills">
                <AccordionTrigger className="font-semibold">Skills</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  {resumeData.skills.map((skill) => (
                    <div key={skill.id} className="p-4 border rounded-lg space-y-4">
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
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </div>
        </ScrollArea>
        <div className="bg-background p-6 h-full overflow-auto print:bg-white print:p-0">
          <ResumePreview resumeData={resumeData} templateId={resumeData.templateId} />
        </div>
      </div>
    </>
  );
}

    