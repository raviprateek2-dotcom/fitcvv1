
'use client';

import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Download, Share2, Sparkles, Bot, Newspaper, Brush, Loader2, SearchCheck, ArrowLeft, Upload, CheckCircle, XCircle, PlusCircle, FileText, KeySquare, Eye, Edit3, MessageSquareText, Linkedin, Target, ArrowRight, BookOpen, AlertTriangle, Check, Copy } from 'lucide-react';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { ResumePreview, CoverLetterPreview } from './ResumePreview';
import { useDoc, useUser, useFirestore, useMemoFirebase, setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
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
import { predictInterviewQuestions as predictQuestionsAction } from '@/app/actions/ai-question-predictor';
import type { PredictQuestionsOutput } from '@/ai/flows/ai-question-predictor';
import { Slider } from '../ui/slider';
import { cn } from '@/lib/utils';
import { nanoid } from 'nanoid';
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
import { LinkedInOptimizerTab } from './LinkedInOptimizerTab';
import { Badge } from '../ui/badge';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type EditorTab = 'content' | 'ai-review' | 'cover-letter' | 'linkedin' | 'design';

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
  { id: 'minimalist', name: 'Minimalist', isPremium: false },
  { id: 'professional', name: 'Professional', isPremium: false },
  { id: 'executive', name: 'Executive', isPremium: false },
  { id: 'elegant', name: 'Elegant', isPremium: false },
  { id: 'technical', name: 'Technical', isPremium: false },
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
            <div className="hidden md:block w-1/3 p-6 space-y-6 border-r overflow-y-auto">
                 <Skeleton className="h-10 w-1/2" />
                 <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                 </div>
            </div>
            <div className="w-full md:w-2/3 p-6 bg-secondary/50">
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
    <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground whitespace-nowrap">
      <div className={
        `w-2 h-2 rounded-full ` +
        (status === 'saved' ? 'bg-green-500' :
         status === 'saving' ? 'bg-yellow-500 animate-pulse' :
         status === 'error' ? 'bg-red-500' :
         'bg-transparent')
      } />
      <span className="hidden sm:inline">{text}</span>
    </div>
  )
}

