'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Mail, 
  Phone, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  Printer,
  Info
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CakeConfig } from '@/types/database';

interface Design {
  id: string;
  title: string;
  description: string;
  image_url: string;
  estimated_price: number;
  configuration_data: CakeConfig;
  bakers: {
    email: string;
    role: string;
    is_premium: boolean;
  } | null;
}

export default function PublicQuotePage() {
  const { id } = useParams();
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function fetchQuote() {
      if (!id) return;

      const { data, error: fetchError } = await supabase
        .from('cake_designs')
        .select(`
          id,
          title,
          description,
          image_url,
          estimated_price,
          configuration_data,
          bakers (
            email,
            role,
            is_premium
          )
        `)
        .eq('id', id)
        .single();

      if (fetchError || !data) {
        console.error('Error fetching quote:', fetchError);
        setError(true);
      } else {
        setDesign(data as any);
      }
      setLoading(false);
    }

    fetchQuote();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F9]">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !design) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FFF9F9] text-center">
        <div className="w-20 h-20 bg-pink-50 rounded-3xl flex items-center justify-center mb-8 text-pink-300">
            <Info className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif font-black mb-4">Quote Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-sm">This quote may have expired or the link is incorrect. Please contact your baker directly.</p>
        <Link href="/" className="btn btn-primary px-8">Back to Home</Link>
      </div>
    );
  }

  const { configuration_data: config } = design;

  return (
    <main className="min-h-screen bg-[#FFF9F9] pb-24 selection:bg-pink-100">
      {/* HEADER BAR */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-50">
        <div className="container px-4 flex items-center justify-between h-16 max-w-6xl mx-auto">
          <Link href="/" className="text-xl font-serif font-black text-secondary">
            Bake Ops
          </Link>
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-pink-400">
              <span className="flex items-center gap-1.5 ring-1 ring-pink-100 px-3 py-1.5 rounded-full bg-white shadow-sm">
                <Sparkles className="w-3 h-3" />
                Custom Quote
              </span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-12 md:pt-20">
        {/* HERO GRID */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* LEFT: MOCKUP PREVIEW */}
          <div className="lg:col-span-7 space-y-6">
            <div className="group relative aspect-square bg-white rounded-[3rem] p-4 shadow-2xl shadow-pink-100/30 overflow-hidden border border-white">
                <Image 
                  src={design.image_url} 
                  alt="Cake Mockup" 
                  className="w-full h-full object-cover rounded-[2.5rem] transition-transform duration-700 group-hover:scale-105"
                  fill
                  unoptimized={design.image_url.startsWith('data:')}
                />
                <div className="absolute top-8 right-8 bg-white/90 backdrop-blur font-bold text-[10px] uppercase tracking-widest text-primary px-4 py-2 rounded-full shadow-lg border border-pink-50">
                    AI Visual Concept
                </div>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-primary">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Availability</p>
                        <p className="text-sm font-black text-secondary">Date Reserved</p>
                    </div>
                </div>
                <div className="flex-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-secondary">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Security</p>
                        <p className="text-sm font-black text-secondary">Verified Baker</p>
                    </div>
                </div>
            </div>
          </div>

          {/* RIGHT: QUOTE DETAILS */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            <div>
              <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-4 block">Personalized Quote</span>
              <h1 className="text-4xl md:text-5xl font-serif font-black text-secondary leading-tight mb-4">
                {design.title || 'Your Custom Design'}
              </h1>
              <p className="text-gray-500 leading-relaxed font-medium">
                {design.description || "A beautiful custom creation tailored to your specific vision and taste preferences."}
              </p>
            </div>

            {/* SPECS */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-pink-100/20 space-y-6">
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <SpecItem label="Type" value={config?.productType || 'Custom'} />
                    <SpecItem label="Flavor" value={config?.flavor || 'Standard'} />
                    <SpecItem label="Filling" value={config?.filling || 'None'} />
                    <SpecItem label="Tiers/Qty" value={config?.tiers ? `${config.tiers} Tiers` : `${config?.quantity} Qty`} />
                </div>
                
                <div className="pt-6 border-t border-gray-50">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-3">Included Customizations</label>
                    <div className="flex flex-wrap gap-2">
                        {config?.addOns?.map((addon: string) => (
                            <span key={addon} className="px-3 py-1.5 bg-gray-50 text-secondary text-[10px] font-bold uppercase tracking-wider rounded-lg border border-gray-100">
                                {addon}
                            </span>
                        )) || <span className="text-xs text-gray-400 italic">No specific add-ons listed.</span>}
                    </div>
                </div>

                <div className="pt-10 flex items-end justify-between items-center bg-[#FFF9F9] -mx-4 -mb-4 p-8 rounded-b-[2rem] border-t border-pink-50">
                    <div>
                        <p className="text-xs font-bold text-gray-400 mb-1">Total Quote Amount</p>
                        <h2 className="text-4xl font-black text-secondary leading-none">
                            ${design.estimated_price?.toFixed(2)}
                        </h2>
                    </div>
                    <Link href={`mailto:${design.bakers?.email}`} className="btn btn-primary py-4 px-6 shadow-none flex items-center gap-2">
                        Approve <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* BAKER BIO */}
            <div className="p-8 rounded-[2rem] bg-secondary text-white relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative z-10">
                    <p className="text-pink-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Business Contact</p>
                    <h3 className="text-xl font-bold mb-6">Connect with your Baker</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-pink-400"><Mail className="w-4 h-4" /></div>
                            <span className="text-sm font-medium text-gray-300">{design.bakers?.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-pink-400"><Clock className="w-4 h-4" /></div>
                            <span className="text-sm font-medium text-gray-300">Mon - Sat, 9am - 6pm</span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-center text-[10px] text-gray-400 font-medium px-4">
                Quotes are estimated based on ingredients and labor. <br />Final invoice may vary depending on design refinements.
            </p>
          </div>

        </div>
      </div>

      {/* FLOATING CTAS FOR MOBILE */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50">
          <Link href={`mailto:${design.bakers?.email}`} className="btn btn-primary w-full py-5 text-lg shadow-2xl flex items-center justify-center gap-3">
              Approve Design <ChevronRight className="w-5 h-5" />
          </Link>
      </div>

    </main>
  );
}

function SpecItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100/50">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-black text-secondary truncate">{value}</p>
        </div>
    );
}
