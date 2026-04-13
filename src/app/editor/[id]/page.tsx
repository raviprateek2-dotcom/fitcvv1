import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ResumeEditor = dynamic(
  () => import('@/components/editor/ResumeEditor').then((m) => ({ default: m.ResumeEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen bg-background">
        <div className="hidden md:block w-[450px] border-r p-6 space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-full w-full max-w-2xl mx-auto rounded-xl" />
        </div>
      </div>
    ),
  }
);

export default function EditorPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div className="flex flex-col h-screen bg-secondary">
      <div className="flex-grow overflow-hidden">
        <ResumeEditor resumeId={id} />
      </div>
    </div>
  );
}
