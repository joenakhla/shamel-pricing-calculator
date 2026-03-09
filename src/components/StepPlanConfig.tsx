"use client";

import { FormData } from "@/app/page";
import { getTier, ORIGINAL_INDIVIDUAL_PRICE, ORIGINAL_FAMILY_PRICE } from "@/lib/pricing";
import { Users, UserRound, UsersRound, ArrowRight, ArrowLeft, AlertCircle, Tag } from "lucide-react";

interface Props {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepPlanConfig({ formData, setFormData, onNext, onBack }: Props) {
  const tier = getTier(formData.employeeCount);
  const isMixed = formData.planType === "mixed";
  const mixedTotal = formData.individualCount + formData.familyCount;
  const mixedValid = !isMixed || mixedTotal === formData.employeeCount;

  const canProceed =
    formData.employeeCount >= 5 && tier !== null && (!isMixed || mixedValid);

  function formatEGP(n: number) {
    return n.toLocaleString("en-EG");
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Configuration */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure your plan</h2>
        <p className="text-gray-500 mb-8">
          Choose the right plan for your workforce
        </p>

        <div className="space-y-6">
          {/* Employee Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Users size={16} className="inline mr-2 text-cyan-600" />
              Number of Employees
            </label>
            <input
              type="number"
              min={5}
              value={formData.employeeCount || ""}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setFormData({
                  ...formData,
                  employeeCount: val,
                  individualCount: formData.planType === "mixed" ? val : 0,
                  familyCount: 0,
                });
              }}
              placeholder="Minimum 5 employees"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-gray-900 placeholder-gray-400"
            />
            {formData.employeeCount > 0 && formData.employeeCount < 5 && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                Minimum of 5 employees required for enterprise pricing
              </p>
            )}
          </div>

          {/* Plan Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Plan Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["individual", "family", "mixed"] as const).map((type) => {
                const icons = { individual: UserRound, family: UsersRound, mixed: Users };
                const labels = { individual: "Individual", family: "Family", mixed: "Mixed" };
                const descs = { individual: "1 member", family: "Up to 4 members", mixed: "Combine both" };
                const Icon = icons[type];
                const selected = formData.planType === type;
                return (
                  <button
                    key={type}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        planType: type,
                        individualCount: type === "mixed" ? formData.employeeCount : 0,
                        familyCount: 0,
                      })
                    }
                    className={`p-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                      selected
                        ? "border-cyan-500 bg-cyan-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon size={22} className={selected ? "text-cyan-600" : "text-gray-400"} />
                    <p className={`mt-2 text-sm font-semibold ${selected ? "text-cyan-700" : "text-gray-700"}`}>
                      {labels[type]}
                    </p>
                    <p className="text-xs text-gray-400">{descs[type]}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mixed Split */}
          {isMixed && formData.employeeCount >= 5 && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <p className="text-sm font-medium text-gray-700">
                Split {formData.employeeCount} employees between plans:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Individual</label>
                  <input
                    type="number"
                    min={0}
                    max={formData.employeeCount}
                    value={formData.individualCount || ""}
                    onChange={(e) => {
                      const val = Math.min(parseInt(e.target.value) || 0, formData.employeeCount);
                      setFormData({
                        ...formData,
                        individualCount: val,
                        familyCount: formData.employeeCount - val,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-cyan-500 outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Family</label>
                  <input
                    type="number"
                    min={0}
                    max={formData.employeeCount}
                    value={formData.familyCount || ""}
                    onChange={(e) => {
                      const val = Math.min(parseInt(e.target.value) || 0, formData.employeeCount);
                      setFormData({
                        ...formData,
                        familyCount: val,
                        individualCount: formData.employeeCount - val,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-cyan-500 outline-none text-gray-900"
                  />
                </div>
              </div>
              {!mixedValid && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={12} />
                  Total must equal {formData.employeeCount} (currently {mixedTotal})
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`flex-1 py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
              canProceed
                ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 shadow-lg shadow-cyan-200 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Calculate Pricing
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-6">
        {tier && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 animate-slide-in">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={18} className="text-cyan-600" />
              <h3 className="font-bold text-gray-900">Your Pricing Tier</h3>
            </div>
            <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-500">Company Tier</p>
              <p className="text-xl font-bold text-cyan-700">{tier.type}</p>
              <p className="text-sm text-gray-500 mt-1">{tier.label} employees</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400">Individual / month</p>
                <p className="text-2xl font-bold text-gray-900">{formatEGP(tier.individualPrice)}</p>
                <p className="text-xs text-gray-400 line-through">{formatEGP(ORIGINAL_INDIVIDUAL_PRICE)} EGP</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400">Family / month</p>
                <p className="text-2xl font-bold text-gray-900">{formatEGP(tier.familyPrice)}</p>
                <p className="text-xs text-gray-400 line-through">{formatEGP(ORIGINAL_FAMILY_PRICE)} EGP</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-sm text-green-600 font-medium">Enterprise Discount</p>
              <p className="text-3xl font-bold text-green-700">{tier.discount.toFixed(1)}% OFF</p>
              <p className="text-xs text-green-500 mt-1">vs. retail pricing</p>
            </div>
          </div>
        )}

        {!tier && formData.employeeCount > 0 && formData.employeeCount < 5 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <p className="text-amber-700 font-medium">
              Enterprise pricing starts at 5 employees. For smaller teams, check our{" "}
              <a href="https://www.vezeeta.com/en/shamel" target="_blank" rel="noopener noreferrer" className="underline">
                retail plans
              </a>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
