'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Save, Info, Palette, Send, Mail, Phone, Copy, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';

export default function NewDesignPage() {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [savedDesignId, setSavedDesignId] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState('');
  const quoteRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState({
    productType: 'cake', // cake, cupcakes, cookies, cakepops
    tiers: 1,
    quantity: 12, // for non-cakes
    flavor: 'Vanilla Bean',
    filling: 'Strawberry',
    addOns: [] as string[],
    theme: '',
    notes: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);
  const [useAiPricing, setUseAiPricing] = useState(true);
  const [manualPrice, setManualPrice] = useState<number | string>('');
  const [quote, setQuote] = useState({
    base: 65,
    decor: 0,
    filling: 15,
    addOns: 0,
    marketAdjustment: 12,
    total: 92
  });

  // Dynamic pricing calculation (AI Suggestion)
  useEffect(() => {
    let base = 0;
    let filling = 0;
    let decor = config.theme.length > 50 ? 80 : 40;
    let addOnsPrice = config.addOns.length * 20;
    // Pseudo-AI market adjustment based on complexity and "area"
    let marketAdjustment = Math.floor((config.theme.length / 10) + (config.addOns.length * 5));

    if (config.productType === 'cake') {
      base = config.tiers * 65;
      filling = config.filling === 'None' ? 0 : 15;
    } else if (config.productType === 'cupcakes') {
      base = (config.quantity / 12) * 45;
      filling = config.filling === 'None' ? 0 : 10;
    } else {
      base = (config.quantity / 12) * 35;
      filling = 0;
    }

    setQuote({
      base,
      decor,
      filling,
      addOns: addOnsPrice,
      marketAdjustment,
      total: base + decor + filling + addOnsPrice + marketAdjustment + 25 // + $25 service fee
    });
  }, [config]);

  const productTypes = [
    { id: 'cake', label: 'Custom Cake' },
    { id: 'cupcakes', label: 'Cupcakes' },
    { id: 'cookies', label: 'Cookies' },
    { id: 'cakepops', label: 'Cake Pops' }
  ];

  const addOnOptions = ['Fondant Work', 'Gold Leaf', 'Hand-painted', 'Fresh Flowers', 'Acrylic Topper', 'Chocolate Drip'];
  const flavors = ['Vanilla Bean', 'Rich Chocolate', 'Red Velvet', 'Lemon Zest', 'Carrot Cake', 'Confetti'];
  const fillings = ['None', 'Strawberry', 'Chocolate Ganache', 'Cream Cheese', 'Lemon Curd', 'Salted Caramel'];

  const handleGenerate = async () => {
    if (!config.theme) {
      alert('Please describe your theme first!');
      return;
    }
    setIsGenerating(true);
    try {
      const prompt = `A professional bakery photograph of ${config.productType === 'cake' ? `${config.tiers} tier cake` : `${config.quantity} ${config.productType}`}, theme: ${config.theme}. ${config.addOns.length > 0 ? `Add-ons: ${config.addOns.join(', ')}.` : ''} High quality, detailed icing, elegant presentation, soft studio lighting.`;
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setMockupUrl(data.imageUrl);
      setStep(2);
    } catch (err: any) {
      console.error(err);
      alert('AI Generation failed: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (isFinal = false) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please login to save designs');
        return;
      }

      const finalPrice = useAiPricing ? quote.total : (parseFloat(manualPrice as string) || 0);

      const { data: design, error: designError } = await supabase
        .from('cake_designs')
        .insert({
          baker_id: user.id,
          title: `${config.productType.toUpperCase()}: ${config.theme.slice(0, 20)}...` || 'Custom Design',
          description: config.theme,
          image_url: mockupUrl,
          configuration_data: config,
          estimated_price: finalPrice,
          is_public: false
        })
        .select()
        .single();

      if (designError) throw designError;

      if (isFinal) {
        // Create a pending order as well
        const { error: orderError } = await supabase
          .from('orders')
          .insert({
            baker_id: user.id,
            design_id: design.id,
            customer_email: 'pending@example.com', // Would be from a form
            customer_name: 'New Client',
            status: 'pending',
            total_price: finalPrice,
            delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Default 1 week out
          });
        
        if (orderError) throw orderError;
        
        // Set up share modal
        const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/quote/${design.id}`;
        setShareLink(link);
        setSavedDesignId(design.id);
        setShowShareModal(true);
      } else {
        alert('Draft saved! Screenshot this page and send to your customer.');
      }

      // Don't redirect yet if we're showing share modal
      if (!isFinal) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      alert('Error: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle sending via email
  const handleSendViaEmail = () => {
    const subject = encodeURIComponent(`Your Cake Quote - $${quote.total.toFixed(2)}`);
    const body = encodeURIComponent(
      `Hi! Here's your custom cake quote:\n\n` +
      `Design: ${config.theme}\n` +
      `Price: $${quote.total.toFixed(2)}\n\n` +
      `View your quote here: ${shareLink}\n\n` +
      `Would you like to create a customer account for easy scheduling and payments? ` +
      `It's optional - you can also just message your baker directly!\n\n` +
      `Let me know if you'd like any changes to the design!`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Handle sending via SMS
  const handleSendViaSMS = () => {
    const message = encodeURIComponent(
      `Here's your cake quote: $${quote.total.toFixed(2)} - View: ${shareLink}\n\n` +
      `Want to create an account for easy scheduling? Optional! Just message your baker directly.`
    );
    window.location.href = `sms:?body=${message}`;
  };

  // Handle copying link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Handle saving as image
  const handleSaveAsImage = async () => {
    if (!mockupUrl) return;
    
    setIsSaving(true);
    try {
      // First save as draft
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please login to save designs');
        return;
      }

      const finalPrice = useAiPricing ? quote.total : (parseFloat(manualPrice as string) || 0);

      const { data: design, error: designError } = await supabase
        .from('cake_designs')
        .insert({
          baker_id: user.id,
          title: `${config.productType.toUpperCase()}: ${config.theme.slice(0, 20)}...` || 'Custom Design',
          description: config.theme,
          image_url: mockupUrl,
          configuration_data: config,
          estimated_price: finalPrice,
          is_public: false,
          is_draft: true
        })
        .select()
        .single();

      if (designError) throw designError;

      // Download the mockup image
      const response = await fetch(mockupUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `cake-quote-${design.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('Draft saved! Image downloaded to your camera roll.');
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      alert('Error: ' + err.message);
    } finally {
      setIsSaving(false);
    }
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
              Product Type
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {productTypes.map((type) => (
                <button
                  key={type.id}
                  className={`py-3 rounded-xl border-2 transition-all font-bold text-sm ${config.productType === type.id ? 'border-primary bg-pink-50 text-primary shadow-sm' : 'border-gray-50 text-gray-400 hover:border-pink-100'}`}
                  onClick={() => setConfig({...config, productType: type.id})}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-pink-100 text-primary rounded-full flex items-center justify-center text-xs">2</span>
              Details
            </h2>
            
            <div className="space-y-6">
              {config.productType === 'cake' ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">Number of Tiers</label>
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
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">Quantity (Dozens)</label>
                  <input 
                    type="number" 
                    step="12"
                    min="12"
                    className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                    value={config.quantity}
                    onChange={(e) => setConfig({...config, quantity: parseInt(e.target.value)})}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="base-flavor" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Flavor</label>
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
                  <label htmlFor="filling" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Filling</label>
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
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">Add-ons & Accents</label>
                <div className="flex flex-wrap gap-2">
                  {addOnOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        const newAddOns = config.addOns.includes(opt) 
                          ? config.addOns.filter(a => a !== opt)
                          : [...config.addOns, opt];
                        setConfig({...config, addOns: newAddOns});
                      }}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${config.addOns.includes(opt) ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-gray-100 text-gray-400 hover:border-pink-200 hover:text-primary'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="theme" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Theme / Description</label>
                <textarea 
                  id="theme"
                  className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-4 focus:ring-primary/10 min-h-[100px] transition-all"
                  placeholder="e.g. Modern minimalist with white fondant and single gold butterfly..."
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
                  <h3 className="font-bold text-lg">Final Quote</h3>
                  <p className="text-sm text-gray-500">Suggested by AI + Manual Override</p>
                </div>
                <div className="text-2xl font-black text-secondary">
                  ${useAiPricing ? quote.total.toFixed(2) : (parseFloat(manualPrice as string) || 0).toFixed(2)}
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <button 
                    onClick={() => setUseAiPricing(true)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${useAiPricing ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}
                  >
                    AI Suggestion
                  </button>
                  <button 
                    onClick={() => setUseAiPricing(false)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${!useAiPricing ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}
                  >
                    Manual Price
                  </button>
                </div>

                {useAiPricing ? (
                  <div className="space-y-2 px-1">
                    <QuoteDetail label={`${config.productType === 'cake' ? `${config.tiers} Tier Cake` : `${config.quantity} ${config.productType}`} Base`} value={`$${quote.base.toFixed(2)}`} />
                    <QuoteDetail label="Theme & Decoration" value={`$${quote.decor.toFixed(2)}`} />
                    <QuoteDetail label="Fillings & Flavor" value={`$${quote.filling.toFixed(2)}`} />
                    <QuoteDetail label="Premium Add-ons" value={`$${quote.addOns.toFixed(2)}`} />
                    <QuoteDetail label="Market Adjustment (Area)" value={`$${quote.marketAdjustment.toFixed(2)}`} />
                    <QuoteDetail label="Service Fee" value="$25.00" />
                  </div>
                ) : (
                  <div className="space-y-2 px-1">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Set Custom Price ($)</label>
                    <input 
                      type="number"
                      className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 text-lg font-black outline-none focus:ring-4 focus:ring-primary/10"
                      placeholder="0.00"
                      value={manualPrice}
                      onChange={(e) => setManualPrice(e.target.value)}
                    />
                    <p className="text-[10px] text-gray-400 italic mt-2">Adjusted based on your local market & supply costs.</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button 
                  disabled={isSaving}
                  onClick={() => handleSave(false)}
                  className="flex-1 btn btn-secondary py-3 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Draft'}
                </button>
                <button 
                  disabled={isSaving}
                  onClick={() => handleSave(true)}
                  className="flex-1 btn btn-primary py-3 flex items-center justify-center gap-2 shadow-lg shadow-pink-100"
                >
                  <Send className="w-4 h-4" /> {isSaving ? 'Sending...' : 'Send to Customer'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Share Quote with Customer
              </h2>
              <button 
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">Share this link with your customer to view their custom cake quote.</p>
              
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <input 
                  type="text" 
                  value={shareLink}
                  readOnly
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                />
                <button 
                  onClick={handleCopyLink}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="Copy link"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleSendViaEmail}
                className="flex-1 bg-primary text-white py-3 px-4 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 font-bold"
              >
                <Mail className="w-4 h-4" />
                Send via Email
              </button>
              <button 
                onClick={handleSendViaSMS}
                className="flex-1 bg-secondary text-white py-3 px-4 rounded-xl hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 font-bold"
              >
                <Phone className="w-4 h-4" />
                Send via SMS
              </button>
            </div>
          </div>
        </div>
      )}
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
