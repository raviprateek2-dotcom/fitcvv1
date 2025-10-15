
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Download, PlusCircle, Share2, Trash2, Sparkles, Bot, FileText, Newspaper, PanelLeft, ArrowLeft, Brush, Lock, Lightbulb, Upload, MinusCircle, Loader2, Target } from 'lucide-react';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import AIContentDialog from './AIContentDialog';
import AISectionWriterDialog from './AISectionWriterDialog';
import { ResumePreview, CoverLetterPreview } from './ResumePreview';
import { useDoc, useUser, useFirestore, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { writeCoverLetter as writeCoverLetterAction } from '@/app/actions/ai-cover-letter';
import { suggestKeywords as suggestKeywordsAction } from '@/app/actions/ai-keyword-suggester';
import { suggestTitle as suggestTitleAction } from '@/app/actions/ai-title-suggester';
import { Slider } from '../ui/slider';
import { cn } from '@/lib/utils';
import { nanoid } from 'nanoid';
import { Badge } from '../ui/badge';
import { parseResumeFromPdf } from '@/app/actions/ai-resume-parser';


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

type Project = {
  id: number;
  name: string;
  description: string;
  link: string;
};

type Styling = {
  bodyFontSize: number;
  headingFontSize: number;
  titleFontSize: number;
  accentColor: string;
};

type ResumeData = {
  userId?: string;
  title?: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills?: Skill[];
  projects?: Project[];
  jobDescription: string;
  templateId?: string;
  coverLetter?: string;
  companyInfo?: {
    name: string;
    jobTitle: string;
  };
  styling?: Styling;
  shareId?: string;
};

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type EditorTab = 'content' | 'job-target' | 'cover-letter' | 'design';

const colorSwatches = [
  'hsl(221.2 83.2% 53.3%)', // Blue
  'hsl(142.1 76.2% 36.3%)', // Green
  'hsl(0 84.2% 60.2%)', // Red
  'hsl(262.1 83.3% 57.8%)', // Purple
  'hsl(24.6 95% 53.1%)',   // Orange
  'hsl(0 0% 9%)',          // Black
];

const availableTemplates = [
  { id: 'modern', name: 'Modern', isPremium: false },
  { id: 'classic', name: 'Classic', isPremium: false },
  { id: 'creative', name: 'Creative', isPremium: false },
  { id: 'minimalist', name: 'Minimalist', isPremium: true },
  { id: 'professional', name: 'Professional', isPremium: true },
  { id: 'executive', name: 'Executive', isPremium: true },
];

const EditorLoadingSkeleton = () => {
    return (
        <div className="flex h-[calc(100vh-4rem)]">
            <div className="w-1/3 p-6 space-y-6 border-r">
                 <Skeleton className="h-10 w-1/2" />
                 <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                 </div>
            </div>
            <div className="w-2/3 p-6">
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
  const initialDataRef = useRef<ResumeData | null>(null);

  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [activeTab, setActiveTab] = useState<EditorTab>('content');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const { toast } = useToast();
  
  const [isTitleSuggesting, setIsTitleSuggesting] = useState(false);


  useEffect(() => {
    if (initialResumeData && !initialDataRef.current) {
        let updatedData = { ...initialResumeData };
        
        // Ensure all fields are present to prevent controlled/uncontrolled input errors
        if (typeof updatedData.coverLetter !== 'string') updatedData.coverLetter = '';
        if (typeof updatedData.companyInfo !== 'object' || updatedData.companyInfo === null) updatedData.companyInfo = { name: '', jobTitle: '' };
        if (typeof updatedData.styling !== 'object' || updatedData.styling === null) {
            updatedData.styling = { 
                bodyFontSize: 14, 
                headingFontSize: 18, 
                titleFontSize: 36,
                accentColor: 'hsl(221.2 83.2% 53.3%)'
            };
        }
        if (typeof updatedData.styling.accentColor !== 'string') {
            updatedData.styling.accentColor = 'hsl(221.2 83.2% 53.3%)';
        }


        setResumeData(updatedData);
        initialDataRef.current = updatedData;
    }
  }, [initialResumeData]);


  useEffect(() => {
    if (isPrintMode && resumeData) {
      setTimeout(() => window.print(), 1000); // Wait for render
    }
  }, [isPrintMode, resumeData]);

  // Debounced save function
  const handleSave = useCallback((dataToSave: ResumeData) => {
    if (!resumeDocRef || !firestore || !user) return;
    setSaveStatus('saving');

    const updatedData = {
        ...dataToSave,
        userId: user.uid,
        updatedAt: serverTimestamp()
    };
    
    // Non-blocking save
    setDocumentNonBlocking(resumeDocRef, updatedData, { merge: true });
    
    // Also update the public resume if it exists
    if(dataToSave.shareId) {
        const publicResumeRef = doc(firestore, 'publicResumes', dataToSave.shareId);
        setDocumentNonBlocking(publicResumeRef, { ...updatedData }, { merge: true });
    }

    // Optimistically update UI
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, [resumeDocRef, firestore, user]);


  // Auto-save useEffect
  useEffect(() => {
    if (!resumeData || !initialDataRef.current || isPrintMode) return;
    
    if (JSON.stringify(resumeData) === JSON.stringify(initialDataRef.current)) {
      return;
    }

    const handler = setTimeout(() => {
      handleSave(resumeData);
    }, 1500);

    return () => {
      clearTimeout(handler);
    };
  }, [resumeData, handleSave, isPrintMode]);


  const handleFieldChange = <T extends keyof ResumeData>(field: T, value: ResumeData[T]) => {
     setResumeData(prev => prev ? {...prev, [field]: value} : null);
  };
  
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!resumeData) return;
    const { name, value } = e.target;
    handleFieldChange('personalInfo', { ...resumeData.personalInfo, [name]: value });
  };
  
  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!resumeData || !resumeData.companyInfo) return;
    const { name, value } = e.target;
    handleFieldChange('companyInfo', { ...resumeData.companyInfo, [name]: value });
  }

  const handleStylingChange = (field: keyof Styling, value: string | number) => {
    if (!resumeData || !resumeData.styling) return;
    handleFieldChange('styling', { ...resumeData.styling, [field]: value });
  };

  const handleNestedChange = (
    section: 'experience' | 'education' | 'skills' | 'projects', 
    id: number, 
    field: keyof Experience | keyof Education | keyof Skill | keyof Project, 
    value: string
  ) => {
    setResumeData(prev => {
        if (!prev) return null;
        const list = prev[section as 'experience' | 'education'] || [];
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
      return rest;
    });
  }

  const addSkill = () => {
    setResumeData(prev => (prev ? {
        ...prev,
        skills: [...(prev.skills || []), { id: Date.now(), name: '', level: 'Advanced' }]
    } : null));
  };

  const removeSkill = (id: number) => {
      setResumeData(prev => (prev ? {
          ...prev,
          skills: (prev.skills || []).filter(skill => skill.id !== id)
      } : null));
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
      return rest;
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
  
  const handlePrint = () => {
    window.print();
  };

  const handleWriteCoverLetter = async () => {
    if (!resumeData?.companyInfo?.jobTitle || !resumeData?.companyInfo?.name) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide both a Job Title and Company Name.',
      });
      return;
    }
    
    setIsAiLoading(true);
    const resumeText = JSON.stringify(resumeData); // Simple serialization for now
    
    try {
      const result = await writeCoverLetterAction({
        jobTitle: resumeData.companyInfo.jobTitle,
        companyName: resumeData.companyInfo.name,
        resumeContent: resumeText,
      });

      if (result.success && result.data) {
        handleFieldChange('coverLetter', result.data.coverLetterText);
        toast({ title: 'Cover Letter Generated!' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const handleTemplateChange = (templateId: string) => {
    const template = availableTemplates.find(t => t.id === templateId);
    if (!template) return;

    const isProUser = userProfile?.subscription === 'premium';

    if (template.isPremium && !isProUser) {
        toast({
            variant: 'destructive',
            title: 'Upgrade Required',
            description: `The "${template.name}" template is a Pro feature.`,
            action: <Button asChild><Link href="/pricing">Upgrade</Link></Button>
        });
        return;
    }
    
    handleFieldChange('templateId', templateId);
  };
  
  const handleShare = () => {
    if (!resumeData || !firestore || !user) return;

    let shareId = resumeData.shareId;
    
    // If there is no shareId, create one.
    if (!shareId) {
        shareId = nanoid(10);
        // This state update will be picked up by the auto-save useEffect
        setResumeData(prev => (prev ? { ...prev, shareId } : null)); 
    }

    const dataToShare = {
        ...resumeData,
        shareId,
        userId: user.uid // Ensure userId is in the shared data
    };

    // Create or update the public document non-blockingly
    const publicResumeRef = doc(firestore, 'publicResumes', shareId);
    setDocumentNonBlocking(publicResumeRef, dataToShare, { merge: true });

    const shareUrl = `${window.location.origin}/share/${shareId}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
        title: "Share Link Copied!",
        description: "Anyone with the link can now view your resume."
    });
  };

  const handleSuggestKeywords = async () => {
    if (!resumeData || !resumeData.jobDescription) {
      toast({
        variant: 'destructive',
        title: 'Job Description Required',
        description: 'Please paste a job description to get keyword suggestions.',
      });
      return;
    }
    setIsAiLoading(true);
    setKeywordSuggestions([]);

    const resumeContent = JSON.stringify({
      summary: resumeData.summary,
      experience: resumeData.experience,
      skills: resumeData.skills,
    });

    try {
      const result = await suggestKeywordsAction({
        resumeContent,
        jobDescription: resumeData.jobDescription,
      });
      if (result.success && result.data) {
        setKeywordSuggestions(result.data.suggestions);
        toast({ title: 'Keywords Suggested!', description: 'Here are some keywords you might want to add.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    setIsParsing(true);
    toast({ title: 'Parsing PDF...', description: 'Our AI is reading your resume to fill in the editor.' });
  
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = reader.result as string;
        
        const result = await parseResumeFromPdf(base64String);
        
        if (!result.success || !result.data) {
          throw new Error(result.error || 'Failed to parse resume.');
        }
        
        // Update the current resume data with the parsed content
        setResumeData(prev => ({
          ...prev!,
          ...result.data!.resumeData,
          title: result.data!.resumeData.personalInfo.name ? `${result.data!.resumeData.personalInfo.name}'s Resume` : 'Imported Resume',
        }));
  
        toast({ title: 'Success!', description: 'Your resume has been imported into the editor.' });
      };
      reader.onerror = (error) => {
        throw new Error('Failed to read the file.');
      };
  
    } catch (error: any) {
      console.error('Error parsing PDF resume:', error);
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description: error.message || 'Could not import your resume from the PDF.',
      });
    } finally {
      setIsParsing(false);
      // Reset file input
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSuggestTitle = async () => {
    if (!resumeData?.personalInfo.title) return;
    setIsTitleSuggesting(true);
    try {
      const result = await suggestTitleAction({ currentTitle: resumeData.personalInfo.title });
      if (result.success && result.data) {
        if (result.data.suggestedTitle.toLowerCase() !== resumeData.personalInfo.title.toLowerCase()) {
          toast({
            title: 'AI Title Suggestion',
            description: `We suggest changing "${resumeData.personalInfo.title}" to "${result.data.suggestedTitle}".`,
            action: (
              <Button size="sm" onClick={() => {
                setResumeData(prev => prev ? { ...prev, personalInfo: { ...prev.personalInfo, title: result.data.suggestedTitle }} : null);
              }}>
                Apply
              </Button>
            )
          });
        } else {
            toast({ title: 'Title Looks Good!', description: 'Your job title is already professional and clear.' });
        }
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    } catch (error: any) {
       toast({ variant: 'destructive', title: 'Error', description: 'Failed to get title suggestion.' });
    } finally {
      setIsTitleSuggesting(false);
    }
  }


  const isProUser = userProfile?.subscription === 'premium';

  if (isResumeLoading || !resumeData) {
    return <EditorLoadingSkeleton />;
  }

  if (isPrintMode) {
      return (
        <div className="bg-white print:p-0">
          <ResumePreview resumeData={resumeData} />
        </div>
      );
  }

  return (
    <>
      <header className="bg-background border-b sticky top-0 z-10 no-print">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-grow min-w-0">
             <Button variant="outline" size="icon" onClick={() => setIsFormVisible(!isFormVisible)} className="h-8 w-8">
                <PanelLeft className="h-4 w-4" />
             </Button>
              <Input 
                  value={resumeData.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="Untitled Resume"
                  className="text-lg font-headline font-semibold h-10 border-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-1 flex-grow bg-transparent"
              />
          </div>
           <div className="flex items-center gap-4">
             <SaveStatusIndicator status={saveStatus} />
             <input
              type="file"
              ref={fileInputRef}
              onChange={handlePdfUpload}
              accept="application/pdf"
              className="hidden"
              disabled={isParsing}
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isParsing}>
              {isParsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              {isParsing ? 'Importing...' : 'Import PDF'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4"/>Share
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard"><ArrowLeft className="h-4 w-4"/></Link>
            </Button>
          </div>
        </div>
      </header>
       <div className="flex flex-grow h-[calc(100vh-4rem)]">
        <aside className={cn("w-1/3 border-r bg-background no-print transition-all duration-300 ease-in-out", !isFormVisible && "-ml-[33.333333%]")}>
            <ScrollArea className="h-full">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as EditorTab)} className="w-full">
                <div className="p-4 border-b">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="content"><FileText className="mr-2 h-4 w-4"/>Content</TabsTrigger>
                    <TabsTrigger value="job-target"><Target className="mr-2 h-4 w-4"/>Job Target</TabsTrigger>
                    <TabsTrigger value="cover-letter"><Newspaper className="mr-2 h-4 w-4"/>Cover Letter</TabsTrigger>
                    <TabsTrigger value="design"><Brush className="mr-2 h-4 w-4"/>Design</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="design" className="p-6">
                    <Accordion type="single" defaultValue="template" collapsible className="w-full">
                         <AccordionItem value="template">
                          <AccordionTrigger className="font-semibold">Template</AccordionTrigger>
                          <AccordionContent className="space-y-4 pt-4">
                                <Select value={resumeData.templateId} onValueChange={handleTemplateChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableTemplates.map(template => (
                                            <SelectItem key={template.id} value={template.id} disabled={template.isPremium && !isProUser}>
                                                <div className="flex items-center gap-2">
                                                    {template.name}
                                                    {template.isPremium && <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">PRO</span>}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="styling">
                          <AccordionTrigger className="font-semibold">Styling</AccordionTrigger>
                          <AccordionContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label>Accent Color</Label>
                              <div className="flex flex-wrap gap-2">
                                {colorSwatches.map(color => (
                                  <button
                                    key={color}
                                    type="button"
                                    onClick={() => handleStylingChange('accentColor', color)}
                                    className={cn(
                                      "w-8 h-8 rounded-full border-2 transition-all",
                                      resumeData.styling?.accentColor === color ? 'border-primary ring-2 ring-primary' : 'border-transparent'
                                    )}
                                    style={{ backgroundColor: color }}
                                  >
                                    <span className="sr-only">Set color to {color}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Title Font Size: {resumeData.styling?.titleFontSize}px</Label>
                              <Slider
                                value={[resumeData.styling?.titleFontSize || 36]}
                                onValueChange={([val]) => handleStylingChange('titleFontSize', val)}
                                min={24} max={60} step={1}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Heading Font Size: {resumeData.styling?.headingFontSize}px</Label>
                              <Slider
                                value={[resumeData.styling?.headingFontSize || 18]}
                                onValueChange={([val]) => handleStylingChange('headingFontSize', val)}
                                min={14} max={32} step={1}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Body Font Size: {resumeData.styling?.bodyFontSize}px</Label>
                              <Slider
                                value={[resumeData.styling?.bodyFontSize || 14]}
                                onValueChange={([val]) => handleStylingChange('bodyFontSize', val)}
                                min={10} max={18} step={0.5}
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </TabsContent>

                <TabsContent value="content" className="p-6">
                  <div className="space-y-6">
                    <Accordion type="multiple" defaultValue={['personal-info', 'summary' ]} className="w-full">
                        <AccordionItem value="personal-info">
                        <AccordionTrigger className="font-semibold">Personal Information</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Full Name</Label><Input name="name" value={resumeData.personalInfo.name} onChange={handlePersonalInfoChange} /></div>
                                <div className="space-y-2">
                                  <Label>Job Title</Label>
                                  <div className="flex items-center gap-2">
                                    <Input name="title" value={resumeData.personalInfo.title} onChange={handlePersonalInfoChange} className="flex-grow"/>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="outline" size="icon" onClick={handleSuggestTitle} disabled={isTitleSuggesting}>
                                            <Sparkles className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>AI Suggest Professional Title</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </div>
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
                        
                        {resumeData.projects === undefined ? (
                          <div className="p-4 border-dashed border-2 rounded-lg flex items-center justify-center">
                            <Button variant="ghost" onClick={addProjectSection}>
                              <PlusCircle className="mr-2 h-4 w-4" /> Add Projects Section
                            </Button>
                          </div>
                        ) : (
                          <AccordionItem value="projects">
                          <div className="flex items-center">
                            <AccordionTrigger className="font-semibold flex-grow">Projects</AccordionTrigger>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => removeProjectSection()} className="text-destructive hover:text-destructive-foreground hover:bg-destructive h-7 w-7">
                                    <MinusCircle className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Remove Section</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <AccordionContent className="space-y-4 pt-4">
                              {resumeData.projects.map((proj) => (
                                  <div key={proj.id} className="p-4 border rounded-lg space-y-4 relative">
                                      <div className="space-y-2"><Label>Project Name</Label><Input value={proj.name} onChange={e => handleNestedChange('projects', proj.id, 'name', e.target.value)} /></div>
                                      <div className="space-y-2"><Label>Description</Label><Textarea rows={3} value={proj.description} onChange={e => handleNestedChange('projects', proj.id, 'description', e.target.value)} /></div>
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
                          </AccordionContent>
                          </AccordionItem>
                        )}
                        

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

                        {resumeData.skills === undefined ? (
                          <div className="p-4 border-dashed border-2 rounded-lg flex items-center justify-center">
                            <Button variant="ghost" onClick={addSkillSection}>
                              <PlusCircle className="mr-2 h-4 w-4" /> Add Skills Section
                            </Button>
                          </div>
                        ) : (
                           <AccordionItem value="skills">
                           <div className="flex items-center">
                             <AccordionTrigger className="font-semibold flex-grow">Skills</AccordionTrigger>
                             <TooltipProvider>
                               <Tooltip>
                                 <TooltipTrigger asChild>
                                   <Button variant="ghost" size="icon" onClick={() => removeSkillSection()} className="text-destructive hover:text-destructive-foreground hover:bg-destructive h-7 w-7">
                                     <MinusCircle className="h-4 w-4" />
                                   </Button>
                                 </TooltipTrigger>
                                 <TooltipContent>Remove Section</TooltipContent>
                               </Tooltip>
                             </TooltipProvider>
                           </div>
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
                        )}
                        

                    </Accordion>
                  </div>
                </TabsContent>

                <TabsContent value="job-target" className="p-6">
                    <div className="space-y-4 pt-4">
                        <Label>Paste the job description here to get tailored AI suggestions and keyword analysis.</Label>
                        <Textarea 
                          value={resumeData.jobDescription} 
                          onChange={e => handleFieldChange('jobDescription', e.target.value)} 
                          rows={12}
                          placeholder='e.g., "Seeking a product manager with 5+ years of experience..."'
                        />
                        <ProFeatureWrapper isPro={isProUser}>
                          <Button variant="outline" size="sm" onClick={handleSuggestKeywords} disabled={isAiLoading}>
                            {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Lightbulb className="mr-2 h-4 w-4" />}
                            {isAiLoading ? 'Analyzing...' : 'Suggest Keywords'}
                          </Button>
                        </ProFeatureWrapper>
                        {keywordSuggestions.length > 0 && (
                          <div className="space-y-2 pt-2">
                            <Label>Suggested Keywords to Add:</Label>
                            <div className="flex flex-wrap gap-2">
                              {keywordSuggestions.map((keyword, i) => (
                                <Badge key={i} variant="secondary">{keyword}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                </TabsContent>
                
                <TabsContent value="cover-letter" className="p-6">
                  <div className="space-y-6">
                    <div className="p-4 border rounded-lg space-y-4">
                        <h3 className="font-semibold text-lg">Target Role</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Company Name</Label>
                                <Input name="name" value={resumeData.companyInfo?.name} onChange={handleCompanyInfoChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Job Title</Label>
                                <Input name="jobTitle" value={resumeData.companyInfo?.jobTitle} onChange={handleCompanyInfoChange} />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border rounded-lg space-y-4">
                        <h3 className="font-semibold text-lg">Cover Letter Content</h3>
                        <Textarea 
                            value={resumeData.coverLetter}
                            onChange={e => handleFieldChange('coverLetter', e.target.value)}
                            rows={15}
                            placeholder="Your generated cover letter will appear here..."
                        />
                        <ProFeatureWrapper isPro={isProUser}>
                            <Button onClick={handleWriteCoverLetter} disabled={isAiLoading}>
                            <Bot className="mr-2 h-4 w-4" />
                            {isAiLoading ? 'Generating...' : 'AI Generate'}
                            </Button>
                        </ProFeatureWrapper>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </ScrollArea>
        </aside>
        <main className={cn("flex-grow bg-secondary/50 p-6 h-full print:bg-white print:p-0 transition-all duration-300 ease-in-out", isFormVisible ? 'w-2/3' : 'w-full')}>
          <ScrollArea className="h-full">
            {activeTab === 'resume' || activeTab === 'design' || activeTab === 'job-target' ? (
              <ResumePreview resumeData={resumeData} />
            ) : (
              <CoverLetterPreview resumeData={resumeData} />
            )}
          </ScrollArea>
        </main>
      </div>
    </>
  );
}

    