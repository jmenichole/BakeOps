import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <Link href="/" className="text-primary hover:underline mb-8 inline-block">← Back to home</Link>
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-pink max-w-none space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using BakeBot (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Beta Testing Period</h2>
            <p>
              BakeBot is currently in a Beta Testing phase. You acknowledge that the Service is provided &quot;as is&quot; and may contain bugs or errors. We reserve the right to modify or discontinue features at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information when creating an account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Subscriptions and Payments</h2>
            <p>
              After the trial period, the Service requires a paid subscription or a lifetime license. Payments are processed via Paddle/Lemon Squeezy. You agree to their respective terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Content Ownership</h2>
            <p>
              You retain all rights to the designs and data you create within BakeBot. We do not claim ownership over your specific business data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
            <p>
              BakeBot shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Your continued use of the Service after changes are posted constitutes your acceptance of the new terms.
            </p>
          </section>

          <p className="text-sm text-gray-400 pt-8 border-t border-gray-100">
            Last updated: February 9, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
