/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  ActivityDurations,
  ActivityId,
  CalculatorStep,
  Country,
  UsageProfileId,
} from './types/calculator.ts';
import {
  DEFAULT_SAFETY_MARGIN_PERCENT,
  USAGE_PROFILES,
} from './data/config.ts';
import { COUNTRIES } from './data/destinations.ts';
import { calculateRoamingData } from './utils/calculatorEngine.ts';
import { Header } from './components/Header.tsx';
import { StepProgress } from './components/StepProgress.tsx';
import { DestinationStep } from './components/DestinationStep.tsx';
import { DurationStep } from './components/DurationStep.tsx';
import { ProfileStep } from './components/ProfileStep.tsx';
import { ActivityCustomizerStep } from './components/ActivityCustomizerStep.tsx';
import { ResultsView } from './components/ResultsView.tsx';
import { StickyLedgerDossier } from './components/StickyLedgerDossier.tsx';
import { RatesBenchmarkModal } from './components/RatesBenchmarkModal.tsx';
import { DestinationsCatalogModal } from './components/DestinationsCatalogModal.tsx';
import { PlanLedgerModal } from './components/PlanLedgerModal.tsx';
import { Compass, Sparkles, ShieldCheck, Zap } from 'lucide-react';

const STORAGE_KEY = 'earth_voyage_roaming_calculator_state_v1';

