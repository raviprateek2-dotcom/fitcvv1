'use client';

import { Rocket, Shield, Cpu, Globe, ArrowUpRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative mt-20 px-4 pb-12 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-glass border border-white/5 rounded-[40px] p-8 md:p-16 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24 relative z-10">
            <div className="flex flex-col gap-8">
              <Link href="/" className="flex items-center gap-4 font-black font-headline text-3xl group w-fit">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <Rocket className="h-7 w-7" />
                </div>
                <span className="text-gradient">FitCV</span>
              </Link>
              <p className="text-sm text-muted-foreground/60 leading-relaxed font-medium max-w-xs">
                The world's most advanced AI Career Intelligence Platform. Engineered for elite professionals who demand visual and strategic excellence.
              </p>
              <div className="flex gap-4">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 transition-all cursor-pointer group/icon">
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover/icon:text-primary transition-colors" />
                   </div>
                 ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80 mb-2 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5" /> Product Suite
              </h3>
              <div className="space-y-4">
                {['Templates', 'Command Center', 'Career Blog', 'Interview Lab'].map((link) => (
                  <Link key={link} href="#" className="text-xs font-bold text-muted-foreground/60 hover:text-white transition-all flex items-center gap-2 group/link">
                      <div className="w-1 h-1 rounded-full bg-primary/40 group-hover/link:w-4 group-hover/link:bg-primary transition-all" />
                      {link}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80 mb-2 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> Company
              </h3>
              <div className="space-y-4">
                {['Genesis', 'Manifesto', 'Status: Optimal', 'Partner Program'].map((link) => (
                  <Link key={link} href="#" className="text-xs font-bold text-muted-foreground/60 hover:text-white transition-all flex items-center gap-2 group/link">
                      <div className="w-1 h-1 rounded-full bg-primary/40 group-hover/link:w-4 group-hover/link:bg-primary transition-all" />
                      {link}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="p-6 rounded-[28px] bg-white/[0.03] border border-white/5 space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Stay Sharp
                 </h4>
                 <div className="relative">
                    <input type="text" placeholder="Email Address" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:border-primary/40 transition-all" />
                    <button className="absolute right-2 top-1.5 bottom-1.5 px-3 rounded-lg bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Submit</button>
                 </div>
                 <p className="text-[9px] text-muted-foreground/40 leading-relaxed font-bold uppercase tracking-tighter">Enter the grid for elite career drops.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
                &copy; {new Date().getFullYear()} FITCV CORE ARCHITECTURE.
              </p>
              <div className="flex gap-8">
                  {['Twitter', 'LinkedIn', 'Instagram'].map(social => (
                    <span key={social} className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 hover:text-primary transition-all cursor-pointer">
                      {social}
                    </span>
                  ))}
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
