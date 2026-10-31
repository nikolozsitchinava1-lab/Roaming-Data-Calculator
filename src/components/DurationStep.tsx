/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DURATION_PRESETS } from '../data/config.ts';
import { Calendar, Minus, Plus, ArrowRight, ArrowLeft } from 'lucide-react';

interface DurationStepProps {
  durationDays: number;
  onChangeDuration: (days: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DurationStep: React.FC<DurationStepProps> = ({
  durationDays,
  onChangeDuration,
  onNext,
  onBack,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + durationDays);
    return d.toISOString().split('T')[0];
  });

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1 && val <= 90) {
      onChangeDuration(val);
      syncEndDateWithDays(val, startDate);
    }
  };

  const syncEndDateWithDays = (days: number, start: string) => {
    try {
      const s = new Date(start);
      if (!isNaN(s.getTime())) {
        const e = new Date(s);
        e.setDate(e.getDate() + days);
        setEndDate(e.toISOString().split('T')[0]);
      }
    } catch {
      // ignore
    }
  };

  const handleDateChange = (newStart: string, newEnd: string) => {
    setStartDate(newStart);
    setEndDate(newEnd);
    try {
      const s = new Date(newStart);
      const e = new Date(newEnd);
      if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
        const diffTime = e.getTime() - s.getTime();
        const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
        if (diffDays <= 90) {
          onChangeDuration(diffDays);
        }
      }
    } catch {
      // ignore
    }
  };

  const handleDecrement = () => {
    if (durationDays > 1) {
      const nextDays = durationDays - 1;
      onChangeDuration(nextDays);
      syncEndDateWithDays(nextDays, startDate);
    }
  };

  const handleIncrement = () => {
    if (durationDays < 90) {
      const nextDays = durationDays + 1;
      onChangeDuration(nextDays);
      syncEndDateWithDays(nextDays, startDate);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & context */}
      <div>
        <div className="text-xs font-semibold text-[#5D3BE0] uppercase tracking-wider mb-1">
          Step 2 · Journey Timeline
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D153C] tracking-tight">
          How many days will you roam?
        </h2>
        <p className="text-sm text-[#484555] mt-1">
          All daily activity data rates are multiplied by your itinerary duration in real-time.
        </p>
      </div>

      {/* Large Numerical Display Callout Card */}
      <div className="p-6 md:p-8 bg-white border border-[#E2DCF7] rounded-xl shadow-xs text-center relative overflow-hidden">
        <div className="text-xs font-semibold text-[#3C2F80] uppercase tracking-wider mb-2">
          Itinerary Length
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={durationDays <= 1}
            className="w-10 h-10 rounded-lg bg-[#F0EDFB] text-[#3C2F80] border border-[#E2DCF7] flex items-center justify-center hover:bg-[#E7DEFF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease days"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="flex items-baseline gap-1">
            <span className="text-5xl md:text-6xl font-extrabold text-[#5D3BE0] tracking-tight tabular-nums">
              {durationDays}
            </span>
            <span className="text-xl md:text-2xl font-bold text-[#1D153C]">
              {durationDays === 1 ? 'Day' : 'Days'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            disabled={durationDays >= 90}
            className="w-10 h-10 rounded-lg bg-[#F0EDFB] text-[#3C2F80] border border-[#E2DCF7] flex items-center justify-center hover:bg-[#E7DEFF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase days"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Granular Slider */}
        <div className="mt-6 max-w-md mx-auto space-y-2">
          <div className="flex items-center justify-between text-xs text-[#484555] font-medium">
            <span>1 day</span>
            <span>30 days</span>
            <span>60 days</span>
            <span>90 days</span>
          </div>
          <input
            type="range"
            min={1}
            max={90}
            value={durationDays}
            onChange={handleSliderChange}
            aria-label="Trip duration slider"
            className="w-full"
          />
        </div>
      </div>

      {/* Quick Preset Chips */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-[#3C2F80]">
          Standard Itinerary Durations
        </div>
        <div className="flex flex-wrap gap-2">
          {DURATION_PRESETS.map((preset) => {
            const isSelected = durationDays === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  onChangeDuration(preset);
                  syncEndDateWithDays(preset, startDate);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#5D3BE0] text-white shadow-xs'
                    : 'bg-white border border-[#E2DCF7] text-[#3C2F80] hover:bg-[#F0EDFB]'
                }`}
              >
                {preset} Days {preset === 7 ? '(1 Week)' : preset === 14 ? '(2 Weeks)' : preset === 30 ? '(1 Month)' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Range Selector Toggle */}
      <div className="bg-[#F0EDFB] border border-[#E2DCF7] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#5D3BE0]" />
            <span className="text-xs font-bold text-[#1D153C]">Calendar Dates Mode</span>
          </div>
          <button
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="text-xs font-semibold text-[#5D3BE0] hover:underline"
          >
            {showDatePicker ? 'Hide Date Inputs' : 'Set Exact Travel Dates'}
          </button>
        </div>

        {showDatePicker && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-[#484555] mb-1">
                Departure Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleDateChange(e.target.value, endDate)}
                className="w-full px-3 py-2 bg-white border border-[#E2DCF7] rounded-md text-xs text-[#1D153C] focus:outline-none focus:border-[#5D3BE0]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#484555] mb-1">
                Return Date
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => handleDateChange(startDate, e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E2DCF7] rounded-md text-xs text-[#1D153C] focus:outline-none focus:border-[#5D3BE0]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-[#E2DCF7] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-md border border-[#E2DCF7] text-xs font-semibold text-[#3C2F80] hover:bg-[#F0EDFB] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Destination</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 rounded-md bg-[#5D3BE0] hover:bg-[#4E2EC7] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer"
        >
          <span>Continue to Usage Profile</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
