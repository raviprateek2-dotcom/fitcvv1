
'use client';

import { ResumeEditor } from '@/components/editor/ResumeEditor';

export default function EditorPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col h-screen bg-secondary">
      <div className="flex-grow overflow-hidden">
        <ResumeEditor resumeId={params.id} />
      </div>
    </div>
  );
}
