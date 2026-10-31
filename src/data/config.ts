/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActivityRateConfig, ActivityDurations, UsageProfileConfig } from '../types/calculator.ts';

/**
 * Centralized approximate published consumption rates (in MB per hour).
 * Rates represent real-world cellular data traffic.
 * Midpoint is used as the default expected rate, with messaging utilizing
 * a documented conservative figure (0.75 MB/hr, assuming rich text with occasional thumbnails).
 */
export const ACTIVITY_RATE_CONFIGS: Record<string, ActivityRateConfig> = {
  navigation: {
    id: 'navigation',
    label: 'Navigation & Maps',
    category: 'essential',
    minRateMBPerHour: 5,
    maxRateMBPerHour: 10,
    defaultRateMBPerHour: 7.5, // Midpoint of 5-10
    rateNotes: 'Vector map tile downloads, GPS routing queries, and live transit re-routes.',
    iconName: 'Compass',
    maxDailyHours: 12,
  },
  messaging: {
    id: 'messaging',
    label: 'Messaging & Chat',
    category: 'essential',
    minRateMBPerHour: 0.2,
    maxRateMBPerHour: 1.0,
    defaultRateMBPerHour: 0.75, // Conservative assumption under 1 MB/hour for text + previews
    rateNotes: 'WhatsApp, iMessage, and Telegram text threads with occasional compressed previews.',
    iconName: 'MessageSquare',
    maxDailyHours: 16,
  },
  social: {
    id: 'social',
    label: 'Social Media',
    category: 'media',
    minRateMBPerHour: 30,
    maxRateMBPerHour: 100,
    defaultRateMBPerHour: 65, // Midpoint of 30-100
    rateNotes: 'Instagram feed, X (Twitter), TikTok quick scrolling with autoplay previews.',
    iconName: 'Share2',
    maxDailyHours: 10,
  },
  browsing: {
    id: 'browsing',
    label: 'Web Browsing',
    category: 'essential',
    minRateMBPerHour: 10,
    maxRateMBPerHour: 25,
    defaultRateMBPerHour: 17.5, // Midpoint of 10-25
    rateNotes: 'Travel booking sites, museum tickets, restaurant reviews, and search engines.',
    iconName: 'Globe',
    maxDailyHours: 10,
  },
  music: {
    id: 'music',
    label: 'Music Streaming',
    category: 'media',
    minRateMBPerHour: 40,
    maxRateMBPerHour: 80,
    defaultRateMBPerHour: 60, // Midpoint of 40-80
    rateNotes: 'Spotify, Apple Music, and podcasts streaming at standard 160 kbps quality.',
    iconName: 'Music',
    maxDailyHours: 12,
  },
  sd_video: {
    id: 'sd_video',
    label: 'SD Video Streaming',
    category: 'media',
    minRateMBPerHour: 300,
    maxRateMBPerHour: 700,
    defaultRateMBPerHour: 500, // Midpoint of 300-700
    rateNotes: 'YouTube and Netflix at 480p standard definition.',
    iconName: 'Play',
    maxDailyHours: 8,
  },
  hd_video: {
    id: 'hd_video',
    label: 'HD Video Streaming',
    category: 'heavy',
    minRateMBPerHour: 1500,
    maxRateMBPerHour: 3000,
    defaultRateMBPerHour: 2250, // Midpoint of 1,500-3,000
    rateNotes: 'YouTube, Netflix, and Disney+ streaming at 1080p high definition.',
    iconName: 'Video',
    maxDailyHours: 8,
  },
  video_calls: {
    id: 'video_calls',
    label: 'Video Calls',
    category: 'heavy',
    minRateMBPerHour: 250,
    maxRateMBPerHour: 900,
    defaultRateMBPerHour: 575, // Midpoint of 250-900
    rateNotes: 'FaceTime, WhatsApp Video, Google Meet, and Zoom peer-to-peer calls.',
    iconName: 'Smartphone',
    maxDailyHours: 6,
  },
  hotspot: {
    id: 'hotspot',
    label: 'Personal Hotspot',
    category: 'heavy',
    minRateMBPerHour: 100,
    maxRateMBPerHour: 300,
    defaultRateMBPerHour: 200, // Midpoint of 100-300
    rateNotes: 'Tethering laptop or tablet for remote work, cloud sync, and document editing.',
    iconName: 'Wifi',
    maxDailyHours: 8,
  },
};

