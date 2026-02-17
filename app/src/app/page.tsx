import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { Sparkles, ArrowRight, Zap, Palette, Calendar, Calculator, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-pink-100">
      {/* BETA ANNOUNCEMENT BANNER */}
      <div className="bg-secondary text-white py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-4">
        <Sparkles className="w-3 h-3 text-pink-400 animate-pulse" />
        Now Accepting Beta Testers — Join the Future of Baking
        <Sparkles className="w-3 h-3 text-pink-400 animate-pulse" />
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-50 animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-50 rounded-full blur-3xl opacity-50 animate-pulse" />
        </div>

        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 border border-pink-100 rounded-full text-primary text-xs font-bold mb-8 animate-in slide-in-from-bottom-4">
              <Zap className="w-3 h-3 fill-current" /> <span>Beta v1.0 is Live</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-serif font-black text-secondary mb-8 leading-[1.1] animate-in slide-in-from-bottom-8 duration-700">
              AI-Powered Cake Designs <br />
              <span className="text-primary italic">Baked On Time</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-12 duration-1000">
              Turn customer descriptions into stunning cake mockups, accurate quotes, and auto-bookings in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in slide-in-from-bottom-16 duration-1000">
              <Link href="/signup" className="btn btn-primary py-5 px-10 text-xl shadow-2xl shadow-pink-200 group flex items-center gap-3">
                Join Beta Tester Program <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/dashboard" className="btn btn-secondary py-5 px-10 text-xl border-secondary flex items-center gap-3">
                View Live Demo
              </Link>
            </div>

            <div className="mt-16 flex items-center justify-center gap-8 text-gray-400 opacity-60">
              <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> <span className="text-xs font-bold uppercase tracking-widest">Secure Payments</span></div>
              <div className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> <span className="text-xs font-bold uppercase tracking-widest">AI Trained Models</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* BETA PROGRAM INFO */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-black mb-8">Why Join the <span className="text-pink-400">Beta</span>?</h2>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                We&apos;re building BakeBot alongside the world&apos;s most talented custom bakers. As a beta tester, you&apos;ll get:
              </p>
              
              <ul className="space-y-6">
                <BetaBenefit icon="🎁" title="14 Days Full Access" description="Experience every premium feature completely free during testing." />
                <BetaBenefit icon="💎" title="Lifetime Founder Discount" description="Get a permanent 50% discount when we launch globally." />
                <BetaBenefit icon="🛠️" title="Influence the Roadmap" description="Suggest features and vote on what we build next." />
              </ul>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl">
              <div className="space-y-8">
                <h3 className="text-2xl font-bold">Current Beta Goals</h3>
                <div className="space-y-4">
                  <GoalItem label="AI Accuracy Training" progress={75} />
                  <GoalItem label="Pricing Engine Logic" progress={90} />
                  <GoalItem label="Multi-day Scheduling" progress={60} />
                  <GoalItem label="Customer Portal UX" progress={45} />
                </div>
                <div className="pt-8 border-t border-white/10">
                  <Link href="/signup" className="text-pink-400 font-bold hover:underline flex items-center gap-2">
                    Start Testing Today <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES */}
      <section className="py-32">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-serif font-black mb-6 text-secondary">Efficiency Baked In</h2>
            <p className="text-gray-500">Stop losing time on manual calculations and endless DMs. Let AI handle the heavy lifting.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<Palette className="w-8 h-8" />}
              title="AI Configurator"
              description="Turn text descriptions into realistic cake mockups that match your style."
              color="bg-pink-50 text-primary"
            />
            <FeatureCard 
              icon={<Calculator className="w-8 h-8" />}
              title="Auto-Quotes"
              description="Instant pricing based on your custom rules. No more guessing."
              color="bg-blue-50 text-blue-600"
            />
            <FeatureCard 
              icon={<Calendar className="w-8 h-8" />}
              title="Prep Planning"
              description="Automatic multi-day schedules broken down by task type."
              color="bg-orange-50 text-orange-600"
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8" />}
              title="Instant Booking"
              description="Send automated payment links and secure deposits instantly."
              color="bg-purple-50 text-purple-600"
            />
          </div>
        </div>
      </section>

      {/* UPCOMING FEATURES */}
      <section className="py-24 bg-gradient-to-br from-pink-50 via-white to-blue-50">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-pink-200 rounded-full text-primary text-xs font-bold mb-6">
              <Sparkles className="w-3 h-3 fill-current animate-pulse" /> <span>Coming Soon</span>
            </div>
            <h2 className="text-4xl font-serif font-black mb-6 text-secondary">What&apos;s Next</h2>
            <p className="text-gray-500">We&apos;re constantly evolving. Here&apos;s what we&apos;re building for you next.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:shadow-xl transition-all">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="font-bold text-secondary mb-2">Find a Local Baker</h3>
              <p className="text-sm text-gray-500">Connect with talented bakers in your area through our marketplace.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:shadow-xl transition-all">
              <div className="text-3xl mb-4">📸</div>
              <h3 className="font-bold text-secondary mb-2">Progress Updates</h3>
              <p className="text-sm text-gray-500">Share photos and mini videos of your baking process with customers.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:shadow-xl transition-all">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="font-bold text-secondary mb-2">Order Tracking</h3>
              <p className="text-sm text-gray-500">Status bars and ready-for-pickup notifications keep everyone informed.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-pink-200 hover:shadow-xl transition-all">
              <div className="text-3xl mb-4">💳</div>
              <h3 className="font-bold text-secondary mb-2">Payment Options</h3>
              <p className="text-sm text-gray-500">Multiple payment methods and flexible installment plans.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL / BETA INVITE */}
      <section className="py-24 bg-[#FFF9F9] border-y border-pink-50">
        <div className="container px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="text-6xl mb-8">🧁</div>
            <h2 className="text-4xl font-serif font-black mb-8 text-secondary">Ready to build the future of your bakery?</h2>
            <p className="text-lg text-gray-500 mb-12">
              We are currently only accepting 100 dedicated beta testers. Secure your spot and help us refine the ultimate tool for custom bakers.
            </p>
            <Link href="/signup" className="btn btn-primary py-5 px-12 text-xl shadow-2xl shadow-pink-200">
              Apply for Beta Access
            </Link>
          </div>
        </div>
      </section>
      
      <SiteFooter />
    </main>
  );
}

function BetaBenefit({ icon, title, description }: any) {
  return (
    <li className="flex gap-4">
      <div className="text-2xl shrink-0">{icon}</div>
      <div>
        <h4 className="font-bold text-white mb-1">{title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </li>
  );
}

function GoalItem({ label, progress }: any) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-pink-400 transition-all duration-1000 shadow-[0_0_10px_rgba(244,114,182,0.5)]" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: any) {
  return (
    <div className="p-8 rounded-[2rem] border border-gray-100 bg-white hover:border-pink-100 hover:shadow-2xl hover:shadow-pink-100/50 transition-all group duration-500">
      <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-secondary">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
