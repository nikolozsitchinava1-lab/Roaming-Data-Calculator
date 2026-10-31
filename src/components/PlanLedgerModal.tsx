/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Country, eSIMPlan } from '../types/calculator.ts';
import { COUNTRIES } from '../data/destinations.ts';
import { X, QrCode, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface PlanLedgerModalProps {
  isOpen: boolean;
  selectedCountry: Country | null;
  onSelectCountry: (c: Country) => void;
  onClose: () => void;
}

export const PlanLedgerModal: React.FC<PlanLedgerModalProps> = ({
  isOpen,
  selectedCountry,
  onSelectCountry,
  onClose,
}) => {
  if (!isOpen) return null;

  const currentCountry = selectedCountry || COUNTRIES[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#1D153C]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col p-6 shadow-2xl border border-[#E2DCF7] space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-bold text-[#5D3BE0] uppercase tracking-wider">
              Earth Voyage eSIM Ledger
            </div>
            <h3 className="text-xl font-extrabold text-[#1D153C] mt-0.5">
              Available Data Packages for {currentCountry.flag} {currentCountry.name}
            </h3>
            <p className="text-xs text-[#484555]">
              Local carriers: {currentCountry.networks.join(', ')} · 5G &amp; LTE High Speed
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

        {/* Country Selector Dropdown */}
        <div className="flex items-center gap-2 bg-[#F8F7FD] p-2.5 rounded-lg border border-[#E2DCF7]">
          <span className="text-xs font-medium text-[#484555]">Country:</span>
          <select
            value={currentCountry.code}
            onChange={(e) => {
              const c = COUNTRIES.find((x) => x.code === e.target.value);
              if (c) onSelectCountry(c);
            }}
            className="flex-1 bg-white border border-[#E2DCF7] rounded-md text-xs font-bold text-[#1D153C] p-1.5 focus:outline-none focus:border-[#5D3BE0]"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {/* Plan Cards Grid */}
        <div className="overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pr-1">
          {currentCountry.plans.map((p) => (
            <div
              key={p.id}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                p.popular || p.bestValue
                  ? 'bg-[#F0EDFB] border-[#5D3BE0]/50 shadow-xs'
                  : 'bg-white border-[#E2DCF7]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#5D3BE0]">{p.speed}</span>
                  <span className="text-[10px] text-[#797587]">{p.validityDays} Days</span>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-extrabold text-[#1D153C] tabular-nums">
                    {p.dataGB} GB
                  </div>
                  <div className="text-xs text-[#484555] font-medium">{p.name}</div>
                </div>
                <div className="mt-3 text-xl font-bold text-[#5D3BE0] tabular-nums">
                  ${p.priceUSD.toFixed(2)}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-[#E2DCF7] text-[10px] text-[#484555] space-y-1">
                <div className="flex items-center gap-1">
                  <QrCode className="w-3 h-3 text-[#5D3BE0]" />
                  <span>Instant QR setup</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Prepaid, no roaming fees</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[#E2DCF7] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#5D3BE0] text-white text-xs font-semibold rounded-md hover:bg-[#4E2EC7]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
