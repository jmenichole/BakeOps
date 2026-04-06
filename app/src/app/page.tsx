import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { AuthButton } from '@/components/AuthButton';
import { ArrowRight, Zap, Palette, Calendar, Calculator, ShieldCheck, Clock, ChevronRight, Medal, DollarSign, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-pink-100">
      {/* STICKY NAV */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="container px-4 flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-serif font-black text-secondary">
            Bake Ops
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <Link href="/pricing" className="hover:text-secondary transition-colors">Pricing</Link>
            <Link href="/support" className="hover:text-secondary transition-colors">Support</Link>
            <Link href="/signup" className="hover:text-secondary transition-colors">Join Beta</Link>
          </div>
          <div className="flex items-center gap-3">
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-pink-100 to-pink-50 rounded-full blur-[120px] opacity-60" />
          <div className="absolute bottom-0 right-[5%] w-[400px] h-[400px] bg-gradient-to-tl from-blue-50 to-purple-50 rounded-full blur-[100px] opacity-40" />
        </div>

        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-full text-[11px] font-bold uppercase tracking-wider mb-10">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Now accepting beta testers
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-serif font-black text-secondary mb-8 leading-[1.05] tracking-tight">
              Stop losing hours <br className="hidden sm:block" />
              to <span className="text-primary">admin work.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-14 max-w-xl mx-auto leading-relaxed font-medium">
              Bake Ops handles your quotes, cake mockups, and production schedules &mdash; so you can focus on what you actually love: baking.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Link href="/signup" className="btn btn-primary py-4 px-10 text-base shadow-2xl shadow-pink-200/60 group flex items-center gap-3">
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/pricing" className="btn btn-secondary py-4 px-10 text-base flex items-center gap-3">
                See Pricing
              </Link>
            </div>

            <p className="text-xs text-gray-400 font-medium">
              14-day free trial &middot; No credit card required &middot; Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-gray-100 py-10 bg-gray-50/50">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            <ProofStat icon={<Zap className="w-5 h-5" />} value="60 sec" label="Quote turnaround" />
            <ProofStat icon={<Sparkles className="w-5 h-5" />} value="AI mockups" label="On demand" />
            <ProofStat icon={<Clock className="w-5 h-5" />} value="5+ hrs" label="Saved per week" />
            <ProofStat icon={<ShieldCheck className="w-5 h-5" />} value="14 days" label="Free trial" />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28">
        <div className="container px-4">
          <div className="text-center max-w-xl mx-auto mb-20">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4">How it works</p>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-secondary leading-tight">
              From idea to invoice in three steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard
              step="01"
              title="Describe the vision"
              description="Type the customer&apos;s request &mdash; flavors, tiers, theme, add-ons. Upload a reference photo if you have one."
              accent="bg-pink-50 text-primary"
            />
            <StepCard
              step="02"
              title="Get a mockup & price"
              description="AI generates a photorealistic cake mockup and calculates a quote based on your real ingredient costs, labor rate, and complexity."
              accent="bg-blue-50 text-blue-600"
            />
            <StepCard
              step="03"
              title="Send, confirm & schedule"
              description="Share the quote with your customer. Once they confirm and pay a deposit, your full prep schedule is built automatically."
              accent="bg-orange-50 text-orange-600"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-28 bg-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
        </div>

        <div className="container px-4 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-20">
            <p className="text-pink-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Built for bakers</p>
            <h2 className="text-4xl md:text-5xl font-serif font-black leading-tight">
              Everything you need, nothing you don&apos;t
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="AI Design Studio"
              description="Generate realistic cake mockups from a text description in seconds. Upload your own past work as style references so every mockup matches your skill level and aesthetic."
            />
            <FeatureCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Smart Pricing"
              description="Stop guessing. Instant quotes cover ingredients, overhead, complexity surcharges, and market rates &mdash; with a Good&thinsp;/&thinsp;Better&thinsp;/&thinsp;Best tier for every order."
            />
            <FeatureCard
              icon={<Calendar className="w-6 h-6" />}
              title="Prep Planner"
              description="Automatically break down every order into a multi-day schedule. Batch totals across all orders so you know exactly how much buttercream to make on Thursday."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Instant Booking"
              description="Send a branded quote and payment link in one tap. Clients confirm and pay deposits without a single back-and-forth DM."
            />
          </div>
        </div>
      </section>

      {/* BETA PROGRAM */}
      <section className="py-28">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto">
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4">Beta program</p>
              <h2 className="text-4xl md:text-5xl font-serif font-black text-secondary mb-8 leading-tight">
                Help us build exactly what you need
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-10">
                Bake Ops is being built alongside the bakers who use it every day. Join the beta and get full access while shaping what we build next.
              </p>

              <ul className="space-y-6 mb-8">
                <BetaPerk
                  title="14 days full access, free"
                  description="Every feature, zero restrictions, no credit card."
                />
                <BetaPerk
                  title="Direct line to the team"
                  description="Vote on features, report bugs, and influence what we build next."
                />
              </ul>

              {/* Founder pricing highlight card */}
              <FounderCard />

              <Link href="/signup" className="btn btn-primary py-4 px-10 text-base shadow-xl shadow-pink-200/40 group inline-flex items-center gap-3 mt-8">
                Apply for Beta Access
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="py-28 bg-gray-50/80 border-y border-gray-100">
        <div className="container px-4">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4">Roadmap</p>
            <h2 className="text-4xl font-serif font-black text-secondary">Coming soon</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <RoadmapCard title="Baker Marketplace" description="Let customers discover and order from bakers in their area." />
            <RoadmapCard title="Progress Photos" description="Share bake-day updates and process videos directly with clients." />
            <RoadmapCard title="Live Order Tracking" description="Status bars, ready-for-pickup alerts, and delivery ETA for customers." />
            <RoadmapCard title="Flexible Payments" description="Split payments, installment plans, and multiple payment methods." />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28">
        <div className="container px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif font-black text-secondary mb-6 leading-tight">
              Ready to run your bakery smarter?
            </h2>
            <p className="text-lg text-gray-400 mb-12 leading-relaxed">
              Join bakers in our beta program and reclaim hours every week. Limited spots &mdash; and beta members lock in 50% off forever.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup" className="btn btn-primary py-5 px-12 text-lg shadow-2xl shadow-pink-200/50 group flex items-center gap-3">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="mt-10 flex items-center justify-center gap-8 text-gray-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Setup in 2 min</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

/* ─── Sub-components ─── */

function ProofStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="text-primary">{icon}</div>
      <div>
        <div className="text-xl font-black text-secondary leading-tight">{value}</div>
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
}

function StepCard({ step, title, description, accent }: { step: string; title: string; description: string; accent: string }) {
  return (
    <div className="relative p-8 rounded-[2rem] bg-white border border-gray-100 hover:border-pink-100 hover:shadow-2xl hover:shadow-pink-100/30 transition-all duration-500 group">
      <div className={`w-12 h-12 ${accent} rounded-xl flex items-center justify-center text-sm font-black mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {step}
      </div>
      <h3 className="text-xl font-bold text-secondary mb-3">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 group">
      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-pink-400 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function BetaPerk({ title, description }: { title: string; description: string }) {
  return (
    <li className="flex gap-4">
      <div className="mt-1 w-6 h-6 bg-pink-50 border border-pink-100 rounded-lg flex items-center justify-center shrink-0">
        <ChevronRight className="w-3.5 h-3.5 text-primary" />
      </div>
      <div>
        <h4 className="font-bold text-secondary text-[15px] mb-0.5">{title}</h4>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
    </li>
  );
}

function FounderCard() {
  return (
    <div className="relative bg-gradient-to-br from-secondary to-secondary/80 text-white p-6 rounded-2xl overflow-hidden">
      <div className="absolute top-4 right-4 opacity-20">
        <Medal className="w-16 h-16" />
      </div>
      <div className="flex items-center gap-3 mb-3 relative z-10">
        <div className="w-8 h-8 bg-yellow-400/20 border border-yellow-400/40 rounded-full flex items-center justify-center">
          <Medal className="w-4 h-4 text-yellow-300" />
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-yellow-300">Lifetime Founder Pricing</span>
      </div>
      <p className="text-white/90 text-sm leading-relaxed relative z-10">
        Beta members lock in <strong className="text-yellow-300">50% off forever</strong> when we launch publicly. No renewals, no price hikes — ever.
      </p>
    </div>
  );
}

function RoadmapCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all duration-300">
      <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center mb-4">
        <div className="w-2 h-2 bg-primary rounded-full" />
      </div>
      <h3 className="font-bold text-secondary mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
