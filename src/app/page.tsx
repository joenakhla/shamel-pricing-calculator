"use client";

import { useState } from "react";
import StepCompanyInfo from "@/components/StepCompanyInfo";
import StepPlanConfig from "@/components/StepPlanConfig";
import StepResults from "@/components/StepResults";
import { calculatePricing, CalculationResult } from "@/lib/pricing";
import {
  Building2,
  Users,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

const steps = [
  { label: "Company Info", icon: Building2 },
  { label: "Plan Setup", icon: Users },
  { label: "Results & ROI", icon: BarChart3 },
];

export interface FormData {
  companyName: string;
  industry: string;
  employeeCount: number;
  planType: "individual" | "family" | "mixed";
  individualCount: number;
  familyCount: number;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    industry: "",
    employeeCount: 0,
    planType: "individual",
    individualCount: 0,
    familyCount: 0,
  });
  const [result, setResult] = useState<CalculationResult | null>(null);

  function handleNext() {
    if (currentStep === 1) {
      const calc = calculatePricing(
        formData.employeeCount,
        formData.planType,
        formData.individualCount,
        formData.familyCount
      );
      setResult(calc);
    }
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function handleBack() {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }

  function handleRestart() {
    setCurrentStep(0);
    setFormData({
      companyName: "",
      industry: "",
      employeeCount: 0,
      planType: "individual",
      individualCount: 0,
      familyCount: 0,
    });
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-cyan-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Shamel Enterprise</h1>
            <p className="text-xs text-gray-500">Healthcare Benefits by Vezeeta</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === currentStep;
            const isCompleted = i < currentStep;
            return (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-cyan-600 text-white shadow-lg shadow-cyan-200"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={22} />
                    ) : (
                      <Icon size={22} />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      isActive ? "text-cyan-700" : isCompleted ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-16 sm:w-24 h-1 mx-2 rounded-full transition-colors duration-300 ${
                      i < currentStep ? "bg-green-400" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="animate-fade-in-up" key={currentStep}>
          {currentStep === 0 && (
            <StepCompanyInfo
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
            />
          )}
          {currentStep === 1 && (
            <StepPlanConfig
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 2 && result && (
            <StepResults
              result={result}
              companyName={formData.companyName}
              onBack={handleBack}
              onRestart={handleRestart}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
          Powered by <span className="font-semibold text-cyan-600">Shamel</span> by Vezeeta &mdash; Egypt&apos;s #1 Healthcare Platform
        </div>
      </footer>
    </div>
  );
}