/**
 * Standard usage profiles: Light, Normal, Heavy.
 * Selecting a profile initializes all activity durations.
 */
export const USAGE_PROFILES: Record<'light' | 'normal' | 'heavy', UsageProfileConfig> = {
  light: {
    id: 'light',
    title: 'Light Wanderer',
    subtitle: 'Low Daily Consumption',
    description: 'Designed for travelers who disconnect: navigation, essential messaging, and occasional lookups.',
    badge: 'Under 1 GB / day',
    durations: {
      navigation: { hours: 1, minutes: 15 },
      messaging: { hours: 2, minutes: 30 },
      social: { hours: 0, minutes: 20 },
      browsing: { hours: 0, minutes: 30 },
      music: { hours: 0, minutes: 0 },
      sd_video: { hours: 0, minutes: 0 },
      hd_video: { hours: 0, minutes: 0 },
      video_calls: { hours: 0, minutes: 0 },
      hotspot: { hours: 0, minutes: 0 },
    },
  },
  normal: {
    id: 'normal',
    title: 'Balanced Explorer',
    subtitle: 'Moderate Daily Consumption',
    description: 'Typical travel usage: regular social sharing, active navigation, music playlists, and web lookups.',
    badge: '1.5 – 3 GB / day',
    durations: {
      navigation: { hours: 2, minutes: 0 },
      messaging: { hours: 3, minutes: 30 },
      social: { hours: 1, minutes: 15 },
      browsing: { hours: 1, minutes: 0 },
      music: { hours: 1, minutes: 30 },
      sd_video: { hours: 0, minutes: 30 },
      hd_video: { hours: 0, minutes: 0 },
      video_calls: { hours: 0, minutes: 15 },
      hotspot: { hours: 0, minutes: 0 },
    },
  },
  heavy: {
    id: 'heavy',
    title: 'Digital Nomad',
    subtitle: 'High Daily Consumption',
    description: 'Power users, remote workers, and content creators: HD video, hotspot tethering, and frequent video calls.',
    badge: '4 – 8+ GB / day',
    durations: {
      navigation: { hours: 2, minutes: 30 },
      messaging: { hours: 4, minutes: 0 },
      social: { hours: 2, minutes: 0 },
      browsing: { hours: 1, minutes: 30 },
      music: { hours: 2, minutes: 0 },
      sd_video: { hours: 0, minutes: 45 },
      hd_video: { hours: 1, minutes: 15 },
      video_calls: { hours: 0, minutes: 45 },
      hotspot: { hours: 1, minutes: 30 },
    },
  },
};

/**
 * Standard commercially available international eSIM package sizes (in GB).
 * The calculator rounds the recommendation upwards to the nearest available package tier.
 */
export const AVAILABLE_PACKAGE_SIZES_GB: number[] = [1, 2, 3, 5, 10, 15, 20, 30, 50, 100];

/**
 * Default safe roam buffer percentages.
 * The "+20% Safe Roam Cushion" is highlighted in the brand mint turquoise.
 */
export const BUFFER_PRESETS = [
  { value: 10, label: '10% Minimal', description: 'Tight margin for disciplined data savers' },
  { value: 20, label: '20% Safe Roam (Recommended)', description: 'Eliminates bill shock and covers unexpected uploads' },
  { value: 30, label: '30% Generous', description: 'Extra peace of mind for group sharing or heavy hotspot' },
];

export const DEFAULT_SAFETY_MARGIN_PERCENT = 20;

/**
 * Trip duration quick presets in days.
 */
export const DURATION_PRESETS = [3, 7, 10, 14, 21, 30, 60];
