'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Save, Info, Palette } from 'lucide-react';
import Link from 'next/link';

export default function NewDesignPage() {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    tiers: 1,
    servings: 20,
    flavor: 'Vanilla Bean',
    filling: 'Strawberry',
    colorPalette: ['#FFFFFF', '#FFB6C1'],
    theme: '',
    notes: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);

  const flavors = ['Vanilla Bean', 'Rich Chocolate', 'Red Velvet', 'Lemon Zest', 'Carrot Cake', 'Confetti'];
  const fillings = ['Strawberry', 'Chocolate Ganache', 'Cream Cheese', 'Lemon Curd', 'Salted Caramel'];

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setMockupUrl('https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80');
      setStep(2);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/dashboard/designs" className="p-2 hover:bg-white rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">New Cake Design</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Configuration Form */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-pink-100 text-primary rounded-full flex items-center justify-center text-xs">1</span>
              Base Configuration
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tiers</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      className={`py-2 rounded-lg border-2 transition-all ${config.tiers === n ? 'border-primary bg-pink-50 text-primary font-bold' : 'border-gray-50 text-gray-400'}`}
                      onClick={() => setConfig({...config, tiers: n})}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="base-flavor" className="block text-sm font-medium text-gray-700 mb-2">Base Flavor</label>
                  <select 
                    id="base-flavor"
                    className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-primary/20"
                    value={config.flavor}
                    onChange={(e) => setConfig({...config, flavor: e.target.value})}
                  >
                    {flavors.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="filling" className="block text-sm font-medium text-gray-700 mb-2">Filling</label>
                  <select 
                    id="filling"
                    className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-primary/20"
                    value={config.filling}
                    onChange={(e) => setConfig({...config, filling: e.target.value})}
                  >
                    {fillings.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">Theme / Inspiration</label>
                <textarea 
                  id="theme"
                  className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                  placeholder="e.g. Enchanted forest with gold butterflies and soft pastel flowers..."
                  value={config.theme}
                  onChange={(e) => setConfig({...config, theme: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full btn btn-primary py-4 text-lg flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                AI is Designing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate AI Mockup
              </>
            )}
          </button>
        </div>

        {/* Right: Preview / Mockup */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm aspect-square flex flex-col items-center justify-center relative overflow-hidden">
            {mockupUrl ? (
              <>
                <img src={mockupUrl} alt="Cake Mockup" className="w-full h-full object-cover rounded-xl" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-primary shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI GENERATED
                </div>
              </>
            ) : (
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Palette className="w-10 h-10" />
                </div>
                <h3 className="font-bold text-gray-400 mb-2">No Mockup Yet</h3>
                <p className="text-sm text-gray-400">Configure your cake and click "Generate" to see the AI magic.</p>
              </div>
            )}
          </div>

          {mockupUrl && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-lg">Estimated Quote</h3>
                  <p className="text-sm text-gray-500">Based on your configuration</p>
                </div>
                <div className="text-2xl font-black text-secondary">$185.00</div>
              </div>
              
              <div className="space-y-3 mb-8">
                <QuoteDetail label="Base Price (1 Tier)" value="$65.00" />
                <QuoteDetail label="Custom Theme Decoration" value="$80.00" />
                <QuoteDetail label="Premium Filling" value="$15.00" />
                <QuoteDetail label="Service Fee" value="$25.00" />
              </div>

              <div className="flex gap-3">
                <button className="flex-1 btn btn-secondary py-3 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Save Draft
                </button>
                <button className="flex-1 btn btn-primary py-3">Send to Customer</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuoteDetail({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
