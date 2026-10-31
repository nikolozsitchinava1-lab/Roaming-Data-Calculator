/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ACTIVITY_RATE_CONFIGS } from '../data/config.ts';
import { ActivityIcon } from './ActivityIcon.tsx';
import { X, Sliders, ShieldCheck } from 'lucide-react';

interface RatesBenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RatesBenchmarkModal: React.FC<RatesBenchmarkModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const activities = Object.values(ACTIVITY_RATE_CONFIGS);

  return (
    <div className="fixed inset-0 z-50 bg-[#1D153C]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[#E2DCF7] space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-bold text-[#5D3BE0] uppercase tracking-wider">
              Earth Voyage Telephony Architecture
            </div>
            <h3 className="text-xl font-extrabold text-[#1D153C] mt-0.5">
              Published Consumption Benchmarks &amp; Rate Ranges
            </h3>
            <p className="text-xs text-[#484555] mt-1">
              Data consumption rates vary by platform, codec, and cellular bandwidth. Here are the exact industry benchmarks powering this calculator.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0EDFB] text-[#1D153C] flex items-center justify-center hover:bg-[#E7DEFF]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-[#E2DCF7] rounded-lg overflow-hidden">
            <thead className="bg-[#F0EDFB] text-[#3C2F80] font-bold border-b border-[#E2DCF7]">
              <tr>
                <th className="p-3">Activity</th>
                <th className="p-3">Published Range</th>
                <th className="p-3">Engine Default</th>
                <th className="p-3">Traffic Breakdown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DCF7] text-[#484555]">
              {activities.map((act) => (
                <tr key={act.id} className="hover:bg-[#F8F7FD]">
                  <td className="p-3 font-semibold text-[#1D153C] flex items-center gap-2">
                    <ActivityIcon name={act.iconName} className="w-4 h-4 text-[#5D3BE0]" />
                    <span>{act.label}</span>
                  </td>
                  <td className="p-3 tabular-nums font-mono">
                    {act.minRateMBPerHour}–{act.maxRateMBPerHour} MB/h
                  </td>
                  <td className="p-3 font-bold text-[#5D3BE0] tabular-nums font-mono">
                    {act.defaultRateMBPerHour} MB/h
                  </td>
                  <td className="p-3 text-[11px] text-[#484555]">
                    {act.rateNotes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#F8F7FD] rounded-xl border border-[#E2DCF7] space-y-2 text-xs text-[#484555]">
          <div className="font-bold text-[#1D153C] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Calculation Guarantees</span>
          </div>
          <p>
            • <strong>Gigabyte Conversion:</strong> Adheres strictly to the telecom standard: 1 GB = 1,000 MB.
          </p>
          <p>
            • <strong>Messaging:</strong> Calculated conservatively at 0.75 MB/hr, providing enough buffer for rich media links and thumbnail caches.
          </p>
          <p>
            • <strong>Safe Roam Cushion:</strong> The recommended +20% buffer prevents sudden package exhaustion when travelers upload photos or receive software background updates.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#5D3BE0] text-white text-xs font-semibold rounded-md hover:bg-[#4E2EC7]"
          >
            Close Benchmark
          </button>
        </div>
      </div>
    </div>
  );
};
