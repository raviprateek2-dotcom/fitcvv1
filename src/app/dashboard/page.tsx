'use client';

import { useCollection, useUser } from '@/firebase';
import { useMemo } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemoFirebase } from '@/firebase/provider';

type Resume = {
  id: string;
  title: string;
  updatedAt: {
    toDate: () => Date;
  };
};

const ResumeCard = ({ resume }: { resume: Resume }) => {
  const image = useMemo(() => PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)], []);
  const updatedAt = useMemo(() => {
    const date = resume.updatedAt?.toDate();
    if (!date) return 'recently';
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
                src={image.imageUrl}
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
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>Download PDF</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const resumesQuery = useMemoFirebase(
    () => (user ? collection(firestore, `users/${user.uid}/resumes`) : null),
    [firestore, user]
  );
  
  const { data: resumes, isLoading } = useCollection<Resume>(resumesQuery);

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

      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => <ResumeSkeleton key={i} />)}
        </div>
      )}

      {!isLoading && resumes && resumes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      ) : !isLoading && (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">No Resumes Yet</h2>
          <p className="text-muted-foreground mb-4">Click below to create your first professional resume.</p>
          <Button asChild>
            <Link href="/templates">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create a Resume
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
