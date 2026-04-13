
'use client';

import { useCollection, useUser, useMemoFirebase, useFirestore } from '@/firebase';
import type { PersonalInfo, Experience, Education, Skill, Project } from '@/components/editor/types';
import { useEffect, useState, useRef, useMemo } from 'react';
import { serverTimestamp, collection, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, ArrowRight, Upload, FileText, Loader2, CheckCircle2, Circle, Sparkles, TrendingUp, Zap, Lightbulb, Ear, BarChart3, Target, Share2, Copy, Check, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { deleteDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { parseResumeFromPdf } from '@/app/actions/ai-resume-parser';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn, isPlaceholderCoUrl } from '@/lib/utils';
import { GoalSetter } from '@/components/dashboard/GoalSetter';
import { aiNarrate } from '@/app/actions/ai-narrator';
import { ApplicationTracker } from '@/components/dashboard/ApplicationTracker';
import { ChartTooltip, ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';
import { trackEvent } from '@/lib/analytics-events';

type Resume = {
    id: string;
    title: string;
    templateId: string;
    shareId?: string;
    updatedAt: { toDate: () => Date } | null;
    matchScore?: number;
    auditSummary?: string;
    skillGaps?: string[];
    learningPath?: string;
    personalInfo?: PersonalInfo;
    summary?: string;
    experience?: Experience[];
    education?: Education[];
    skills?: Skill[];
    projects?: Project[];
    jobDescription?: string;
    coverLetter?: string;
};

type Application = {
    id: string;
    status: string;
    dateApplied: { toDate: () => Date } | null;
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const calculateResumeStrength = (resume: Resume) => {
    let score = 0;
    if (resume.personalInfo?.name && resume.personalInfo?.name !== 'Your Name') score += 10;
    if (resume.summary && resume.summary.length > 50) score += 15;
    if (resume.experience && resume.experience.length > 0) score += 20;
    if (resume.education && resume.education.length > 0) score += 10;
    if (resume.skills && resume.skills.length > 0) score += 10;
    if (resume.projects && resume.projects.length > 0) score += 10;
    if (resume.jobDescription && resume.jobDescription.length > 100) score += 10;
    if (resume.matchScore !== undefined) score += 15;
    return Math.min(score, 100);
}

const ResumeCard = ({ resume, onDuplicate, onDelete }: { resume: Resume; onDuplicate: (resume: Resume) => void; onDelete: (resumeId: string) => void; }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [updatedAtText, setUpdatedAtText] = useState('...');
    const [isCopied, setIsCopied] = useState(false);
    const strength = useMemo(() => calculateResumeStrength(resume), [resume]);

    useEffect(() => {
        if (!resume.updatedAt) {
            setUpdatedAtText('just now');
            return;
        }
        const date = resume.updatedAt.toDate();
        const diff = new Date().getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days < 1) setUpdatedAtText('today');
        else if (days < 2) setUpdatedAtText('yesterday');
        else if (days < 7) setUpdatedAtText(`${days} days ago`);
        else setUpdatedAtText(date.toLocaleDateString());
    }, [resume.updatedAt]);

    const handleDownloadPdf = () => {
        const printUrl = `/editor/${resume.id}?print=true`;
        window.open(printUrl, '_blank');
    };

    const handleCopyShareLink = () => {
        if (!resume.shareId) return;
        const shareUrl = `${window.location.origin}/share/${resume.shareId}`;
        navigator.clipboard.writeText(shareUrl);
        trackEvent('resume_share_copy', { source: 'dashboard_card' });
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }

    const handleShareWhatsApp = () => {
        if (!resume.shareId) return;
        const shareUrl = `${window.location.origin}/share/${resume.shareId}`;
        const waUrl = `https://wa.me/?text=${encodeURIComponent(`Check out my resume: ${shareUrl}`)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        trackEvent('resume_share_whatsapp', { source: 'dashboard_card' });
    };

    const templateImage = PlaceHolderImages.find(img => img.id === `template-${resume.templateId}`);

    return (
        <motion.div variants={itemVariants}>
            <div className="premium-card flex flex-col h-full relative group">
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/60 backdrop-blur-md border border-white/20 shadow-sm text-[10px] font-bold uppercase tracking-tight">
                        <Zap className={cn("w-3 h-3", strength > 70 ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground")} />
                        {strength}% Health
                    </div>
                    {resume.matchScore !== undefined && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20 shadow-sm text-[10px] font-bold uppercase tracking-tight text-primary">
                            <Target className="w-3 h-3" />
                            {resume.matchScore}% Match
                        </div>
                    )}
                </div>
                    {resume.shareId && (
                        <Badge variant="outline" className="bg-blue-500/10 backdrop-blur-sm shadow-sm border-blue-500/20 text-blue-600 font-bold">
                            <Share2 className="w-3 h-3 mr-1" />
                            Shared
                        </Badge>
                    )}

                <Link href={`/editor/${resume.id}`} className="block overflow-hidden">
                    <motion.div
                        className="h-60 bg-secondary rounded-t-lg flex items-center justify-center relative border-b"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {templateImage ? (
                            <Image
                                src={templateImage.imageUrl}
                                alt={resume.title || 'Resume preview'}
                                width={400}
                                height={566}
                                sizes="(max-width: 768px) 100vw, 400px"
                                unoptimized={isPlaceholderCoUrl(templateImage.imageUrl)}
                                className="w-auto h-full object-contain transition-transform duration-500 ease-in-out group-hover:scale-105 p-4"
                            />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                <FileText className="w-16 h-16 text-muted-foreground" />
                            </div>
                        )}
                    </motion.div>
                </Link>
                <CardHeader className="pt-4">
                    <CardTitle className="text-lg font-semibold truncate">
                        <Link href={`/editor/${resume.id}`} className="hover:underline">
                            {resume.title || 'Untitled Resume'}
                        </Link>
                    </CardTitle>
                    <CardDescription>Updated {updatedAtText}</CardDescription>
                </CardHeader>

                <CardFooter className="p-4 pt-0 mt-auto flex justify-between items-center text-sm text-muted-foreground">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/editor/${resume.id}`}>Edit Resume</Link>
                    </Button>
                    <div className="flex items-center gap-1">
                        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">More options</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onDuplicate(resume)}>Duplicate</DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDownloadPdf}>Download PDF</DropdownMenuItem>
                                {resume.shareId && (
                                    <DropdownMenuItem onClick={handleCopyShareLink}>
                                        {isCopied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                                        {isCopied ? 'Copied Link' : 'Copy Share Link'}
                                    </DropdownMenuItem>
                                )}
                                {resume.shareId && (
                                    <DropdownMenuItem onClick={handleShareWhatsApp}>
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Share on WhatsApp
                                    </DropdownMenuItem>
                                )}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e: Event) => e.preventDefault()} className="text-destructive focus:bg-destructive/90 focus:text-destructive-foreground">Delete</DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your resume.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => { onDelete(resume.id); setIsMenuOpen(false); }} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardFooter>
            </div>
        </motion.div>
    );
};

