'use client';

import { useCollection, useUser } from '@/firebase';
import { useMemo, useEffect } from 'react';
import { addDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MoreHorizontal, PlusCircle, FileText, Palette, Download, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemoFirebase } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { collection } from 'firebase/firestore';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

type Resume = {
  id: string;
  title: string;
  templateId: string;
  updatedAt: {
    toDate: () => Date;
  };
  content?: any;
};

const ResumeCard = ({ resume, onDuplicate, onDelete }: { resume: Resume; onDuplicate: (resume: Resume) => void; onDelete: (resumeId: string) => void; }) => {
  const image = useMemo(() => {
    const templateImage = PlaceHolderImages.find(p => p.id.includes(resume.templateId));
    return templateImage || PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
  }, [resume.templateId]);
  
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


  return (
    <Card className="overflow-hidden group">
      <CardHeader className="p-0">
        <Link href={`/editor/${resume.id}`}>
          <div className="aspect-[3/2] overflow-hidden">
            {image && (
              <Image
                src={image.imageUrl.replace('/400/566', '/300/200')} // Adjust image size for dashboard
                width={300}
                height={200}
                alt={image.description}
                data-ai-hint={image.imageHint}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold truncate">
          <Link href={`/editor/${resume.id}`} className="hover:underline">
            {resume.title}
          </Link>
        </CardTitle>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm text-muted-foreground">
        <span>Updated {updatedAt}</span>
        <DropdownMenu>
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
            <DropdownMenuItem>Download PDF</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(resume.id)} className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

const ResumeSkeleton = () => {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-0">
                <Skeleton className="aspect-[3/2] w-full" />
            </CardHeader>
            <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4" />
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </CardFooter>
        </Card>
    )
}

const LoadingState = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <ResumeSkeleton key={i} />)}
    </div>
);

const EmptyState = () => (
    <div className="text-center py-16 md:py-24 border-2 border-dashed rounded-lg bg-background">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-headline font-bold mb-4">Welcome to ResumeCraft AI!</h2>
        <p className="text-muted-foreground mb-8 text-lg">Let's create a resume that gets you hired. Follow these simple steps to get started.</p>
        
        <div className="grid md:grid-cols-3 gap-8 text-left mb-10">
            <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/10 text-primary rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg">1</div>
                <div>
                    <h3 className="font-semibold">Choose a Template</h3>
                    <p className="text-sm text-muted-foreground">Pick a design that matches your style and industry.</p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/10 text-primary rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg">2</div>
                <div>
                    <h3 className="font-semibold">Fill in Your Details</h3>
                    <p className="text-sm text-muted-foreground">Use our AI assistant to craft compelling content.</p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex-shrink-0 bg-primary/10 text-primary rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg">3</div>
                <div>
                    <h3 className="font-semibold">Download & Apply</h3>
                    <p className="text-sm text-muted-foreground">Export your new resume as a PDF and start applying.</p>
                </div>
            </div>
        </div>

        <Button asChild size="lg" className="group">
          <Link href="/templates">
            Start by Choosing a Template
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
);


export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

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

  const handleDuplicate = async (resumeToDuplicate: Resume) => {
    if (!user || !resumesQuery) return;
    
    const { id, ...resumeContent } = resumeToDuplicate;
    
    const newResumeData = {
      ...resumeContent,
      title: `${resumeToDuplicate.title} (Copy)`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const newDocRef = await addDoc(resumesQuery, newResumeData);
    if (newDocRef) {
      router.push(`/editor/${newDocRef.id}`);
    }
  };

  const handleDelete = (resumeId: string) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, `users/${user.uid}/resumes`, resumeId);
    deleteDocumentNonBlocking(docRef);
  };
  
  if (isUserLoading || !user) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-headline font-bold">My Resumes</h1>
                <Button asChild>
                <Link href="/templates">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Resume
                </Link>
                </Button>
            </div>
            <LoadingState />
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-headline font-bold">My Resumes</h1>
        <Button asChild>
          <Link href="/templates">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Resume
          </Link>
        </Button>
      </div>

      {(isLoading) && <LoadingState />}

      {!isLoading && resumes && resumes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} onDuplicate={handleDuplicate} onDelete={handleDelete} />
          ))}
        </div>
      ) : !isLoading && (
        <EmptyState />
      )}
    </div>
  );
}
