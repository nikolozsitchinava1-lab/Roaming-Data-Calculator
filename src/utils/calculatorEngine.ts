/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ACTIVITY_RATE_CONFIGS,
  AVAILABLE_PACKAGE_SIZES_GB,
  DEFAULT_SAFETY_MARGIN_PERCENT,
} from '../data/config.ts';
import {
  ActivityBreakdownItem,
  ActivityDurations,
  CalculationResult,
  Country,
  eSIMPlan,
} from '../types/calculator.ts';

/**
 * Converts hours and minutes into fractional hours safely.
 * e.g., 1 hr 30 min => 1.5 hours
 */
export function durationToHours(duration?: { hours: number; minutes: number }): number {
  if (!duration) return 0;
  const hours = Number(duration.hours) || 0;
  const minutes = Number(duration.minutes) || 0;
  const total = Math.max(0, hours + minutes / 60);
  return Number.isFinite(total) ? total : 0;
}

/**
 * Centralized and reusable calculation engine for Earth Voyage.
 * Converts activity inputs into accurate low, expected, and high estimates,
 * adds configurable safety buffer (+20% Safe Roam Cushion), and rounds up
 * to standard package availability.
 *
 * All conversions adhere strictly to the specification: 1 GB = 1,000 MB.
 */
export function calculateRoamingData(
  durations: ActivityDurations,
  tripDays: number,
  safetyMarginPercent: number = DEFAULT_SAFETY_MARGIN_PERCENT,
  country?: Country
): CalculationResult {
  const validDays = Math.max(1, Math.round(Number(tripDays) || 1));
  const validMarginPercent = Math.max(0, Number(safetyMarginPercent) || 0);

  let dailyMBLow = 0;
  let dailyMBExpected = 0;
  let dailyMBHigh = 0;

  const breakdown: ActivityBreakdownItem[] = [];

  // Iterate over all 9 activities in centralized configuration
  Object.keys(ACTIVITY_RATE_CONFIGS).forEach((activityId) => {
    const config = ACTIVITY_RATE_CONFIGS[activityId];
    const duration = durations[activityId as keyof ActivityDurations] || { hours: 0, minutes: 0 };
    const hoursPerDay = durationToHours(duration);

    const actDailyMBLow = hoursPerDay * config.minRateMBPerHour;
    const actDailyMBExpected = hoursPerDay * config.defaultRateMBPerHour;
    const actDailyMBHigh = hoursPerDay * config.maxRateMBPerHour;

    const actTotalMBLow = actDailyMBLow * validDays;
    const actTotalMBExpected = actDailyMBExpected * validDays;
    const actTotalMBHigh = actDailyMBHigh * validDays;
    const actTotalGBExpected = actTotalMBExpected / 1000;

    dailyMBLow += actDailyMBLow;
    dailyMBExpected += actDailyMBExpected;
    dailyMBHigh += actDailyMBHigh;

    breakdown.push({
      activityId: config.id,
      label: config.label,
      iconName: config.iconName,
      hoursPerDay: Math.round(hoursPerDay * 100) / 100,
      dailyMBExpected: Math.round(actDailyMBExpected * 10) / 10,
      dailyMBLow: Math.round(actDailyMBLow * 10) / 10,
      dailyMBHigh: Math.round(actDailyMBHigh * 10) / 10,
      totalMBExpected: Math.round(actTotalMBExpected * 10) / 10,
      totalMBLow: Math.round(actTotalMBLow * 10) / 10,
      totalMBHigh: Math.round(actTotalMBHigh * 10) / 10,
      totalGBExpected: Math.round((actTotalGBExpected + Number.EPSILON) * 100) / 100,
      percentageOfTotal: 0, // Calculated below once total is known
    });
  });

  const totalMBLow = dailyMBLow * validDays;
  const totalMBExpected = dailyMBExpected * validDays;
  const totalMBHigh = dailyMBHigh * validDays;

  // 1 GB = 1,000 MB rule
  const totalGBLow = totalMBLow / 1000;
  const totalGBExpected = totalMBExpected / 1000;
  const totalGBHigh = totalMBHigh / 1000;

  // Calculate percentage share for each activity
  breakdown.forEach((item) => {
    if (totalMBExpected > 0) {
      item.percentageOfTotal = Math.round((item.totalMBExpected / totalMBExpected) * 1000) / 10;
    } else {
      item.percentageOfTotal = 0;
    }
  });

  // Sort breakdown descending by expected consumption
  breakdown.sort((a, b) => b.totalMBExpected - a.totalMBExpected);

  // Safety buffer calculation
  const safetyMarginGB = (totalGBExpected * validMarginPercent) / 100;
  const totalWithBufferGB = totalGBExpected + safetyMarginGB;

  // Package rounding logic:
  // Round recommended packages upward to available package sizes.
  // Never round the recommendation below estimated consumption.
  const recommendedPackageGB = getRecommendedPackageSize(totalWithBufferGB);

  // Match available country plans
  const matchedPlans = matchPlansForRecommendation(
    recommendedPackageGB,
    country?.plans || [],
    validDays
  );

  // Compute dynamic usage pattern insight
  const hdVideoItem = breakdown.find((b) => b.activityId === 'hd_video');
  const sdVideoItem = breakdown.find((b) => b.activityId === 'sd_video');
  const hotspotItem = breakdown.find((b) => b.activityId === 'hotspot');
  const videoPercent = (hdVideoItem?.percentageOfTotal || 0) + (sdVideoItem?.percentageOfTotal || 0);
  const hotspotPercent = hotspotItem?.percentageOfTotal || 0;

  let insight: {
    type: 'video_heavy' | 'hotspot_heavy' | 'music_heavy' | 'balanced' | 'light_saver';
    title: string;
    advice: string;
    savingTip: string;
  };

  if (videoPercent >= 40) {
    insight = {
      type: 'video_heavy',
      title: 'Streaming-Heavy Profile Detected',
      advice: `Video streaming represents ${Math.round(videoPercent)}% of your estimated ${totalGBExpected} GB consumption. HD video consumes ~2.25 GB/hr.`,
      savingTip: 'Tip: Lower stream quality to 480p SD while on cellular or pre-download playlists and shows on hotel Wi-Fi to cut mobile data by up to 70%.',
    };
  } else if (hotspotPercent >= 30) {
    insight = {
      type: 'hotspot_heavy',
      title: 'High Tethering & Laptop Hotspot Share',
      advice: `Laptop tethering accounts for ${Math.round(hotspotPercent)}% of your trip data. Background OS and cloud updates can drain packages quickly.`,
      savingTip: 'Tip: Enable "Low Data Mode" / "Metered Connection" on your tethered laptop to block silent background app updates.',
    };
  } else if (totalGBExpected <= 2.5) {
    insight = {
      type: 'light_saver',
      title: 'Disciplined Low-Consumption Profile',
      advice: 'Your usage is tightly centered on vector maps and messaging. Daily average is well under 500 MB.',
      savingTip: 'Tip: A compact 3 GB or 5 GB eSIM package will comfortably cover your itinerary with ample contingency headroom.',
    };
  } else {
    insight = {
      type: 'balanced',
      title: 'Balanced Travel Explorer',
      advice: 'Your mobile usage is evenly distributed across maps, travel guides, social feeds, and light media.',
      savingTip: 'Tip: The +20% Safe Roam Cushion covers spontaneous video uploads and unexpected GPS rerouting.',
    };
  }

  return {
    dailyMBExpected: Math.round(dailyMBExpected * 10) / 10,
    dailyMBLow: Math.round(dailyMBLow * 10) / 10,
    dailyMBHigh: Math.round(dailyMBHigh * 10) / 10,

    totalMBExpected: Math.round(totalMBExpected * 10) / 10,
    totalMBLow: Math.round(totalMBLow * 10) / 10,
    totalMBHigh: Math.round(totalMBHigh * 10) / 10,

    totalGBExpected: Math.round((totalGBExpected + Number.EPSILON) * 100) / 100,
    totalGBLow: Math.round((totalGBLow + Number.EPSILON) * 100) / 100,
    totalGBHigh: Math.round((totalGBHigh + Number.EPSILON) * 100) / 100,

    safetyMarginPercent: validMarginPercent,
    safetyMarginGB: Math.round((safetyMarginGB + Number.EPSILON) * 100) / 100,
    totalWithBufferGB: Math.round((totalWithBufferGB + Number.EPSILON) * 100) / 100,

    recommendedPackageGB,
    matchedPlans,
    insight,
    breakdown,
  };
}

