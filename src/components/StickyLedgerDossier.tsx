/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CalculationResult, CalculatorStep, Country } from '../types/calculator.ts';
import { ShieldCheck, ArrowRight, Sparkles, MapPin, Calendar } from 'lucide-react';

interface StickyLedgerDossierProps {
  result: CalculationResult;
  selectedCountry: Country | null;
  tripDays: number;
  currentStep: CalculatorStep;
  onNavigateToResults: () => void;
}

export const StickyLedgerDossier: React.FC<StickyLedgerDossierProps> = ({
  result,
  selectedCountry,
  tripDays,
  currentStep,
  onNavigateToResults,
}) => {
  const topActivity = result.breakdown[0];

  const totalBase = result.totalGBExpected;
  const bufferAmount = result.safetyMarginGB;
  const recommendedTier = result.recommendedPackageGB;

  const baseWidthPercent = recommendedTier > 0 ? Math.min(100, (totalBase / recommendedTier) * 100) : 0;
  const bufferWidthPercent = recommendedTier > 0 ? Math.min(100 - baseWidthPercent, (bufferAmount / recommendedTier) * 100) : 0;

  return (
    <>
      {/* Desktop Sticky 5-Column Dossier */}
      <aside className="hidden lg:block sticky top-20 space-y-4">
        <div className="bg-white border border-[#E2DCF7] rounded-xl p-5 shadow-sm space-y-5 transition-all">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EDFB]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#5D3BE0]" />
              <span className="text-xs font-bold text-[#1D153C] tracking-wide uppercase">
                Live Roam Ledger
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#5D3BE0] bg-[#F0EDFB] px-2 py-0.5 rounded-full">
              Real-time
            </span>
          </div>

          {/* Destination & Itinerary Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#484555]">
                <MapPin className="w-3.5 h-3.5 text-[#5D3BE0]" />
                <span>Destination:</span>
              </div>
              <span className="font-bold text-[#1D153C]">
                {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : 'Not selected'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#484555]">
                <Calendar className="w-3.5 h-3.5 text-[#5D3BE0]" />
                <span>Trip Duration:</span>
              </div>
              <span className="font-bold text-[#1D153C] tabular-nums">
                {tripDays} {tripDays === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          </div>

          {/* Primary Recommended Callout Card */}
          <div className="p-4 bg-gradient-to-br from-[#F0EDFB] to-[#ECE4FF] border border-[#5D3BE0]/20 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#3C2F80] uppercase tracking-wider">
                Recommended eSIM
              </span>
              <span className="text-[11px] font-semibold text-[#5D3BE0] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Matched Tier</span>
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-extrabold text-[#5D3BE0] tracking-tight tabular-nums transition-all">
                {result.recommendedPackageGB} <span className="text-base font-bold">GB</span>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-[#1D153C] tabular-nums">
                  {result.totalWithBufferGB} GB needed
                </div>
                <div className="text-[10px] text-[#484555]">
                  incl. +{result.safetyMarginPercent}% buffer
                </div>
              </div>
            </div>

            {/* Mini Segmented Bar with smooth transition */}
            <div className="h-2 w-full bg-[#E2DCF7] rounded-full overflow-hidden flex">
              <div
                style={{ width: `${baseWidthPercent}%` }}
                className="h-full bg-[#5D3BE0] transition-all duration-500 ease-out"
                title={`Base: ${result.totalGBExpected} GB`}
              />
              <div
                style={{ width: `${bufferWidthPercent}%` }}
                className="h-full bg-buffer-stripes transition-all duration-500 ease-out"
                title={`Buffer: +${result.safetyMarginGB} GB`}
              />
            </div>
          </div>

          {/* Calculation Ledger Numbers */}
          <div className="space-y-2 text-xs divide-y divide-[#F0EDFB] pt-1">
            <div className="flex items-center justify-between py-1.5">
              <span className="text-[#484555]">Expected Base:</span>
              <span className="font-semibold text-[#1D153C] tabular-nums">
                {result.totalGBExpected} GB
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-[#484555]">Daily Average:</span>
              <span className="font-semibold text-[#1D153C] tabular-nums">
                {result.dailyMBExpected} MB/day
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-[#484555]">Low – High Spectrum:</span>
              <span className="font-semibold text-[#1D153C] tabular-nums">
                {result.totalGBLow} – {result.totalGBHigh} GB
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-[#484555]">Safe Roam Cushion:</span>
              <span className="font-bold text-[#2DD4BF] tabular-nums">
                +{result.safetyMarginGB} GB (+{result.safetyMarginPercent}%)
              </span>
            </div>
            {topActivity && (
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#484555]">Top Traffic Source:</span>
                <span className="font-medium text-[#5D3BE0] truncate max-w-[150px]">
                  {topActivity.label} ({topActivity.percentageOfTotal}%)
                </span>
              </div>
            )}
          </div>

          {/* Guarantee Pill */}
          <div className="flex items-center gap-2 p-2.5 bg-[#F8F7FD] rounded-lg border border-[#E2DCF7] text-[11px] text-[#484555]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Prepaid calculation guarantee: No unexpected overage fees</span>
          </div>

          {/* CTA Action */}
          {currentStep !== 'results' && (
            <button
              type="button"
              onClick={onNavigateToResults}
              className="w-full py-3 px-4 bg-[#5D3BE0] hover:bg-[#4E2EC7] text-white text-xs font-semibold rounded-md shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>View Matched eSIM Plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Sticky Bottom Summary Bar (Strictly capped below 15% viewport height) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E2DCF7] px-4 py-2.5 shadow-lg flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold text-[#5D3BE0] tabular-nums">
              {result.recommendedPackageGB} GB
            </span>
            <span className="text-[11px] text-[#2DD4BF] font-bold">
              (+{result.safetyMarginPercent}% safe buffer)
            </span>
          </div>
          <div className="text-[11px] text-[#484555] truncate">
            {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : 'Roaming'} &middot; {tripDays} days &middot; {result.totalGBExpected} GB base
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToResults}
          className="shrink-0 min-h-[44px] px-4 py-2 bg-[#5D3BE0] text-white rounded-md text-xs font-bold shadow-xs flex items-center gap-1 active:scale-[0.98] cursor-pointer"
        >
          <span>{currentStep === 'results' ? 'eSIM Ledger' : 'View Plan'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </>
  );
};
