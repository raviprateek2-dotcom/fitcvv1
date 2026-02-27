'use client';

import { TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquareText, Sparkles, Building2, Briefcase, Wand2, Lightbulb, PenTool } from 'lucide-react';
import { useResumeEditorStore } from '@/store/resume-editor-store';
import { useToast } from '@/hooks/use-toast';
import { writeCoverLetter as writeCoverLetterAction } from '@/app/actions/ai-cover-letter';
import type { ResumeData } from '../types';
import { cn } from '@/lib/utils';

export function CoverLetterTab() {
  const { resumeData, setResumeData, clTone, setClTone, isAiLoading, setIsAiLoading } = useResumeEditorStore();
  const { toast } = useToast();

  const handleFieldChange = <T extends keyof ResumeData>(field: T, value: ResumeData[T]) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!resumeData || !resumeData.companyInfo) return;
    const { name, value } = e.target;
    handleFieldChange('companyInfo', { ...resumeData.companyInfo, [name]: value });
  };

  const handleWriteCoverLetter = async () => {
    if (!resumeData?.companyInfo?.jobTitle || !resumeData?.companyInfo?.name) {
      toast({
        variant: 'destructive',
        title: 'Missing Parameters',
        description: 'Sync your Target Title and Organization Name first.',
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
    } catch (error: unknown) {
      toast({ variant: 'destructive', title: 'Error', description: error instanceof Error ? error.message : 'An unexpected error occurred' });
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!resumeData) return null;

  return (
    <TabsContent value="cover-letter" className="p-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="bg-glass backdrop-blur-3xl border-white/10 shadow-2xl overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
        <CardHeader className="relative pb-8">
            <div className="flex items-center gap-4 mb-2">
                <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/20 shadow-inner">
                <PenTool className="w-6 h-6" />
                </div>
                <div>
                <CardTitle className="text-2xl font-black font-headline tracking-tight text-white">Narrative Architect</CardTitle>
                <CardDescription className="text-muted-foreground/80 font-medium">Engineer a compelling cover letter that bridges the gap between your resume and the role.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="relative space-y-8">
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6 shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/80">Mission Context</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Organization</Label>
                        <Input 
                            name="name" 
                            value={resumeData.companyInfo?.name || ''} 
                            onChange={handleCompanyInfoChange} 
                            placeholder="e.g. OpenAI"
                            className="bg-white/5 border-white/10 h-11 rounded-xl focus:ring-primary/20 transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Proposed Designation</Label>
                        <Input 
                            name="jobTitle" 
                            value={resumeData.companyInfo?.jobTitle || ''} 
                            onChange={handleCompanyInfoChange} 
                            placeholder="e.g. Senior Staff Engineer"
                            className="bg-white/5 border-white/10 h-11 rounded-xl focus:ring-primary/20 transition-all font-bold"
                        />
                    </div>
                </div>
                <div className="space-y-3 pt-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Narrative Tone & Velocity</Label>
                    <Select value={clTone} onValueChange={(v: 'professional' | 'bold' | 'friendly') => setClTone(v)}>
                        <SelectTrigger className="bg-white/5 border-white/10 h-11 rounded-xl focus:ring-primary/20 transition-all font-black uppercase text-[10px] tracking-widest">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-glass backdrop-blur-3xl border-white/10">
                            <SelectItem value="professional" className="text-[10px] font-bold uppercase">Professional (Balanced / High-Signal)</SelectItem>
                            <SelectItem value="bold" className="text-[10px] font-bold uppercase">Bold (Aggressive / Achievement-First)</SelectItem>
                            <SelectItem value="friendly" className="text-[10px] font-bold uppercase">Friendly (Relationship / Culture-First)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-4 pt-2">
                <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                        <MessageSquareText className="w-4 h-4 text-primary" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Generated Strategy Content</h4>
                    </div>
                    {isAiLoading && <div className="flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin text-primary" /><span className="text-[9px] font-black text-primary uppercase animate-pulse">Drafting...</span></div>}
                </div>
                <Textarea
                    value={resumeData.coverLetter || ''}
                    onChange={e => handleFieldChange('coverLetter', e.target.value)}
                    rows={15}
                    placeholder="Your high-impact cover letter will be synthesized here..."
                    className="bg-white/5 border-white/10 rounded-2xl resize-none focus-visible:ring-primary/20 text-sm leading-relaxed p-6 transition-all hover:bg-white/[0.07] shadow-inner font-medium min-h-[400px]"
                />
            </div>
        </CardContent>
        <CardFooter className="relative pt-4 pb-8 border-t border-white/5 bg-white/[0.02]">
            <Button onClick={handleWriteCoverLetter} disabled={isAiLoading} className="w-full h-14 rounded-2xl text-base font-black tracking-wide shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] transition-all bg-primary text-primary-foreground group overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-2">
                {isAiLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />}
                {isAiLoading ? 'Synthesizing Narrative...' : 'Generate Premium Cover Letter'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-foreground/10 to-primary opacity-0 group-hover:opacity-10 transition-opacity" />
            </Button>
        </CardFooter>
      </Card>

      <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl flex items-start gap-4 shadow-inner">
            <div className="bg-primary/20 p-2 rounded-xl">
                <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/80">Pro Architect Tip</p>
                <p className="text-sm text-muted-foreground/90 leading-relaxed font-medium">
                    A premium cover letter doesn't just restate your resume. It <span className="text-foreground font-bold">connects the dots</span> between the company's pain points and your uniquely engineered solutions.
                </p>
            </div>
      </div>
    </TabsContent>
  );
}
