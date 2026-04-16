'use client';

import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Download, Share2, Sparkles, Bot, Newspaper, Brush, Loader2, SearchCheck, ArrowLeft, Upload, CheckCircle, XCircle, PlusCircle, FileText, KeySquare, Eye, Edit3, MessageSquareText, Linkedin, Target, ArrowRight, BookOpen, AlertTriangle, Check, Copy, History, Zap, TrendingUp } from 'lucide-react';
import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { CoverLetterPreview } from './ResumePreview';
import { AtsSimulationPreview } from './AtsSimulationPreview';
import { useDoc, useUser, useFirestore, useMemoFirebase, setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useResumeEditorStore } from '@/store/resume-editor-store';
import { useStore } from 'zustand';

import type { PredictQuestionsOutput } from '@/ai/flows/ai-question-predictor';
import { Slider } from '../ui/slider';
import { cn } from '@/lib/utils';
import { nanoid } from 'nanoid';
import { parseResumeFromPdf } from '@/app/actions/ai-resume-parser';
import fastDeepEqual from 'fast-deep-equal';
import { generateResumeDocx } from '@/app/actions/export-docx';
import { readFileAsDataURL, downloadBase64File } from '@/lib/file-utils';
import { calcHiringReadiness } from '@/lib/resume-scoring';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { ContentTab } from './tabs/ContentTab';
import { CoverLetterTab } from './tabs/CoverLetterTab';
import { AIReviewTab } from './tabs/AIReviewTab';
import type { ResumeData, Styling } from './types';
import { Label } from '@/components/ui/label';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { ProFeatureWrapper } from './ProFeatureWrapper';
import { AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Badge } from '../ui/badge';
import { EditorHeader } from './EditorHeader';
import { downloadAtsTemplatePdfClient, downloadResumePdfClient } from '@/lib/resume-download-client';
import { buildGuestResumeSeed, isGuestResumeId, loadGuestResume, saveGuestResume } from '@/lib/guest-resume';
import { ResumePreview as UnifiedResumePreview } from '@/components/resume/ResumePreview';
import { buildUnifiedTemplateFromResumeData } from '@/lib/resume-template-mapper';
import { mapResumeDataToMasterSchema } from '@/lib/resume-master-mapper';
import { validateResumeTemplateBeforeDownload } from '@/lib/resume-template-validation';
import type { ResumeTemplateVariantId } from '@/lib/resume-template-variants';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type EditorTab = 'content' | 'ai-review' | 'cover-letter' | 'design';

import { DesignTab } from './tabs/DesignTab';
import { VersionHistoryTab } from './tabs/VersionHistoryTab';

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

