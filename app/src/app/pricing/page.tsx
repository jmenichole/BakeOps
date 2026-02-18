import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join the Bake Ops beta and lock in exclusive founder pricing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Trial Plan */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold mb-2">Beta Tester</h3>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">$0</span>
              <span className="text-gray-500 ml-2">for 14 days</span>
            </div>
            <p className="text-gray-600 mb-8">
              Experience the full power of Bake Ops while helping us shape the future of baking management.
            </p>
            <ul className="space-y-4 mb-8 flex-grow">
              {[
                'AI Cake Configurator',
                'Production Planning',
                'Order Management',
                'Daily Analytics Reports',
                'Affiliate Rewards'
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-gray-700">
                  <Check className="w-5 h-5 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block text-center py-4 px-6 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Lifetime Plan */}
          <div className="bg-white p-8 rounded-3xl border-2 border-primary shadow-xl relative flex flex-col">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              EARLY BIRD DEAL
            </div>
            <h3 className="text-xl font-bold mb-2">Lifetime Founder</h3>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">$149</span>
              <span className="text-gray-500 ml-2">one-time</span>
            </div>
            <p className="text-gray-600 mb-8">
              Pay once, own it forever. Exclusive to our first 100 beta testers.
            </p>
            <ul className="space-y-4 mb-8 flex-grow">
              {[
                'Everything in Beta Trial',
                'Lifetime Updates',
                'Priority Support',
                'Founder Badge on Profile',
                'No Monthly Fees, Ever'
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-gray-700">
                  <Check className="w-5 h-5 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block text-center py-4 px-6 rounded-xl bg-primary text-white font-bold hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200"
            >
              Get Lifetime Access
            </Link>
          </div>
        </div>

        <div className="mt-20 text-center text-gray-500">
          <p>Questions? Reach out at <a href="mailto:jmenichole007@outlook.com" className="text-primary hover:underline">jmenichole007@outlook.com</a></p>
        </div>
      </div>
    </div>
  );
}
