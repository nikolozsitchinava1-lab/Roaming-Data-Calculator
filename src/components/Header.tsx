/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RotateCcw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onNavigateTab: (tab: 'calculator' | 'destinations' | 'ledger' | 'rates') => void;
  activeTab: 'calculator' | 'destinations' | 'ledger' | 'rates';
}

export const Header: React.FC<HeaderProps> = ({ onReset, onNavigateTab, activeTab }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E2DCF7] px-4 md:px-8 py-3.5 shadow-xs">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('calculator')}
            className="text-left group flex items-center gap-2 text-inherit"
          >
            <div className="w-8 h-8 rounded-lg bg-[#5D3BE0] flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-xs">
              EV
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1D153C] whitespace-nowrap shrink-0 group-hover:text-[#5D3BE0] transition-colors">
              Earth Voyage
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#484555]">
          <button
            onClick={() => onNavigateTab('calculator')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'calculator'
                ? 'text-[#5D3BE0] font-semibold border-b-2 border-[#5D3BE0]'
                : 'hover:text-[#1D153C]'
            }`}
          >
            Data Calculator
          </button>
          <button
            onClick={() => onNavigateTab('destinations')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'destinations'
                ? 'text-[#5D3BE0] font-semibold border-b-2 border-[#5D3BE0]'
                : 'hover:text-[#1D153C]'
            }`}
          >
            Destinations &amp; Networks
          </button>
          <button
            onClick={() => onNavigateTab('ledger')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'ledger'
                ? 'text-[#5D3BE0] font-semibold border-b-2 border-[#5D3BE0]'
                : 'hover:text-[#1D153C]'
            }`}
          >
            eSIM Plan Ledger
          </button>
          <button
            onClick={() => onNavigateTab('rates')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeTab === 'rates'
                ? 'text-[#5D3BE0] font-semibold border-b-2 border-[#5D3BE0]'
                : 'hover:text-[#1D153C]'
            }`}
          >
            Consumption Benchmark
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#3C2F80] bg-[#F0EDFB] border border-[#E2DCF7] rounded-md hover:bg-[#E7DEFF] transition-colors whitespace-nowrap shrink-0"
            title="Reset calculator to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#5D3BE0]" />
            <span>Reset Inputs</span>
          </button>
        </div>
      </div>
    </header>
  );
};
