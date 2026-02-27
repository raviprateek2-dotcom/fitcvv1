'use client';

import { motion } from 'framer-motion';

const logos = [
  'Google', 'Amazon', 'Meta', 'Netflix', 'Tesla', 'Microsoft', 'Apple', 'Adobe'
];

export function TrustMarquee() {
  return (
    <div className="w-full py-12 bg-white/[0.01] border-y border-white/5 overflow-hidden select-none">
      <div className="container mx-auto px-4 mb-8 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">
          Trusted by professionals from leading institutions
        </p>
      </div>
      
      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16 py-4">
          {logos.concat(logos).map((logo, idx) => (
            <span 
              key={idx} 
              className="text-2xl md:text-3xl font-headline font-black text-muted-foreground/20 hover:text-primary/40 transition-colors cursor-default"
            >
              {logo}
            </span>
          ))}
        </div>

        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-16 py-4">
          {logos.concat(logos).map((logo, idx) => (
            <span 
              key={idx + logos.length} 
              className="text-2xl md:text-3xl font-headline font-black text-muted-foreground/20 hover:text-primary/40 transition-colors cursor-default"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
      
      {/* CSS for custom marquee if not in tailwind config */}
      <style jsx>{`
        .animate-marquee {
          display: inline-flex;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee2 {
          display: inline-flex;
          position: absolute;
          top: 0;
          left: 100%;
          animation: marquee2 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
