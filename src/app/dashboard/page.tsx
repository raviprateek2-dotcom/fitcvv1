
'use client';

import { useCollection, useUser } from '@/firebase';
import { useEffect, useState, useRef, useMemo } from 'react';
import { serverTimestamp, collection, doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, ArrowRight, Upload, FileText, Loader2, CheckCircle2, Circle, Sparkles, TrendingUp, Zap, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemoFirebase } from '@/firebase/provider';
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
import { cn } from '@/lib/utils';
import { GoalSetter } from '@/components/dashboard/GoalSetter';


type Resume = {
  id: string;
  title: string;
  templateId: string;
  updatedAt: {
    toDate: () => Date;
  };
  personalInfo?: any;
  summary?: string;
  experience?: any[];
  education?: any[];
  skills?: any[];
  projects?: any[];
  jobDescription?: string;
  coverLetter?: string;
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const calculateResumeStrength = (resume: Resume) => {
    let score = 0;
    if (resume.personalInfo?.name && resume.personalInfo?.name !== 'Your Name') score += 10;
    if (resume.summary && resume.summary.length > 50) score += 15;
    if (resume.experience && resume.experience.length > 0) score += 25;
    if (resume.education && resume.education.length > 0) score += 15;
    if (resume.skills && resume.skills.length > 0) score += 15;
    if (resume.projects && resume.projects.length > 0) score += 10;
    if (resume.jobDescription && resume.jobDescription.length > 100) score += 10;
    return Math.min(score, 100);
}

const ResumeCard = ({ resume, onDuplicate, onDelete }: { resume: Resume; onDuplicate: (resume: Resume) => void; onDelete: (resumeId: string) => void; }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const strength = useMemo(() => calculateResumeStrength(resume), [resume]);
  
  const updatedAt = useMemo(() => {
    if (!resume.updatedAt) return 'never';
    const date = resume.updatedAt.toDate();
    const diff = new Date().getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 1) return 'today';
    if (days < 2) return 'yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  }, [resume.updatedAt]);

  const handleDownloadPdf = () => {
    const printUrl = `/editor/${resume.id}?print=true`;
    window.open(printUrl, '_blank');
  };
  
  const templateImage = PlaceHolderImages.find(img => img.id === `template-${resume.templateId}`);

  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden group flex flex-col h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl relative" variant="neuro">
        <div className="absolute top-2 left-2 z-10">
            <Badge variant={strength === 100 ? "default" : "secondary"} className="bg-background/80 backdrop-blur-sm shadow-sm border-primary/20">
                <Zap className={cn("w-3 h-3 mr-1", strength > 70 ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground")} />
                {strength}% Strength
            </Badge>
        </div>
        
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
          <CardDescription>Updated {updatedAt}</CardDescription>
        </CardHeader>
        
        <CardFooter className="p-4 pt-0 mt-auto flex justify-between items-center text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/editor/${resume.id}`}>Edit Resume</Link>
          </Button>
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/90 focus:text-destructive-foreground">Delete</DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your resume.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsMenuOpen(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => { onDelete(resume.id); setIsMenuOpen(false); }} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const SuccessPath = ({ resumes }: { resumes: Resume[] }) => {
    const steps = [
        { label: 'Create your first resume', done: resumes.length > 0, link: '/templates' },
        { label: 'Optimize for a job description', done: resumes.some(r => (r.jobDescription?.length || 0) > 100), link: '#' },
        { label: 'Generate an AI cover letter', done: resumes.some(r => (r.coverLetter?.length || 0) > 200), link: '#' },
        { label: 'Practice with the AI Interviewer', done: false, link: '/interview' },
    ];

    const completedSteps = steps.filter(s => s.done).length;
    const progress = (completedSteps / steps.length) * 100;

    return (
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <Card variant="neuro" className="lg:col-span-2 overflow-hidden border-primary/10">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <TrendingUp className="w-32 h-32 text-primary" />
                </div>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                Your Success Path
                            </CardTitle>
                            <CardDescription>Complete these steps to maximize your hiring potential.</CardDescription>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-2xl font-bold text-primary">{Math.round(progress)}%</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest">Progress</p>
                        </div>
                    </div>
                    <Progress value={progress} className="h-2 mt-4 bg-secondary" />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {steps.map((step, i) => (
                            <div key={i} className={cn(
                                "flex items-center gap-3 p-3 rounded-xl transition-all border",
                                step.done ? 'bg-accent/5 border-accent/20' : 'bg-secondary/30 border-transparent hover:border-primary/20'
                            )}>
                                {step.done ? (
                                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                                ) : (
                                    <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                                )}
                                <span className={`text-sm ${step.done ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            
            <Card variant="neuro" className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 relative overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        Tip of the Day
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        "Recruiters spend an average of 7 seconds scanning a resume. Use <strong>bold keywords</strong> and <strong>quantifiable results</strong> (like 'increased sales by 20%') to make every second count."
                    </p>
                </CardContent>
                <CardFooter>
                    <Button variant="link" className="p-0 text-primary" asChild>
                        <Link href="/blog">Read more tips <ArrowRight className="ml-1 w-4 h-4" /></Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

const ResumeSkeleton = () => {
    return (
        <Card className="overflow-hidden" variant="neuro">
            <div className="p-4">
              <Skeleton className="h-60 w-full mb-4" />
            </div>
            <CardHeader className="pt-0">
                 <Skeleton className="h-6 w-3/4 mb-2" />
                 <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </CardFooter>
        </Card>
    )
}

const LoadingState = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <ResumeSkeleton />
      <ResumeSkeleton />
      <ResumeSkeleton />
      <ResumeSkeleton />
    </div>
);

const EmptyState = ({ onPdfUploadClick }: { onPdfUploadClick: () => void; }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Card variant="neuro" className="text-center py-16 md:py-24 bg-gradient-to-br from-background to-secondary/50">
        <CardContent className="flex flex-col items-center">
          <motion.div 
            className="p-4 bg-primary/10 rounded-full mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <FileText className="w-12 h-12 text-primary" />
          </motion.div>
          <motion.h2 
            className="text-3xl font-headline font-bold mb-4"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, ease: 'easeOut' }}
          >
            Design Your Future with FitCV
          </motion.h2>
          <motion.p 
            className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, ease: 'easeOut' }}
          >
            Welcome to FitCV! Start by choosing a professional template or importing an existing resume to see the power of AI guidance.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, ease: 'easeOut' }}
          >
             <Button size="lg" className="group" variant="outline" onClick={onPdfUploadClick}>
              <Upload className="mr-2 h-5 w-5" />
              Import from PDF
            </Button>
            <Button asChild size="lg" className="group" variant="neuro">
              <Link href="/templates">
                Explore Templates
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
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

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const resumesQuery = useMemoFirebase(
    () => (user && firestore ? collection(firestore, `users/${user.uid}/resumes`) : null),
    [firestore, user]
  );
  
  const { data: resumes, isLoading } = useCollection<Resume>(resumesQuery);

  const handleDuplicate = (resumeToDuplicate: Resume) => {
    if (!user || !resumesQuery) return;
    
    const { id, ...resumeContent } = resumeToDuplicate;
    
    const newResumeData = {
      ...resumeContent,
      title: `${resumeToDuplicate.title || 'Untitled Resume'} (Copy)`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    toast({
      title: 'Duplicating Resume...',
      description: `Copying "${resumeToDuplicate.title || 'Untitled Resume'}".`,
    });

    addDocumentNonBlocking(resumesQuery, newResumeData)
      .then(newDocRef => {
        if (newDocRef) {
          router.push(`/editor/${newDocRef.id}`);
        }
      });
  };

  const handleDelete = (resumeId: string) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, `users/${user.uid}/resumes`, resumeId);
    deleteDocumentNonBlocking(docRef);
    toast({
      title: 'Resume Deleted',
      description: 'Your resume has been successfully removed.',
    });
  };
  
  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !resumesQuery) return;
  
    setIsParsing(true);
    toast({ title: 'Parsing PDF...', description: 'Our AI is reading your resume. This may take a moment.' });
  
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const base64String = reader.result as string;
  
          const result = await parseResumeFromPdf(base64String);
          
          if (!result.success || !result.data) {
            throw new Error(result.error || 'Failed to parse resume.');
          }
          
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
          
          addDocumentNonBlocking(resumesQuery, newResumeData)
            .then(newDocRef => {
              if (newDocRef) {
                toast({ title: 'Success!', description: 'Your resume has been imported.' });
                router.push(`/editor/${newDocRef.id}`);
              }
            });
  
        } catch (innerError: any) {
            toast({
              variant: 'destructive',
              title: 'Import Failed',
              description: innerError.message || 'Could not import your resume from the PDF.',
            });
        } finally {
            setIsParsing(false);
            if(fileInputRef.current) fileInputRef.current.value = '';
        }
      };
    } catch (error: any) {
        setIsParsing(false);
        toast({
            variant: 'destructive',
            title: 'Import Failed',
            description: error.message || 'An unexpected error occurred.',
        });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (isUserLoading || !user) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <Skeleton className="h-9 w-48" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-36" />
                    <Skeleton className="h-10 w-40" />
                </div>
            </div>
            <LoadingState />
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
       <input
          type="file"
          ref={fileInputRef}
          onChange={handlePdfUpload}
          accept="application/pdf"
          className="hidden"
          disabled={isParsing}
        />
      
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-headline font-bold">Welcome back, {user.displayName?.split(' ')[0] || 'User'}!</h1>
            <p className="text-muted-foreground">The smartest way to build your career is right here.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isParsing}>
              {isParsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              {isParsing ? 'Importing...' : 'Import PDF'}
            </Button>
          <Button asChild variant="neuro">
            <Link href="/templates">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Resume
            </Link>
          </Button>
        </div>
      </div>

      {!isLoading && resumes && resumes.length > 0 && (
        <>
            <SuccessPath resumes={resumes} />
            <GoalSetter />
        </>
      )}

      {(isLoading) && <LoadingState />}

      {!isLoading && resumes && resumes.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} onDuplicate={handleDuplicate} onDelete={handleDelete} />
          ))}
        </motion.div>
      ) : !isLoading && (
        <EmptyState onPdfUploadClick={() => fileInputRef.current?.click()} />
      )}
    </div>
  );
}
