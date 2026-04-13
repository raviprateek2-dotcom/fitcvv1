'use client';

import { generateResumePdf } from '@/app/actions/export-pdf';
import { downloadBase64File } from '@/lib/file-utils';
import type { ResumeData } from '@/components/editor/types';
import { celebrateFirstPdfDownload } from '@/lib/first-pdf-celebration';
import { trackEvent } from '@/lib/analytics-events';

type ToastFn = (opts: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => void;

/** Shared PDF download used by editor header and mobile bottom bar. */
export async function downloadResumePdfClient(
  resumeData: ResumeData,
  resumeId: string,
  toast: ToastFn,
  setExporting: (v: boolean) => void
) {
  setExporting(true);
  trackEvent('pdf_export_start', { source: 'editor' });
  try {
    const result = await generateResumePdf(resumeData, resumeId);
    if (result.success && result.pdfBase64) {
      const filename = `${resumeData.title || resumeData.personalInfo.name || 'Resume'}.pdf`;
      downloadBase64File(result.pdfBase64, filename, 'application/pdf');
      const firstEver = celebrateFirstPdfDownload();
      if (firstEver) {
        toast({
          title: 'Your resume is ready.',
          description: `${filename} — Go get that job.`,
        });
      } else {
        toast({ title: 'PDF downloaded', description: filename });
      }
      trackEvent('pdf_export_success', { source: 'editor' });
    } else {
      console.warn('Server PDF failed, falling back to browser print:', result.error);
      window.open(`/editor/${resumeId}?print=true`, '_blank');
      trackEvent('pdf_export_fallback_print', { reason: result.error ?? 'unknown' });
    }
  } catch (error: unknown) {
    console.error('PDF export error:', error);
    window.open(`/editor/${resumeId}?print=true`, '_blank');
    trackEvent('pdf_export_fail', { reason: error instanceof Error ? error.message : 'runtime_error' });
  } finally {
    setExporting(false);
  }
}
