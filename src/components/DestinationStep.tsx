/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Country } from '../types/calculator.ts';
import { COUNTRIES, REGIONS } from '../data/destinations.ts';
import { Search, Globe, Check, ArrowRight, Radio, Sparkles, X, Wifi } from 'lucide-react';

interface DestinationStepProps {
  selectedCountry: Country | null;
  onSelectCountry: (country: Country) => void;
  onNext: () => void;
}

export const DestinationStep: React.FC<DestinationStepProps> = ({
  selectedCountry,
  onSelectCountry,
  onNext,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter((country) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        country.name.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query) ||
        country.networks.some((n) => n.toLowerCase().includes(query));

      const matchesRegion =
        selectedRegion === 'all' || country.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedRegion]);

  const popularCountries = useMemo(() => {
    return COUNTRIES.filter((c) => c.popular).slice(0, 8);
  }, []);

  return (
    <div className="space-y-6">
      {/* Title & context */}
      <div>
        <div className="text-xs font-semibold text-[#5D3BE0] uppercase tracking-wider mb-1">
          Step 1 · International Routing
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1D153C] tracking-tight">
          Where are you travelling?
        </h2>
        <p className="text-sm text-[#484555] mt-1">
          Select your destination to preview local tier-1 cellular carrier partners, 5G availability, and matched data packages.
        </p>
      </div>

      {/* Search Bar matching BrandBook specs */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#3C2F80]">
          <Globe className="w-5 h-5 text-[#5D3BE0]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search country, ISO code, or carrier (e.g. Japan, France, Docomo, Orange)..."
          className="w-full pl-11 pr-10 py-3.5 bg-white border border-[#E2DCF7] rounded-lg text-sm text-[#1D153C] placeholder-[#797587] transition-all focus:outline-none focus:border-[#5D3BE0] focus:ring-3 focus:ring-[#5D3BE0]/20 shadow-xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#797587] hover:text-[#1D153C]"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Region Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedRegion('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            selectedRegion === 'all'
              ? 'bg-[#5D3BE0] text-white shadow-xs'
              : 'bg-[#F0EDFB] text-[#3C2F80] hover:bg-[#E7DEFF]'
          }`}
        >
          All Regions ({COUNTRIES.length})
        </button>
        {REGIONS.map((region) => (
          <button
            key={region}
            type="button"
            onClick={() => setSelectedRegion(region)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              selectedRegion === region
                ? 'bg-[#5D3BE0] text-white shadow-xs'
                : 'bg-[#F0EDFB] text-[#3C2F80] hover:bg-[#E7DEFF]'
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {/* Quick Select Featured Destinations with Rich Photography */}
      {!searchQuery && selectedRegion === 'all' && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3C2F80]">
            <Sparkles className="w-3.5 h-3.5 text-[#5D3BE0]" />
            <span>Featured International Destinations</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {popularCountries.slice(0, 4).map((c) => {
              const isSelected = selectedCountry?.code === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => onSelectCountry(c)}
                  className={`group relative rounded-xl border text-left overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-end h-32 md:h-36 ${
                    isSelected
                      ? 'border-2 border-[#5D3BE0] shadow-md ring-2 ring-[#5D3BE0]/30'
                      : 'border-[#E2DCF7] hover:border-[#5D3BE0]/60 shadow-xs'
                  }`}
                >
                  {/* Photo Background or styled fallback */}
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F0EDFB] to-[#ECE4FF]" />
                  )}

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                  {/* Content Overlay */}
                  <div className="relative z-10 p-3 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xl shrink-0" role="img" aria-label={c.name}>
                        {c.flag}
                      </span>
                      <span className="text-[10px] font-bold bg-[#5D3BE0] text-white px-2 py-0.5 rounded-full shadow-2xs">
                        {c.fastestSpeed}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white mt-1 truncate">{c.name}</div>
                    <div className="text-[10px] text-white/80 truncate">
                      {c.networks[0]}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 z-20 w-5 h-5 rounded-full bg-[#5D3BE0] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Secondary Quick Hubs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {popularCountries.slice(4, 8).map((c) => {
              const isSelected = selectedCountry?.code === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => onSelectCountry(c)}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F0EDFB] border-2 border-[#5D3BE0] shadow-xs'
                      : 'bg-white border-[#E2DCF7] hover:border-[#5D3BE0]/40 hover:bg-[#F8F7FD]'
                  }`}
                >
                  <span className="text-xl shrink-0" role="img" aria-label={c.name}>
                    {c.flag}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-[#1D153C] truncate">{c.name}</div>
                    <div className="text-[10px] text-[#5D3BE0] font-semibold">{c.fastestSpeed}</div>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-[#5D3BE0] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Country List / Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#484555]">
          <span>Available Destinations ({filteredCountries.length})</span>
          {selectedCountry && (
            <span className="font-semibold text-[#5D3BE0]">
              Active: {selectedCountry.name} ({selectedCountry.code})
            </span>
          )}
        </div>

        {filteredCountries.length === 0 ? (
          <div className="p-8 text-center bg-white border border-[#E2DCF7] rounded-xl space-y-3">
            <Globe className="w-8 h-8 text-[#797587] mx-auto" />
            <div className="text-sm font-semibold text-[#1D153C]">No destination matches found</div>
            <p className="text-xs text-[#484555] max-w-sm mx-auto">
              We couldn&apos;t find any country matching &ldquo;{searchQuery}&rdquo;. Try searching for another name or reset filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('all');
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#5D3BE0] bg-[#F0EDFB] rounded-md hover:bg-[#E7DEFF]"
            >
              Clear Search Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredCountries.map((c) => {
              const isSelected = selectedCountry?.code === c.code;
              return (
                <div
                  key={c.code}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectCountry(c)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectCountry(c);
                    }
                  }}
                  className={`relative p-3.5 rounded-lg border text-left cursor-pointer transition-all flex items-start gap-3 select-none ${
                    isSelected
                      ? 'bg-[#F0EDFB] border-2 border-[#5D3BE0] shadow-sm ring-1 ring-[#5D3BE0]'
                      : 'bg-white border-[#E2DCF7] hover:border-[#5D3BE0]/50 hover:bg-[#F8F7FD]'
                  }`}
                >
                  <span className="text-3xl shrink-0 mt-0.5" role="img" aria-label={c.name}>
                    {c.flag}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#1D153C] truncate">{c.name}</span>
                      <span className="text-[11px] font-mono text-[#797587]">({c.code})</span>
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-[11px] text-[#484555]">
                      <Radio className="w-3 h-3 text-[#5D3BE0] shrink-0" />
                      <span className="truncate">{c.networks.slice(0, 2).join(' · ')}</span>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-[11px] text-[#484555]">
                      <span className="font-semibold text-[#3C2F80]">{c.region}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#5D3BE0] font-medium">{c.fastestSpeed}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">From ${c.plans[0]?.priceUSD.toFixed(2)}</span>
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-[#5D3BE0] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-[#E2DCF7] shrink-0 hover:border-[#5D3BE0]" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Destination Confirmation Card & Next Action */}
      <div className="pt-4 border-t border-[#E2DCF7] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          {selectedCountry ? (
            <div className="text-xs text-[#484555]">
              Destination set to{' '}
              <strong className="text-[#1D153C]">{selectedCountry.flag} {selectedCountry.name}</strong>
              {' '}&middot; {selectedCountry.fastestSpeed} via {selectedCountry.networks[0]}
            </div>
          ) : (
            <div className="text-xs text-[#BA1A1A] font-medium">
              Please select a destination country to proceed.
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={!selectedCountry}
          onClick={onNext}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold text-sm transition-all shadow-xs ${
            selectedCountry
              ? 'bg-[#5D3BE0] hover:bg-[#4E2EC7] text-white cursor-pointer active:scale-[0.98]'
              : 'bg-[#E2DCF7] text-[#797587] cursor-not-allowed'
          }`}
        >
          <span>Continue to Trip Duration</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
