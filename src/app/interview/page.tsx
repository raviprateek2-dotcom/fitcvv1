
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function InterviewPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <Card className="max-w-4xl mx-auto" variant="neuro">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <FileText className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">Interview Preparation</CardTitle>
          <CardDescription>This section is under construction. Coming soon!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            We're working on exciting new features to help you ace your interviews.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