/**
 * Finds the smallest standard package tier that safely covers total data need.
 * If total needed exceeds the highest tier, rounds up to the next 10GB interval.
 */
export function getRecommendedPackageSize(
  dataGBNeeded: number,
  availablePackages = AVAILABLE_PACKAGE_SIZES_GB
): number {
  if (dataGBNeeded <= 0) {
    return availablePackages[0] || 1;
  }

  // Find smallest tier >= needed
  const matched = availablePackages.find((pkg) => pkg >= dataGBNeeded);
  if (matched !== undefined) {
    return matched;
  }

  // If exceeds max available tier, round up to multiple of 10
  return Math.ceil(dataGBNeeded / 10) * 10;
}

/**
 * Matches eSIM plans for the recommendation card.
 * Prioritizes the exact recommended size or the closest plan that covers it.
 */
export function matchPlansForRecommendation(
  recommendedGB: number,
  countryPlans: eSIMPlan[],
  _tripDays: number
): eSIMPlan[] {
  if (!countryPlans || countryPlans.length === 0) return [];

  // Sort country plans by data size
  const sorted = [...countryPlans].sort((a, b) => a.dataGB - b.dataGB);

  // Find exact or closest covering plan
  let primaryPlan = sorted.find((p) => p.dataGB >= recommendedGB);
  if (!primaryPlan) {
    primaryPlan = sorted[sorted.length - 1];
  }

  // Return the best match first, plus immediate alternatives
  const alternatives = sorted.filter((p) => p.id !== primaryPlan!.id);
  return [primaryPlan, ...alternatives];
}

/**
 * Formats data amounts nicely (e.g. 850 MB vs 4.2 GB)
 */
export function formatDataAmount(mb: number): string {
  if (!Number.isFinite(mb) || mb <= 0) return '0 MB';
  if (mb < 1000) {
    return `${Math.round(mb)} MB`;
  }
  const gb = mb / 1000;
  return `${gb >= 10 ? Math.round(gb) : gb.toFixed(1)} GB`;
}