export function ResumeEditor({ resumeId }: { resumeId: string }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const isPrintMode = searchParams.get('print') === 'true';

  const resumeDocRef = useMemoFirebase(
    () => (user ? doc(firestore!, `users/${user.uid}/resumes`, resumeId) : null),
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
  
  const [mobileMode, setMobileMode] = useState<'edit' | 'preview'>('edit');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResumeOutput | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<ReviewResumeOutput | null>(null);
  const [clTone, setClTone] = useState<'professional' | 'bold' | 'friendly'>('professional');
  const [isCopied, setIsCopied] = useState(false);

  const [isPredictingQuestions, setIsPredictingQuestions] = useState(false);
  const [predictedQuestions, setPredictedQuestions] = useState<PredictQuestionsOutput | null>(null);

  useEffect(() => {
    if (initialResumeData && !initialDataRef.current) {
        let updatedData = { ...initialResumeData };
        
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
        if (updatedData.jobDescription === undefined) updatedData.jobDescription = '';

        setResumeData(updatedData);
        initialDataRef.current = updatedData;
    }
  }, [initialResumeData]);

  useEffect(() => {
    if (isPrintMode && resumeData) {
      setTimeout(() => window.print(), 1000); 
    }
  }, [isPrintMode, resumeData]);

  const handleSave = useCallback((dataToSave: ResumeData) => {
    if (!resumeDocRef || !firestore || !user) return;
    setSaveStatus('saving');

    const updatedData = {
        ...dataToSave,
        userId: user.uid,
        updatedAt: serverTimestamp()
    };
    
    setDocumentNonBlocking(resumeDocRef, updatedData, { merge: true });
    
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

    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, [resumeDocRef, firestore, user]);

  useEffect(() => {
    if (!resumeData || !initialDataRef.current || isPrintMode) return;
    
    if (JSON.stringify(resumeData) === JSON.stringify(initialDataRef.current)) {
      return;
    }

    const handler = setTimeout(() => {
      handleSave(resumeData);
      initialDataRef.current = resumeData;
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
    window.open(`/editor/${resumeId}?print=true`, '_blank');
  };

  const handleWriteCoverLetter = async () => {
    if (!resumeData?.companyInfo?.jobTitle || !resumeData?.companyInfo?.name) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Provide a Job Title and Company Name.',
      });
      return;
    }
    
    setIsAiLoading(true);
    const resumeText = JSON.stringify(resumeData); 
    
    try {
      const result = await writeCoverLetterAction({
        jobTitle: resumeData.companyInfo.jobTitle,
        companyName: resumeData.companyInfo.name,
        resumeContent: resumeText,
        tone: clTone,
      });

      if (result.success && result.data) {
        handleFieldChange('coverLetter', result.data.coverLetterText);
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
    handleFieldChange('templateId', templateId);
  };
  
  const handleShare = () => {
    if (!resumeData || !firestore || !user) return;

    let shareId = resumeData.shareId;
    
    if (!shareId) {
        shareId = nanoid(10);
        setResumeData(prev => (prev ? { ...prev, shareId } : null)); 
    }

    const shareUrl = `${window.location.origin}/share/${shareId || resumeData.shareId}`;
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSuggestKeywords = async () => {
    if (!resumeData || !resumeData.jobDescription) {
      toast({ variant: 'destructive', title: 'Job Description Required' });
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
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAddKeywordAsSkill = (keyword: string) => {
    if (!resumeData) return;
  
    const currentSkills = resumeData.skills || [];
    if (currentSkills.some(skill => skill.name.toLowerCase() === keyword.toLowerCase())) {
      return;
    }
  
    const newSkill: Skill = { id: Date.now(), name: keyword, level: 'Advanced' };
    handleFieldChange('skills', [...currentSkills, newSkill]);
  };
  
  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    setIsParsing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = reader.result as string;
        const result = await parseResumeFromPdf(base64String);
        
        if (result.success && result.data) {
            setResumeData(prev => ({
            ...prev!,
            ...result.data!.resumeData,
            title: result.data!.resumeData.personalInfo.name ? `${result.data!.resumeData.personalInfo.name}'s Resume` : 'Imported Resume',
            }));
        } else {
            toast({ variant: 'destructive', title: 'Parse Failed', description: result.error });
        }
      };
    } finally {
      setIsParsing(false);
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAnalyzeResume = async () => {
    if (!resumeData || !resumeData.jobDescription) {
      toast({ variant: 'destructive', title: 'Job Description Required' });
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeResumeAction({ resumeContent: JSON.stringify(resumeData), jobDescription: resumeData.jobDescription });
      if (result.success && result.data) {
          setAnalysisResult(result.data);
          if (resumeDocRef) {
              updateDocumentNonBlocking(resumeDocRef, { 
                  matchScore: result.data.matchScore,
                  auditSummary: result.data.summary,
                  skillGaps: result.data.skillGaps,
                  learningPath: result.data.learningPath
              });
          }
      } else {
          toast({ variant: 'destructive', title: 'Analysis Error', description: result.error });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleReviewResume = async () => {
      if (!resumeData) return;
      setIsReviewing(true);
      setReviewResult(null);
      try {
          const result = await reviewResumeAction({ resumeContent: JSON.stringify(resumeData) });
          if (result.success && result.data) setReviewResult(result.data);
      } finally {
          setIsReviewing(false);
      }
  };

  const handlePredictQuestions = async () => {
    if (!resumeData?.jobDescription) {
        toast({ variant: 'destructive', title: 'Job Description Required' });
        return;
    }
    setIsPredictingQuestions(true);
    setPredictedQuestions(null);
    try {
        const result = await predictQuestionsAction({ jobDescription: resumeData.jobDescription });
        if (result.success && result.data) {
            setPredictedQuestions(result.data);
        } else {
            toast({ variant: 'destructive', title: 'Prediction Error', description: result.error });
        }
    } finally {
        setIsPredictingQuestions(false);
    }
  };

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
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 flex-grow min-w-0">
              <Input 
                  value={resumeData.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="Untitled Resume"
                  className="text-base md:text-lg font-headline font-semibold h-10 border-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-1 flex-grow bg-transparent truncate"
              />
              {resumeData.matchScore !== undefined && (
                  <Badge variant="outline" className="bg-accent/10 border-accent/20 text-accent hidden sm:flex">
                      <Target className="w-3 h-3 mr-1" />
                      {resumeData.matchScore}% Match
                  </Badge>
              )}
          </div>
           <div className="flex items-center gap-2 md:gap-4">
             <SaveStatusIndicator status={saveStatus} />
             <input
              type="file"
              ref={fileInputRef}
              onChange={handlePdfUpload}
              accept="application/pdf"
              className="hidden"
              disabled={isParsing}
            />
            <div className="hidden lg:flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isParsing}>
                {isParsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Import
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                {isCopied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Share2 className="mr-2 h-4 w-4"/>}
                {isCopied ? 'Copied' : 'Share'}
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                <Download className="mr-2 h-4 w-4" />
                PDF
                </Button>
            </div>
            <Button variant="outline" size="icon" asChild className="shrink-0">
                <Link href="/dashboard" aria-label="Back to Dashboard"><ArrowLeft className="h-4 w-4"/></Link>
            </Button>
          </div>
        </div>
      </header>

       <div className="flex md:hidden bg-background border-b p-2 gap-2 no-print">
            <Button variant={mobileMode === 'edit' ? 'default' : 'ghost'} className="flex-1 gap-2" onClick={() => setMobileMode('edit')}><Edit3 className="w-4 h-4" /> Edit</Button>
            <Button variant={mobileMode === 'preview' ? 'default' : 'ghost'} className="flex-1 gap-2" onClick={() => setMobileMode('preview')}><Eye className="w-4 h-4" /> Preview</Button>
       </div>

       <div className="flex-grow flex overflow-hidden no-print">
        <ScrollArea className={cn("w-full md:w-1/3 border-r bg-background", mobileMode === 'preview' ? 'hidden md:block' : 'block')}>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as EditorTab)} className="h-full flex flex-col">
              <div className="p-4 border-b">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="content" className="px-0"><FileText className="md:mr-2 h-4 w-4"/><span className="hidden md:inline">Content</span></TabsTrigger>
                  <TabsTrigger value="ai-review" className="px-0"><SearchCheck className="md:mr-2 h-4 w-4"/><span className="hidden md:inline">Audit</span></TabsTrigger>
                  <TabsTrigger value="cover-letter" className="px-0"><Newspaper className="md:mr-2 h-4 w-4"/><span className="hidden md:inline">Letter</span></TabsTrigger>
                  <TabsTrigger value="linkedin" className="px-0"><Linkedin className="md:mr-2 h-4 w-4"/><span className="hidden md:inline">LinkedIn</span></TabsTrigger>
                  <TabsTrigger value="design" className="px-0"><Brush className="md:mr-2 h-4 w-4"/><span className="hidden md:inline">Design</span></TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex-grow overflow-y-auto">
                  <TabsContent value="design" className="p-4 md:p-6">
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
                                              <SelectItem key={template.id} value={template.id}>
                                                  {template.name}
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
                                    />
                                    ))}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Title Size: {resumeData.styling?.titleFontSize}px</Label>
                                <Slider value={[resumeData.styling?.titleFontSize || 36]} onValueChange={([val]) => handleStylingChange('titleFontSize', val)} min={24} max={60} step={1} />
                              </div>
                              <div className="space-y-2">
                                <Label>Body Size: {resumeData.styling?.bodyFontSize}px</Label>
                                <Slider value={[resumeData.styling?.bodyFontSize || 14]} onValueChange={([val]) => handleStylingChange('bodyFontSize', val)} min={10} max={18} step={0.5} />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                      </Accordion>
                  </TabsContent>

                  <TabsContent value="content" className="p-4 md:p-6">
                    <Accordion type="multiple" defaultValue={['personal-info', 'summary' ]} className="w-full space-y-4">
                        <PersonalInfoSection resumeData={resumeData} setResumeData={setResumeData} isProUser={true} />
                        <SummarySection resumeData={resumeData} setResumeData={setResumeData} isProUser={true} />
                        <ExperienceSection resumeData={resumeData} setResumeData={setResumeData} isProUser={true} />
                        <EducationSection resumeData={resumeData} setResumeData={setResumeData} />
                        <ProjectsSection resumeData={resumeData} setResumeData={setResumeData} />
                        <SkillsSection resumeData={resumeData} setResumeData={setResumeData} />
                    </Accordion>
                  </TabsContent>

                   <TabsContent value="ai-review" className="p-4 md:p-6 space-y-4">
                     <Card variant="neuro">
                        <CardHeader>
                            <CardTitle className="font-headline">AI Strategic Audit</CardTitle>
                            <CardDescription>Get a high-stakes analysis of your fit for the role.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="job-description-analysis">Target Job Description</Label>
                                <Textarea
                                id="job-description-analysis"
                                value={resumeData.jobDescription || ''}
                                onChange={(e) => handleFieldChange('jobDescription', e.target.value)}
                                rows={8}
                                placeholder="Paste the job requirements here..."
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2">
                            <Button onClick={handleAnalyzeResume} disabled={!resumeData.jobDescription || isAnalyzing || isAiLoading} className="w-full">
                                <SearchCheck className="mr-2 h-4 w-4" /> Run Deep Analysis
                            </Button>
                            <div className="grid grid-cols-2 gap-2 w-full">
                                <Button onClick={handleSuggestKeywords} disabled={!resumeData.jobDescription || isAiLoading} variant="secondary">
                                    <KeySquare className="mr-2 h-4 w-4" /> Keywords
                                </Button>
                                <Button onClick={handlePredictQuestions} disabled={!resumeData.jobDescription || isPredictingQuestions} variant="ghost">
                                    <Target className="mr-2 h-4 w-4" /> Predict Prep
                                </Button>
                            </div>
                        </CardFooter>
                     </Card>

                    {(isAnalyzing || isReviewing || isAiLoading || isPredictingQuestions) && <div className="text-center p-4"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></div>}
                    
                    {predictedQuestions && (
                        <Card variant="neuro" className="border-primary/20 bg-primary/5">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Target className="w-5 h-5 text-primary" />
                                    Predicted Interview Questions
                                </CardTitle>
                                <CardDescription>Strategic preparation based on the requirements.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {predictedQuestions.questions.map((q, i) => (
                                    <div key={i} className="p-3 bg-background rounded-lg border space-y-2 group transition-all hover:border-primary/40">
                                        <div className="flex items-center justify-between">
                                            <Badge variant="secondary" className="capitalize text-[10px]">{q.type}</Badge>
                                            <Button variant="link" size="sm" className="h-auto p-0 text-[10px] opacity-0 group-hover:opacity-100" asChild>
                                                <Link href={`/interview?q=${encodeURIComponent(q.question)}`}>Practice Now <ArrowRight className="ml-1 w-2 h-2" /></Link>
                                            </Button>
                                        </div>
                                        <p className="text-sm font-bold leading-tight">"{q.question}"</p>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed italic">{q.reasoning}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {analysisResult && (
                        <div className="space-y-4">
                            <Card variant="neuro">
                                <CardHeader>
                                    <CardTitle className="text-lg">Match Analysis</CardTitle>
                                    <CardDescription className="text-xs">{analysisResult.summary}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                        <div>
                                        <Label className="text-xs">Match Score</Label>
                                        <div className="flex items-center gap-4">
                                            <Progress value={analysisResult.matchScore} className="w-full" />
                                            <span className="font-bold text-lg">{analysisResult.matchScore}%</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-xs text-green-600 uppercase">Strengths</h4>
                                            <ul className="list-none space-y-1.5 text-sm">
                                                {analysisResult.positivePoints.map((point, i) => (
                                                    <li key={i} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />{point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-xs text-amber-600 uppercase">Suggestions</h4>
                                            <ul className="list-none space-y-1.5 text-sm">
                                                {analysisResult.areasForImprovement.map((point, i) => (
                                                    <li key={i} className="flex items-start gap-2"><XCircle className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />{point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card variant="neuro" className="border-red-500/20 bg-red-500/5">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                        Critical Skill Gaps
                                    </CardTitle>
                                    <CardDescription>Missing technical requirements detected.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {analysisResult.skillGaps.map((gap, i) => (
                                            <Badge key={i} variant="destructive" className="bg-red-500/10 text-red-600 border-red-500/20">{gap}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card variant="neuro" className="border-accent/20 bg-accent/5">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-accent" />
                                        Strategic Growth Path
                                    </CardTitle>
                                    <CardDescription>AI-suggested plan to bridge the gaps.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 bg-background rounded-lg border text-sm leading-relaxed whitespace-pre-wrap">
                                        {analysisResult.learningPath}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {reviewResult && (
                        <Card variant="neuro">
                            <CardHeader>
                                <CardTitle className="text-lg">General Audit</CardTitle>
                                <CardDescription className="text-xs">Holistic view of your career narrative.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm p-3 bg-secondary rounded-lg leading-relaxed">{reviewResult.overallFeedback}</p>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-xs uppercase">Key Improvements</h4>
                                    <ul className="space-y-1.5">
                                        {reviewResult.areasForImprovement.map((tip, i) => (
                                            <li key={i} className="text-sm flex gap-2"><Sparkles className="w-4 h-4 text-primary shrink-0" /> {tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {keywordSuggestions.length > 0 && (
                        <Card variant="neuro">
                            <CardHeader>
                                <CardTitle className="text-lg">Keywords to Add</CardTitle>
                                <CardDescription className="text-xs">Missing from your profile based on the job description.</CardDescription>
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
                   </TabsContent>
                  
                  <TabsContent value="cover-letter" className="p-4 md:p-6">
                  <div className="space-y-6">
                      <div className="p-4 border rounded-lg space-y-4">
                          <h3 className="font-semibold text-lg">Target Role</h3>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <Label>Company</Label>
                                  <Input name="name" value={resumeData.companyInfo?.name || ''} onChange={handleCompanyInfoChange} />
                              </div>
                              <div className="space-y-2">
                                  <Label>Job Title</Label>
                                  <Input name="jobTitle" value={resumeData.companyInfo?.jobTitle || ''} onChange={handleCompanyInfoChange} />
                              </div>
                          </div>
                          <div className="space-y-2">
                              <Label>Letter Tone</Label>
                              <Select value={clTone} onValueChange={(v: any) => setClTone(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="professional">Professional (Balanced)</SelectItem>
                                    <SelectItem value="bold">Bold (Achievement-focused)</SelectItem>
                                    <SelectItem value="friendly">Friendly (Culture-focused)</SelectItem>
                                </SelectContent>
                              </Select>
                          </div>
                      </div>
                      <div className="p-4 border rounded-lg space-y-4">
                          <h3 className="font-semibold text-lg flex items-center justify-between">
                            Content
                            {isAiLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                          </h3>
                          <Textarea 
                              value={resumeData.coverLetter || ''}
                              onChange={e => handleFieldChange('coverLetter', e.target.value)}
                              rows={15}
                              placeholder="Your generated cover letter will appear here..."
                          />
                          <Button onClick={handleWriteCoverLetter} disabled={isAiLoading} className="w-full">
                          <MessageSquareText className="mr-2 h-4 w-4" />
                          {isAiLoading ? 'Drafting...' : 'AI Generate Letter'}
                          </Button>
                      </div>
                  </div>
                  </TabsContent>

                  <TabsContent value="linkedin" className="p-4 md:p-6">
                      <LinkedInOptimizerTab resumeData={resumeData} />
                  </TabsContent>
              </div>
            </Tabs>
        </ScrollArea>
        <ScrollArea className={cn("w-full md:w-2/3 bg-secondary/50", mobileMode === 'preview' ? 'block' : 'hidden md:block')}>
             <div className="p-4 md:p-10 mx-auto max-w-full overflow-x-hidden">
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
