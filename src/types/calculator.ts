/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActivityId =
  | 'navigation'
  | 'messaging'
  | 'social'
  | 'browsing'
  | 'music'
  | 'sd_video'
  | 'hd_video'
  | 'video_calls'
  | 'hotspot';

export interface ActivityRateConfig {
  id: ActivityId;
  label: string;
  category: 'essential' | 'media' | 'heavy';
  minRateMBPerHour: number;
  maxRateMBPerHour: number;
  defaultRateMBPerHour: number;
  rateNotes: string;
  iconName: string;
  maxDailyHours: number;
}

export interface ActivityDuration {
  hours: number;
  minutes: number;
}

export type ActivityDurations = Record<ActivityId, ActivityDuration>;

export type UsageProfileId = 'light' | 'normal' | 'heavy' | 'custom';

export interface UsageProfileConfig {
  id: UsageProfileId;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  durations: ActivityDurations;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  region: 'Europe' | 'Asia-Pacific' | 'North America' | 'Latin America' | 'Middle East' | 'Africa';
  popular?: boolean;
  networks: string[];
  fastestSpeed: '5G' | '4G/LTE';
  currency: string;
  image?: string;
  plans: eSIMPlan[];
}

export interface eSIMPlan {
  id: string;
  name: string;
  dataGB: number;
  validityDays: number;
  priceUSD: number;
  speed: string;
  networks: string[];
  bestValue?: boolean;
  popular?: boolean;
  instantQR: boolean;
}

export interface ActivityBreakdownItem {
  activityId: ActivityId;
  label: string;
  iconName: string;
  hoursPerDay: number;
  dailyMBExpected: number;
  dailyMBLow: number;
  dailyMBHigh: number;
  totalMBExpected: number;
  totalMBLow: number;
  totalMBHigh: number;
  totalGBExpected: number;
  percentageOfTotal: number;
}

export interface UsagePatternInsight {
  type: 'video_heavy' | 'hotspot_heavy' | 'music_heavy' | 'balanced' | 'light_saver';
  title: string;
  advice: string;
  savingTip: string;
}

export interface CalculationResult {
  // Daily estimates (MB)
  dailyMBExpected: number;
  dailyMBLow: number;
  dailyMBHigh: number;
  
  // Trip totals (MB and GB, 1GB = 1,000MB)
  totalMBExpected: number;
  totalMBLow: number;
  totalMBHigh: number;
  totalGBExpected: number;
  totalGBLow: number;
  totalGBHigh: number;

  // Safety buffer
  safetyMarginPercent: number; // e.g., 20
  safetyMarginGB: number;
  totalWithBufferGB: number;

  // Package recommendation
  recommendedPackageGB: number;
  matchedPlans: eSIMPlan[];

  // Pattern Insight
  insight: UsagePatternInsight;

  // Detailed breakdown
  breakdown: ActivityBreakdownItem[];
}

export type CalculatorStep = 'destination' | 'duration' | 'profile' | 'customize' | 'results';
