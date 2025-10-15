
'use client';

import { useCollection, useDoc, useFirestore, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import { ResumePreview } from '@/components/editor/ResumePreview';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send } from 'lucide-react';
import React, { useState, useMemo } from 'react';

// Reusing types from the editor
type PersonalInfo = { name: string; title: string; email: string; phone: string; location: string; website: string; };
type Experience = { id: number; company: string; role: string; date: string; description: string; };
type Education = { id: number; institution: string; degree: string; date: string; };
type Skill = { id: number; name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'; };
type Project = { id: number; name: string; description: string; link: string; };
type Styling = { bodyFontSize: number; headingFontSize: number; titleFontSize: number; accentColor: string; };
type ResumeData = { personalInfo: PersonalInfo; summary: string; experience: Experience[]; education: Education[]; skills: Skill[]; projects: Project[]; templateId?: string; styling?: Styling; };
type Feedback = { id: string; name: string; comment: string; createdAt: { toDate: () => Date } };

const SharePageSkeleton = () => (
  <div className="container mx-auto px-4 md:px-6 py-12">
    <div className="grid lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2">
        <Skeleton className="w-full aspect-[8.5/11] rounded-2xl" />
      </div>
      <div className="space-y-8">
        <Card variant="neuro">
            <CardHeader>
                <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <Skeleton className="h-12 w-full" />
            </CardContent>
        </Card>
        <Separator />
        <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  </div>
);

export default function SharePage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reference to the public resume document
  const resumeDocRef = useMemoFirebase(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, 'publicResumes', params.id);
  }, [firestore, params.id]);

  const { data: resumeData, isLoading: isResumeLoading } = useDoc<ResumeData>(resumeDocRef);

  const feedbackCollectionRef = useMemoFirebase(() => {
     if (!resumeDocRef) return null;
     return collection(firestore, resumeDocRef.path, 'feedback');
  }, [resumeDocRef]);

  const { data: feedback, isLoading: isFeedbackLoading } = useCollection<Feedback>(feedbackCollectionRef);

  const sortedFeedback = useMemo(() => {
    if (!feedback) return [];
    return feedback.sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime());
  }, [feedback]);


  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName || !feedbackComment || !feedbackCollectionRef) return;

    setIsSubmitting(true);
    addDocumentNonBlocking(feedbackCollectionRef, {
      name: feedbackName,
      comment: feedbackComment,
      createdAt: serverTimestamp(),
    }).then(() => {
        toast({ title: 'Success!', description: 'Your feedback has been submitted.' });
        setFeedbackName('');
        setFeedbackComment('');
    }).catch(() => {
        // Error is handled by the non-blocking function's internal catch block
        toast({ variant: 'destructive', title: 'Error', description: 'Could not submit feedback.' });
    }).finally(() => {
        setIsSubmitting(false);
    });
  };

  if (isResumeLoading) {
    return <SharePageSkeleton />;
  }

  if (!resumeData) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 text-center">
        <h1 className="text-3xl font-headline font-bold">Resume Not Found</h1>
        <p className="text-muted-foreground mt-4">The link may be broken, or the resume may have been deleted.</p>
      </div>
    );
  }

  return (
    <div className="bg-secondary min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <ResumePreview resumeData={resumeData} />
          </div>

          <div className="space-y-8">
            <Card variant="neuro">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="text-primary" />
                  Leave Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      value={feedbackName}
                      onChange={(e) => setFeedbackName(e.target.value)}
                      placeholder="e.g., Jane Doe"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comment">Comment</Label>
                    <Textarea
                      id="comment"
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="e.g., 'Great summary! Consider adding more metrics to your experience.'"
                      required
                      rows={4}
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting} variant="neuro">
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Separator />

            <div className="space-y-6">
              <h3 className="text-xl font-headline font-semibold">Feedback ({sortedFeedback.length})</h3>
              {isFeedbackLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
              ) : sortedFeedback.length > 0 ? (
                sortedFeedback.map((item) => (
                  <Card key={item.id} variant="neuro" className="p-4">
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.createdAt.toDate().toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.comment}</p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                  <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                      <p>No feedback yet. Be the first to leave a comment!</p>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

    