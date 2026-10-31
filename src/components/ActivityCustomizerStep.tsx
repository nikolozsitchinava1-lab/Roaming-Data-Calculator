/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActivityDurations, ActivityId } from '../types/calculator.ts';
import { ACTIVITY_RATE_CONFIGS } from '../data/config.ts';
import { durationToHours, formatDataAmount } from '../utils/calculatorEngine.ts';
import { ActivityIcon } from './ActivityIcon.tsx';
import {
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  Info,
  Clock,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react';

interface ActivityCustomizerStepProps {
  durations: ActivityDurations;
  tripDays: number;
  onChangeDuration: (activityId: ActivityId, hours: number, minutes: number) => void;
  onResetToProfile: () => void;
  onNext: () => void;
  onBack: () => void;
}

export const ActivityCustomizerStep: React.FC<ActivityCustomizerStepProps> = ({
  durations,
  tripDays,
  onChangeDuration,
  onResetToProfile,
  onNext,
  onBack,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'essential' | 'media' | 'heavy'>('all');
  const [showRateInfo, setShowRateInfo] = useState(false);

  // Set initial expanded states: top 4 expanded by default
  const [expandedActivities, setExpandedActivities] = useState<Record<string, boolean>>({
    navigation: true,
    messaging: true,
    social: true,
    hd_video: true,
  });

  const toggleExpand = (id: string) => {
    setExpandedActivities((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    Object.keys(ACTIVITY_RATE_CONFIGS).forEach((k) => {
      allExpanded[k] = true;
    });
    setExpandedActivities(allExpanded);
  };

  const collapseAll = () => {
    setExpandedActivities({});
  };

  const activities = Object.values(ACTIVITY_RATE_CONFIGS);

  const filteredActivities = activities.filter((act) => {
    if (activeCategory === 'all') return true;
    return act.category === activeCategory;
  });

  const handleHourStep = (id: ActivityId, delta: number) => {
    const current = durations[id] || { hours: 0, minutes: 0 };
    const newHours = Math.max(0, Math.min(24, current.hours + delta));
    onChangeDuration(id, newHours, current.minutes);
  };

  const handleMinuteStep = (id: ActivityId, delta: number) => {
    const current = durations[id] || { hours: 0, minutes: 0 };
    let totalMinutes = current.hours * 60 + current.minutes + delta;
    if (totalMinutes < 0) totalMinutes = 0;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    onChangeDuration(id, newHours, newMins);
  };

  const handleSliderChange = (id: ActivityId, totalQuarterHours: number) => {
    const totalMinutes = Math.round(totalQuarterHours * 15);
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    onChangeDuration(id, newHours, newMins);
  };

  const handleSetExactMinutes = (id: ActivityId, mins: number) => {
    const current = durations[id] || { hours: 0, minutes: 0 };
    onChangeDuration(id, current.hours, mins);
  };

  const handleZeroOut = (id: ActivityId) => {
    onChangeDuration(id, 0, 0);
  };

  return (
    <div className="space-y-6">
      {/* Title & context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="text-xs font-semibold text-[#5D3BE0] uppercase tracking-wider mb-1">
            Step 4 · Activity Customizer
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D153C] tracking-tight">
            Fine-tune your daily online habits
          </h2>
          <p className="text-sm text-[#484555] mt-1">
            Expand any activity card to calibrate daily duration in hours &amp; minutes. Live estimates update instantly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRateInfo(!showRateInfo)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#3C2F80] bg-[#F0EDFB] border border-[#E2DCF7] rounded-md hover:bg-[#E7DEFF] transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-[#5D3BE0]" />
            <span>{showRateInfo ? 'Hide Benchmarks' : 'Rate Benchmarks'}</span>
          </button>

          <button
            type="button"
            onClick={onResetToProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#5D3BE0] bg-white border border-[#E2DCF7] rounded-md hover:bg-[#F8F7FD] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Profile</span>
          </button>
        </div>
      </div>

      {/* Benchmark disclosure if open */}
      {showRateInfo && (
        <div className="p-4 bg-white border border-[#E2DCF7] rounded-xl text-xs text-[#484555] space-y-2 shadow-xs">
          <div className="font-bold text-[#1D153C] flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-[#5D3BE0]" />
            <span>Published Consumption Standards &amp; Engineering Assumptions</span>
          </div>
          <p>
            Calculations use the midpoint of published mobile industry consumption ranges:
            Navigation (5–10 MB/h, avg 7.5 MB/h), Messaging (0.2–1.0 MB/h, conservative 0.75 MB/h),
            Social Media (30–100 MB/h, avg 65 MB/h), Browsing (10–25 MB/h, avg 17.5 MB/h),
            Music (40–80 MB/h, avg 60 MB/h), SD Video (300–700 MB/h, avg 500 MB/h),
            HD Video (1,500–3,000 MB/h, avg 2,250 MB/h), Video Calls (250–900 MB/h, avg 575 MB/h),
            and Personal Hotspot (100–300 MB/h, avg 200 MB/h).
          </p>
          <div className="text-[11px] text-[#797587]">
            Note: 1 GB is strictly calculated as 1,000 MB. Actual traffic varies with network compression and video bitrates.
          </div>
        </div>
      )}

      {/* Category Filter Tabs & Expand/Collapse Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#5D3BE0] text-white shadow-xs'
                : 'bg-[#F0EDFB] text-[#3C2F80] hover:bg-[#E7DEFF]'
            }`}
          >
            All 9 Activities
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('essential')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategory === 'essential'
                ? 'bg-[#5D3BE0] text-white shadow-xs'
                : 'bg-[#F0EDFB] text-[#3C2F80] hover:bg-[#E7DEFF]'
            }`}
          >
            Essential (Maps, Chat, Browsing)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('media')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategory === 'media'
                ? 'bg-[#5D3BE0] text-white shadow-xs'
                : 'bg-[#F0EDFB] text-[#3C2F80] hover:bg-[#E7DEFF]'
            }`}
          >
            Media &amp; Music
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('heavy')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategory === 'heavy'
                ? 'bg-[#5D3BE0] text-white shadow-xs'
                : 'bg-[#F0EDFB] text-[#3C2F80] hover:bg-[#E7DEFF]'
            }`}
          >
            Heavy (HD Video, Calls, Hotspot)
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <button
            type="button"
            onClick={expandAll}
            className="text-[11px] font-semibold text-[#5D3BE0] hover:underline cursor-pointer"
          >
            Expand All
          </button>
          <span className="text-[#E2DCF7]">&middot;</span>
          <button
            type="button"
            onClick={collapseAll}
            className="text-[11px] font-semibold text-[#797587] hover:underline cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* 9 Expandable Activity Cards */}
      <div className="space-y-3">
        {filteredActivities.map((act) => {
          const duration = durations[act.id] || { hours: 0, minutes: 0 };
          const hours = duration.hours;
          const minutes = duration.minutes;
          const fractionalHours = durationToHours(duration);

          const dailyMBExpected = fractionalHours * act.defaultRateMBPerHour;
          const tripMBExpected = dailyMBExpected * tripDays;
          const totalQuarterHours = Math.round(fractionalHours * 4);
          const maxQuarterHours = act.maxDailyHours * 4;
          const isExpanded = !!expandedActivities[act.id];
          const hasTime = hours > 0 || minutes > 0;

          return (
            <div
              key={act.id}
              className={`bg-white border rounded-xl shadow-xs transition-all overflow-hidden ${
                hasTime
                  ? 'border-[#E2DCF7] hover:border-[#5D3BE0]/40'
                  : 'border-[#E2DCF7]/60 opacity-80'
              }`}
            >
              {/* Header / Summary Clickable Bar */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleExpand(act.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpand(act.id);
                  }
                }}
                className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-[#F8F7FD] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#F0EDFB] border border-[#E2DCF7] flex items-center justify-center text-[#5D3BE0] shrink-0">
                    <ActivityIcon name={act.iconName} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#1D153C] truncate">{act.label}</h4>
                      <span className="text-[11px] text-[#484555] bg-[#F0EDFB] px-2 py-0.5 rounded-full font-medium shrink-0">
                        ~{act.defaultRateMBPerHour} MB/hr
                      </span>
                    </div>
                    <div className="text-xs text-[#484555] mt-0.5 truncate">
                      {act.rateNotes}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#5D3BE0] tabular-nums">
                      {formatDataAmount(dailyMBExpected)} / day
                    </div>
                    <div className="text-[11px] text-[#797587] tabular-nums">
                      {hours}h {minutes > 0 ? `${minutes}m` : ''} daily &middot; {formatDataAmount(tripMBExpected)} total
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-md bg-[#F0EDFB] text-[#3C2F80] flex items-center justify-center">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable Controls Panel */}
              {isExpanded && (
                <div className="p-4 md:p-5 bg-[#F8F7FD] border-t border-[#E2DCF7] space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    {/* Hours Stepper Module */}
                    <div className="md:col-span-5 flex items-center gap-2">
                      <div className="flex-1 flex items-center justify-between bg-white p-2 rounded-lg border border-[#E2DCF7] shadow-2xs">
                        <span className="text-xs font-semibold text-[#484555]">Hours:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleHourStep(act.id, -1);
                            }}
                            disabled={hours <= 0 && minutes <= 0}
                            className="w-7 h-7 rounded-md bg-[#F0EDFB] text-[#3C2F80] flex items-center justify-center hover:bg-[#E7DEFF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label={`Decrease hours for ${act.label}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-9 text-center text-xs font-bold text-[#1D153C] tabular-nums">
                            {hours}h
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleHourStep(act.id, 1);
                            }}
                            disabled={hours >= act.maxDailyHours}
                            className="w-7 h-7 rounded-md bg-[#F0EDFB] text-[#3C2F80] flex items-center justify-center hover:bg-[#E7DEFF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label={`Increase hours for ${act.label}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Minutes Stepper Module */}
                      <div className="flex-1 flex items-center justify-between bg-white p-2 rounded-lg border border-[#E2DCF7] shadow-2xs">
                        <span className="text-xs font-semibold text-[#484555]">Mins:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMinuteStep(act.id, -15);
                            }}
                            disabled={hours <= 0 && minutes <= 0}
                            className="w-7 h-7 rounded-md bg-[#F0EDFB] text-[#3C2F80] flex items-center justify-center hover:bg-[#E7DEFF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label={`Decrease 15 mins for ${act.label}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-9 text-center text-xs font-bold text-[#1D153C] tabular-nums">
                            {minutes}m
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMinuteStep(act.id, 15);
                            }}
                            disabled={hours >= act.maxDailyHours}
                            className="w-7 h-7 rounded-md bg-[#F0EDFB] text-[#3C2F80] flex items-center justify-center hover:bg-[#E7DEFF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label={`Increase 15 mins for ${act.label}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quick 15-min Intervals & Zero out */}
                    <div className="md:col-span-7 flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-[#797587] mr-1">Quick Mins:</span>
                        {[0, 15, 30, 45].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetExactMinutes(act.id, m);
                            }}
                            className={`px-2 py-1 text-[11px] font-semibold rounded-md border transition-all cursor-pointer ${
                              minutes === m
                                ? 'bg-[#5D3BE0] text-white border-[#5D3BE0]'
                                : 'bg-white text-[#3C2F80] border-[#E2DCF7] hover:bg-[#F0EDFB]'
                            }`}
                          >
                            {m}m
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleHourStep(act.id, 1);
                          }}
                          className="px-2 py-1 text-[11px] font-semibold text-[#5D3BE0] bg-white border border-[#E2DCF7] rounded-md hover:bg-[#F0EDFB] cursor-pointer"
                        >
                          +1 hour
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleZeroOut(act.id);
                          }}
                          className="px-2 py-1 text-[11px] font-semibold text-[#797587] hover:text-[#BA1A1A] bg-white border border-[#E2DCF7] rounded-md hover:bg-[#FFDAD6]/30 cursor-pointer"
                        >
                          Zero out
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Range Slider for Fluid Dragging */}
                  <div className="flex items-center gap-3 pt-1">
                    <Clock className="w-4 h-4 text-[#797587] shrink-0" />
                    <input
                      type="range"
                      min={0}
                      max={maxQuarterHours}
                      step={1}
                      value={totalQuarterHours}
                      onChange={(e) => handleSliderChange(act.id, parseInt(e.target.value, 10))}
                      aria-label={`Daily time slider for ${act.label}`}
                      className="w-full"
                    />
                    <span className="text-xs font-bold text-[#5D3BE0] shrink-0 tabular-nums w-16 text-right">
                      {hours}h {minutes > 0 ? `${minutes}m` : '0m'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-[#E2DCF7] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md border border-[#E2DCF7] text-xs font-semibold text-[#3C2F80] hover:bg-[#F0EDFB] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Persona</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#5D3BE0] hover:bg-[#4E2EC7] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-[0.98]"
        >
          <span>Calculate Roaming Ledger</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
