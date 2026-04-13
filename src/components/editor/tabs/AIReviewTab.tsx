'use client';

import { TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SearchCheck, KeySquare, Target, Loader2, ArrowRight, CheckCircle, XCircle, AlertTriangle, Linkedin, Sparkles, PlusCircle, ShieldCheck, Activity, Brain } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useResumeEditorStore } from '@/store/resume-editor-store';
import { useUser, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';

import { analyzeResume as analyzeResumeAction, type AnalyzeResumeOutput } from '@/app/actions/ai-resume-analyzer';
import { reviewResume as reviewResumeAction, type ReviewResumeOutput } from '@/app/actions/ai-resume-review';
import { predictInterviewQuestions as predictQuestionsAction } from '@/app/actions/ai-question-predictor';
import type { PredictQuestionsOutput } from '@/ai/flows/ai-question-predictor';
import { suggestKeywords as suggestKeywordsAction } from '@/app/actions/ai-keyword-suggester';
import type { ResumeData, Skill } from '../types';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics-events';

export function AIReviewTab() {
  const { resumeData, setResumeData, resumeId, isAnalyzing, setIsAnalyzing, isReviewing, setIsReviewing, isPredictingQuestions, setIsPredictingQuestions, isAiLoading, setIsAiLoading } = useResumeEditorStore();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResumeOutput | null>(null);
  const [highMatchCelebration, setHighMatchCelebration] = useState(false);
  const [reviewResult, setReviewResult] = useState<ReviewResumeOutput | null>(null);
  const [predictedQuestions, setPredictedQuestions] = useState<PredictQuestionsOutput | null>(null);

  const resumeDocRef = useMemoFirebase(
    () => (user ? doc(firestore!, `users/${user.uid}/resumes`, resumeId) : null),
    [firestore, user, resumeId]
  );

  const handleFieldChange = <T extends keyof ResumeData>(field: T, value: ResumeData[T]) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyzeResume = async () => {
    if (!resumeData || !resumeData.jobDescription) {
      toast({ variant: 'destructive', title: 'Job Description Required' });
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    trackEvent('jd_analyze_start', { source: 'ai_review_tab' });
    try {
      const result = await analyzeResumeAction({ resumeContent: JSON.stringify(resumeData), jobDescription: resumeData.jobDescription });
      if (result.success && result.data) {
        setAnalysisResult(result.data);
        trackEvent('jd_analyze_success', { match_score: result.data.matchScore });
        if (result.data.matchScore >= 90) {
          toast({
            title: 'Strong match for this role',
            description: 'Your resume aligns well with the job description — great ATS positioning.',
          });
          const reduceMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (!reduceMotion) setHighMatchCelebration(true);
        }
        if (resumeDocRef) {
          updateDocumentNonBlocking(resumeDocRef, {
            matchScore: result.data.matchScore,
            auditSummary: result.data.summary,
            skillGaps: result.data.skillGaps,
            learningPath: result.data.learningPath
          });
        }
      } else {
        trackEvent('jd_analyze_fail', { reason: result.error ?? 'unknown' });
        toast({ variant: 'destructive', title: 'Analysis Error', description: result.error });
      }
    } catch (error: unknown) {
      trackEvent('jd_analyze_fail', { reason: 'runtime_error' });
      toast({
        variant: 'destructive',
        title: 'Analysis failed',
        description: error instanceof Error ? error.message : 'Please try again in a few seconds.',
      });
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
    trackEvent('interview_predict_start', { source: 'ai_review_tab' });
    try {
      const result = await predictQuestionsAction({ jobDescription: resumeData.jobDescription });
      if (result.success && result.data) {
        setPredictedQuestions(result.data);
        trackEvent('interview_predict_success', { count: result.data.questions.length });
      } else {
        trackEvent('interview_predict_fail', { reason: result.error ?? 'unknown' });
        toast({ variant: 'destructive', title: 'Prediction Error', description: result.error });
      }
    } catch (error: unknown) {
      trackEvent('interview_predict_fail', { reason: 'runtime_error' });
      toast({
        variant: 'destructive',
        title: 'Interview prep failed',
        description: error instanceof Error ? error.message : 'Please retry in a moment.',
      });
    } finally {
      setIsPredictingQuestions(false);
    }
  };

  const handleSuggestKeywords = async () => {
    if (!resumeData || !resumeData.jobDescription) {
      toast({ variant: 'destructive', title: 'Job Description Required' });
      return;
    }
    setIsAiLoading(true);
    setKeywordSuggestions([]);
    trackEvent('keyword_suggest_start', { source: 'ai_review_tab' });

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
        trackEvent('keyword_suggest_success', { count: result.data.suggestions.length });
      } else {
        trackEvent('keyword_suggest_fail', { reason: result.error ?? 'unknown' });
        toast({ variant: 'destructive', title: 'Keyword suggestions failed', description: result.error });
      }
    } catch (error: unknown) {
      trackEvent('keyword_suggest_fail', { reason: 'runtime_error' });
      toast({
        variant: 'destructive',
        title: 'Keyword suggestions failed',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    if (!highMatchCelebration) return;
    const t = window.setTimeout(() => setHighMatchCelebration(false), 2600);
    return () => window.clearTimeout(t);
  }, [highMatchCelebration]);

  const handleAddKeywordAsSkill = (keyword: string) => {
    if (!resumeData) return;

    const currentSkills = resumeData.skills || [];
    if (currentSkills.some(skill => skill.name.toLowerCase() === keyword.toLowerCase())) {
      return;
    }

    const newSkill: Skill = { id: Date.now(), name: keyword, level: 'Advanced' };
    handleFieldChange('skills', [...currentSkills, newSkill]);
  };

  if (!resumeData) return null;

  return (
    <TabsContent value="ai-review" className="p-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="bg-glass backdrop-blur-3xl border-white/10 shadow-2xl overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
        <CardHeader className="relative pb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/20 shadow-inner">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black font-headline tracking-tight text-white">Tailor to Job Description</CardTitle>
              <CardDescription className="text-muted-foreground/80 font-medium">Paste a real JD to get match score, skill gaps, and concrete edits.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <Label htmlFor="job-description-analysis" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Job Description (JD)</Label>
              <Badge variant="outline" className="text-[9px] font-black uppercase text-primary border-primary/20 bg-primary/5">High Contrast Mode</Badge>
            </div>
            <Textarea
              id="job-description-analysis"
              value={resumeData.jobDescription || ''}
              onChange={(e) => handleFieldChange('jobDescription', e.target.value)}
              rows={8}
              placeholder="Paste the full job description to run ATS-style analysis..."
              className="bg-white/5 border-white/10 rounded-2xl resize-none focus-visible:ring-primary/20 text-sm leading-relaxed p-5 transition-all hover:bg-white/[0.07] shadow-inner"
            />
          </div>
        </CardContent>
        <CardFooter className="relative flex flex-col gap-4 border-t border-white/5 pt-8 bg-white/[0.02]">
          <Button onClick={handleAnalyzeResume} disabled={!resumeData.jobDescription || isAnalyzing || isAiLoading} className="w-full h-14 rounded-2xl text-base font-black tracking-wide shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] transition-all bg-primary text-primary-foreground group overflow-hidden">
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isAnalyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <SearchCheck className="h-5 w-5 group-hover:scale-110 transition-transform" />}
              Analyze Match
            </span>
          </Button>
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button onClick={handleSuggestKeywords} disabled={!resumeData.jobDescription || isAiLoading} variant="glass" className="h-12 rounded-xl border-white/10 shadow-lg font-bold">
              <KeySquare className="mr-2 h-4 w-4 text-primary" /> Keywords
            </Button>
            <Button onClick={handlePredictQuestions} disabled={!resumeData.jobDescription || isPredictingQuestions} variant="glass" className="h-12 rounded-xl border-white/10 shadow-lg font-bold">
              <Target className="mr-2 h-4 w-4 text-primary" /> Prep Mode
            </Button>
          </div>
        </CardFooter>
      </Card>

      {(isAnalyzing || isReviewing || isAiLoading || isPredictingQuestions) && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-pulse">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Running AI analysis...</p>
        </div>
      )}

      {predictedQuestions && (
        <Card className="bg-primary/5 border-primary/20 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in-95">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/20 text-primary">
                    <Target className="w-5 h-5" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black font-headline text-white">Interview Vector Prediction</CardTitle>
                    <CardDescription className="text-muted-foreground/60 text-xs">Strategic preparation based on requirement high-points.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {predictedQuestions.questions.map((q, i) => (
              <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3 group transition-all hover:bg-white/[0.08] hover:border-primary/30 shadow-inner">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="px-2 py-0.5 rounded-lg text-[9px] font-black tracking-widest uppercase bg-primary/10 text-primary border-primary/10">{q.type}</Badge>
                  <Button variant="link" size="sm" className="h-auto p-0 text-[10px] opacity-0 group-hover:opacity-100 transition-all font-bold text-primary" asChild>
                    <Link href={`/interview?q=${encodeURIComponent(q.question)}`}>Run Simulator <ArrowRight className="ml-1 w-3 h-3" /></Link>
                  </Button>
                </div>
                <p className="text-sm font-bold leading-relaxed text-white">"{q.question}"</p>
                <div className="flex items-start gap-2 pt-1 border-t border-white/5 mt-2">
                    <Activity className="w-3.5 h-3.5 text-muted-foreground/40 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">{q.reasoning}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {analysisResult && (
        <div className="grid grid-cols-1 gap-6 pb-8">
          <Card className="bg-glass border-white/10 rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-black font-headline text-white">Match Intelligence</CardTitle>
              <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium mt-2">{analysisResult.summary}</p>
            </CardHeader>
            <CardContent className="space-y-8">
              <div
                className={cn(
                  'space-y-4 p-6 bg-white/5 rounded-2xl shadow-inner border border-white/5 transition-[box-shadow,ring] duration-500',
                  highMatchCelebration &&
                    analysisResult.matchScore >= 90 &&
                    'motion-safe:ring-2 motion-safe:ring-primary/50 motion-safe:shadow-[0_0_24px_rgba(var(--primary-rgb),0.25)] motion-safe:animate-pulse'
                )}
              >
                <div className="flex justify-between items-end mb-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Strategic Match Index</Label>
                    <span className="font-black text-3xl font-headline text-primary">{analysisResult.matchScore}%</span>
                </div>
                <Progress value={analysisResult.matchScore} className="h-3 rounded-full bg-white/10 shadow-inner" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-green-500/10 text-green-500">
                        <CheckCircle className="h-4 w-4" />
                    </div>
                    <h4 className="font-black text-[10px] uppercase tracking-widest text-green-500">Synergies</h4>
                  </div>
                  <ul className="space-y-3">
                    {analysisResult.positivePoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm font-medium text-muted-foreground leading-snug">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                        <Activity className="h-4 w-4" />
                    </div>
                    <h4 className="font-black text-[10px] uppercase tracking-widest text-amber-500">Delta Points</h4>
                  </div>
                  <ul className="space-y-3">
                    {analysisResult.areasForImprovement.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm font-medium text-muted-foreground leading-snug">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-red-500/5 border-red-500/20 rounded-3xl overflow-hidden">
                <CardHeader>
                <CardTitle className="text-lg font-black font-headline flex items-center gap-2 text-red-500">
                    <ShieldCheck className="w-5 h-5" />
                    Critical Gaps
                </CardTitle>
                <CardDescription className="text-red-500/50 text-xs">Essential technical requirements missing.</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="flex flex-wrap gap-2">
                    {analysisResult.skillGaps.map((gap, i) => (
                    <Badge key={i} className="bg-red-500/10 text-red-500 border-red-500/20 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider">{gap}</Badge>
                    ))}
                </div>
                </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20 rounded-3xl overflow-hidden">
                <CardHeader>
                <CardTitle className="text-lg font-black font-headline flex items-center gap-2 text-primary">
                    <Activity className="w-5 h-5" />
                    Tactical Road-map
                </CardTitle>
                <CardDescription className="text-primary/50 text-xs text-gradient">AI-derived plan to bridge the divide.</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 text-xs text-muted-foreground leading-relaxed font-medium shadow-inner">
                    {analysisResult.learningPath}
                </div>
                </CardContent>
            </Card>
          </div>
        </div>
      )}

      {reviewResult && (
        <Card className="bg-white/5 border-white/10 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          <CardHeader>
            <CardTitle className="text-xl font-black font-headline text-white">Narrative Audit</CardTitle>
            <CardDescription className="text-xs font-medium">Holistic appraisal of your professional identity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">"{reviewResult.overallFeedback}"</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 ml-1">Structural Optimizations</h4>
              <div className="grid grid-cols-1 gap-4">
                {reviewResult.areasForImprovement.map((tip: string, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 hover:bg-white/5 transition-all border border-white/5 shadow-sm">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-bold text-muted-foreground/90">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {keywordSuggestions.length > 0 && (
        <Card className="bg-glass border-white/10 rounded-3xl overflow-hidden animate-in fade-in zoom-in-95">
          <CardHeader>
            <CardTitle className="text-xl font-black font-headline text-white">Semantic Reinforcement</CardTitle>
            <CardDescription className="text-xs font-medium">Inject these high-intent keywords to bypass ATS filters.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 pt-2">
              {keywordSuggestions.map((keyword, i) => (
                <Button key={i} variant="glass" size="sm" className="h-10 px-4 rounded-xl border-white/10 group overflow-hidden relative shadow-lg" onClick={() => handleAddKeywordAsSkill(keyword)}>
                  <PlusCircle className="mr-2 h-4 w-4 text-primary group-hover:scale-125 transition-transform" />
                  <span className="relative z-10 font-bold uppercase text-[10px] tracking-wider">{keyword}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );
}
