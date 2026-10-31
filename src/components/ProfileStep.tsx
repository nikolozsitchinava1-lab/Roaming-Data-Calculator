/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UsageProfileId } from '../types/calculator.ts';
import { USAGE_PROFILES } from '../data/config.ts';
import { Check, ArrowRight, ArrowLeft, Sliders, Sparkles, Feather, Compass, Flame } from 'lucide-react';

interface ProfileStepProps {
  selectedProfileId: UsageProfileId;
  onSelectProfile: (profileId: 'light' | 'normal' | 'heavy') => void;
  onNext: () => void;
  onBack: () => void;
  onSkipToResults?: () => void;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({
  selectedProfileId,
  onSelectProfile,
  onNext,
  onBack,
  onSkipToResults,
}) => {
  const profiles = [
    {
      ...USAGE_PROFILES.light,
      icon: Feather,
      dailyRate: '~0.35 GB / day',
      color: '#5D3BE0',
      highlights: [
        '1 hr 15 min Maps & Navigation',
        '2 hr 30 min Essential Messaging',
        '30 min Web & Restaurant Lookups',
      ],
    },
    {
      ...USAGE_PROFILES.normal,
      icon: Compass,
      dailyRate: '~1.85 GB / day',
      color: '#5D3BE0',
      highlights: [
        '2 hr Maps & Transit Routing',
        '3 hr 30 min Chat & Messaging',
        '1 hr 15 min Social Media Feed',
        '1 hr 30 min Music Streaming',
        '30 min Standard SD Video',
      ],
    },
    {
      ...USAGE_PROFILES.heavy,
      icon: Flame,
      dailyRate: '~4.80 GB / day',
      color: '#5D3BE0',
      highlights: [
        '1 hr 15 min HD 1080p Video',
        '1 hr 30 min Laptop Hotspot Tether',
        '45 min Video Calls (Zoom/Meet)',
        '2 hr Music & Podcasts',
        '2 hr Social Media autoplays',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & context */}
      <div>
        <div className="text-xs font-semibold text-[#5D3BE0] uppercase tracking-wider mb-1">
          Step 3 · Usage Persona
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D153C] tracking-tight">
          Choose your travel roaming style
        </h2>
        <p className="text-sm text-[#484555] mt-1">
          Selecting a persona initializes all 9 activity sliders with realistic habits. You can fine-tune every minute in the next step.
        </p>
      </div>

      {/* 3 Profile Cards matching BrandBook specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profiles.map((p) => {
          const isSelected = selectedProfileId === p.id;
          const isCustomizedFromThis = selectedProfileId === 'custom';
          const Icon = p.icon;

          return (
            <div
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectProfile(p.id as 'light' | 'normal' | 'heavy')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectProfile(p.id as 'light' | 'normal' | 'heavy');
                }
              }}
              className={`relative p-5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between select-none ${
                isSelected
                  ? 'bg-[#F0EDFB] border-2 border-[#5D3BE0] shadow-md ring-2 ring-[#5D3BE0]/20'
                  : 'bg-white border-[#E2DCF7] hover:border-[#5D3BE0]/50 hover:bg-[#F8F7FD] shadow-xs'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#5D3BE0] text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#5D3BE0] text-white shadow-xs'
                        : 'bg-[#F0EDFB] text-[#5D3BE0] border border-[#E2DCF7]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#5D3BE0] bg-white px-2.5 py-0.5 rounded-full border border-[#E2DCF7] tabular-nums">
                    {p.dailyRate}
                  </span>
                </div>

                <div className="text-xs font-semibold text-[#5D3BE0] mb-0.5">
                  {p.subtitle}
                </div>
                <h3 className="text-lg font-bold text-[#1D153C]">
                  {p.title}
                </h3>
                <p className="text-xs text-[#484555] mt-1.5 leading-relaxed">
                  {p.description}
                </p>

                {/* Pre-initialized activities list */}
                <div className="mt-4 pt-3 border-t border-[#E2DCF7] space-y-1.5">
                  <div className="text-[11px] font-semibold text-[#3C2F80] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#5D3BE0]" />
                    <span>Preset Activity Defaults:</span>
                  </div>
                  {p.highlights.map((h, i) => (
                    <div key={i} className="text-[11px] text-[#484555] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5D3BE0] shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E2DCF7] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#3C2F80] tabular-nums">
                  {p.badge}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-[#5D3BE0] text-white'
                      : 'text-[#5D3BE0] bg-[#F0EDFB]'
                  }`}
                >
                  {isSelected ? 'Active Baseline' : 'Apply Profile'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Notice about customization */}
      <div className="p-4 bg-white border border-[#E2DCF7] rounded-xl flex items-start gap-3 shadow-xs">
        <Sliders className="w-5 h-5 text-[#5D3BE0] shrink-0 mt-0.5" />
        <div className="text-xs text-[#484555] leading-relaxed">
          <strong className="text-[#1D153C]">Granular Activity Customization:</strong> Choosing a profile is just the starting point. Next, you can expand any activity card to adjust daily hours, add 15-minute intervals, or zero out unused apps.
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-[#E2DCF7] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md border border-[#E2DCF7] text-xs font-semibold text-[#3C2F80] hover:bg-[#F0EDFB] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Duration</span>
        </button>

        <div className="flex items-center gap-2">
          {onSkipToResults && (
            <button
              type="button"
              onClick={onSkipToResults}
              className="px-4 py-2.5 rounded-md border border-[#E2DCF7] text-xs font-semibold text-[#3C2F80] hover:bg-[#F0EDFB] transition-colors cursor-pointer"
            >
              Skip to Plan Results
            </button>
          )}

          <button
            type="button"
            onClick={onNext}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#5D3BE0] hover:bg-[#4E2EC7] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-[0.98]"
          >
            <span>Fine-Tune 9 Activities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
