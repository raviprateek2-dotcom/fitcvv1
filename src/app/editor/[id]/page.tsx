
'use client';

import { ResumeEditor } from '@/components/editor/ResumeEditor';

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
