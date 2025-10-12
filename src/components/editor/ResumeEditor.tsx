'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import AIContentDialog from './AIContentDialog';
import { ResumePreview } from './ResumePreview';

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

type ResumeData = {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string;
  jobDescription: string;
};

const initialResumeData: ResumeData = {
  personalInfo: {
    name: 'Jane Doe',
    title: 'Software Engineer',
    email: 'jane.doe@example.com',
    phone: '123-456-7890',
    location: 'San Francisco, CA',
    website: 'janedoe.com',
  },
  summary:
    'Innovative Software Engineer with 5+ years of experience in developing scalable web applications. Proficient in JavaScript, React, and Node.js. Passionate about creating intuitive user experiences and solving complex problems.',
  experience: [
    {
      id: 1,
      company: 'Tech Solutions Inc.',
      role: 'Senior Software Engineer',
      date: 'Jan 2021 - Present',
      description: '- Led the development of a new customer-facing analytics dashboard, resulting in a 20% increase in user engagement.\n- Mentored junior engineers and conducted code reviews to maintain high-quality standards.',
    },
    {
      id: 2,
      company: 'Web Innovators',
      role: 'Software Engineer',
      date: 'Jun 2018 - Dec 2020',
      description: '- Developed and maintained front-end features for a large-scale e-commerce platform using React and Redux.\n- Collaborated with cross-functional teams to deliver new features on schedule.',
    },
  ],
  education: [
    {
      id: 1,
      institution: 'State University',
      degree: 'B.S. in Computer Science',
      date: '2014 - 2018',
    },
  ],
  skills: 'JavaScript, TypeScript, React, Node.js, Express, PostgreSQL, Docker, AWS',
  jobDescription: '',
};

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function ResumeEditor({ resumeId }: { resumeId: string }) {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const { toast } = useToast();

  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving resume data:', resumeData);
      setSaveStatus('saved');
      toast({
        title: 'Saved!',
        description: 'Your resume has been saved successfully.',
      });
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
  }, [resumeData, toast]);

  useEffect(() => {
    const autoSave = setTimeout(() => {
      handleSave();
    }, 30000); // 30 seconds

    return () => clearTimeout(autoSave);
  }, [resumeData, handleSave]);


  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value },
    }));
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeData((prev) => ({ ...prev, summary: e.target.value }));
  };

  const handleExperienceChange = (id: number, field: keyof Experience, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
        ...prev,
        experience: [...prev.experience, { id: Date.now(), company: '', role: '', date: '', description: '' }]
    }));
  };

  const removeExperience = (id: number) => {
    setResumeData(prev => ({
        ...prev,
        experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const handleEducationChange = (id: number, field: keyof Education, value: string) => {
    setResumeData(prev => ({
        ...prev,
        education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
        ...prev,
        education: [...prev.education, { id: Date.now(), institution: '', degree: '', date: '' }]
    }));
  };

  const removeEducation = (id: number) => {
    setResumeData(prev => ({
        ...prev,
        education: prev.education.filter(edu => edu.id !== id)
    }));
  };
  
  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeData((prev) => ({ ...prev, skills: e.target.value }));
  };

  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeData((prev) => ({ ...prev, jobDescription: e.target.value }));
  };

  return (
    <div className="grid md:grid-cols-2 h-[calc(100vh-8rem)]">
      <ScrollArea className="h-full bg-background p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-headline font-semibold">Edit Content</h2>
          </div>
          <Accordion type="multiple" defaultValue={['personal-info', 'summary']} className="w-full">
            <AccordionItem value="job-description">
              <AccordionTrigger className="font-semibold">Job Description (Optional)</AccordionTrigger>
              <AccordionContent className="space-y-2 pt-4">
                <Label>Paste the job description here to get tailored AI suggestions.</Label>
                <Textarea value={resumeData.jobDescription} onChange={handleJobDescriptionChange} rows={6} />
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
                <Textarea value={resumeData.summary} onChange={handleSummaryChange} rows={5} />
                <AIContentDialog 
                  sectionName="Professional Summary" 
                  currentContent={resumeData.summary}
                  jobDescription={resumeData.jobDescription}
                  onApply={(newContent) => setResumeData(prev => ({...prev, summary: newContent}))}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="experience">
              <AccordionTrigger className="font-semibold">Work Experience</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="p-4 border rounded-lg space-y-4 relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Company</Label><Input value={exp.company} onChange={e => handleExperienceChange(exp.id, 'company', e.target.value)} /></div>
                            <div className="space-y-2"><Label>Role</Label><Input value={exp.role} onChange={e => handleExperienceChange(exp.id, 'role', e.target.value)} /></div>
                        </div>
                        <div className="space-y-2"><Label>Date</Label><Input value={exp.date} onChange={e => handleExperienceChange(exp.id, 'date', e.target.value)} /></div>
                        <div className="space-y-2"><Label>Description</Label><Textarea rows={4} value={exp.description} onChange={e => handleExperienceChange(exp.id, 'description', e.target.value)} /></div>
                        <div className="flex justify-between items-center">
                          <AIContentDialog 
                              sectionName={`Experience at ${exp.company}`}
                              currentContent={exp.description}
                              jobDescription={resumeData.jobDescription}
                              onApply={(newContent) => handleExperienceChange(exp.id, 'description', newContent)}
                          />
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
                            <div className="space-y-2"><Label>Institution</Label><Input value={edu.institution} onChange={e => handleEducationChange(edu.id, 'institution', e.target.value)} /></div>
                            <div className="space-y-2"><Label>Degree/Certificate</Label><Input value={edu.degree} onChange={e => handleEducationChange(edu.id, 'degree', e.target.value)} /></div>
                        </div>
                        <div className="space-y-2"><Label>Date</Label><Input value={edu.date} onChange={e => handleEducationChange(edu.id, 'date', e.target.value)} /></div>
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
              <AccordionContent className="space-y-2 pt-4">
                <Label>Enter skills separated by commas</Label>
                <Textarea value={resumeData.skills} onChange={handleSkillsChange} rows={3} />
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
      </ScrollArea>
      <div className="bg-secondary p-6 h-full overflow-auto">
        <ResumePreview resumeData={resumeData} />
      </div>
    </div>
  );
}