export function ResumeEditor({ resumeId }: { resumeId: string }) {
  const { user } = useUser();
  const isGuestMode = isGuestResumeId(resumeId);
  const firestore = useFirestore();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const isPrintMode = searchParams.get('print') === 'true';

  const resumeDocRef = useMemoFirebase(
    () => (user ? doc(firestore!, `users/${user.uid}/resumes`, resumeId) : null),
    [firestore, user, resumeId]
  );
  const { data: initialResumeData, isLoading: isResumeLoading } = useDoc<ResumeData>(resumeDocRef);
  const initialDataRef = useRef<ResumeData | null>(null);
  const [guestReady, setGuestReady] = useState(false);

  const {
    resumeData, setResumeData, setResumeId,
    saveStatus, setSaveStatus,
    activeTab, setActiveTab,
    mobileMode, setMobileMode,
    isParsing, setIsParsing,
    isExporting, setIsExporting,
    isAiLoading, setIsAiLoading,
    isAnalyzing, setIsAnalyzing,
    isReviewing, setIsReviewing,
    isPredictingQuestions, setIsPredictingQuestions,
    isCopied, setIsCopied,
    clTone, setClTone,
    isAtsMode,
    hiringReadiness
  } = useResumeEditorStore();

  const { undo, redo, pastStates, futureStates } = useStore(useResumeEditorStore.temporal);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [autosaveMs, setAutosaveMs] = useState(1500);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => setAutosaveMs(mq.matches ? 10000 : 1500);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Initialize store with resumeId
  useEffect(() => {
    setResumeId(resumeId);
  }, [resumeId, setResumeId]);

  useEffect(() => {
    if (!isGuestMode) return;
    const fromStorage = loadGuestResume(resumeId);
    const seed = fromStorage ?? buildGuestResumeSeed('modern');
    setResumeData(seed);
    initialDataRef.current = seed;
    setGuestReady(true);
  }, [isGuestMode, resumeId, setResumeData]);

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
  }, [initialResumeData, setResumeData, isGuestMode]);

  useEffect(() => {
    if (isPrintMode && resumeData) {
      setTimeout(() => window.print(), 1000);
    }
  }, [isPrintMode, resumeData]);

  const handleSave = useCallback((dataToSave: ResumeData) => {
    if (isGuestMode || !user) {
      saveGuestResume(resumeId, dataToSave);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1000);
      return;
    }
    if (!resumeDocRef || !firestore || !user) return;
    setSaveStatus('saving');

    const updatedData = {
      ...dataToSave,
      userId: user.uid,
      updatedAt: serverTimestamp()
    };

    setDocumentNonBlocking(resumeDocRef, updatedData, { merge: true });

    if (dataToSave.shareId) {
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
  }, [resumeDocRef, firestore, user, setSaveStatus, isGuestMode, resumeId]);

  useEffect(() => {
    if (!resumeData || !initialDataRef.current || isPrintMode) return;

    if (fastDeepEqual(resumeData, initialDataRef.current)) {
      return;
    }

    const handler = setTimeout(() => {
      handleSave(resumeData);
      initialDataRef.current = resumeData;
    }, autosaveMs);

    return () => {
      clearTimeout(handler);
    };
  }, [resumeData, handleSave, isPrintMode, autosaveMs]);

  function handleFieldChange<T extends keyof ResumeData>(field: T, value: ResumeData[T]) {
    setResumeData(prev => ({ ...prev, [field]: value }));
  }

  const flushSaveNow = useCallback(() => {
    if (!resumeData || isPrintMode) return;
    handleSave(resumeData);
    initialDataRef.current = resumeData;
    toast({ title: 'Saved', description: 'Your resume is up to date.' });
  }, [resumeData, handleSave, isPrintMode, toast]);

  const handleMobileExportPdf = useCallback(() => {
    if (!resumeData) return;
    if (isAtsMode) {
      const variantId = (typeof window !== 'undefined'
        ? (window.localStorage.getItem('fitcv:ats-template-variant') as ResumeTemplateVariantId | null)
        : null) ?? 'ats-classic';
      const mapped = mapResumeDataToMasterSchema(resumeData);
      const validation = validateResumeTemplateBeforeDownload(mapped, variantId);
      if (validation.errors.length > 0) {
        toast({
          variant: 'destructive',
          title: 'Fix resume issues before export',
          description: `${validation.errors.length} blocking issues found in ATS check.`,
        });
        return;
      }
      if (validation.warnings.length > 0) {
        toast({
          title: 'ATS warnings detected',
          description: `${validation.warnings.length} warnings found. Exporting anyway on mobile.`,
        });
      }
      void downloadAtsTemplatePdfClient(
        mapped,
        variantId,
        `${resumeData.title || resumeData.personalInfo.name || 'Resume'}-ATS`,
        toast,
        setIsExporting
      );
      return;
    }
    void downloadResumePdfClient(resumeData, resumeId, toast, setIsExporting);
  }, [resumeData, resumeId, toast, setIsExporting, isAtsMode]);

  if ((isGuestMode && !guestReady) || (!isGuestMode && isResumeLoading) || !resumeData) {
    return <EditorLoadingSkeleton />;
  }

  const unifiedTemplate = buildUnifiedTemplateFromResumeData(resumeData);

  if (isPrintMode) {
    return (
      <div className="bg-white print:p-0">
        <UnifiedResumePreview template={unifiedTemplate} className="rounded-none border-none shadow-none" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background relative">
      {/* Decorative Background for Editor */}
      <div className="fixed inset-0 -z-10 opacity-20 dark:opacity-10 animate-mesh filter blur-[100px]" />
      
      <EditorHeader />
      
      <div className="flex md:hidden bg-background/60 backdrop-blur-md border-b p-2 gap-2 no-print z-20">
        <Button
          variant={mobileMode === 'edit' ? 'default' : 'ghost'}
          className="flex-1 gap-2 rounded-xl min-h-[52px] text-base"
          onClick={() => setMobileMode('edit')}
        >
          <Edit3 className="w-5 h-5 shrink-0" aria-hidden />
          Edit
        </Button>
        <Button
          variant={mobileMode === 'preview' ? 'default' : 'ghost'}
          className="flex-1 gap-2 rounded-xl min-h-[52px] text-base"
          onClick={() => setMobileMode('preview')}
        >
          <Eye className="w-5 h-5 shrink-0" aria-hidden />
          Preview
        </Button>
      </div>

      <div
        className="flex-grow flex overflow-hidden no-print relative pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-0"
        data-tour="editor-split"
      >
        <div
          className={cn(
            'w-full md:w-[450px] lg:w-[500px] xl:w-[550px] shrink-0 h-full border-r bg-glass backdrop-blur-3xl z-10 flex flex-col shadow-2xl transition-all duration-300 max-md:[&_input]:min-h-11 max-md:[&_input]:text-base max-md:[&_textarea]:min-h-[120px] max-md:[&_textarea]:text-base',
            mobileMode === 'preview' ? 'hidden md:flex' : 'flex'
          )}
        >
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as EditorTab)} className="h-full flex flex-col">
            <div className="p-5 border-b bg-white/5">
              <TabsList className="grid w-full grid-cols-5 p-1 bg-secondary/50 rounded-2xl h-11">
                <TabsTrigger value="content" title="Content" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><FileText className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="ai-review" title="Audit" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Target className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="cover-letter" title="Letter" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Newspaper className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="design" title="Design" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Brush className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="history" title="History" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><History className="h-4 w-4" /></TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-grow">
              <div className="p-6">
                <DesignTab />
                <ContentTab />
                <AIReviewTab />
                <CoverLetterTab />
                <VersionHistoryTab />
              </div>
            </ScrollArea>
          </Tabs>
        </div>

        <div
          className={cn(
            'flex-grow bg-[#f8f9fa] dark:bg-black/40 overflow-y-auto relative p-4 md:p-12 lg:p-16 scrollbar-hide',
            mobileMode === 'preview' ? 'block' : 'hidden md:block'
          )}
        >
           <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
           
           <div
             className={cn(
               'mx-auto max-w-[900px] perspective-1000',
               mobileMode === 'preview' &&
                 'max-h-[min(70vh,calc(100dvh-12rem))] overflow-auto rounded-2xl'
             )}
             style={
               mobileMode === 'preview'
                 ? { touchAction: 'pan-x pan-y pinch-zoom' as const }
                 : undefined
             }
           >
             <motion.div 
               initial={{ opacity: 0, y: 30, scale: 0.98 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               transition={{ duration: 0.6, ease: "easeOut" }}
               className="shadow-[0_20px_70px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_70px_-10px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10"
             >
                {activeTab === 'cover-letter' ? (
                  <CoverLetterPreview resumeData={resumeData} />
                ) : isAtsMode ? (
                  <AtsSimulationPreview resumeData={resumeData} />
                ) : (
                  <UnifiedResumePreview template={unifiedTemplate} />
                )}
             </motion.div>
           </div>
        </div>
      </div>

      <div
        className="md:hidden no-print fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md px-3 pt-2 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_24px_rgba(0,0,0,0.35)]"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto flex max-w-lg items-stretch gap-2">
          <Button variant="outline" size="lg" className="min-h-[48px] flex-1 gap-1.5 px-2" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
              {isGuestMode ? 'Exit guest' : 'Back'}
            </Link>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="min-h-[48px] flex-1"
            onClick={flushSaveNow}
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'saving' ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
            ) : null}
            Save
          </Button>
          <Button
            type="button"
            size="lg"
            className="min-h-[48px] flex-1 gap-1.5 px-2"
            onClick={handleMobileExportPdf}
            disabled={isExporting}
            data-tour="editor-download"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
            ) : (
              <Download className="h-4 w-4 shrink-0" aria-hidden />
            )}
            PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
