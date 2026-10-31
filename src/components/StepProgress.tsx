/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CalculatorStep } from '../types/calculator.ts';
import { Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: CalculatorStep;
  onSelectStep: (step: CalculatorStep) => void;
  canNavigateToStep: (step: CalculatorStep) => boolean;
}

interface StepDefinition {
  id: CalculatorStep;
  index: number;
  label: string;
  summary: string;
}

const STEPS: StepDefinition[] = [
  { id: 'destination', index: 1, label: 'Destination', summary: 'Country & network' },
  { id: 'duration', index: 2, label: 'Duration', summary: 'Days on the road' },
  { id: 'profile', index: 3, label: 'Profile', summary: 'Usage baseline' },
  { id: 'customize', index: 4, label: 'Activities', summary: 'Daily habits' },
  { id: 'results', index: 5, label: 'Ledger', summary: 'Calculated eSIM plan' },
];

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  onSelectStep,
  canNavigateToStep,
}) => {
  const currentStepObj = STEPS.find((s) => s.id === currentStep) || STEPS[0];
  const currentIndex = currentStepObj.index;

  return (
    <div className="w-full bg-[#FFFFFF] border-b border-[#E2DCF7] px-4 md:px-8 py-3">
      <div className="max-w-[1280px] mx-auto">
        {/* Desktop Step Bar */}
        <div className="hidden sm:grid grid-cols-5 gap-2 md:gap-4">
          {STEPS.map((step) => {
            const isCompleted = step.index < currentIndex;
            const isCurrent = step.id === currentStep;
            const isClickable = canNavigateToStep(step.id);

            return (
              <button
                key={step.id}
                type="button"
                disabled={!isClickable}
                onClick={() => onSelectStep(step.id)}
                className={`flex items-center gap-3 p-2 rounded-lg text-left transition-all ${
                  isCurrent
                    ? 'bg-[#F0EDFB] border border-[#5D3BE0]/40'
                    : isClickable
                    ? 'hover:bg-[#F8F7FD] cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-[#5D3BE0] text-white'
                      : isCurrent
                      ? 'bg-[#5D3BE0] text-white ring-2 ring-[#5D3BE0]/20'
                      : 'bg-[#F0EDFB] text-[#3C2F80] border border-[#E2DCF7]'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : step.index}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#1D153C] truncate">
                    {step.label}
                  </div>
                  <div className="text-[11px] text-[#484555] truncate">
                    {step.summary}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile Compact Stepper */}
        <div className="sm:hidden flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#5D3BE0] text-white flex items-center justify-center text-xs font-bold">
              {currentIndex}
            </span>
            <span className="text-xs font-bold text-[#1D153C]">
              Step {currentIndex} of 5: <span className="font-medium text-[#5D3BE0]">{currentStepObj.label}</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`h-1.5 rounded-full transition-all ${
                  step.id === currentStep
                    ? 'w-6 bg-[#5D3BE0]'
                    : step.index < currentIndex
                    ? 'w-3 bg-[#9E5AFD]'
                    : 'w-2 bg-[#E2DCF7]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
