"use client";

import { FormData } from "@/app/page";
import { Building2, Briefcase, ArrowRight, Stethoscope, FlaskConical, Pill, HeartPulse } from "lucide-react";
import { networkStats } from "@/lib/pricing";

const industries = [
  "Technology",
  "Healthcare",
  "Finance & Banking",
  "Manufacturing",
  "Retail & E-commerce",
  "Education",
  "Real Estate",
  "Telecommunications",
  "Oil & Gas",
  "Tourism & Hospitality",
  "Logistics & Transportation",
  "Other",
];

interface Props {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onNext: () => void;
}

export default function StepCompanyInfo({ formData, setFormData, onNext }: Props) {
  const canProceed = formData.companyName.trim() !== "" && formData.industry !== "";

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your company</h2>
        <p className="text-gray-500 mb-8">
          Get a personalized Shamel pricing quote for your team
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Building2 size={16} className="inline mr-2 text-cyan-600" />
              Company Name
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Enter your company name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-gray-900 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Briefcase size={16} className="inline mr-2 text-cyan-600" />
              Industry
            </label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-gray-900 bg-white"
            >
              <option value="">Select your industry</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`mt-8 w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
            canProceed
              ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 shadow-lg shadow-cyan-200 cursor-pointer"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Continue to Plan Setup
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Info Panel */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-cyan-600 to-teal-700 rounded-2xl p-8 text-white shadow-lg">
          <h3 className="text-lg font-bold mb-4">Why Shamel for Business?</h3>
          <ul className="space-y-3 text-cyan-50 text-sm">
            <li className="flex items-start gap-3">
              <HeartPulse size={18} className="mt-0.5 shrink-0" />
              <span>Comprehensive healthcare discounts for your entire team — no approvals needed</span>
            </li>
            <li className="flex items-start gap-3">
              <Stethoscope size={18} className="mt-0.5 shrink-0" />
              <span>Access to {networkStats.doctors} doctors and {networkStats.hospitals} hospitals across Egypt</span>
            </li>
            <li className="flex items-start gap-3">
              <FlaskConical size={18} className="mt-0.5 shrink-0" />
              <span>Up to 80% off labs, scans, and diagnostics from {networkStats.labs} labs</span>
            </li>
            <li className="flex items-start gap-3">
              <Pill size={18} className="mt-0.5 shrink-0" />
              <span>Pharmacy co-payment program across {networkStats.pharmacies} pharmacies nationwide</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Discount Coverage</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Doctor Visits", value: "Up to 40%" },
              { label: "Labs & Scans", value: "Up to 80%" },
              { label: "Pharmacy", value: "Co-payment" },
              { label: "Surgeries", value: "All-inclusive" },
            ].map((item) => (
              <div key={item.label} className="bg-cyan-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-sm font-bold text-cyan-700">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
