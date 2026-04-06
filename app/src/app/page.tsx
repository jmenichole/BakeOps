import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { AuthButton } from '@/components/AuthButton';
import { ArrowRight, Zap, Calendar, ShieldCheck, Clock, ChevronRight, Medal, DollarSign, Sparkles, Star, Check } from 'lucide-react';

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

      {/* HERO — split screen */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-[5%] w-[600px] h-[600px] bg-gradient-to-br from-pink-100 to-pink-50 rounded-full blur-[140px] opacity-50" />
          <div className="absolute bottom-0 right-[2%] w-[450px] h-[450px] bg-gradient-to-tl from-blue-50 to-purple-50 rounded-full blur-[110px] opacity-35" />
        </div>

        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-center max-w-6xl mx-auto">
            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-full text-[11px] font-bold uppercase tracking-wider mb-8">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Now accepting beta testers
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-[4.75rem] font-serif font-black text-secondary mb-6 leading-[1.05] tracking-tight">
                Stop losing hours <br className="hidden sm:block" />
                to <span className="text-primary">admin work.</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-lg leading-relaxed mx-auto lg:mx-0">
                Bake Ops handles your quotes, cake mockups, and production schedules &mdash; so you can focus on what you actually love: baking.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center lg:justify-start">
                <Link href="/signup" className="btn btn-primary btn-primary-glow py-4 px-10 text-base group flex items-center justify-center gap-3">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/pricing" className="btn btn-secondary py-4 px-10 text-base">
                  See Pricing
                </Link>
              </div>

              <p className="text-xs text-gray-400 font-medium">
                14-day free trial &middot; No credit card required &middot; Cancel anytime
              </p>
            </div>

            {/* Right: product mockup */}
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-gray-100 py-8 bg-gray-50/60">
        <div className="container px-4">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">
            Join bakers who use Bake Ops every day
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 mb-8">
            <ProofStat icon={<Zap className="w-5 h-5" />} value="60 sec" label="Quote turnaround" />
            <ProofStat icon={<Sparkles className="w-5 h-5" />} value="AI mockups" label="On demand" />
            <ProofStat icon={<Clock className="w-5 h-5" />} value="5+ hrs" label="Saved per week" />
            <ProofStat icon={<ShieldCheck className="w-5 h-5" />} value="14 days" label="Free trial" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <AsSeenIn name="Product Hunt" />
            <AsSeenIn name="Cake Central" />
            <AsSeenIn name="Baker's Journal" />
            <AsSeenIn name="HoneyBook Blog" />
            <AsSeenIn name="Small Biz Daily" />
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
              description="Type the customer's request — flavors, tiers, theme, add-ons. Upload a reference photo if you have one."
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

      {/* FEATURES — bento grid */}
      <section className="py-28 bg-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
        </div>

        <div className="container px-4 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-pink-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">Built for bakers</p>
            <h2 className="text-4xl md:text-5xl font-serif font-black leading-tight">
              Everything you need, nothing you don&apos;t
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* AI Design Studio — full width */}
            <div className="md:col-span-2 p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 group">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-5 text-pink-400 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">AI Design Studio</h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                    Generate photorealistic cake mockups from a text description in seconds. Upload your past work as style references so every mockup matches your unique aesthetic.
                  </p>
                </div>
                <AiStudioPeek />
              </div>
            </div>

            {/* Smart Pricing */}
            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 group">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-5 text-pink-400 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Pricing</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Instant quotes covering ingredients, overhead, complexity surcharges, and market rates — automatically tiered for every order.
              </p>
              <PricingTierPeek />
            </div>

            {/* Prep Planner */}
            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 group">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-5 text-pink-400 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Prep Planner</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Automatically breaks every order into a multi-day schedule. Batch totals across all orders so you know exactly how much buttercream to make on Thursday.
              </p>
              <PrepPlannerPeek />
            </div>

            {/* Instant Booking — full width */}
            <div className="md:col-span-2 p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 group">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-5 text-pink-400 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Instant Booking</h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                    Send a branded quote and payment link in one tap. Clients confirm and pay deposits without a single back-and-forth DM.
                  </p>
                </div>
                <InstantBookingPeek />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BETA PROGRAM */}
      <section className="py-28">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4">Beta program</p>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-secondary mb-8 leading-tight">
              Help us build exactly what you need
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-10">
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

            <FounderCard />

            <Link href="/signup" className="btn btn-primary btn-primary-glow py-4 px-10 text-base group inline-flex items-center gap-3 mt-8">
              Apply for Beta Access
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
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
            <p className="text-lg text-gray-500 mb-12 leading-relaxed">
              Join bakers in our beta program and reclaim hours every week. Limited spots — and beta members lock in 50% off forever.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup" className="btn btn-primary btn-primary-glow py-5 px-12 text-lg group flex items-center gap-3">
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

/* ─── Hero product mockup ─── */

function HeroMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-gradient-to-br from-pink-200/25 to-purple-200/15 rounded-3xl blur-3xl pointer-events-none" />
      <div className="relative bg-secondary rounded-3xl p-5 shadow-[0_30px_80px_-20px_rgba(60,47,47,0.35)] border border-white/10">
        {/* Browser chrome dots */}
        <div className="flex gap-1.5 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-400/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
          <div className="w-3 h-3 rounded-full bg-green-400/70" />
        </div>

        {/* Top: prompt input */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-3">
          <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Theme / Description</div>
          <div className="text-[11px] text-gray-300 leading-relaxed">
            3-tier vanilla cake, ocean waves, surfboard topper, hula dancer, gold lettering ✨
          </div>
        </div>

        {/* Split: mockup preview + quote */}
        <div className="grid grid-cols-2 gap-3">
          {/* Left: AI mockup card */}
          <div className="space-y-2">
            <div className="text-[9px] font-black text-pink-400 uppercase tracking-widest">AI Mockup</div>
            <div className="bg-gradient-to-b from-sky-900/40 to-teal-900/20 border border-sky-700/20 rounded-xl flex flex-col items-center justify-center py-5 gap-1.5 relative overflow-hidden">
              {/* Decorative cake tiers */}
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-8 h-3 bg-white/20 rounded-full border border-white/10" />
                <div className="w-12 h-3.5 bg-white/25 rounded-full border border-white/10" />
                <div className="w-16 h-4 bg-white/30 rounded-full border border-white/10" />
              </div>
              <div className="flex gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <div className="absolute top-1.5 right-1.5 bg-primary/80 rounded px-1.5 py-0.5 text-[7px] font-bold text-white">AI</div>
            </div>
            <div className="text-[8px] text-gray-500 text-center">Generated in ~8s</div>
          </div>

          {/* Right: quote */}
          <div className="space-y-2">
            <div className="text-[9px] font-black text-pink-400 uppercase tracking-widest">Final Quote</div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
              <div>
                <div className="text-[8px] text-gray-500 uppercase tracking-wider">AI Suggested</div>
                <div className="text-2xl font-black text-white leading-none mt-0.5">$95</div>
              </div>
              <div className="flex gap-1">
                {(['Good', 'Better', 'Best'] as const).map((t, i) => (
                  <span key={t} className={`text-[7px] px-1.5 py-0.5 rounded font-bold leading-none ${i === 1 ? 'bg-primary text-white' : 'bg-white/10 text-gray-400'}`}>{t}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-1">
              <div className="flex-1 py-1.5 text-center bg-white/5 border border-white/10 rounded-lg text-[8px] font-bold text-gray-300">Draft</div>
              <div className="flex-1 py-1.5 text-center bg-primary/80 rounded-lg text-[8px] font-black text-white">Send →</div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/5 text-[8px] text-gray-500 text-center">
          Powered by AI · Adjusts to your local market & supply costs
        </div>
      </div>
    </div>
  );
}

/* ─── Feature peek sub-components ─── */

function AiStudioPeek() {
  return (
    <div className="shrink-0 w-full md:w-72 bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
      <div className="text-[9px] font-bold text-pink-400 uppercase tracking-widest">Live Preview</div>
      <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-[10px] text-gray-400 italic">
        &ldquo;2-tier lemon cake, watercolor florals, gold leaf accent…&rdquo;
      </div>
      <div className="bg-gradient-to-br from-rose-900/30 to-pink-800/20 border border-pink-700/20 rounded-xl flex items-center justify-center py-6">
        <span className="text-4xl drop-shadow">🎂</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-gray-500">Generated in 8s</span>
        <div className="flex gap-1">
          <div className="px-2 py-1 bg-white/10 rounded text-[8px] text-gray-300 cursor-pointer hover:bg-white/15 transition-colors">Regenerate</div>
          <div className="px-2 py-1 bg-primary/80 rounded text-[8px] text-white cursor-pointer hover:bg-primary transition-colors">Use This</div>
        </div>
      </div>
    </div>
  );
}

function PricingTierPeek() {
  const tiers = [
    { label: 'Good',   price: '$65',  features: ['Buttercream finish', '2 flavors'], highlight: false },
    { label: 'Better', price: '$85',  features: ['Fondant finish', '3 flavors'],    highlight: true  },
    { label: 'Best',   price: '$125', features: ['Artisan finish', 'Sugar flowers'], highlight: false },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {tiers.map(({ label, price, features, highlight }) => (
        <div key={label} className={`rounded-xl p-3 border text-center ${highlight ? 'bg-primary/20 border-primary/40' : 'bg-white/5 border-white/10'}`}>
          <div className={`text-[9px] font-black uppercase tracking-widest mb-1 ${highlight ? 'text-primary' : 'text-gray-400'}`}>{label}</div>
          <div className="text-lg font-black text-white mb-2">{price}</div>
          {features.map(f => (
            <div key={f} className="text-[8px] text-gray-400 leading-snug">{f}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

function PrepPlannerPeek() {
  const days = [
    { day: 'Mon', tasks: [{ label: 'Bake sponge', color: 'bg-pink-500/60' }, { label: 'Make syrup', color: 'bg-pink-500/40' }] },
    { day: 'Tue', tasks: [{ label: 'Crumb coat', color: 'bg-blue-500/60' }, { label: 'Chill 4hrs', color: 'bg-blue-500/40' }] },
    { day: 'Wed', tasks: [{ label: 'Final coat', color: 'bg-orange-500/60' }, { label: 'Sugar flowers', color: 'bg-orange-500/40' }] },
  ];
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
      <div className="text-[9px] font-black text-pink-400 uppercase tracking-widest mb-3">This Week</div>
      {days.map(({ day, tasks }) => (
        <div key={day} className="flex items-start gap-3">
          <div className="text-[9px] font-bold text-gray-500 w-6 shrink-0 pt-1">{day}</div>
          <div className="flex gap-1 flex-wrap">
            {tasks.map(({ label, color }) => (
              <span key={label} className={`${color} text-white text-[8px] font-bold px-2 py-0.5 rounded`}>{label}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function InstantBookingPeek() {
  return (
    <div className="shrink-0 w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
      <div className="text-[9px] font-bold text-pink-400 uppercase tracking-widest">Customer Quote</div>
      <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
        <div>
          <div className="text-xs font-bold text-white">Wedding Cake &middot; 3 tiers</div>
          <div className="text-[9px] text-gray-400 mt-0.5">Due June 14 &middot; $340</div>
        </div>
        <div className="w-8 h-8 bg-green-500/20 border border-green-500/40 rounded-lg flex items-center justify-center">
          <Check className="w-4 h-4 text-green-400" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 py-2 text-center bg-primary/80 rounded-xl text-[10px] font-black text-white cursor-pointer hover:bg-primary transition-colors">
          Send to Client
        </div>
        <div className="flex-1 py-2 text-center bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-gray-300 cursor-pointer hover:bg-white/10 transition-colors">
          Save Draft
        </div>
      </div>
      <div className="text-[9px] text-gray-500 text-center">Client receives email + secure payment link</div>
    </div>
  );
}

/* ─── Shared sub-components ─── */

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

function AsSeenIn({ name }: { name: string }) {
  return (
    <span className="text-[11px] font-black uppercase tracking-widest text-gray-300 cursor-default">
      {name}
    </span>
  );
}

function StepCard({ step, title, description, accent }: { step: string; title: string; description: string; accent: string }) {
  return (
    <div className="relative p-8 rounded-[2rem] bg-white border border-gray-100 hover:border-pink-100 hover:shadow-2xl hover:shadow-pink-100/30 hover:-translate-y-1 transition-all duration-500 group">
      <div className={`w-12 h-12 ${accent} rounded-xl flex items-center justify-center text-sm font-black mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {step}
      </div>
      <h3 className="text-xl font-bold text-secondary mb-3">{title}</h3>
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
    <div className="golden-ticket text-white p-7 rounded-2xl border border-yellow-500/20 shadow-[0_8px_40px_-12px_rgba(255,215,0,0.25)]">
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="w-10 h-10 bg-yellow-400/15 border border-yellow-400/40 rounded-xl flex items-center justify-center shadow-inner">
          <Medal className="w-5 h-5 text-yellow-300" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-yellow-300 block">Lifetime Founder Pricing</span>
          <span className="text-[10px] text-yellow-500/60 font-medium">Limited beta spots available</span>
        </div>
        <div className="ml-auto shrink-0">
          <div className="px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-300 text-[9px] font-black uppercase tracking-widest">
            Golden Tier
          </div>
        </div>
      </div>

      <p className="text-white/90 text-sm leading-relaxed relative z-10">
        Beta members lock in <strong className="text-yellow-300">50% off forever</strong> when we launch publicly.{' '}
        No renewals, no price hikes — ever. Your rate is guaranteed for the lifetime of your account.
      </p>

      <div className="mt-5 pt-4 border-t border-yellow-500/10 flex items-center gap-6 relative z-10">
        <div className="text-center">
          <div className="text-xl font-black text-white">$9<span className="text-sm font-medium text-white/50">/mo</span></div>
          <div className="text-[9px] text-yellow-400/70 uppercase tracking-wider font-bold">Founder rate</div>
        </div>
        <div className="text-gray-600 text-xl font-light" aria-hidden="true">→</div>
        <div className="text-center opacity-50">
          <div className="text-xl font-black text-white line-through">$19<span className="text-sm font-medium">/mo</span></div>
          <div className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Public rate</div>
        </div>
      </div>
    </div>
  );
}

function RoadmapCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center mb-4">
        <div className="w-2 h-2 bg-primary rounded-full" />
      </div>
      <h3 className="font-bold text-secondary mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
