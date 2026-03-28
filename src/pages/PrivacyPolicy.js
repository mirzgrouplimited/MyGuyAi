import { SEO } from '@/components/SEO';

export default function PrivacyPolicy() {
  return (
    <>
      <SEO 
        title="Privacy Policy - MyGuyAI" 
        description="Read MyGuyAI's privacy policy. Learn how we protect your data and ensure complete privacy with our browser-based processing."
        path="/privacy-policy"
      />
      
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-12">
            Last updated: January 2026
          </p>

          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Privacy Matters</h2>
              <p className="text-slate-600 leading-relaxed">
                At MyGuyAI, we take your privacy seriously. This Privacy Policy explains how we handle your data 
                when you use our online tools and AI assistant.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Client-Side Processing</h2>
              <p className="text-slate-600 leading-relaxed">
                All file processing on MyGuyAI happens entirely in your web browser. This means:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mt-4">
                <li>Your files processed by our tools are never uploaded to our servers</li>
                <li>We never see, store, or have access to your processed files</li>
                <li>All tool processing happens on your own device</li>
                <li>Your files remain completely private and secure</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">AI Assistant Data</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                When you interact with My Guy (our AI assistant):
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Chat messages are processed to provide helpful responses</li>
                <li>Files uploaded through the chat are stored temporarily (15 minutes max)</li>
                <li>Common Q&A pairs may be cached to improve response times</li>
                <li>Session data is automatically deleted after 15 minutes of inactivity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We collect minimal information to improve our service:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li><strong>Analytics Data:</strong> We may use analytics to understand how visitors use our site</li>
                <li><strong>Session Data:</strong> Temporary session identifiers to maintain chat continuity</li>
                <li><strong>Contact Information:</strong> If you contact us, we store your email and message to respond</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Rate Limiting</h2>
              <p className="text-slate-600 leading-relaxed">
                To prevent abuse and ensure fair usage, we implement rate limiting (10 AI requests per hour). 
                This is based on anonymized IP addresses and is automatically reset hourly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">File Security</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                For files uploaded to our AI assistant:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Maximum file size: 10MB</li>
                <li>Allowed formats: PDF, Word, PNG, JPG, HEIC, HEIF</li>
                <li>Files are automatically deleted after 15 minutes</li>
                <li>Files are stored in isolated sessions and are not accessible to other users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Services</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We use the following third-party services:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Google Gemini (for AI responses via secure API)</li>
                <li>Analytics services (for website analytics)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Access any personal data we hold about you</li>
                <li>Request deletion of your personal data</li>
                <li>Opt out of cookies and tracking</li>
                <li>Contact us with privacy concerns</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Children's Privacy</h2>
              <p className="text-slate-600 leading-relaxed">
                Our service is not directed to children under 13. We do not knowingly collect personal information 
                from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Policy</h2>
              <p className="text-slate-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new policy on this page with an updated "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p className="text-slate-600 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at: support@myguyai.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