export default function App() {
  // 1. Destination state (defaults to Japan for instant rich demo, user can freely switch)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.countryCode) {
          return COUNTRIES.find((c) => c.code === parsed.countryCode) || COUNTRIES[0];
        }
      }
    } catch {
      // fallback
    }
    return COUNTRIES[0]; // Japan
  });

  // 2. Trip duration (days)
  const [tripDays, setTripDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.tripDays === 'number' && parsed.tripDays >= 1) {
          return parsed.tripDays;
        }
      }
    } catch {
      // fallback
    }
    return 7;
  });

  // 3. Usage profile ('light' | 'normal' | 'heavy' | 'custom')
  const [selectedProfileId, setSelectedProfileId] = useState<UsageProfileId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profileId) return parsed.profileId;
      }
    } catch {
      // fallback
    }
    return 'normal';
  });

  // 4. Activity durations (hours & minutes for all 9 activities)
  const [durations, setDurations] = useState<ActivityDurations>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.durations) return parsed.durations;
      }
    } catch {
      // fallback
    }
    return JSON.parse(JSON.stringify(USAGE_PROFILES.normal.durations));
  });

  // 5. Configurable safety margin (default 20%)
  const [safetyMarginPercent, setSafetyMarginPercent] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.safetyMarginPercent === 'number') {
          return parsed.safetyMarginPercent;
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_SAFETY_MARGIN_PERCENT;
  });

  // 6. Navigation Step
  const [currentStep, setCurrentStep] = useState<CalculatorStep>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentStep) return parsed.currentStep;
      }
    } catch {
      // fallback
    }
    return 'destination';
  });

  // Secondary interactive modals
  const [showRatesModal, setShowRatesModal] = useState(false);
  const [showDestinationsModal, setShowDestinationsModal] = useState(false);
  const [showPlanLedgerModal, setShowPlanLedgerModal] = useState(false);
  const [activeHeaderTab, setActiveHeaderTab] = useState<'calculator' | 'destinations' | 'ledger' | 'rates'>('calculator');

  // Persist state changes into localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        countryCode: selectedCountry?.code,
        tripDays,
        profileId: selectedProfileId,
        durations,
        safetyMarginPercent,
        currentStep,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // ignore
    }
  }, [selectedCountry, tripDays, selectedProfileId, durations, safetyMarginPercent, currentStep]);

  // Recalculate roaming data on any input change (Live calculation engine)
  const calculationResult = useMemo(() => {
    return calculateRoamingData(
      durations,
      tripDays,
      safetyMarginPercent,
      selectedCountry || undefined
    );
  }, [durations, tripDays, safetyMarginPercent, selectedCountry]);

  // Reset to initial defaults
  const handleReset = () => {
    setSelectedCountry(COUNTRIES[0]);
    setTripDays(7);
    setSelectedProfileId('normal');
    setDurations(JSON.parse(JSON.stringify(USAGE_PROFILES.normal.durations)));
    setSafetyMarginPercent(DEFAULT_SAFETY_MARGIN_PERCENT);
    setCurrentStep('destination');
  };

  // Profile selection initializes activity durations
  const handleSelectProfile = (profileId: 'light' | 'normal' | 'heavy') => {
    setSelectedProfileId(profileId);
    setDurations(JSON.parse(JSON.stringify(USAGE_PROFILES[profileId].durations)));
  };

  // Custom activity duration edit
  const handleChangeActivityDuration = (
    activityId: ActivityId,
    hours: number,
    minutes: number
  ) => {
    setDurations((prev) => ({
      ...prev,
      [activityId]: { hours, minutes },
    }));
    setSelectedProfileId('custom');
  };

  // Reset activities to the selected profile
  const handleResetToProfile = () => {
    const profile =
      selectedProfileId === 'custom' ? 'normal' : selectedProfileId;
    setSelectedProfileId(profile as 'light' | 'normal' | 'heavy');
    setDurations(JSON.parse(JSON.stringify(USAGE_PROFILES[profile as 'light' | 'normal' | 'heavy'].durations)));
  };

  // Navigation handlers
  const canNavigateToStep = (step: CalculatorStep): boolean => {
    if (step === 'destination') return true;
    if (!selectedCountry) return false;
    return true;
  };

  const handleHeaderNav = (tab: 'calculator' | 'destinations' | 'ledger' | 'rates') => {
    setActiveHeaderTab(tab);
    if (tab === 'calculator') {
      setCurrentStep('destination');
    } else if (tab === 'destinations') {
      setShowDestinationsModal(true);
    } else if (tab === 'ledger') {
      setShowPlanLedgerModal(true);
    } else if (tab === 'rates') {
      setShowRatesModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FD] flex flex-col text-[#1D153C] pb-24 lg:pb-12">
      {/* 3-Zone Header */}
      <Header
        onReset={handleReset}
        onNavigateTab={handleHeaderNav}
        activeTab={activeHeaderTab}
      />

      {/* Tactile Progress Bar */}
      <StepProgress
        currentStep={currentStep}
        onSelectStep={(step) => {
          if (canNavigateToStep(step)) setCurrentStep(step);
        }}
        canNavigateToStep={canNavigateToStep}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Intro Hero Banner with Rich Travel Imagery */}
        <div className="mb-6 bg-white border border-[#E2DCF7] rounded-2xl shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch">
          <div className="p-6 md:p-8 md:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#5D3BE0]">
                <Compass className="w-4 h-4 text-[#5D3BE0]" />
                <span className="tracking-wide uppercase">Voyage Roam &amp; Ledger &middot; International Telephony</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-[#1D153C] tracking-tight mt-1.5 leading-tight">
                Zero Bill Shock Roaming Data Calculator
              </h1>
              <p className="text-xs md:text-sm text-[#484555] mt-2 leading-relaxed">
                Estimate your exact overseas data requirements using real telecom consumption rates, apply a transparent +20% safety cushion, and match the optimal travel eSIM tier.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="px-3.5 py-2 bg-[#F0EDFB] border border-[#E2DCF7] rounded-xl flex items-center gap-2 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-[#1D153C]">1 GB = 1,000 MB</div>
                  <div className="text-[10px] text-[#484555]">Strict Telecom Standard</div>
                </div>
              </div>

              <div className="px-3.5 py-2 bg-[#F0EDFB] border border-[#E2DCF7] rounded-xl flex items-center gap-2 shadow-2xs">
                <Zap className="w-4 h-4 text-[#5D3BE0] shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-[#1D153C]">+20% Safe Buffer</div>
                  <div className="text-[10px] text-[#484555]">Contingency Cushion</div>
                </div>
              </div>

              {selectedCountry && (
                <div className="px-3.5 py-2 bg-[#F8F7FD] border border-[#5D3BE0]/30 rounded-xl flex items-center gap-2 shadow-2xs">
                  <span className="text-lg">{selectedCountry.flag}</span>
                  <div>
                    <div className="text-[11px] font-bold text-[#5D3BE0]">{selectedCountry.name}</div>
                    <div className="text-[10px] text-[#484555]">{tripDays} Days Active</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative md:col-span-5 min-h-[180px] md:min-h-full bg-gradient-to-tr from-[#5D3BE0]/10 to-[#9E5AFD]/10 overflow-hidden border-t md:border-t-0 md:border-l border-[#E2DCF7]">
            <img
              src="/src/assets/images/hero_voyage_traveler_1793465633377.jpg"
              alt="International traveler with smartphone navigating historic city street at golden hour"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center max-h-[260px] md:max-h-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D153C]/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-[11px] font-semibold text-white/95 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/20">
                5G International Roaming &middot; Instant QR Activation
              </span>
            </div>
          </div>
        </div>

        {/* 12-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: 7 Cols on desktop for interactive step controls */}
          <section className="lg:col-span-7 transition-all">
            <div key={currentStep} className="animate-in fade-in-50 slide-in-from-bottom-2 duration-200">
              {currentStep === 'destination' && (
                <DestinationStep
                  selectedCountry={selectedCountry}
                  onSelectCountry={(c) => setSelectedCountry(c)}
                  onNext={() => setCurrentStep('duration')}
                />
              )}

              {currentStep === 'duration' && (
                <DurationStep
                  durationDays={tripDays}
                  onChangeDuration={(d) => setTripDays(d)}
                  onNext={() => setCurrentStep('profile')}
                  onBack={() => setCurrentStep('destination')}
                />
              )}

              {currentStep === 'profile' && (
                <ProfileStep
                  selectedProfileId={selectedProfileId}
                  onSelectProfile={handleSelectProfile}
                  onNext={() => setCurrentStep('customize')}
                  onBack={() => setCurrentStep('duration')}
                  onSkipToResults={() => setCurrentStep('results')}
                />
              )}

              {currentStep === 'customize' && (
                <ActivityCustomizerStep
                  durations={durations}
                  tripDays={tripDays}
                  onChangeDuration={handleChangeActivityDuration}
                  onResetToProfile={handleResetToProfile}
                  onNext={() => setCurrentStep('results')}
                  onBack={() => setCurrentStep('profile')}
                />
              )}

              {currentStep === 'results' && (
                <ResultsView
                  result={calculationResult}
                  selectedCountry={selectedCountry}
                  tripDays={tripDays}
                  safetyMarginPercent={safetyMarginPercent}
                  onChangeSafetyMargin={setSafetyMarginPercent}
                  onEditActivities={() => setCurrentStep('customize')}
                  onBackToSteps={() => setCurrentStep('customize')}
                />
              )}
            </div>
          </section>

          {/* Right Column: 5 Cols on desktop for Sticky Recommendation Dossier */}
          <div className="lg:col-span-5">
            <StickyLedgerDossier
              result={calculationResult}
              selectedCountry={selectedCountry}
              tripDays={tripDays}
              currentStep={currentStep}
              onNavigateToResults={() => setCurrentStep('results')}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E2DCF7] bg-white py-6 px-4 md:px-8 text-center text-xs text-[#797587]">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1D153C]">Earth Voyage</span>
            <span>&middot;</span>
            <span>Roaming Data Calculator &amp; eSIM Ledger</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setShowRatesModal(true)}
              className="hover:text-[#5D3BE0] transition-colors"
            >
              Benchmark Methodology
            </button>
            <button
              onClick={() => setShowDestinationsModal(true)}
              className="hover:text-[#5D3BE0] transition-colors"
            >
              Global 5G Networks
            </button>
            <span>&copy; 2026 Earth Voyage. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Secondary Information Modals */}
      <RatesBenchmarkModal
        isOpen={showRatesModal}
        onClose={() => {
          setShowRatesModal(false);
          setActiveHeaderTab('calculator');
        }}
      />

      <DestinationsCatalogModal
        isOpen={showDestinationsModal}
        selectedCountry={selectedCountry}
        onSelectCountry={(c) => {
          setSelectedCountry(c);
          setShowDestinationsModal(false);
          setActiveHeaderTab('calculator');
        }}
        onClose={() => {
          setShowDestinationsModal(false);
          setActiveHeaderTab('calculator');
        }}
      />

      <PlanLedgerModal
        isOpen={showPlanLedgerModal}
        selectedCountry={selectedCountry}
        onSelectCountry={(c) => {
          setSelectedCountry(c);
          setActiveHeaderTab('calculator');
        }}
        onClose={() => {
          setShowPlanLedgerModal(false);
          setActiveHeaderTab('calculator');
        }}
      />
    </div>
  );
}
