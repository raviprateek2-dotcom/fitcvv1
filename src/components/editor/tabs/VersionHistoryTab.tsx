'use client';

import { TabsContent } from '@/components/ui/tabs';
import { useFirestore, useUser } from '@/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useResumeEditorStore } from '@/store/resume-editor-store';
import type { ResumeData } from '@/components/editor/types';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { History, GitCommit, FileWarning, Clock, Archive, ArrowUpLeft, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface SavedVersion extends ResumeData {
  versionId: string;
  versionCreatedAt: any; // Firestore timestamp
}

export function VersionHistoryTab() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { resumeId, setResumeData } = useResumeEditorStore();
  const [versions, setVersions] = useState<SavedVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!firestore || !user || !resumeId) return;

    const versionsRef = collection(firestore, `users/${user.uid}/resumes/${resumeId}/versions`);
    const q = query(versionsRef, orderBy('versionCreatedAt', 'desc'), limit(20));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedVersions: SavedVersion[] = [];
      snapshot.forEach((doc) => {
        fetchedVersions.push({ versionId: doc.id, ...doc.data() } as SavedVersion);
      });
      setVersions(fetchedVersions);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching versions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, user, resumeId]);

  const handleRestore = (version: SavedVersion) => {
    const { versionId, versionCreatedAt, ...rest } = version;
    setResumeData(rest as ResumeData);
    toast({ title: 'System Restored', description: 'Resume state has been synchronized with the selected snapshot.' });
  };

  return (
    <TabsContent value="history" className="p-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-start gap-4 shadow-inner relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 relative z-10 shadow-sm">
            <History className="w-6 h-6" />
        </div>
        <div className="relative z-10">
            <h3 className="text-lg font-black font-headline text-white tracking-tight">Temporal Registry</h3>
            <p className="text-sm text-muted-foreground/80 font-medium leading-relaxed">Manage high-fidelity snapshots of your progress. Revert to any milestone with precision.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4 animate-pulse">
            <Clock className="w-12 h-12 text-primary/40 animate-spin-slow" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Searching Archives...</p>
        </div>
      ) : versions.length === 0 ? (
        <div className="text-center py-20 px-8 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02] flex flex-col items-center">
          <Archive className="w-16 h-16 text-muted-foreground/20 mb-6" />
          <p className="text-lg font-bold text-muted-foreground/60 mb-2">No Snapshots Found</p>
          <p className="text-xs text-muted-foreground/40 max-w-[280px] leading-relaxed">Execute a manual save in the primary navigation to capture your current architectural progress.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 pb-8">
          {versions.map((version, idx) => (
            <Card key={version.versionId} className="bg-glass border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-primary/30 transition-all group/card relative">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <ShieldCheck className="w-5 h-5 text-primary/40" />
                </div>
              <CardHeader className="p-6 pb-2">
                <div className="flex items-center gap-4 mb-1">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary border border-white/5">
                    <GitCommit className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-black font-headline text-white tracking-wide">Snapshot #{versions.length - idx}</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mt-0.5">
                        {version.versionCreatedAt ? formatDistanceToNow(version.versionCreatedAt.toDate(), { addSuffix: true }) : 'Real-time'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="glass" className="w-full h-11 rounded-xl text-xs font-bold uppercase tracking-widest border-white/5 shadow-lg group overflow-hidden">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <ArrowUpLeft className="w-4 h-4 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        Synchronize Local State
                      </span>
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-glass backdrop-blur-3xl border-white/10 rounded-3xl p-8 max-w-[400px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-black font-headline tracking-tight text-white">Revert Architectural State?</AlertDialogTitle>
                      <AlertDialogDescription className="text-sm font-medium text-muted-foreground/80 leading-relaxed pt-2">
                        You are about to synchronize your local workspace with this historical snapshot. Unsaved progress in the current terminal will be overwritten.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="pt-6">
                      <AlertDialogCancel className="bg-white/5 border-white/10 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-white/10">Abort</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleRestore(version)} className="bg-primary text-primary-foreground rounded-xl font-black uppercase text-[10px] tracking-[0.1em] px-6 shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]">Initialize Restore</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </TabsContent>
  );
}
