
'use client';

import { ResumeEditor } from '@/components/editor/ResumeEditor';

export default function EditorPage({ params }: { params: { id: string } }) {
  // Although this is a client component, the page itself is rendered on the server first,
  // so we still receive the id from the URL parameters.
  // The 'use client' boundary means the component and its children will hydrate
  // and become interactive on the client.
  return (
    <div className="flex flex-col h-screen bg-secondary">
      <div className="flex-grow overflow-hidden">
        <ResumeEditor resumeId={params.id} />
      </div>
    </div>
  );
}
