import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How FitCV collects, uses, and protects your data.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <Card className="max-w-4xl mx-auto" variant="neuro">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none dark:prose-invert">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly, including account details, resume content, cover letters, interview
            practice transcripts, and job application notes. We also collect limited technical data (browser/device metadata,
            logs, and usage events) to keep the service reliable and secure.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use your data to operate FitCV features, including resume editing, document export, interview analysis, job
            tracker workflows, customer support, and product quality improvements. AI requests are processed only to generate
            outputs you request and are not used by us to train public models.
          </p>
          
          <h2>3. Information Sharing</h2>
          <p>
            We do not sell personal information. We share data only with trusted service providers required to run FitCV
            (for example cloud hosting, analytics, payments, and AI infrastructure), under contractual controls and only for
            service delivery.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We use technical and organizational safeguards to protect your information from unauthorized access, disclosure,
            alteration, and destruction. This includes access controls, transport encryption, and monitoring of critical systems.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            We retain your account data while your account is active. You can delete resumes, interview sessions, and other
            records from your dashboard. If you request account deletion, associated personal data is removed or anonymized
            according to legal and operational requirements.
          </p>
          
          <h2>6. Your Rights</h2>
          <p>
            Depending on your location, you may have rights to access, correct, export, or delete your data, and to object to
            certain processing. To make a request, contact us at the email below from your registered account email.
          </p>
          
          <h2>7. Payments</h2>
          <p>
            Payments are processed by Razorpay and related banking partners. We do not store your full card details on FitCV
            servers. Payment metadata (order/payment IDs, status, timestamps) may be retained for accounting, support, and fraud
            prevention.
          </p>
          
          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this policy as features evolve. When we make material changes, we update the date below and may provide
            additional notice within the product.
          </p>

          <h2>9. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, contact us at privacy@fitcv.in.</p>

          <p className="text-sm text-muted-foreground mt-8">Last updated: April 15, 2026</p>
        </CardContent>
      </Card>
    </div>
  );
}
