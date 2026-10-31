/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Country } from '../types/calculator.ts';
import { COUNTRIES, REGIONS } from '../data/destinations.ts';
import { X, Search, Radio, Check, Globe } from 'lucide-react';

interface DestinationsCatalogModalProps {
  isOpen: boolean;
  selectedCountry: Country | null;
  onSelectCountry: (country: Country) => void;
  onClose: () => void;
}

export const DestinationsCatalogModal: React.FC<DestinationsCatalogModalProps> = ({
  isOpen,
  selectedCountry,
  onSelectCountry,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('all');

  if (!isOpen) return null;

  const filtered = COUNTRIES.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.networks.some((n) => n.toLowerCase().includes(search.toLowerCase()));
    const matchesRegion = region === 'all' || c.region === region;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#1D153C]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col p-6 shadow-2xl border border-[#E2DCF7] space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-bold text-[#5D3BE0] uppercase tracking-wider">
              Global Coverage Directory
            </div>
            <h3 className="text-xl font-extrabold text-[#1D153C] mt-0.5">
              Available Destinations &amp; Local Network Partners
            </h3>
            <p className="text-xs text-[#484555]">
              Select any destination to load its local partner networks into the roaming calculator.
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

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#797587] absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destination by country, ISO, or network..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2DCF7] rounded-lg text-xs text-[#1D153C] focus:outline-none focus:border-[#5D3BE0]"
            />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            <button
              onClick={() => setRegion('all')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap ${
                region === 'all' ? 'bg-[#5D3BE0] text-white' : 'bg-[#F0EDFB] text-[#3C2F80]'
              }`}
            >
              All
            </button>
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap ${
                  region === r ? 'bg-[#5D3BE0] text-white' : 'bg-[#F0EDFB] text-[#3C2F80]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Countries Grid */}
        <div className="overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pr-1">
          {filtered.map((c) => {
            const isSelected = selectedCountry?.code === c.code;

            return (
              <div
                key={c.code}
                role="button"
                tabIndex={0}
                onClick={() => {
                  onSelectCountry(c);
                  onClose();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCountry(c);
                    onClose();
                  }
                }}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-[#F0EDFB] border-2 border-[#5D3BE0]'
                    : 'bg-white border-[#E2DCF7] hover:bg-[#F8F7FD]'
                }`}
              >
                <span className="text-2xl">{c.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1D153C] truncate">{c.name}</span>
                    <span className="text-[10px] text-[#5D3BE0] font-semibold">{c.fastestSpeed}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#484555] mt-1">
                    <Radio className="w-3 h-3 text-[#5D3BE0]" />
                    <span className="truncate">{c.networks.join(', ')}</span>
                  </div>
                  <div className="text-[10px] text-[#797587] mt-1">
                    {c.region} · From ${c.plans[0]?.priceUSD.toFixed(2)}
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#5D3BE0] shrink-0" />}
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-[#E2DCF7] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#F0EDFB] text-[#3C2F80] text-xs font-semibold rounded-md hover:bg-[#E7DEFF]"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
