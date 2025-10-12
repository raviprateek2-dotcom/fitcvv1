import { ResumeEditor } from '@/components/editor/ResumeEditor';
import { Button } from '@/components/ui/button';
import { Download, Eye, Save, Share2 } from 'lucide-react';

export default function EditorPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch resume data based on params.id
  // For this example, we'll pass a placeholder or let the editor handle its initial state.

  return (
    <div className="flex flex-col h-full bg-secondary">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-headline font-semibold">Resume Editor</h1>
            <p className="text-sm text-muted-foreground">Editing: Software Engineer Resume</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
             <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </header>
      <div className="flex-grow">
        <ResumeEditor resumeId={params.id} />
      </div>
    </div>
  );
}
