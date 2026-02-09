import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="bg-secondary text-white pt-20 pb-10">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-3xl font-serif font-black text-white mb-6 block">BOT</Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-Powered Cake Design Platform for Professional Bakers. 
              Efficiency baked into every order.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-pink-400">Sitemap</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Early Access</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-pink-400">Dashboard</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Overview</Link></li>
              <li><Link href="/dashboard/designs" className="hover:text-white transition-colors">AI Configurator</Link></li>
              <li><Link href="/dashboard/production" className="hover:text-white transition-colors">Production Planner</Link></li>
              <li><Link href="/dashboard/referrals" className="hover:text-white transition-colors">Affiliate Program</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-pink-400">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; 2026 BakeBot. All rights reserved. Built with ❤️ for Bakers.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs">Instagram</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs">Twitter</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
