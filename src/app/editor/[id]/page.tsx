
import { ResumeEditor } from '@/components/editor/ResumeEditor';

// In Next.js 14.2, params is a plain object, not a promise.
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
