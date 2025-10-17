
'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

interface ProFeatureWrapperProps {
    isPro: boolean;
    children: React.ReactNode;
}

export const ProFeatureWrapper: React.FC<ProFeatureWrapperProps> = ({ isPro, children }) => {
    if (isPro) {
      return <>{children}</>;
    }
  
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative w-full">
              <div className="w-full h-full absolute top-0 left-0 z-10 cursor-not-allowed"/>
              {children}
               <div className="absolute -top-2 -right-2 z-20">
                  <div className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      Pro
                  </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upgrade to Pro to use this feature.</p>
            <Button size="sm" asChild className="mt-2 w-full">
              <Link href="/pricing">Upgrade</Link>
            </Button>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

    