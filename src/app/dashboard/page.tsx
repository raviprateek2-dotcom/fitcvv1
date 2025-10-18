
'use client';

import { useCollection, useUser } from '@/firebase';
import { useEffect, useState, useRef, useMemo } from 'react';
import { addDoc, doc, serverTimestamp, collection } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, ArrowRight, Upload, FileText, Loader2 } from 'lucide-react';
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


type Resume = {
  id: string;
  title: string;
  templateId: string;
  updatedAt: {
    toDate: () => Date;
  };
  content?: any;
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};


const ResumeCard = ({ resume, onDuplicate, onDelete }: { resume: Resume; onDuplicate: (resume: Resume) => void; onDelete: (resumeId: string) => void; }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
      <Card className="overflow-hidden group flex flex-col h-full transition-all duration-300 hover:shadow-2xl border-transparent hover:border-primary/20" variant="neuro">
        <Link href={`/editor/${resume.id}`} className="block overflow-hidden">
          <motion.div
            className="h-60 bg-secondary rounded-t-lg flex items-center justify-center relative"
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
                    className="w-auto h-full object-contain transition-transform duration-500 ease-in-out group-hover:scale-105"
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
          <Button variant="ghost" asChild>
            <Link href={`/editor/${resume.id}`}>Edit</Link>
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Create Your First Resume
          </motion.h2>
          <motion.p 
            className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Welcome! Start by choosing a professional template or importing an existing resume.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
             <Button size="lg" className="group" variant="outline" onClick={onPdfUploadClick}>
              <Upload className="mr-2 h-5 w-5" />
              Import from PDF
            </Button>
            <Button asChild size="lg" className="group" variant="neuro">
              <Link href="/templates">
                Choose a Template
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
        const base64String = reader.result as string;

        const result = await parseResumeFromPdf(base64String);
        
        if (!result.success || !result.data) {
          throw new Error(result.error || 'Failed to parse resume.');
        }
        
        const newResumeData = {
          title: result.data.resumeData.personalInfo.name ? `${result.data.resumeData.personalInfo.name}'s Resume` : 'Imported Resume',
          templateId: 'modern',
          content: result.data.resumeData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        
        addDocumentNonBlocking(resumesQuery, newResumeData)
          .then(newDocRef => {
              toast({ title: 'Success!', description: 'Your resume has been imported.' });
              if (newDocRef) {
                router.push(`/editor/${newDocRef.id}`);
              }
          });
      };
      reader.onerror = (error) => {
        throw new Error('Failed to read file.');
      };

    } catch (error: any) {
      console.error('Error parsing or saving PDF resume:', error);
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description: error.message || 'Could not import your resume from the PDF.',
      });
    } finally {
      setIsParsing(false);
      if(fileInputRef.current) fileInputRef.current.value = '';
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
        <h1 className="text-3xl font-headline font-bold">My Resumes</h1>
        <div className="flex items-center gap-2">
           <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isParsing}>
              {isParsing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {isParsing ? 'Importing...' : 'Import from PDF'}
            </Button>
          <Button asChild variant="neuro">
            <Link href="/templates">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Resume
            </Link>
          </Button>
        </div>
      </div>

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

    