import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOrganizationStore } from "@/shared/stores/organizationStore";
import { toast } from 'sonner';
import { Palette, Upload, CheckCircle2, Sparkles, Image as ImageIcon } from 'lucide-react';

export const BrandingSettings: React.FC = () => {
  const { branding, updateBranding } = useOrganizationStore();
  const [primaryColor, setPrimaryColor] = useState(branding?.primaryColor || '#1E40AF');
  const [secondaryColor, setSecondaryColor] = useState(branding?.secondaryColor || '#2563EB');
  const [accentColor, setAccentColor] = useState(branding?.accentColor || '#16A34A');
  const [fontFamily, setFontFamily] = useState(branding?.fontFamily || 'Inter');

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranding({
      primaryColor,
      secondaryColor,
      accentColor,
      fontFamily,
    });
    toast.success('Branding Theme Updated', {
      description: 'Dynamic tenant color scheme applied across all candidate exam runners and portals.',
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Organization Branding & Theme</h1>
        <p className="text-sm text-gray-400 mt-1">Customize logos, color schemes, typography, and candidate portal branding</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Controls */}
        <div className="lg:col-span-7">
          <Card className="glass-card p-6 border-white/10 space-y-6">
            <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Palette className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Color Palette & Fonts</h2>
            </div>

            <form onSubmit={handleSaveBranding} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-300 uppercase font-medium">Primary Brand</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-9 h-9 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="bg-surface-dark border-white/10 text-white font-mono text-xs" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-300 uppercase font-medium">Secondary Brand</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-9 h-9 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="bg-surface-dark border-white/10 text-white font-mono text-xs" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-gray-300 uppercase font-medium">Success Accent</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-9 h-9 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="bg-surface-dark border-white/10 text-white font-mono text-xs" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-300 uppercase font-medium">Typography Font Family</Label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-surface-dark border border-white/10 text-white text-xs"
                >
                  <option value="Inter">Inter (Default Enterprise)</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                  <option value="IBM Plex Sans">IBM Plex Sans (Healthcare)</option>
                  <option value="Roboto">Roboto</option>
                </select>
              </div>

              <Button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold shadow-lg shadow-primary/20">
                Save Branding Theme
              </Button>
            </form>
          </Card>
        </div>

        {/* Live Theme Preview */}
        <div className="lg:col-span-5">
          <Card className="glass-card p-6 border-white/10 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center">
              <Sparkles className="w-4 h-4 text-primary mr-2" />
              Live Candidate Exam Portal Preview
            </h3>

            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <div style={{ backgroundColor: primaryColor }} className="w-6 h-6 rounded flex items-center justify-center font-bold text-white text-xs">
                    M
                  </div>
                  <span className="font-bold text-white text-xs">MIT Examination Portal</span>
                </div>
                <span style={{ backgroundColor: `${accentColor}20`, color: accentColor, borderColor: `${accentColor}40` }} className="text-[10px] font-mono px-2 py-0.5 rounded border font-bold">
                  VERIFIED CANDIDATE
                </span>
              </div>

              <div className="space-y-2 text-xs text-gray-300 font-mono">
                <p className="text-white font-semibold">CS-101 Final Exam — Question #12</p>
                <div className="p-3 rounded bg-surface-dark border border-white/5 space-y-2">
                  <p>Which data structure offers O(1) amortized insertion?</p>
                  <div style={{ borderColor: primaryColor }} className="p-2 rounded border bg-primary/10 text-white font-bold">
                    A) Dynamic Array Vector [Selected]
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BrandingSettings;