const SuccessPath = ({ resumes }: { resumes: Resume[] }) => {
    const { toast } = useToast();
    const steps = [
        { label: 'Create your first resume', done: resumes.length > 0 },
        { label: 'Run Tailor-to-JD analysis', done: resumes.some(r => r.matchScore !== undefined) },
        { label: 'Generate an AI cover letter', done: resumes.some(r => (r.coverLetter?.trim().length || 0) > 200) },
        { label: 'Identify and bridge skill gaps', done: resumes.some(r => (r.skillGaps?.length || 0) > 0) },
    ];

    const completedSteps = steps.filter(s => s.done).length;
    const progress = (completedSteps / steps.length) * 100;

    const [isNarratingTip, setIsNarratingTip] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const strategistTips = useMemo(() => [
        "Hiring managers look for growth. Use our Skill Gap analyzer to identify exactly what you need to learn to land that high-stakes senior role.",
        "Quality beats quantity. Tailor one resume to a strong JD match before sending broad applications.",
        "LinkedIn is your social proof. Use our Optimizer to ensure your profile headline stops the scroll for recruiters.",
        "Confidence comes from preparation. Practice the predicted interview questions to reduce anxiety and sound like an expert."
    ], []);

    const [tipText, setTipText] = useState(strategistTips[0]);

    useEffect(() => {
        setTipText(strategistTips[Math.floor(Math.random() * strategistTips.length)]);
    }, [strategistTips]);

    const handleNarrateTip = async () => {
        setIsNarratingTip(true);
        try {
            const res = await aiNarrate(tipText);
            if (res.success && res.data && audioRef.current) {
                audioRef.current.src = res.data.audioDataUri;
                audioRef.current.play();
            } else {
                throw new Error(res.error || "Failed to generate narration.");
            }
        } catch (e: unknown) {
            toast({
                variant: 'destructive',
                title: 'Narration Failed',
                description: e instanceof Error ? e.message : 'Could not narrate the strategist tip.'
            });
        } finally {
            setIsNarratingTip(false);
        }
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="premium-card lg:col-span-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                    <TrendingUp className="w-48 h-48 text-primary" />
                </div>
                <div className="flex flex-col space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold font-headline flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-primary" />
                                <span className="text-gradient">Career Momentum</span>
                            </h3>
                            <p className="text-muted-foreground text-sm">Follow the data-driven path to your next offer.</p>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-4xl font-extrabold text-primary drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">{Math.round(progress)}%</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Progress</p>
                        </div>
                    </div>
                    <Progress value={progress} className="h-2.5 bg-primary/10" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {steps.map((step, i) => (
                            <div key={i} className={cn(
                                "flex items-center gap-3 p-4 rounded-2xl transition-all border",
                                step.done ? 'bg-primary/5 border-primary/20 opacity-60' : 'bg-background/40 border-white/10 hover:border-primary/30 shadow-sm'
                            )}>
                                {step.done ? (
                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                                )}
                                <span className={cn("text-sm font-medium", step.done && "line-through text-muted-foreground")}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="premium-card bg-gradient-to-br from-primary/10 via-background to-accent/5 border-primary/20 relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-xl">
                                <Lightbulb className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold font-headline">Strategist Tip</h3>
                        </div>
                        <Button size="icon" variant="glass" className="h-9 w-9 rounded-full shadow-lg" onClick={handleNarrateTip} disabled={isNarratingTip}>
                            {isNarratingTip ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ear className="h-4 w-4" />}
                        </Button>
                    </div>
                    <p className="text-base leading-relaxed text-muted-foreground/90 italic font-medium">
                        "{tipText}"
                    </p>
                </div>
                <div className="pt-6 mt-6 border-t border-white/10">
                    <Button variant="link" className="p-0 text-primary h-auto font-bold uppercase tracking-widest text-[10px]" asChild>
                        <Link href="/blog">Expert Articles <ArrowRight className="ml-1 w-3 h-3" /></Link>
                    </Button>
                </div>
                <audio ref={audioRef} className="hidden" />
            </div>
        </div>
    );
};

const HiringInsights = ({ applications }: { applications: Application[] }) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    const chartData = useMemo(() => {
        if (!applications) return [];

        const counts: Record<string, number> = {
            applied: 0,
            'phone-screen': 0,
            technical: 0,
            final: 0,
            offer: 0,
            rejected: 0,
            ghosted: 0,
        };
        applications.forEach(app => {
            if (counts[app.status] !== undefined) counts[app.status]++;
        });

        return [
            { name: 'Active', value: counts.applied + counts['phone-screen'] + counts.technical + counts.final, fill: 'var(--color-Active)' },
            { name: 'Offers', value: counts.offer, fill: 'var(--color-Offers)' },
            { name: 'Closed', value: counts.rejected + counts.ghosted, fill: 'var(--color-Closed)' },
        ].filter(d => d.value > 0);
    }, [applications]);

    const chartConfig = {
        Active: { label: 'Active', color: 'hsl(var(--primary))' },
        Offers: { label: 'Offers', color: 'hsl(263.4 70% 50.4%)' },
        Closed: { label: 'Closed', color: 'hsl(var(--muted-foreground))' },
    };

    if (!applications || applications.length === 0 || !isMounted) return null;

    return (
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="premium-card lg:col-span-1 flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                    <div className="bg-primary/10 p-2 rounded-xl">
                        <BarChart3 className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold font-headline">Pipeline Analysis</h3>
                </div>
                <div className="h-56">
                    <ChartContainer config={chartConfig}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} className="drop-shadow-lg" />
                                ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        </PieChart>
                    </ChartContainer>
                </div>
                <div className="flex flex-wrap gap-4 mt-auto pt-4">
                    {chartData.map((entry, i) => (
                        <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: chartConfig[entry.name as keyof typeof chartConfig].color }} />
                            <span>{entry.name}: {entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="premium-card lg:col-span-2 relative overflow-hidden group">
                <div className="absolute -bottom-10 -right-10 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                    <Target className="w-64 h-64 text-primary" />
                </div>
                <div className="flex flex-col h-full space-y-8">
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold font-headline">Strategic Velocity</h3>
                        <p className="text-muted-foreground text-sm">Your application rhythm and market traction.</p>
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="space-y-1">
                             <p className="text-6xl font-black text-primary drop-shadow-[0_0_20px_rgba(139,92,246,0.2)]">{applications.length}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Strategic High-Value Attempts</p>
                        </div>
                        <div className="pb-2 text-right">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-3 border border-primary/20">
                                <Zap className="w-3 h-3 animate-pulse" /> Momentum: High
                            </div>
                            <p className="text-[10px] text-muted-foreground italic leading-tight max-w-[140px]">Multiple offers often require consistent, data-driven activity.</p>
                        </div>
                    </div>
                    <div className="mt-auto pt-6 border-t border-white/10">
                        <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            Strategist Tip: Quality audits of your reach-out sequence are 10x more effective than volume.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ResumeSkeleton = () => (
    <Card className="overflow-hidden" variant="neuro">
        <div className="p-4"><Skeleton className="h-60 w-full mb-4" /></div>
        <CardHeader className="pt-0"><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2" /></CardHeader>
        <CardFooter className="p-4 pt-0 flex justify-between items-center"><Skeleton className="h-9 w-20" /><Skeleton className="h-8 w-8 rounded-full" /></CardFooter>
    </Card>
);

const LoadingState = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <ResumeSkeleton /><ResumeSkeleton /><ResumeSkeleton /><ResumeSkeleton />
    </div>
);

const EmptyState = ({ onPdfUploadClick }: { onPdfUploadClick: () => void; }) => (
    <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
        <Card variant="neuro" className="text-center py-16 md:py-24 bg-gradient-to-br from-background to-secondary/50">
            <CardContent className="flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-6"><FileText className="w-12 h-12 text-primary" /></div>
                <h2 className="text-3xl font-headline font-bold mb-4">Design Your Future with FitCV</h2>
                <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">Welcome to FitCV! Start by choosing a professional template or importing an existing resume to see the power of AI guidance.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" variant="outline" onClick={onPdfUploadClick}><Upload className="mr-2 h-5 w-5" /> Import from PDF</Button>
                    <Button asChild size="lg" variant="neuro"><Link href="/templates">Explore Templates <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

export default function DashboardPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isParsing, setIsParsing] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const [greeting, setGreeting] = useState('Strategic Talent');

    useEffect(() => {
        setIsHydrated(true);
        if (!isUserLoading && !user) {
            router.push('/login');
        }
        if (user?.displayName) {
            setGreeting(user.displayName.trim() ? user.displayName.split(' ')[0] : 'Strategic Talent');
        }
    }, [isUserLoading, user, router]);

    const resumesQuery = useMemoFirebase(
        () => (user && firestore ? collection(firestore, `users/${user.uid}/resumes`) : null),
        [firestore, user]
    );

    const applicationsQuery = useMemoFirebase(
        () => (user && firestore ? collection(firestore, `users/${user.uid}/applications`) : null),
        [firestore, user]
    );

    const { data: resumes, isLoading: isResumesLoading } = useCollection<Resume>(resumesQuery);
    const { data: applications, isLoading: isAppsLoading } = useCollection<Application>(applicationsQuery);

    const handleDuplicate = (resumeToDuplicate: Resume) => {
        if (!user || !resumesQuery) return;
        const { id, ...resumeContent } = resumeToDuplicate;
        const newResumeData = {
            ...resumeContent,
            title: `${resumeToDuplicate.title || 'Untitled Resume'} (Copy)`,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };
        addDocumentNonBlocking(resumesQuery, newResumeData).then(newDocRef => {
            if (newDocRef) router.push(`/editor/${newDocRef.id}`);
        });
    };

    const handleDelete = (resumeId: string) => {
        if (!user || !firestore) return;
        const docRef = doc(firestore, `users/${user.uid}/resumes`, resumeId);
        deleteDocumentNonBlocking(docRef);
    };

    const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user || !resumesQuery) return;
        setIsParsing(true);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            try {
                const result = await parseResumeFromPdf(reader.result as string);
                if (!result.success || !result.data) throw new Error(result.error || 'Failed to parse resume.');
                const newResumeData = {
                    title: result.data.resumeData.personalInfo.name ? `${result.data.resumeData.personalInfo.name}'s Resume` : 'Imported Resume',
                    templateId: 'modern',
                    ...result.data.resumeData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    jobDescription: '',
                    coverLetter: '',
                    companyInfo: { name: '', jobTitle: '' },
                };
                addDocumentNonBlocking(resumesQuery, newResumeData).then(newDocRef => {
                    if (newDocRef) router.push(`/editor/${newDocRef.id}`);
                });
            } catch (innerError: unknown) {
                toast({ variant: 'destructive', title: 'Import Failed', description: innerError instanceof Error ? innerError.message : 'Unknown error' });
            } finally {
                setIsParsing(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
    };

    if (!isHydrated || isUserLoading || !user) {
        return (
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <Skeleton className="h-9 w-48" />
                    <div className="flex items-center gap-2"><Skeleton className="h-10 w-36" /><Skeleton className="h-10 w-40" /></div>
                </div>
                <LoadingState />
            </div>
        );
    }

    const isLoading = isResumesLoading || isAppsLoading;

    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            <input type="file" ref={fileInputRef} onChange={handlePdfUpload} accept="application/pdf" className="hidden" disabled={isParsing} />

            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Welcome back, {greeting}!</h1>
                    <p className="text-muted-foreground">Your high-performance career command center.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isParsing}>
                        {isParsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        {isParsing ? 'Importing...' : 'Import PDF'}
                    </Button>
                    <Button asChild variant="neuro"><Link href="/templates"><PlusCircle className="mr-2 h-4 w-4" /> New Resume</Link></Button>
                </div>
            </div>

            {!isLoading && resumes && resumes.length > 0 && (
                <div className="space-y-12">
                    <SuccessPath resumes={resumes} />
                    <HiringInsights applications={applications || []} />
                    <GoalSetter />
                    <ApplicationTracker resumes={resumes as Resume[]} />
                </div>
            )}

            {isLoading && <LoadingState />}

            {!isLoading && resumes && resumes.length > 0 ? (
                <div className="mt-12">
                    <h2 className="text-2xl font-headline font-bold mb-6">Your Resumes</h2>
                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                        {resumes.map((resume) => (
                            <ResumeCard key={resume.id} resume={resume} onDuplicate={handleDuplicate} onDelete={handleDelete} />
                        ))}
                    </motion.div>
                </div>
            ) : !isLoading && (
                <EmptyState onPdfUploadClick={() => fileInputRef.current?.click()} />
            )}
        </div>
    );
}
