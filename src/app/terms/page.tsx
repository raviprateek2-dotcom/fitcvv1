import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Welcome to ResumeAI. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our service, you agree to be bound by these Terms.
          </p>

          <h2>2. Use of Our Service</h2>
          <p>
            You must be at least 18 years old to use our service. You are responsible for any activity that occurs through your account and you agree you will not sell, transfer, license or assign your account, username, or any account rights.
          </p>
          
          <h2>3. Content</h2>
          <p>
            Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the service, including its legality, reliability, and appropriateness.
          </p>

          <h2>4. Subscription and Payments</h2>
          <p>
            Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle").
          </p>
          
          <h2>5. Limitation of Liability</h2>
          <p>
            In no event shall ResumeAI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
          
          <h2>6. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect.
          </p>
          
          <h2>7. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at support@resumeai.ai.</p>
          
          <p className="text-sm text-muted-foreground mt-8">Last updated: {new Date().toLocaleDateString()}</p>
        </CardContent>
      </Card>
    </div>
  );
}
