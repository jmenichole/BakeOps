'use client';

import { useState } from 'react';
import { HelpCircle, Mail, ChevronDown, ChevronUp, Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const faqs = [
    {
      q: "How does the AI cake design work?",
      a: "Bake Ops uses advanced stable diffusion models trained on thousands of bakery images. When you describe a theme, our AI generates a unique, professional mockup to help your clients visualize their order before you even touch a spatula."
    },
    {
      q: "Can I customize the pricing suggestions?",
      a: "Absolutely! Bake Ops provides an AI-suggested price based on complexity, but you have full control to override it with your own pricing, markups, and supply costs."
    },
    {
      q: "What are 'Non-Cake Sweets'?",
      a: "We support more than just cakes! You can create designs and quotes for cupcakes, cookies, cake pops, and dessert tables within the 'New Design' flow."
    },
    {
      q: "How do I manage my subscription?",
      a: "You can manage your billing and subscription in the Dashboard under Settings. During our beta period, most testers have exclusive lifetime access."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F9] pb-20">
      {/* Header */}
      <div className="bg-secondary text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-400 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <Link href="/" className="inline-block text-primary font-black tracking-widest text-xs uppercase mb-6 hover:opacity-80 transition-opacity">Back to Home</Link>
          <h1 className="text-4xl sm:text-6xl font-serif font-black mb-6">How can we help?</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to Bake Ops Support. Find answers to common questions or reach out to our team directly.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-bake bg-white">
              <h2 className="text-2xl font-serif font-black text-secondary mb-8 flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-primary" /> Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-50 rounded-2xl overflow-hidden transition-all">
                    <button 
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-5 text-left bg-gray-50/50 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-bold text-secondary">{faq.q}</span>
                      {openFaq === index ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </button>
                    {openFaq === index && (
                      <div className="p-5 bg-white text-gray-500 text-sm leading-relaxed animate-in slide-in-from-top-2 duration-300">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Support Channels */}
            <div className="card-bake p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-pink-50 text-primary rounded-2xl flex items-center justify-center mb-6 border border-pink-100 shadow-sm">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-secondary mb-2">Email Support</h3>
              <p className="text-xs text-gray-400 mb-6">Response time: &lt; 24 hours</p>
              <a href="mailto:jmenichole007@outlook.com" className="text-primary font-bold hover:underline">jmenichole007@outlook.com</a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <div className="card-bake sticky top-8">
              {!submitted ? (
                <>
                  <h3 className="text-xl font-bold text-secondary mb-2">Send a Message</h3>
                  <p className="text-sm text-gray-400 mb-8">Need something specific? We&apos;re here.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                        placeholder="Baker Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Email Address</label>
                      <input 
                        required
                        type="email" 
                        className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                        placeholder="hello@bakery.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Your Message</label>
                      <textarea 
                        required
                        className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all min-h-[150px]"
                        placeholder="How can we help you today?"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full btn btn-primary py-4 flex items-center justify-center gap-2"
                    >
                      {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-2">Message Sent!</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-8">
                    Thanks for reaching out. We&apos;ve received your request and will get back to you shortly.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="text-primary font-bold hover:underline text-sm">Send another message</button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
