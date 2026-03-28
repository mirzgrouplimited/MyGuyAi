import { SEO } from '@/components/SEO';

export default function Terms() {
  return (
    <>
      <SEO 
        title="Terms & Conditions - MyGuyAI" 
        description="Read the terms and conditions for using MyGuyAI free online tools."
        path="/terms"
      />
      
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-slate-600 mb-12">Last updated: January 2026</p>

          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-600 leading-relaxed">
                By accessing and using MyGuyAI (myguyai.com), you accept and agree to be bound by these Terms 
                and Conditions. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description of Service</h2>
              <p className="text-slate-600 leading-relaxed">
                MyGuyAI provides free online tools for image and PDF processing. All file processing occurs 
                directly in your web browser. We do not store, transmit, or have access to files you process 
                using our tools.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Responsibilities</h2>
              <p className="text-slate-600 leading-relaxed mb-4">You agree to:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Use our services only for lawful purposes</li>
                <li>Not upload files containing malware, viruses, or malicious content</li>
                <li>Not attempt to circumvent any security measures</li>
                <li>Not use automated systems to excessively access our services</li>
                <li>Ensure you have rights to any files you process</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Intellectual Property</h2>
              <p className="text-slate-600 leading-relaxed">
                You retain all rights to files you process using our tools. MyGuyAI does not claim any 
                ownership or rights to your content. Our website design, logos, and branding are protected 
                by intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Disclaimer of Warranties</h2>
              <p className="text-slate-600 leading-relaxed">
                Our services are provided "as is" without warranties of any kind. While we strive to provide 
                accurate and reliable tools, we cannot guarantee uninterrupted service or specific results. 
                You use our tools at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-slate-600 leading-relaxed">
                MyGuyAI shall not be liable for any indirect, incidental, special, or consequential damages 
                arising from your use of our services. This includes but is not limited to loss of data, 
                loss of profits, or business interruption.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Advertising</h2>
              <p className="text-slate-600 leading-relaxed">
                Our free services are supported by advertising. We display ads from third-party advertising 
                networks. These ads help us keep our tools free for all users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Changes to Terms</h2>
              <p className="text-slate-600 leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be posted on this page 
                with an updated date. Continued use of our services after changes constitutes acceptance of 
                the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Contact</h2>
              <p className="text-slate-600 leading-relaxed">
                For questions about these terms, please contact us at support@myguyai.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
