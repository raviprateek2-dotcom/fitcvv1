
'use client';

import { useCollection, useUser } from '@/firebase';
import { useMemo, useEffect, useState, useRef } from 'react';
import { addDoc, doc, serverTimestamp, collection } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, ArrowRight, Upload } from 'lucide-react';
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
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
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
    // Navigate to the editor and trigger print from there
    const printUrl = `/editor/${resume.id}?print=true`;
    window.open(printUrl, '_blank');
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden group flex flex-col h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl" variant="neuro">
        <CardHeader>
          <CardTitle className="text-lg font-semibold truncate">
            <Link href={`/editor/${resume.id}`} className="hover:underline">
              {resume.title || 'Untitled Resume'}
            </Link>
          </CardTitle>
          <CardDescription>Template: {resume.templateId}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {/* Can add a small preview or stats here in the future */}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm text-muted-foreground">
          <span>Updated {updatedAt}</span>
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/editor/${resume.id}`}>Edit</Link>
              </DropdownMenuItem>
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
            <CardHeader className="p-4">
                 <Skeleton className="h-6 w-3/4 mb-2" />
                 <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="p-4">
               
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </CardFooter>
        </Card>
    )
}

const LoadingState = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => <ResumeSkeleton key={i} />)}
    </div>
);

const EmptyState = () => (
    <Card variant="neuro" className="text-center py-16 md:py-24">
      <CardContent>
        <h2 className="text-3xl font-headline font-bold mb-4">Welcome to ResumeAI!</h2>
        <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">Let's create a resume that gets you hired. Follow these simple steps to get started.</p>
        
        <div className="grid md:grid-cols-3 gap-8 text-left mb-10 max-w-4xl mx-auto">
            <Card variant="neuro">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><div className="flex-shrink-0 bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center font-bold">1</div>Choose a Template</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Pick a design that matches your style and industry.</p>
                </CardContent>
            </Card>
            <Card variant="neuro">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><div className="flex-shrink-0 bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center font-bold">2</div>Fill in Your Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Use our AI assistant to craft compelling content.</p>
                </CardContent>
            </Card>
            <Card variant="neuro">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><div className="flex-shrink-0 bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center font-bold">3</div>Download & Apply</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Export your new resume as a PDF and start applying.</p>
                </CardContent>
            </Card>
        </div>

        <Button asChild size="lg" className="group" variant="neuro">
          <Link href="/templates">
            Start by Choosing a Template
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
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
    () => (user ? collection(firestore, `users/${user.uid}/resumes`) : null),
    [firestore, user]
  );
  
  const { data: resumes, isLoading } = useCollection<Resume>(resumesQuery);

  const handleDuplicate = (resumeToDuplicate: Resume) => {
    if (!user || !resumesQuery) return;
    
    // Omitting 'id' as it will be auto-generated by Firestore for the new document.
    const { id, ...resumeContent } = resumeToDuplicate;
    
    const newResumeData = {
      ...resumeContent,
      title: `${resumeToDuplicate.title || 'Untitled Resume'} (Copy)`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

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
  };
  
  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !resumesQuery) return;

    setIsParsing(true);
    toast({ title: 'Parsing PDF...', description: 'Our AI is reading your resume. This may take a moment.' });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);

      const result = await parseResumeFromPdf(fileBuffer);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to parse resume.');
      }
      
      const newResumeData = {
        ...result.data.resumeData,
        title: result.data.resumeData.personalInfo.name ? `${result.data.resumeData.personalInfo.name}'s Resume` : 'Imported Resume',
        templateId: 'modern', // Default template
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

    } catch (error: any) {
      console.error('Error parsing or saving PDF resume:', error);
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
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-headline font-bold">My Resumes</h1>
                <div className="flex gap-2">
                    <Button variant="outline" disabled><Upload className="mr-2 h-4 w-4" /> Import from PDF</Button>
                    <Button asChild variant="neuro">
                    <Link href="/templates">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Resume
                    </Link>
                    </Button>
                </div>
            </div>
            <LoadingState />
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-headline font-bold">My Resumes</h1>
        <div className="flex items-center gap-2">
           <input
              type="file"
              ref={fileInputRef}
              onChange={handlePdfUpload}
              accept="application/pdf"
              className="hidden"
              disabled={isParsing}
            />
           <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isParsing}>
              <Upload className="mr-2 h-4 w-4" /> 
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
        <EmptyState />
      )}
    </div>
  );
}
