
import { ResumeEditor } from '@/components/editor/ResumeEditor';

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  // This is a Server Component.
  // We need to `await` the `params` promise to resolve its value.
  const { id } = await params;
  
  // Then we pass the resolved `id` as a simple string prop 
  // to the ResumeEditor client component.
  return (
    <div className="flex flex-col h-screen bg-secondary">
      <div className="flex-grow overflow-hidden">
        <ResumeEditor resumeId={id} />
      </div>
    </div>
  );
}
