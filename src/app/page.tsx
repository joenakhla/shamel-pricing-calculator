"use client";

import { useState } from "react";
import StepCompanyInfo from "@/components/StepCompanyInfo";
import StepPlanConfig from "@/components/StepPlanConfig";
import StepResults from "@/components/StepResults";
import StepQuotationInfo from "@/components/StepQuotationInfo";
import StepQuotation from "@/components/StepQuotation";
import { calculatePricing, CalculationResult } from "@/lib/pricing";
import {
  Building2,
  Users,
  BarChart3,
  FileText,
  FileCheck,
  CheckCircle2,
} from "lucide-react";

const steps = [
  { label: "Company Info", icon: Building2 },
  { label: "Plan Setup", icon: Users },
  { label: "Results & ROI", icon: BarChart3 },
  { label: "Quotation Details", icon: FileText },
  { label: "Quotation", icon: FileCheck },
];

export interface FormData {
  companyName: string;
  industry: string;
  employeeCount: number;
  planType: "individual" | "family" | "mixed";
  individualCount: number;
  familyCount: number;
  miniIndividualCount: number;
  miniFamilyCount: number;
}

export interface QuotationData {
  salesName: string;
  salesTitle: string;
  recipientName: string;
  recipientTitle: string;
  quotationDate: string;
  language: "en" | "ar" | "both";
  paymentTerms: string;
  offerValidity: string;
  customValidityDate: string;
  lumpSumDiscount: number;
  notes: string;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    industry: "",
    employeeCount: 0,
    planType: "mixed",
    individualCount: 0,
    familyCount: 0,
    miniIndividualCount: 0,
    miniFamilyCount: 0,
  });
  const [quotationData, setQuotationData] = useState<QuotationData>({
    salesName: "",
    salesTitle: "",
    recipientName: "",
    recipientTitle: "",
    quotationDate: new Date().toISOString().split("T")[0],
    language: "en",
    paymentTerms: "100_upfront",
    offerValidity: "1_week",
    customValidityDate: "",
    lumpSumDiscount: 0,
    notes: "",
  });
  const [result, setResult] = useState<CalculationResult | null>(null);

  function handleNext() {
    if (currentStep === 1) {
      const calc = calculatePricing(
        formData.employeeCount,
        formData.planType,
        formData.individualCount,
        formData.familyCount,
        formData.miniIndividualCount,
        formData.miniFamilyCount
      );
      setResult(calc);
    }

    // Save proposal to database when generating quotation (step 3 → step 4)
    if (currentStep === 3 && result) {
      const discountAmount =
        quotationData.lumpSumDiscount > 0
          ? result.shamelTotalAnnual * (quotationData.lumpSumDiscount / 100)
          : 0;
      const finalTotal = result.shamelTotalAnnual - discountAmount;

      // Fire-and-forget — don't block quotation generation
      fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: formData.companyName,
          industry: formData.industry,
          employee_count: formData.employeeCount,
          shamel_individual_count: formData.individualCount,
          shamel_family_count: formData.familyCount,
          mini_individual_count: formData.miniIndividualCount,
          mini_family_count: formData.miniFamilyCount,
          tier_type: result.tier.type,
          shamel_subtotal: result.shamelSubtotal,
          mini_subtotal: result.miniSubtotal,
          total_annual: result.shamelTotalAnnual,
          lump_sum_discount: quotationData.lumpSumDiscount,
          final_total: Math.round(finalTotal),
          sales_name: quotationData.salesName,
          sales_title: quotationData.salesTitle,
          recipient_name: quotationData.recipientName,
          recipient_title: quotationData.recipientTitle,
          quotation_date: quotationData.quotationDate,
          language: quotationData.language,
          payment_terms: quotationData.paymentTerms,
          offer_validity: quotationData.offerValidity === "custom"
            ? quotationData.customValidityDate
            : quotationData.offerValidity,
          notes: quotationData.notes,
        }),
      }).catch(() => {
        // Silently fail — proposal generation should not depend on DB save
      });
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
      planType: "mixed",
      individualCount: 0,
      familyCount: 0,
      miniIndividualCount: 0,
      miniFamilyCount: 0,
    });
    setQuotationData({
      salesName: "",
      salesTitle: "",
      recipientName: "",
      recipientTitle: "",
      quotationDate: new Date().toISOString().split("T")[0],
      language: "en",
      paymentTerms: "100_upfront",
      offerValidity: "1_week",
      customValidityDate: "",
      lumpSumDiscount: 0,
      notes: "",
    });
    setResult(null);
  }

  // On the quotation preview step, hide the stepper and go full width
  const isQuotationPreview = currentStep === 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-cyan-100 shadow-sm print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Shamel Enterprise</h1>
            <p className="text-xs text-gray-500">Healthcare Benefits by Vezeeta</p>
          </div>
        </div>
      </header>

      <main className={`mx-auto px-4 py-8 ${isQuotationPreview ? "max-w-6xl" : "max-w-5xl"}`}>
        {/* Stepper - hide on quotation preview */}
        {!isQuotationPreview && (
          <div className="flex items-center justify-center mb-10 overflow-x-auto">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === currentStep;
              const isCompleted = i < currentStep;
              return (
                <div key={step.label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "bg-cyan-600 text-white shadow-lg shadow-cyan-200"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <Icon size={20} />
                      )}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs mt-2 font-medium whitespace-nowrap ${
                        isActive ? "text-cyan-700" : isCompleted ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 rounded-full transition-colors duration-300 ${
                        i < currentStep ? "bg-green-400" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

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
              onCreateQuotation={handleNext}
            />
          )}
          {currentStep === 3 && result && (
            <StepQuotationInfo
              quotationData={quotationData}
              setQuotationData={setQuotationData}
              result={result}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 4 && result && (
            <StepQuotation
              formData={formData}
              quotationData={quotationData}
              result={result}
              onBack={handleBack}
              onRestart={handleRestart}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12 print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
          Powered by <span className="font-semibold text-cyan-600">Shamel</span> by Vezeeta &mdash; Egypt&apos;s #1 Healthcare Platform
        </div>
      </footer>
    </div>
  );
}
