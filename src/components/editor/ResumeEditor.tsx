
'use client';

import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Download, Share2, Sparkles, Bot, Newspaper, Brush, Loader2, SearchCheck, ArrowLeft, Upload, CheckCircle, XCircle, PlusCircle, FileText, KeySquare } from 'lucide-react';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { ResumePreview, CoverLetterPreview } from './ResumePreview';
import { useDoc, useUser, useFirestore, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { writeCoverLetter as writeCoverLetterAction } from '@/app/actions/ai-cover-letter';
import { suggestKeywords as suggestKeywordsAction } from '@/app/actions/ai-keyword-suggester';
import { analyzeResume as analyzeResumeAction, type AnalyzeResumeOutput } from '@/app/actions/ai-resume-analyzer';
import { reviewResume as reviewResumeAction, type ReviewResumeOutput } from '@/app/actions/ai-resume-review';
import { Slider } from '../ui/slider';
import { cn } from '@/lib/utils';
import { nanoid } from 'nanoid';
import { Badge } from '../ui/badge';
import { parseResumeFromPdf } from '@/app/actions/ai-resume-parser';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { SummarySection } from './sections/SummarySection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { ProjectsSection } from './sections/ProjectsSection';
import type { ResumeData, Styling, Skill } from './types';
import { Label } from '@/components/ui/label';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { ProFeatureWrapper } from './ProFeatureWrapper';
import { AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';


type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type EditorTab = 'content' | 'ai-review' | 'cover-letter' | 'design';

const colorSwatches = [
  'hsl(221.2, 83.2%, 53.3%)', // Blue
  'hsl(142.1, 76.2%, 36.3%)', // Green
  'hsl(0, 84.2%, 60.2%)', // Red
  'hsl(262.1 83.3% 57.8%)', // Purple
  'hsl(47.9 95.8% 53.1%)',   // Yellow
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

const availableFonts = [
    { id: 'font-inter', name: 'Inter (Sans Serif)' },
    { id: 'font-lora', name: 'Lora (Serif)' },
    { id: 'font-space-grotesk', name: 'Space Grotesk (Modern)' },
    { id: 'font-montserrat', name: 'Montserrat (Headline)' },
]

const EditorLoadingSkeleton = () => {
    return (
        <div className="flex h-full">
            <div className="w-1/3 p-6 space-y-6 border-r overflow-y-auto">
                 <Skeleton className="h-10 w-1/2" />
                 <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                 </div>
            </div>
            <div className="w-2/3 p-6 bg-secondary/50">
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
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const { toast } = useToast();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResumeOutput | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<ReviewResumeOutput | null>(null);

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
                accentColor: 'hsl(221.2 83.2% 53.3%)',
                fontFamily: 'font-inter',
            };
        }
        if (typeof updatedData.styling.accentColor !== 'string') {
            updatedData.styling.accentColor = 'hsl(221.2 83.2% 53.3%)';
        }
        if (typeof updatedData.styling.fontFamily !== 'string') {
            updatedData.styling.fontFamily = 'font-inter';
        }
        if (updatedData.skills === undefined) updatedData.skills = [];
        if (updatedData.projects === undefined) updatedData.projects = [];


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
        const dataToShare = {
            title: dataToSave.title,
            personalInfo: dataToSave.personalInfo,
            summary: dataToSave.summary,
            experience: dataToSave.experience,
            education: dataToSave.education,
            skills: dataToSave.skills,
            projects: dataToSave.projects,
            templateId: dataToSave.templateId,
            styling: dataToSave.styling,
        };
        setDocumentNonBlocking(publicResumeRef, { ...dataToShare }, { merge: true });
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
  
  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!resumeData || !resumeData.companyInfo) return;
    const { name, value } = e.target;
    handleFieldChange('companyInfo', { ...resumeData.companyInfo, [name]: value });
  }

  const handleStylingChange = (field: keyof Styling, value: string | number) => {
    if (!resumeData || !resumeData.styling) return;
    handleFieldChange('styling', { ...resumeData.styling, [field]: value });
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
    
    // If there is no shareId, create one and save it to the user's resume doc.
    if (!shareId) {
        shareId = nanoid(10);
        setResumeData(prev => (prev ? { ...prev, shareId } : null)); 
    }

    // Create a clean object with only the data needed for the public resume.
    // Exclude sensitive or internal-only fields.
    const dataToShare = {
        title: resumeData.title,
        personalInfo: resumeData.personalInfo,
        summary: resumeData.summary,
        experience: resumeData.experience,
        education: resumeData.education,
        skills: resumeData.skills,
        projects: resumeData.projects,
        templateId: resumeData.templateId,
        styling: resumeData.styling,
    };

    // Create or update the public document non-blockingly
    const publicResumeRef = doc(firestore, 'publicResumes', shareId);
    setDocumentNonBlocking(publicResumeRef, dataToShare, { merge: true });

    const shareUrl = `${window.location.origin}/share/${shareId}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
        title: "Share Link Copied!",
        description: "Anyone with the link can now view and leave feedback on your resume."
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
        setKeywordSuggestions([]);
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAddKeywordAsSkill = (keyword: string) => {
    if (!resumeData) return;
  
    // Check if skills section exists, if not, create it
    const skillsExist = resumeData.skills !== undefined;
    let currentSkills = resumeData.skills || [];
  
    // Check for duplicates (case-insensitive)
    const isDuplicate = currentSkills.some(skill => skill.name.toLowerCase() === keyword.toLowerCase());
    if (isDuplicate) {
      toast({
        title: 'Skill Already Exists',
        description: `"${keyword}" is already in your skills list.`,
      });
      return;
    }
  
    const newSkill: Skill = {
      id: Date.now(),
      name: keyword,
      level: 'Advanced', // Default level
    };
  
    const updatedSkills = [...currentSkills, newSkill];
  
    // Use the setResumeData function to update the state
    setResumeData(prev => ({
      ...prev!,
      skills: updatedSkills,
    }));
    
    if (!skillsExist) {
        toast({ title: 'Skills Section Added', description: `The "Skills" section was created and "${keyword}" was added.` });
    } else {
        toast({ title: 'Skill Added', description: `"${keyword}" has been added to your skills.` });
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

  const handleAnalyzeResume = async () => {
    if (!resumeData || !resumeData.jobDescription) {
      toast({
        variant: 'destructive',
        title: 'Job Description Required',
        description: 'Please paste a job description to get a match analysis.',
      });
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setReviewResult(null); // Clear other results
    setKeywordSuggestions([]);


    const resumeContent = JSON.stringify(resumeData);

    try {
      const result = await analyzeResumeAction({ resumeContent, jobDescription: resumeData.jobDescription });
      if (result.success && result.data) {
        setAnalysisResult(result.data);
      } else {
        setAnalysisResult(null);
        toast({ variant: 'destructive', title: 'Analysis Failed', description: result.error });
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleReviewResume = async () => {
      if (!resumeData) return;
      setIsReviewing(true);
      setReviewResult(null);
      setAnalysisResult(null); // Clear other results
      setKeywordSuggestions([]);

      const resumeContent = JSON.stringify(resumeData);
      try {
          const result = await reviewResumeAction({ resumeContent });
          if (result.success && result.data) {
              setReviewResult(result.data);
          } else {
              setReviewResult(null);
              toast({ variant: 'destructive', title: 'Review Failed', description: result.error });
          }
      } catch (error: any) {
          toast({ variant: 'destructive', title: 'Error', description: error.message });
      } finally {
          setIsReviewing(false);
      }
  };


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
    <div className="flex flex-col h-full bg-secondary">
      <header className="bg-background border-b z-20 no-print">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-grow min-w-0">
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
       <div className="flex-grow flex overflow-hidden no-print">
        <ScrollArea className="w-1/3 border-r bg-background">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as EditorTab)} className="h-full flex flex-col">
              <div className="p-4 border-b">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content"><FileText className="mr-2 h-4 w-4"/>Content</TabsTrigger>
                  <TabsTrigger value="ai-review"><SearchCheck className="mr-2 h-4 w-4"/>AI Review</TabsTrigger>
                  <TabsTrigger value="cover-letter"><Newspaper className="mr-2 h-4 w-4"/>Cover Letter</TabsTrigger>
                  <TabsTrigger value="design"><Brush className="mr-2 h-4 w-4"/>Design</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex-grow overflow-y-auto">
                  <TabsContent value="design" className="p-6">
                      <Accordion type="multiple" defaultValue={['template', 'styling']} className="w-full space-y-4">
                          <AccordionItem value="template">
                            <AccordionTrigger className="font-semibold text-lg">Template</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4 border bg-secondary/30 rounded-b-lg p-4">
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
                            <AccordionTrigger className="font-semibold text-lg">Styling</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4 border bg-secondary/30 rounded-b-lg p-4">
                              <div className="space-y-2">
                                  <Label>Font Family</Label>
                                  <Select value={resumeData.styling?.fontFamily} onValueChange={(value) => handleStylingChange('fontFamily', value)}>
                                      <SelectTrigger>
                                          <SelectValue placeholder="Select a font" />
                                      </SelectTrigger>
                                      <SelectContent>
                                          {availableFonts.map(font => (
                                              <SelectItem key={font.id} value={font.id}>
                                                  {font.name}
                                              </SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                              </div>
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
                    <Accordion type="multiple" defaultValue={['personal-info', 'summary' ]} className="w-full space-y-4">
                        <PersonalInfoSection 
                            resumeData={resumeData}
                            setResumeData={setResumeData}
                            isProUser={isProUser}
                        />
                        <SummarySection
                             resumeData={resumeData}
                             setResumeData={setResumeData}
                             isProUser={isProUser}
                        />
                        <ExperienceSection
                            resumeData={resumeData}
                            setResumeData={setResumeData}
                            isProUser={isProUser}
                        />
                        <EducationSection
                            resumeData={resumeData}
                            setResumeData={setResumeData}
                        />
                        <ProjectsSection
                            resumeData={resumeData}
                            setResumeData={setResumeData}
                        />
                        <SkillsSection
                            resumeData={resumeData}
                            setResumeData={setResumeData}
                        />
                    </Accordion>
                  </TabsContent>

                   <TabsContent value="ai-review" className="p-6 space-y-4">
                     <Card variant="neuro">
                        <CardHeader>
                            <CardTitle className="font-headline">AI Analysis</CardTitle>
                            <CardDescription>Get general feedback or analyze your resume against a specific job description.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="job-description-analysis">Target Job Description</Label>
                                <Textarea
                                id="job-description-analysis"
                                value={resumeData.jobDescription}
                                onChange={(e) => handleFieldChange('jobDescription', e.target.value)}
                                rows={8}
                                placeholder="Paste a job description here to enable analysis features..."
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <ProFeatureWrapper isPro={isProUser}>
                                <div className="w-full space-y-2">
                                    <div className="flex flex-wrap gap-2">
                                        <Button onClick={handleAnalyzeResume} disabled={!resumeData.jobDescription || isAnalyzing || isReviewing || isAiLoading} className="flex-1">
                                            <SearchCheck className="mr-2 h-4 w-4" /> Analyze Match
                                        </Button>
                                        <Button onClick={handleSuggestKeywords} disabled={!resumeData.jobDescription || isAnalyzing || isReviewing || isAiLoading} className="flex-1" variant="secondary">
                                            <KeySquare className="mr-2 h-4 w-4" /> Suggest Keywords
                                        </Button>
                                    </div>
                                    <Button onClick={handleReviewResume} disabled={isAnalyzing || isReviewing || isAiLoading} className="w-full" variant="ghost">
                                        <Sparkles className="mr-2 h-4 w-4" /> Get General Feedback
                                    </Button>
                                </div>
                            </ProFeatureWrapper>
                        </CardFooter>
                     </Card>

                    {(isAnalyzing || isReviewing || isAiLoading) && <div className="text-center p-4"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></div>}
                    
                    <ProFeatureWrapper isPro={isProUser}>
                        {analysisResult && (
                             <Card variant="neuro">
                                <CardHeader>
                                    <CardTitle>Match Analysis</CardTitle>
                                    <CardDescription>{analysisResult.summary}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div>
                                        <Label>Match Score</Label>
                                        <div className="flex items-center gap-4">
                                            <Progress value={analysisResult.matchScore} className="w-full" />
                                            <span className="font-bold text-lg">{analysisResult.matchScore}%</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-green-600">Strengths</h4>
                                            <ul className="list-none space-y-2 text-sm">
                                                {analysisResult.positivePoints.map((point, i) => (
                                                    <li key={i} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />{point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-amber-600">Improvements</h4>
                                            <ul className="list-none space-y-2 text-sm">
                                                {analysisResult.areasForImprovement.map((point, i) => (
                                                    <li key={i} className="flex items-start gap-2"><XCircle className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />{point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                             </Card>
                        )}
                        {reviewResult && (
                             <Card variant="neuro">
                                <CardHeader>
                                    <CardTitle>General Resume Review</CardTitle>
                                     <CardDescription>{reviewResult.overallFeedback}</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-green-600">Positive Points</h4>
                                        <ul className="list-none space-y-2 text-sm mt-2">
                                            {reviewResult.positivePoints.map((point, i) => <li key={i} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />{point}</li>)}
                                        </ul>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-amber-600">Areas for Improvement</h4>
                                        <ul className="list-none space-y-2 text-sm mt-2">
                                            {reviewResult.areasForImprovement.map((point, i) => <li key={i} className="flex items-start gap-2"><XCircle className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />{point}</li>)}
                                        </ul>
                                    </div>
                                </CardContent>
                             </Card>
                        )}
                        {keywordSuggestions.length > 0 && (
                            <Card variant="neuro">
                                <CardHeader>
                                    <CardTitle>Keyword Suggestions</CardTitle>
                                    <CardDescription>Keywords from the job description that are missing from your resume. Click to add to your skills section.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {keywordSuggestions.map((keyword, i) => (
                                            <Button key={i} variant="secondary" size="sm" className="h-auto" onClick={() => handleAddKeywordAsSkill(keyword)}>
                                                <PlusCircle className="mr-2 h-3 w-3" />{keyword}
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </ProFeatureWrapper>
                   </TabsContent>
                  
                  <TabsContent value="cover-letter" className="p-6">
                  <div className="space-y-6">
                      <div className="p-4 border rounded-lg space-y-4">
                          <h3 className="font-semibold text-lg">Target Role</h3>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <Label>Company Name</Label>
                                  <Input name="name" value={resumeData.companyInfo?.name || ''} onChange={handleCompanyInfoChange} />
                              </div>
                              <div className="space-y-2">
                                  <Label>Job Title</Label>
                                  <Input name="jobTitle" value={resumeData.companyInfo?.jobTitle || ''} onChange={handleCompanyInfoChange} />
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
                          <Button onClick={handleWriteCoverLetter} disabled={isAiLoading}>
                          <Bot className="mr-2 h-4 w-4" />
                          {isAiLoading ? 'Generating...' : 'AI Generate'}
                          </Button>
                      </div>
                  </div>
                  </TabsContent>
              </div>
            </Tabs>
        </ScrollArea>
        <ScrollArea className="w-2/3 bg-secondary/50">
             <div className="p-10 mx-auto">
                {activeTab === 'cover-letter' ? (
                  <CoverLetterPreview resumeData={resumeData} />
                ) : (
                  <ResumePreview resumeData={resumeData} />
                )}
              </div>
        </ScrollArea>
      </div>
    </div>
  );
}
