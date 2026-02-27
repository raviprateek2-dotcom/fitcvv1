'use client';

import { Check } from 'lucide-react';

import { TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';
import { useResumeEditorStore } from '@/store/resume-editor-store';
import type { ResumeData, Styling } from '../types';

const colorSwatches = [
  '#2563eb', // Blue
  '#16a34a', // Green
  '#dc2626', // Red
  '#9333ea', // Purple
  '#ea580c', // Orange
  '#171717', // Black
];

const availableTemplates = [
  { id: 'modern', name: 'Modern', isPremium: false, icon: <div className="w-full h-full bg-white flex flex-col items-center p-2 gap-1 rounded shadow-sm"><div className="w-8 h-2 bg-primary rounded-full mt-1"/><div className="w-12 h-1 bg-muted rounded-full"/><div className="w-full h-1 bg-muted rounded-full mt-2"/></div> },
  { id: 'classic', name: 'Classic', isPremium: false, icon: <div className="w-full h-full bg-white flex flex-col p-2 gap-1 rounded shadow-sm"><div className="w-full border-b pb-1 mb-1"><div className="w-12 h-2 bg-foreground rounded-full"/></div><div className="w-16 h-1 bg-muted rounded-full"/><div className="w-full h-1 bg-muted rounded-full"/></div> },
  { id: 'creative', name: 'Creative', isPremium: false, icon: <div className="w-full h-full bg-white flex flex-col p-2 gap-1 rounded shadow-sm"><div className="w-full h-6 bg-primary rounded flex items-center justify-center mb-1"><div className="w-8 h-1 bg-white rounded-full"/></div><div className="w-16 h-1 bg-muted rounded-full"/><div className="w-full h-1 bg-muted rounded-full"/></div> },
  { id: 'minimalist', name: 'Minimalist', isPremium: false, icon: <div className="w-full h-full bg-white flex flex-col items-start p-2 gap-1 rounded shadow-sm"><div className="w-8 h-2 bg-foreground rounded-full mt-1"/><div className="w-12 h-1 bg-muted/60 rounded-full" /><div className="w-1/2 h-1 bg-muted rounded-full mt-2"/></div> },
  { id: 'professional', name: 'Professional', isPremium: false, icon: <div className="w-full h-full bg-white flex flex-col p-2 gap-1 rounded shadow-sm"><div className="w-10 h-2 bg-foreground rounded-full mb-1"/><div className="w-full h-[1px] bg-muted mb-1" /><div className="w-full h-1 bg-muted rounded-full"/><div className="w-2/3 h-1 bg-muted rounded-full"/></div> },
  { id: 'executive', name: 'Executive', isPremium: false, icon: <div className="w-full h-full bg-white flex flex-col p-2 gap-1 rounded shadow-sm"><div className="w-12 h-2 bg-foreground rounded-full mb-1"/><div className="flex gap-2 w-full"><div className="w-1/3 h-6 bg-muted rounded"/><div className="w-2/3 h-1 bg-muted rounded-full"/></div></div> },
  { id: 'elegant', name: 'Elegant', isPremium: false, icon: <div className="w-full h-full bg-stone-50 flex flex-col items-center p-2 gap-2 rounded shadow-sm"><div className="w-full border-b border-stone-200 pb-1 flex flex-col items-center justify-center"><div className="w-10 h-2 bg-stone-800 rounded-full"/><div className="w-6 h-1 mt-1 bg-stone-400 rounded-full"/></div><div className="w-full h-1 bg-stone-300 rounded-full"/></div> },
  { id: 'technical', name: 'Technical', isPremium: false, icon: <div className="w-full h-full bg-white flex flex-col p-1.5 gap-1 rounded shadow-sm"><div className="w-full border-b-2 border-slate-900 pb-1 flex justify-between"><div className="w-10 h-2 bg-primary rounded-full"/><div className="w-4 h-1 bg-slate-400 rounded-full"/></div><div className="flex gap-1 w-full"><div className="w-2/3 space-y-1 mt-1"><div className="w-full h-1 bg-muted rounded-full"/><div className="w-5/6 h-1 bg-muted rounded-full"/></div><div className="w-1/3 space-y-1 mt-1"><div className="w-full h-2 bg-slate-900 rounded"/><div className="w-full h-2 bg-slate-900 rounded"/></div></div></div> },
];

const availableFonts = [
  { id: 'font-inter', name: 'Inter (Sans Serif)' },
  { id: 'font-lora', name: 'Lora (Serif)' },
  { id: 'font-space-grotesk', name: 'Space Grotesk (Modern)' },
  { id: 'font-montserrat', name: 'Montserrat (Headline)' },
]

export function DesignTab() {
  const { resumeData, setResumeData } = useResumeEditorStore();

  const handleFieldChange = <T extends keyof ResumeData>(field: T, value: ResumeData[T]) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const handleTemplateChange = (templateId: string) => {
    handleFieldChange('templateId', templateId);
  };

  const handleStylingChange = (field: keyof Styling, value: string | number) => {
    if (!resumeData || !resumeData.styling) return;
    handleFieldChange('styling', { ...resumeData.styling, [field]: value });
  };

  if (!resumeData) return null;

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={['template', 'styling']} className="w-full space-y-4">
        <AccordionItem value="template" className="border-none">
          <AccordionTrigger className="hover:no-underline py-0">
            <h3 className="text-xl font-bold font-headline transition-all group-data-[state=open]:text-primary">Template</h3>
          </AccordionTrigger>
          <AccordionContent className="pt-6 border-none">
            <div className="grid grid-cols-2 gap-4">
              {availableTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateChange(template.id)}
                  className={cn(
                    "relative flex flex-col items-center gap-3 p-3 rounded-2xl transition-all border duration-300 group",
                    resumeData.templateId === template.id 
                      ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]" 
                      : "border-white/10 hover:border-white/20 hover:bg-white/5"
                  )}
                >
                  <div className="w-full aspect-[8.5/11] border border-white/10 rounded-xl bg-white/5 overflow-hidden flex flex-col shadow-sm">
                    <div className="flex-1 w-full h-full pointer-events-none transition-transform duration-500 group-hover:scale-105 origin-top">
                        {template.icon}
                    </div>
                  </div>
                  <span className={cn(
                    "text-[11px] font-bold uppercase tracking-wider transition-colors",
                    resumeData.templateId === template.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}>{template.name}</span>
                  {resumeData.templateId === template.id && (
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="styling" className="border-none">
          <AccordionTrigger className="hover:no-underline py-0">
            <h3 className="text-xl font-bold font-headline transition-all group-data-[state=open]:text-primary">Typography & Colors</h3>
          </AccordionTrigger>
          <AccordionContent className="pt-6 space-y-8 border-none">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Typeface Selection</Label>
              <Select value={resumeData.styling?.fontFamily} onValueChange={(value) => handleStylingChange('fontFamily', value)}>
                <SelectTrigger className="rounded-xl bg-white/5 border-white/10 h-11 focus:ring-primary/20 transition-all">
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent className="bg-glass backdrop-blur-3xl border-white/10 rounded-xl">
                  {availableFonts.map(font => (
                    <SelectItem key={font.id} value={font.id} className="rounded-lg focus:bg-primary/20 focus:text-primary">
                      {font.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Brand Color System</Label>
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap gap-3">
                  {colorSwatches.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleStylingChange('accentColor', color)}
                      className={cn(
                        "w-9 h-9 rounded-xl border-2 transition-all duration-300 relative overflow-hidden",
                        resumeData.styling?.accentColor === color 
                          ? 'border-white ring-4 ring-primary/30 scale-110 z-10' 
                          : 'border-white/5 hover:scale-110 shadow-lg'
                      )}
                      style={{ backgroundColor: color }}
                    >
                       {resumeData.styling?.accentColor === color && <div className="absolute inset-0 flex items-center justify-center bg-black/10"><Check className="w-4 h-4 text-white" /></div>}
                    </button>
                  ))}
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex justify-center shadow-inner">
                    <HexColorPicker 
                      color={resumeData.styling?.accentColor?.startsWith('#') ? resumeData.styling.accentColor : '#2563eb'} 
                      onChange={(color) => handleStylingChange('accentColor', color)} 
                    />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Headline Scale</Label>
                  <span className="text-xs font-bold text-primary">{resumeData.styling?.titleFontSize}px</span>
                </div>
                <Slider value={[resumeData.styling?.titleFontSize || 36]} onValueChange={([val]) => handleStylingChange('titleFontSize', val)} min={24} max={60} step={1} className="py-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Document Reading Scale</Label>
                  <span className="text-xs font-bold text-primary">{resumeData.styling?.bodyFontSize}px</span>
                </div>
                <Slider value={[resumeData.styling?.bodyFontSize || 14]} onValueChange={([val]) => handleStylingChange('bodyFontSize', val)} min={10} max={18} step={0.5} className="py-2" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
