'use client';

import { useState } from 'react';
import { useCollection, useUser, useFirestore, addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Briefcase, Building2, ExternalLink, Loader2, Mail, MoreHorizontal, Plus, Trash2, Copy, CheckCircle2, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { generateFollowUpEmail } from '@/app/actions/ai-followup';
import { ScrollArea } from '../ui/scroll-area';

type Application = {
    id: string;
    companyName: string;
    jobTitle: string;
    status: 'applied' | 'phone-screen' | 'technical' | 'final' | 'offer' | 'rejected' | 'ghosted';
    dateApplied: any;
    jobLink?: string;
    resumeId?: string;
    notes?: string;
};

type Resume = {
    id: string;
    title: string;
    personalInfo: any;
    summary: string;
    experience: any[];
    education: any[];
};

const statusColors: Record<Application['status'], string> = {
    applied: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'phone-screen': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    technical: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    final: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    offer: 'bg-green-500/10 text-green-500 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
    ghosted: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
};

const statusLabels: Record<Application['status'], string> = {
    applied: 'Applied',
    'phone-screen': 'Phone Screen',
    technical: 'Technical Interview',
    final: 'Final Round',
    offer: 'Offer Received',
    rejected: 'Rejected',
    ghosted: 'No Response',
};

export function ApplicationTracker({ resumes }: { resumes: Resume[] }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeneratingFollowUp, setIsGeneratingFollowUp] = useState(false);
    const [followUpEmail, setFollowUpEmail] = useState<string | null>(null);
    const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const [newApp, setNewApp] = useState({
        companyName: '',
        jobTitle: '',
        status: 'applied' as Application['status'],
        jobLink: '',
        resumeId: '',
    });

    const appsQuery = useMemoFirebase(
        () => (user && firestore ? collection(firestore, `users/${user.uid}/applications`) : null),
        [firestore, user]
    );

    const { data: applications, isLoading } = useCollection<Application>(appsQuery);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !appsQuery) return;

        setIsSubmitting(true);
        try {
            await addDocumentNonBlocking(appsQuery, {
                ...newApp,
                dateApplied: serverTimestamp(),
            });
            setIsAddOpen(false);
            setNewApp({ companyName: '', jobTitle: '', status: 'applied', jobLink: '', resumeId: '' });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save application.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id: string) => {
        if (!user || !firestore) return;
        const docRef = doc(firestore, `users/${user.uid}/applications`, id);
        deleteDocumentNonBlocking(docRef);
    };

    const handleStatusChange = (id: string, status: Application['status']) => {
        if (!user || !firestore) return;
        const docRef = doc(firestore, `users/${user.uid}/applications`, id);
        updateDocumentNonBlocking(docRef, { status });
    };

    const handleDraftFollowUp = async (app: Application) => {
        const resume = resumes.find(r => r.id === app.resumeId);
        if (!resume) {
            toast({ variant: 'destructive', title: 'Resume Required', description: 'Please link a resume to this application to draft a follow-up.' });
            return;
        }

        setIsGeneratingFollowUp(true);
        setFollowUpEmail(null);
        setIsFollowUpOpen(true);

        try {
            const result = await generateFollowUpEmail({
                jobTitle: app.jobTitle,
                companyName: app.companyName,
                interviewType: statusLabels[app.status],
                resumeContent: JSON.stringify(resume)
            });

            if (result.success && result.data) {
                setFollowUpEmail(result.data.emailContent);
            } else {
                toast({ variant: 'destructive', title: 'Drafting Failed', description: result.error });
                setIsFollowUpOpen(false);
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
            setIsFollowUpOpen(false);
        } finally {
            setIsGeneratingFollowUp(false);
        }
    };

    const copyToClipboard = () => {
        if (!followUpEmail) return;
        navigator.clipboard.writeText(followUpEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card variant="neuro" className="mb-12">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        Application Tracker
                    </CardTitle>
                    <CardDescription>Keep track of your job search progress.</CardDescription>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button variant="neuro" size="sm">
                            <Plus className="w-4 h-4 mr-2" /> Add Job
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleAdd}>
                            <DialogHeader>
                                <DialogTitle>Track New Application</DialogTitle>
                                <DialogDescription>Enter the details of the position you've applied for.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="company">Company</Label>
                                        <Input id="company" value={newApp.companyName} onChange={e => setNewApp({ ...newApp, companyName: e.target.value })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Job Title</Label>
                                        <Input id="title" value={newApp.jobTitle} onChange={e => setNewApp({ ...newApp, jobTitle: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="resume">Resume Used</Label>
                                    <Select value={newApp.resumeId} onValueChange={v => setNewApp({ ...newApp, resumeId: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a resume" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {resumes.map(r => (
                                                <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="link">Job Posting Link</Label>
                                    <Input id="link" type="url" placeholder="https://..." value={newApp.jobLink} onChange={e => setNewApp({ ...newApp, jobLink: e.target.value })} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Log Application
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" /></div>
                ) : applications && applications.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company & Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date Applied</TableHead>
                                    <TableHead>Resume</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.map((app) => (
                                    <TableRow key={app.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold flex items-center gap-1">
                                                    {app.companyName}
                                                    {app.jobLink && (
                                                        <a href={app.jobLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                                            <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    )}
                                                </span>
                                                <span className="text-xs text-muted-foreground">{app.jobTitle}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Badge variant="outline" className={`cursor-pointer capitalize ${statusColors[app.status]}`}>
                                                        {statusLabels[app.status]}
                                                    </Badge>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    {(Object.keys(statusLabels) as Array<Application['status']>).map((s) => (
                                                        <DropdownMenuItem key={s} onClick={() => handleStatusChange(app.id, s)}>
                                                            {statusLabels[s]}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {app.dateApplied ? format(app.dateApplied.toDate(), 'MMM dd, yyyy') : '...'}
                                        </TableCell>
                                        <TableCell>
                                            {app.resumeId ? (
                                                <Badge variant="secondary" className="text-[10px]">
                                                    {resumes.find(r => r.id === app.resumeId)?.title || 'Resume Version'}
                                                </Badge>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                {['phone-screen', 'technical', 'final'].includes(app.status) && (
                                                    <Button variant="ghost" size="icon" onClick={() => handleDraftFollowUp(app)} title="AI Draft Follow-up">
                                                        <Mail className="w-4 h-4 text-primary" />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(app.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                        <Building2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">No applications tracked yet.</p>
                        <p className="text-xs text-muted-foreground/60">Log your first application to stay organized.</p>
                    </div>
                )}
            </CardContent>

            <Dialog open={isFollowUpOpen} onOpenChange={setIsFollowUpOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            AI Follow-up Draft
                        </DialogTitle>
                        <DialogDescription>A personalized thank-you note based on your interview stage.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {isGeneratingFollowUp ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">Writing your strategic follow-up...</p>
                            </div>
                        ) : followUpEmail ? (
                            <div className="space-y-4">
                                <ScrollArea className="h-64 rounded-md border p-4 bg-secondary/20">
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{followUpEmail}</p>
                                </ScrollArea>
                                <div className="flex justify-between items-center text-xs text-muted-foreground italic">
                                    <p>* Remember to personalize with specific details from your conversation.</p>
                                    <Button size="sm" onClick={copyToClipboard} className="shrink-0">
                                        {copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                        {copied ? 'Copied' : 'Copy Email'}
                                    </Button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
