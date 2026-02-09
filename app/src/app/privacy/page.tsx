import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <Link href="/" className="text-primary hover:underline mb-8 inline-block">← Back to home</Link>
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-pink max-w-none space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you create an account, such as your name, email address, and bakery details. We also collect usage data through analytics tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p>
              We use your information to provide, maintain, and improve the Service, to communicate with you, and to send you daily analytics reports (if enabled).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Data Sharing</h2>
            <p>
              We do not sell your personal data. We share data with third-party service providers (like Supabase for database, Resend for emails, and Paddle for payments) only as necessary to provide the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Cookies</h2>
            <p>
              We use cookies to maintain your session and improve your experience. You can control cookie settings through your browser.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Security</h2>
            <p>
              We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal data. Please contact us at jmenichole007@outlook.com for any privacy-related requests.
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
