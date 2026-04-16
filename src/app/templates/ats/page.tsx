'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ATS_TEMPLATE_REGISTRY } from '@/lib/ats-template-registry';
import { atsSampleResumes } from '@/data/ats-sample-resumes';
import { AtsClassicTemplate, FresherStudentTemplate, ProfessionalTemplate } from '@/components/resume/ats-templates';
import type { ResumeTemplateVariantId } from '@/lib/resume-template-variants';

const VARIANT_COMPONENTS: Record<ResumeTemplateVariantId, typeof AtsClassicTemplate> = {
  'ats-classic': AtsClassicTemplate,
  'fresher-student': FresherStudentTemplate,
  'professional-2-5-years': ProfessionalTemplate,
};

export default function AtsTemplatesPage() {
  const router = useRouter();
  const { toast } = useToast();

  const previews = useMemo(
    () =>
      Object.values(ATS_TEMPLATE_REGISTRY).map((definition) => {
        const sample = atsSampleResumes.find((item) => item.recommendedVariant === definition.id) ?? atsSampleResumes[0];
        return { definition, sample };
      }),
    []
  );

  const applyVariant = (variantId: ResumeTemplateVariantId) => {
    window.localStorage.setItem('fitcv:ats-template-variant', variantId);
    toast({
      title: 'ATS template selected',
      description: `Variant set to ${ATS_TEMPLATE_REGISTRY[variantId].label}.`,
    });
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" asChild>
            <Link href="/templates">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Templates
            </Link>
          </Button>
          <Button onClick={() => router.push('/editor/new?template=modern')}>
            Open Editor
          </Button>
        </div>

        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">ATS Template Picker</h1>
          <p className="mt-2 text-muted-foreground">
            Choose a production-grade ATS variant. Selection is persisted and used during ATS PDF export from the editor.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {previews.map(({ definition, sample }) => {
            const PreviewComponent = VARIANT_COMPONENTS[definition.id];
            return (
              <Card key={definition.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    <span>{definition.label}</span>
                    <Badge variant="secondary">ATS</Badge>
                  </CardTitle>
                  <CardDescription>Sample profile: {sample.roleLabel}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[400px] overflow-auto rounded border bg-muted/20 p-2">
                    <PreviewComponent resume={sample.resume} className="scale-[0.45] origin-top-left" />
                  </div>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => applyVariant(definition.id)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Set Variant
                  </Button>
                  <Button
                    onClick={() => {
                      applyVariant(definition.id);
                      router.push('/editor/new?template=modern');
                    }}
                  >
                    Use in Editor
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

