import Link from 'next/link';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <Link href="/" className="text-primary hover:underline mb-8 inline-block">← Back to home</Link>
        <h1 className="text-3xl font-bold mb-8">Refund Policy</h1>
        
        <div className="prose prose-pink max-w-none space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Beta Testing Period</h2>
            <p>
              During the beta testing period, BakeBot is free to use for 14 days. No refunds are applicable for free trial periods.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Lifetime Plan</h2>
            <p>
              Our Lifetime Plan offered to beta testers is a one-time payment. We offer a 14-day "no questions asked" refund policy for this plan if you are not satisfied with the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Subscriptions</h2>
            <p>
              For monthly or annual subscriptions, you may cancel at any time. Refunds for partial billing cycles are generally not provided, but we may make exceptions on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. How to Request a Refund</h2>
            <p>
              To request a refund, please email jmenichole007@outlook.com with your account details and the reason for your request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Processing</h2>
            <p>
              Refunds are processed back to the original payment method through Paddle/Lemon Squeezy. It may take 5-10 business days for the funds to appear in your account.
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
