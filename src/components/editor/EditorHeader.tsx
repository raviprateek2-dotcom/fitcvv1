'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Check, CircleHelp, Download, FileText, Loader2, Share2, Target, Upload, ScanText, History, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { useResumeEditorStore, SaveStatus } from '@/store/resume-editor-store';
import { generateResumeDocx } from '@/app/actions/export-docx';
import { readFileAsDataURL, downloadBase64File } from '@/lib/file-utils';
import { downloadResumePdfClient } from '@/lib/resume-download-client';
import { parseResumeFromPdf } from '@/app/actions/ai-resume-parser';
import { trackEvent } from '@/lib/analytics-events';
import { isGuestResumeId } from '@/lib/guest-resume';
import { useWalkthrough } from '@/components/walkthrough/WalkthroughProvider';
import type { ResumeData } from './types';

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

export function EditorHeader() {
  const { user } = useUser();
  const { openWalkthrough } = useWalkthrough();
  const firestore = useFirestore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    resumeData, setResumeData, resumeId,
    saveStatus,
    isParsing, setIsParsing,
    isExporting, setIsExporting,
    isCopied, setIsCopied,
    hiringReadiness,
    isAtsMode, setIsAtsMode
  } = useResumeEditorStore();
  const isGuestMode = isGuestResumeId(resumeId);

  const handleFieldChange = <T extends keyof ResumeData>(field: T, value: ResumeData[T]) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrint = async () => {
    if (!resumeData) return;
    if (!user || isGuestMode) {
      window.open(`/editor/${resumeId}?print=true`, '_blank');
      toast({
        title: 'Guest export opened',
        description: 'Sign in for server-side PDF generation and cloud saves.',
      });
      trackEvent('guest_export_print', { source: 'editor_header' });
      return;
    }
    await downloadResumePdfClient(resumeData, resumeId, toast, setIsExporting);
  };

  const handleDocxExport = async () => {
    if (!resumeData) return;
    setIsExporting(true);
    trackEvent('docx_export_start', { source: 'editor_header' });
    try {
      const result = await generateResumeDocx(resumeData);
      if (result.success && result.docxBase64) {
        const filename = `${resumeData.title || resumeData.personalInfo.name || 'Resume'}.docx`;
        downloadBase64File(result.docxBase64, filename, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        toast({ title: 'DOCX Downloaded', description: filename });
        trackEvent('docx_export_success', { source: 'editor_header' });
      } else {
        toast({ variant: 'destructive', title: 'DOCX Export Failed', description: result.error });
        trackEvent('docx_export_fail', { reason: result.error ?? 'unknown' });
      }
    } catch (error: unknown) {
      toast({ variant: 'destructive', title: 'Export Error', description: error instanceof Error ? error.message : 'Failed to generate DOCX' });
      trackEvent('docx_export_fail', { reason: 'runtime_error' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = () => {
    if (!resumeData || !firestore || !user || isGuestMode) {
      toast({
        title: 'Sign in to share',
        description: 'Guest drafts stay on this browser. Create a free account to generate share links.',
      });
      trackEvent('signup_gate_hit', { action: 'share_resume' });
      return;
    }

    let shareId = resumeData.shareId;

    if (!shareId) {
      shareId = nanoid(10);
      setResumeData(prev => ({ ...prev, shareId }));
    }

    const shareUrl = `${window.location.origin}/share/${shareId || resumeData.shareId}`;
    navigator.clipboard.writeText(shareUrl);
    trackEvent('resume_share_copy', { source: 'editor_header' });
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!resumeData || !firestore || !user || isGuestMode) {
      toast({
        title: 'Sign in to share',
        description: 'WhatsApp sharing for public resume links needs an account.',
      });
      trackEvent('signup_gate_hit', { action: 'share_whatsapp' });
      return;
    }

    let shareId = resumeData.shareId;
    if (!shareId) {
      shareId = nanoid(10);
      setResumeData(prev => ({ ...prev, shareId }));
    }

    const shareUrl = `${window.location.origin}/share/${shareId || resumeData.shareId}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`Check out my resume: ${shareUrl}`)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    trackEvent('resume_share_whatsapp', { source: 'editor_header' });
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    trackEvent('resume_import_start', { source: 'editor_header' });
    try {
      const base64String = await readFileAsDataURL(file);
      const result = await parseResumeFromPdf(base64String);

      if (result.success && result.data) {
        setResumeData(prev => ({
          ...prev!,
          ...(result.data!.resumeData as Partial<ResumeData>),
          title: result.data!.resumeData.personalInfo.name ? `${result.data!.resumeData.personalInfo.name}'s Resume` : 'Imported Resume',
        } as ResumeData));
        toast({ title: 'Resume Imported', description: 'Resume data has been populated from your PDF.' });
        trackEvent('resume_import_success', { source: 'editor_header' });
      } else {
        toast({ variant: 'destructive', title: 'Parse Failed', description: result.error });
        trackEvent('resume_import_fail', { reason: result.error ?? 'unknown' });
      }
    } catch (error: unknown) {
      toast({ variant: 'destructive', title: 'Upload Error', description: error instanceof Error ? error.message : 'Failed to read file' });
      trackEvent('resume_import_fail', { reason: 'runtime_error' });
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveVersion = () => {
    if (!resumeData || !firestore || !user || !resumeId || isGuestMode) {
      toast({
        title: 'Sign in to save versions',
        description: 'Version history sync is available after account creation.',
      });
      trackEvent('signup_gate_hit', { action: 'version_history' });
      return;
    }
    
    // Save to the subcollection `users/{uid}/resumes/{resumeId}/versions`
    const versionsRef = collection(firestore, `users/${user.uid}/resumes/${resumeId}/versions`);
    
    addDocumentNonBlocking(versionsRef, {
      ...resumeData,
      versionCreatedAt: serverTimestamp(),
      userId: user.uid,
    });
    
    toast({ title: 'Version Saved', description: 'A snapshot of your resume has been saved to your version history.' });
  };

  if (!resumeData) return null;

  return (
    <div className="p-4 no-print z-50">
      <header className="mx-auto w-full max-w-7xl h-16 rounded-2xl bg-glass border border-white/10 shadow-2xl backdrop-blur-3xl flex items-center px-6 gap-4">
        <div className="flex items-center gap-4 flex-grow min-w-0">
          <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-xl transition-colors shrink-0">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Link>
          
          <div className="flex flex-col flex-grow min-w-0">
            <Input
              value={resumeData.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="Untitled Resume"
              className="text-lg font-bold font-headline h-7 border-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent truncate text-gradient"
            />
            <div className="flex items-center gap-3">
              <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden shrink-0">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000" 
                  style={{ width: `${hiringReadiness}%` }} 
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 whitespace-nowrap">
                Hiring Readiness: {hiringReadiness}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isGuestMode && (
            <Badge variant="outline" className="hidden lg:inline-flex border-amber-500/30 text-amber-500">
              Guest draft
            </Badge>
          )}
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
            <Button 
                variant={isAtsMode ? 'premium' : 'glass'} 
                size="sm" 
                onClick={() => setIsAtsMode(!isAtsMode)}
                className="h-9 px-4 rounded-xl"
            >
              <ScanText className="mr-2 h-4 w-4" />
              ATS Simulation
            </Button>
            
            <div className="w-[1px] h-6 bg-white/10 mx-1" />

            <Button variant="glass" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isParsing} className="h-9 w-9 rounded-xl" title="Import PDF">
              {isParsing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            </Button>
            
            <Button variant="glass" size="icon" onClick={handleShare} className="h-9 w-9 rounded-xl" title="Share Link">
              {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
            </Button>

            <Button variant="glass" size="icon" onClick={handleShareWhatsApp} className="h-9 w-9 rounded-xl" title="Share on WhatsApp">
              <MessageCircle className="h-4 w-4" />
            </Button>

            <Button
              variant="glass"
              size="icon"
              onClick={openWalkthrough}
              className="h-9 w-9 rounded-xl"
              title="Show platform guide"
            >
              <CircleHelp className="h-4 w-4" />
            </Button>
            
            <Button variant="glass" size="icon" onClick={handleSaveVersion} className="h-9 w-9 rounded-xl" title="Save Snapshot">
              <History className="h-4 w-4" />
            </Button>

            <div className="w-[1px] h-6 bg-white/10 mx-1" />

            <Button variant="glass" size="sm" onClick={handleDocxExport} disabled={isExporting} className="h-9 px-4 rounded-xl">
              {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              DOCX
            </Button>

            <Button
              variant="premium"
              size="sm"
              onClick={handlePrint}
              disabled={isExporting}
              className="h-9 px-4 rounded-xl"
              data-tour="editor-download"
            >
              {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Export PDF
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}
