
import { ResumeEditor } from '@/components/editor/ResumeEditor';

export default function EditorPage({ params }: { params: { id: string } }) {
  // This is now a Server Component.
  // It receives the `params` from the URL and passes the `id`
  // as a simple string prop to the ResumeEditor client component.
  return (
    <div className="flex flex-col h-screen bg-secondary">
      <div className="flex-grow overflow-hidden">
        <ResumeEditor resumeId={params.id} />
      </div>
    </div>
  );
}
