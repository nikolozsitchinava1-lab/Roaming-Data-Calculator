/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActivityId, CalculationResult, Country, eSIMPlan } from '../types/calculator.ts';
import { BUFFER_PRESETS } from '../data/config.ts';
import { formatDataAmount } from '../utils/calculatorEngine.ts';
import { ActivityIcon } from './ActivityIcon.tsx';
import {
  ShieldCheck,
  Radio,
  QrCode,
  Zap,
  Check,
  Sliders,
  Sparkles,
  ArrowLeft,
  Copy,
  Download,
  AlertCircle,
  ExternalLink,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';

interface ResultsViewProps {
  result: CalculationResult;
  selectedCountry: Country | null;
  tripDays: number;
  safetyMarginPercent: number;
  onChangeSafetyMargin: (percent: number) => void;
  onEditActivities: () => void;
  onBackToSteps: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  selectedCountry,
  tripDays,
  safetyMarginPercent,
  onChangeSafetyMargin,
  onEditActivities,
  onBackToSteps,
}) => {
  const [breakdownMode, setBreakdownMode] = useState<'trip' | 'daily'>('trip');
  const [selectedPlan, setSelectedPlan] = useState<eSIMPlan | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [highlightedActivity, setHighlightedActivity] = useState<ActivityId | null>(null);

  const matchedPlans = result.matchedPlans;

  const handleCopySummary = () => {
    const text = [
      `🌍 Earth Voyage Roaming Itinerary`,
      `Destination: ${selectedCountry?.name || 'International'} (${tripDays} Days)`,
      `Expected Consumption: ${result.totalGBExpected} GB (${result.dailyMBExpected} MB/day)`,
      `Estimated Range: ${result.totalGBLow} GB – ${result.totalGBHigh} GB`,
      `Safe Roam Cushion (+${result.safetyMarginPercent}%): +${result.safetyMarginGB} GB`,
      `Recommended Package: ${result.recommendedPackageGB} GB eSIM`,
      `Profile Insight: ${result.insight.title}`,
      `Top Activity: ${result.breakdown[0]?.label || 'General'} (${result.breakdown[0]?.percentageOfTotal}%)`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleSelectPlan = (plan: eSIMPlan) => {
    setSelectedPlan(plan);
    setShowVoucherModal(true);
  };

  // Safe percentage calculation for dual progress bar
  const totalBase = result.totalGBExpected;
  const bufferAmount = result.safetyMarginGB;
  const totalWithBuffer = totalBase + bufferAmount;
  const recommendedTier = result.recommendedPackageGB;

  // Percentage widths relative to the recommended package size
  const basePercent = recommendedTier > 0 ? Math.min(100, (totalBase / recommendedTier) * 100) : 0;
  const bufferPercent = recommendedTier > 0 ? Math.min(100 - basePercent, (bufferAmount / recommendedTier) * 100) : 0;
  const remainingPercent = Math.max(0, 100 - basePercent - bufferPercent);

  // Active highlighted activity object
  const activeBreakdownItem = highlightedActivity
    ? result.breakdown.find((b) => b.activityId === highlightedActivity)
    : null;

  return (
    <div className="space-y-6">
      {/* Top Banner / Itinerary Header with Travel Photography */}
      <div className="bg-white border border-[#E2DCF7] rounded-xl overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="p-5 md:p-6 md:col-span-8 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5D3BE0]">
              <span className="text-xl" role="img" aria-label="country flag">
                {selectedCountry?.flag || '🌐'}
              </span>
              <span className="font-bold">
                {selectedCountry?.name || 'Worldwide Roaming'} &middot; {tripDays} {tripDays === 1 ? 'Day' : 'Days'} Itinerary
              </span>
              <span aria-hidden="true">&middot;</span>
              <span className="text-[#484555]">
                {selectedCountry?.networks.slice(0, 2).join(' / ') || 'Tier 1 Partner'}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D153C] tracking-tight mt-1">
              Data Ledger &amp; eSIM Plan Recommendation
            </h2>
            <p className="text-xs text-[#484555] mt-1">
              Calculated with conservative industry bitrates, +{safetyMarginPercent}% Safe Roam cushion, and standard eSIM tier rounding.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#3C2F80] bg-[#F0EDFB] border border-[#E2DCF7] rounded-md hover:bg-[#E7DEFF] transition-colors cursor-pointer"
              >
                {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#5D3BE0]" />}
                <span>{copiedSummary ? 'Copied Ledger!' : 'Copy Summary'}</span>
              </button>

              <button
                type="button"
                onClick={onEditActivities}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#5D3BE0] rounded-md hover:bg-[#4E2EC7] transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Adjust Habits</span>
              </button>
            </div>
          </div>

          {selectedCountry?.image && (
            <div className="relative md:col-span-4 h-36 md:h-full min-h-[140px] overflow-hidden border-t md:border-t-0 md:border-l border-[#E2DCF7]">
              <img
                src={selectedCountry.image}
                alt={selectedCountry.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                <span className="text-[11px] font-bold text-white bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-sm">
                  {selectedCountry.flag} {selectedCountry.name} &middot; {selectedCountry.fastestSpeed}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Usage Pattern Insight Banner */}
      <div className="p-4 md:p-5 bg-gradient-to-r from-[#F0EDFB] via-[#F8F7FD] to-white border border-[#5D3BE0]/30 rounded-xl shadow-xs flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-lg bg-[#5D3BE0] text-white flex items-center justify-center shrink-0 shadow-xs">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#5D3BE0] uppercase tracking-wider">
              Pattern Insight &middot; {result.insight.title}
            </span>
          </div>
          <p className="text-xs text-[#1D153C] font-medium mt-1 leading-relaxed">
            {result.insight.advice}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#484555]">
            <Lightbulb className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
            <span>{result.insight.savingTip}</span>
          </div>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recommended Package */}
        <div className="p-5 bg-gradient-to-br from-[#5D3BE0] to-[#4514C9] text-white rounded-xl shadow-md relative overflow-hidden transition-all duration-300">
          <div className="text-[11px] font-bold text-white/80 uppercase tracking-wider mb-1">
            Recommended Package
          </div>
          <div className="text-4xl md:text-5xl font-extrabold tracking-tight tabular-nums transition-all">
            {result.recommendedPackageGB} <span className="text-xl font-bold">GB</span>
          </div>
          <div className="text-xs text-white/90 mt-2 font-medium flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>Covers need + {safetyMarginPercent}% contingency buffer</span>
          </div>
        </div>

        {/* Expected Base Usage */}
        <div className="p-5 bg-white border border-[#E2DCF7] rounded-xl shadow-xs">
          <div className="text-[11px] font-bold text-[#3C2F80] uppercase tracking-wider mb-1">
            Expected Base Usage
          </div>
          <div className="text-4xl md:text-5xl font-extrabold text-[#1D153C] tracking-tight tabular-nums">
            {result.totalGBExpected} <span className="text-xl font-bold text-[#484555]">GB</span>
          </div>
          <div className="text-xs text-[#484555] mt-2">
            Average <strong className="text-[#1D153C] tabular-nums">{result.dailyMBExpected} MB</strong> per day
          </div>
        </div>

        {/* Estimated Range */}
        <div className="p-5 bg-white border border-[#E2DCF7] rounded-xl shadow-xs">
          <div className="text-[11px] font-bold text-[#3C2F80] uppercase tracking-wider mb-1">
            Estimated Range
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-[#1D153C] tracking-tight tabular-nums mt-1">
            {result.totalGBLow} – {result.totalGBHigh} <span className="text-base font-bold text-[#484555]">GB</span>
          </div>
          <div className="text-xs text-[#484555] mt-2">
            Conservative to peak spectrum
          </div>
        </div>

        {/* Safe Roam Cushion */}
        <div className="p-5 bg-[#F0EDFB] border border-[#E2DCF7] rounded-xl shadow-xs">
          <div className="text-[11px] font-bold text-[#3C2F80] uppercase tracking-wider mb-1">
            Safe Roam Buffer
          </div>
          <div className="text-4xl md:text-5xl font-extrabold text-[#2DD4BF] tracking-tight tabular-nums">
            +{result.safetyMarginGB} <span className="text-xl font-bold text-[#3C2F80]">GB</span>
          </div>
          <div className="text-xs text-[#484555] mt-2 flex items-center justify-between">
            <span>+{safetyMarginPercent}% contingency</span>
            <span className="font-semibold text-[#5D3BE0]">Zero Bill Shock</span>
          </div>
        </div>
      </div>

      {/* Visual Dual Progress Bar & Safe Roam Cushion Meter */}
      <div className="p-5 md:p-6 bg-white border border-[#E2DCF7] rounded-xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#1D153C]">
              Visual Safe-Buffer Meter
            </h3>
            <p className="text-xs text-[#484555] mt-0.5">
              Live ratio of expected consumption against the safety cushion and recommended {result.recommendedPackageGB} GB allowance.
            </p>
          </div>

          {/* Safety Margin Selector Toggle */}
          <div className="flex items-center gap-1.5 bg-[#F0EDFB] p-1 rounded-lg border border-[#E2DCF7]">
            <span className="text-[11px] font-semibold text-[#484555] px-2">Cushion:</span>
            {BUFFER_PRESETS.map((b) => (
              <button
                key={b.value}
                type="button"
                onClick={() => onChangeSafetyMargin(b.value)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  safetyMarginPercent === b.value
                    ? 'bg-[#5D3BE0] text-white shadow-xs'
                    : 'text-[#3C2F80] hover:text-[#1D153C]'
                }`}
              >
                +{b.value}%
              </button>
            ))}
          </div>
        </div>

        {/* Dual Progress Bar with smooth CSS transitions */}
        <div className="space-y-2">
          <div className="h-7 w-full bg-[#F0EDFB] rounded-lg overflow-hidden flex border border-[#E2DCF7] p-0.5">
            {/* Expected Base Usage bar */}
            <div
              style={{ width: `${basePercent}%` }}
              className="h-full bg-[#5D3BE0] rounded-l-md transition-all duration-500 ease-out relative group flex items-center justify-center"
              title={`Base Expected Usage: ${result.totalGBExpected} GB`}
            >
              {basePercent > 18 && (
                <span className="text-[11px] font-bold text-white tabular-nums px-1 truncate">
                  {result.totalGBExpected} GB
                </span>
              )}
            </div>

            {/* +20% Safe Roam Cushion in mint turquoise with diagonal hash marks */}
            <div
              style={{ width: `${bufferPercent}%` }}
              className="h-full bg-buffer-stripes transition-all duration-500 ease-out relative group flex items-center justify-center"
              title={`Safe Roam Cushion: +${result.safetyMarginGB} GB`}
            >
              {bufferPercent > 12 && (
                <span className="text-[10px] font-bold text-[#1D153C] bg-white/80 px-1 py-0.5 rounded-sm tabular-nums truncate">
                  +{result.safetyMarginGB} GB
                </span>
              )}
            </div>

            {/* Unallocated headroom in package */}
            {remainingPercent > 0 && (
              <div
                style={{ width: `${remainingPercent}%` }}
                className="h-full bg-transparent rounded-r-md transition-all duration-500 ease-out flex items-center justify-center"
                title={`Package Headroom: ${(result.recommendedPackageGB - totalWithBuffer).toFixed(1)} GB`}
              >
                {remainingPercent > 20 && (
                  <span className="text-[10px] text-[#797587] font-semibold tabular-nums px-1 truncate">
                    +{(result.recommendedPackageGB - totalWithBuffer).toFixed(1)} GB Headroom
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bar Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs text-[#484555] pt-1">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#5D3BE0]" />
                <span>Base Need ({result.totalGBExpected} GB)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#2DD4BF]" />
                <span>Safe Cushion (+{result.safetyMarginGB} GB)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#F0EDFB] border border-[#E2DCF7]" />
                <span>Package Ceiling ({result.recommendedPackageGB} GB)</span>
              </div>
            </div>
            <div className="font-semibold text-[#1D153C] tabular-nums">
              Total with Buffer: {result.totalWithBufferGB} GB
            </div>
          </div>
        </div>
      </div>

      {/* Matched eSIM Package Recommendations (High Trust Layout) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#1D153C] tracking-tight">
              Matched eSIM Plans for {selectedCountry?.name || 'Your Journey'}
            </h3>
            <p className="text-xs text-[#484555]">
              Instant QR-code activation &middot; Connects to {selectedCountry?.networks.join(' & ') || 'Tier 1 networks'} &middot; No roaming overage fees
            </p>
          </div>
          <span className="text-xs font-semibold text-[#5D3BE0]">
            {matchedPlans.length} Plans Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {matchedPlans.slice(0, 3).map((plan, index) => {
            const isRecommended = plan.dataGB >= result.recommendedPackageGB && (index === 0 || plan.bestValue);

            return (
              <div
                key={plan.id}
                className={`relative rounded-xl border p-5 flex flex-col justify-between transition-all ${
                  isRecommended
                    ? 'bg-[#F0EDFB] border-2 border-[#5D3BE0] shadow-md ring-2 ring-[#5D3BE0]/20'
                    : 'bg-white border-[#E2DCF7] hover:border-[#5D3BE0]/40 shadow-xs'
                }`}
              >
                {/* Ribbon Tag */}
                {isRecommended && (
                  <div className="absolute -top-3 left-4 bg-[#5D3BE0] text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Best Value Match ({tripDays} Days)</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-[#5D3BE0]" />
                      <span className="text-xs font-semibold text-[#3C2F80]">
                        {plan.speed}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-[#797587]">
                      {plan.validityDays} Days Validity
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <div className="text-3xl font-extrabold text-[#1D153C] tracking-tight tabular-nums">
                        {plan.dataGB} GB
                      </div>
                      <div className="text-xs text-[#484555] font-medium mt-0.5">
                        {plan.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-[#5D3BE0] tabular-nums">
                        ${plan.priceUSD.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-[#797587]">
                        ${(plan.priceUSD / plan.dataGB).toFixed(2)} / GB
                      </div>
                    </div>
                  </div>

                  {/* High Trust Guarantee Badges */}
                  <div className="mt-4 pt-3 border-t border-[#E2DCF7] space-y-1.5 text-[11px] text-[#484555]">
                    <div className="flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-[#5D3BE0]" />
                      <span>Instant QR-code delivery via email &amp; app</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Prepaid eSIM: Never worry about overages</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Dual network switching ({selectedCountry?.networks[0] || 'Tier 1'})</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E2DCF7]">
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-2.5 px-4 rounded-md font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                      isRecommended
                        ? 'bg-[#5D3BE0] hover:bg-[#4E2EC7] text-white active:scale-[0.98]'
                        : 'bg-white border border-[#5D3BE0] text-[#5D3BE0] hover:bg-[#F0EDFB]'
                    }`}
                  >
                    <span>Select eSIM Plan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Granular Activity Breakdown Section */}
      <div className="bg-white border border-[#E2DCF7] rounded-xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#1D153C]">
              Comprehensive Activity Consumption Breakdown
            </h3>
            <p className="text-xs text-[#484555] mt-0.5">
              Live consumption calculated from your exact daily hours and published telecom rates.
            </p>
          </div>

          {/* Toggle between Trip Total vs Daily Average */}
          <div className="flex items-center gap-1 bg-[#F0EDFB] p-1 rounded-lg border border-[#E2DCF7]">
            <button
              type="button"
              onClick={() => setBreakdownMode('trip')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                breakdownMode === 'trip'
                  ? 'bg-white text-[#1D153C] shadow-xs'
                  : 'text-[#484555] hover:text-[#1D153C]'
              }`}
            >
              Trip Total ({tripDays} Days)
            </button>
            <button
              type="button"
              onClick={() => setBreakdownMode('daily')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                breakdownMode === 'daily'
                  ? 'bg-white text-[#1D153C] shadow-xs'
                  : 'text-[#484555] hover:text-[#1D153C]'
              }`}
            >
              Daily Average
            </button>
          </div>
        </div>

        {/* Stacked Interactive Activity Bar */}
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-[#F0EDFB] rounded-full overflow-hidden flex border border-[#E2DCF7]">
            {result.breakdown.map((item, index) => {
              if (item.percentageOfTotal <= 0) return null;
              const isItemHighlighted = highlightedActivity === item.activityId;
              const opacity = highlightedActivity && !isItemHighlighted ? 0.35 : 1;
              const colors = ['#5D3BE0', '#9E5AFD', '#3C2F80', '#2DD4BF', '#F59E0B', '#6366F1', '#EC4899', '#14B8A6', '#8B5CF6'];
              const color = colors[index % colors.length];

              return (
                <div
                  key={item.activityId}
                  style={{ width: `${item.percentageOfTotal}%`, backgroundColor: color, opacity }}
                  className="h-full transition-all duration-300 cursor-pointer"
                  onClick={() =>
                    setHighlightedActivity(
                      highlightedActivity === item.activityId ? null : item.activityId
                    )
                  }
                  title={`${item.label}: ${item.percentageOfTotal}%`}
                />
              );
            })}
          </div>

          {activeBreakdownItem && (
            <div className="text-[11px] text-[#5D3BE0] font-semibold flex items-center justify-between pt-0.5">
              <span>Selected Segment: {activeBreakdownItem.label}</span>
              <span>{activeBreakdownItem.percentageOfTotal}% of total usage</span>
            </div>
          )}
        </div>

        {/* Breakdown List with smooth interactive highlights */}
        <div className="divide-y divide-[#F0EDFB]">
          {result.breakdown.map((item) => {
            const amountFormatted =
              breakdownMode === 'trip'
                ? formatDataAmount(item.totalMBExpected)
                : formatDataAmount(item.dailyMBExpected);

            const isHighlighted = highlightedActivity === item.activityId;

            return (
              <div
                key={item.activityId}
                onClick={() =>
                  setHighlightedActivity(
                    highlightedActivity === item.activityId ? null : item.activityId
                  )
                }
                className={`py-3 px-2 rounded-lg flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                  isHighlighted ? 'bg-[#F0EDFB]' : 'hover:bg-[#F8F7FD]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#F0EDFB] border border-[#E2DCF7] flex items-center justify-center text-[#5D3BE0] shrink-0">
                    <ActivityIcon name={item.iconName} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1D153C] truncate">{item.label}</span>
                      <span className="text-[11px] text-[#797587]">
                        ({item.hoursPerDay}h / day)
                      </span>
                    </div>

                    {/* Progress track */}
                    <div className="w-32 sm:w-48 h-1.5 bg-[#F0EDFB] rounded-full overflow-hidden mt-1.5">
                      <div
                        className="h-full bg-[#5D3BE0] rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(100, item.percentageOfTotal)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-[#1D153C] tabular-nums">
                    {amountFormatted}
                  </div>
                  <div className="text-[11px] text-[#5D3BE0] font-semibold tabular-nums">
                    {item.percentageOfTotal}% of usage
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation & Recalculate Footer */}
      <div className="pt-4 border-t border-[#E2DCF7] flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToSteps}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-md border border-[#E2DCF7] text-xs font-semibold text-[#3C2F80] hover:bg-[#F0EDFB] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Calculator</span>
        </button>

        <button
          type="button"
          onClick={onEditActivities}
          className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#5D3BE0] hover:bg-[#4E2EC7] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-[0.98]"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Refine Daily Habit Minutes</span>
        </button>
      </div>

      {/* eSIM Order Voucher / Integration-Ready Modal */}
      {showVoucherModal && selectedPlan && (
        <div className="fixed inset-0 z-50 bg-[#1D153C]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2DCF7] space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-bold text-[#5D3BE0] uppercase tracking-wider">
                  Earth Voyage &middot; Plan Voucher
                </div>
                <h3 className="text-xl font-extrabold text-[#1D153C] mt-0.5">
                  {selectedPlan.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVoucherModal(false)}
                className="w-8 h-8 rounded-full bg-[#F0EDFB] text-[#1D153C] flex items-center justify-center hover:bg-[#E7DEFF] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-[#F8F7FD] rounded-xl border border-[#E2DCF7] space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-[#484555]">Destination</span>
                <span className="font-bold text-[#1D153C]">
                  {selectedCountry?.flag} {selectedCountry?.name}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#484555]">Data Allowance</span>
                <span className="font-bold text-[#5D3BE0] tabular-nums">
                  {selectedPlan.dataGB} GB High-Speed 5G
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#484555]">Plan Validity</span>
                <span className="font-bold text-[#1D153C] tabular-nums">
                  {selectedPlan.validityDays} Days (Trip: {tripDays} Days)
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#484555]">Local Networks</span>
                <span className="font-bold text-[#1D153C]">
                  {selectedCountry?.networks.join(', ')}
                </span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-[#E2DCF7]">
                <span className="font-bold text-[#1D153C]">Total Prepaid Price</span>
                <span className="text-base font-extrabold text-[#5D3BE0] tabular-nums">
                  ${selectedPlan.priceUSD.toFixed(2)} USD
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-[#F0EDFB] rounded-lg text-xs text-[#3C2F80]">
              <AlertCircle className="w-4 h-4 text-[#5D3BE0] shrink-0" />
              <span>
                MVP integration preview: You can download or copy your tailored voucher. Payment integration connects to Stripe/Apple Pay in release v2.
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className="flex-1 py-2.5 px-4 rounded-md border border-[#E2DCF7] text-xs font-semibold text-[#3C2F80] hover:bg-[#F0EDFB] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-[#5D3BE0]" />
                <span>Copy Voucher</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`eSIM voucher for ${selectedPlan.name} generated! Ready for instant QR scan upon departure.`);
                  setShowVoucherModal(false);
                }}
                className="flex-1 py-2.5 px-4 rounded-md bg-[#5D3BE0] hover:bg-[#4E2EC7] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Offline Voucher</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
