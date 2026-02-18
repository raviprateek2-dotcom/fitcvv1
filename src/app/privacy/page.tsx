
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <Card className="max-w-4xl mx-auto" variant="neuro">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, such as when you create an account, create a resume, or communicate with us. This may include personal information like your name, email address, and the content of your resume.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services. This includes using your resume data to power our AI suggestion features and to personalize your experience.
          </p>
          
          <h2>3. Information Sharing</h2>
          <p>
            We do not share your personal information with third parties except as described in this Privacy Policy. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration, and destruction.
          </p>
          
          <h2>5. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights under local law in relation to the personal data we hold about you. These may include the right to access, correct, or delete your personal information.
          </p>
          
          <h2>6. Changes to This Policy</h2>
          <p>
            We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the bottom of the policy and, in some cases, we may provide you with additional notice.
          </p>
          
          <h2>7. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@fitcv.ai.</p>

          <p className="text-sm text-muted-foreground mt-8">Last updated: {new Date().toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </div>
  );
}
