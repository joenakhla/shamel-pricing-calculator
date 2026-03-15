"use client";

import { FormData } from "@/app/page";
import {
  getTier,
  getMiniTier,
  ORIGINAL_INDIVIDUAL_PRICE,
  ORIGINAL_FAMILY_PRICE,
  MINI_ORIGINAL_INDIVIDUAL_PRICE,
  MINI_ORIGINAL_FAMILY_PRICE,
} from "@/lib/pricing";
import { Users, ArrowRight, ArrowLeft, AlertCircle, Tag, Zap, UserRound, UsersRound } from "lucide-react";

interface Props {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepPlanConfig({ formData, setFormData, onNext, onBack }: Props) {
  const tier = getTier(formData.employeeCount);
  const miniTier = getMiniTier(formData.employeeCount);

  const totalAllocated =
    formData.individualCount +
    formData.familyCount +
    formData.miniIndividualCount +
    formData.miniFamilyCount;
  const remaining = formData.employeeCount - totalAllocated;
  const allocationValid = totalAllocated === formData.employeeCount && formData.employeeCount >= 5;

  const canProceed = formData.employeeCount >= 5 && tier !== null && allocationValid;

  function formatEGP(n: number) {
    return n.toLocaleString("en-EG");
  }

  function updateCount(field: keyof FormData, value: number) {
    const val = Math.max(0, Math.min(value, formData.employeeCount));
    // Derive planType from allocation
    const next = { ...formData, [field]: val };
    const hasInd = (field === "individualCount" ? val : next.individualCount) > 0 ||
                   (field === "miniIndividualCount" ? val : next.miniIndividualCount) > 0;
    const hasFam = (field === "familyCount" ? val : next.familyCount) > 0 ||
                   (field === "miniFamilyCount" ? val : next.miniFamilyCount) > 0;
    next.planType = hasInd && hasFam ? "mixed" : hasFam ? "family" : "individual";
    setFormData(next);
  }

  function applyPreset(preset: string) {
    const n = formData.employeeCount;
    const base = { ...formData, individualCount: 0, familyCount: 0, miniIndividualCount: 0, miniFamilyCount: 0 };
    switch (preset) {
      case "shamel_ind":
        setFormData({ ...base, individualCount: n, planType: "individual" });
        break;
      case "shamel_fam":
        setFormData({ ...base, familyCount: n, planType: "family" });
        break;
      case "mini_ind":
        setFormData({ ...base, miniIndividualCount: n, planType: "individual" });
        break;
      case "mini_fam":
        setFormData({ ...base, miniFamilyCount: n, planType: "family" });
        break;
      case "half":
        const half = Math.floor(n / 2);
        setFormData({ ...base, individualCount: half, miniIndividualCount: n - half, planType: "individual" });
        break;
    }
  }

  const showAllocation = formData.employeeCount >= 5;

  return (
    <div className="grid md:grid-cols-5 gap-8">
      {/* Configuration — 3 cols */}
      <div className="md:col-span-3 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure your plan</h2>
        <p className="text-gray-500 mb-8">
          Allocate employees across Shamel and Mini subscription types
        </p>

        <div className="space-y-6">
          {/* Employee Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Users size={16} className="inline mr-2 text-cyan-600" />
              Total Number of Employees
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
                  individualCount: val,
                  familyCount: 0,
                  miniIndividualCount: 0,
                  miniFamilyCount: 0,
                  planType: "individual",
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

          {/* Allocation Section */}
          {showAllocation && tier && miniTier && (
            <>
              {/* Quick Presets */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "shamel_ind", label: "All Shamel Individual" },
                    { key: "shamel_fam", label: "All Shamel Family" },
                    { key: "mini_ind", label: "All Mini Individual" },
                    { key: "mini_fam", label: "All Mini Family" },
                    { key: "half", label: "50/50 Shamel/Mini" },
                  ].map((p) => (
                    <button
                      key={p.key}
                      onClick={() => applyPreset(p.key)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Allocation Grid */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <p className="text-sm font-semibold text-gray-700">
                  Allocate {formData.employeeCount} employees across subscriptions:
                </p>

                {/* Headers */}
                <div className="grid grid-cols-[1fr_1fr_1fr] gap-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <div></div>
                  <div className="flex items-center gap-1"><UserRound size={12} /> Individual</div>
                  <div className="flex items-center gap-1"><UsersRound size={12} /> Family</div>
                </div>

                {/* Shamel Row */}
                <div className="grid grid-cols-[1fr_1fr_1fr] gap-3 items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                    <span className="text-sm font-semibold text-gray-800">Shamel</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      min={0}
                      max={formData.employeeCount}
                      value={formData.individualCount || ""}
                      onChange={(e) => updateCount("individualCount", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none text-gray-900 text-sm"
                    />
                    <p className="text-[10px] text-gray-400 mt-0.5">{formatEGP(tier.individualPrice)} EGP/yr</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      min={0}
                      max={formData.employeeCount}
                      value={formData.familyCount || ""}
                      onChange={(e) => updateCount("familyCount", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none text-gray-900 text-sm"
                    />
                    <p className="text-[10px] text-gray-400 mt-0.5">{formatEGP(tier.familyPrice)} EGP/yr</p>
                  </div>
                </div>

                {/* Mini Row */}
                <div className="grid grid-cols-[1fr_1fr_1fr] gap-3 items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm font-semibold text-gray-800">Mini</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      min={0}
                      max={formData.employeeCount}
                      value={formData.miniIndividualCount || ""}
                      onChange={(e) => updateCount("miniIndividualCount", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-gray-900 text-sm"
                    />
                    <p className="text-[10px] text-gray-400 mt-0.5">{formatEGP(miniTier.individualPrice)} EGP/yr</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      min={0}
                      max={formData.employeeCount}
                      value={formData.miniFamilyCount || ""}
                      onChange={(e) => updateCount("miniFamilyCount", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-gray-900 text-sm"
                    />
                    <p className="text-[10px] text-gray-400 mt-0.5">{formatEGP(miniTier.familyPrice)} EGP/yr</p>
                  </div>
                </div>

                {/* Allocation Progress */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-500">
                      Allocated: {totalAllocated} / {formData.employeeCount}
                    </span>
                    {remaining !== 0 && (
                      <span className={`text-xs font-semibold ${remaining > 0 ? "text-amber-600" : "text-red-600"}`}>
                        {remaining > 0 ? `${remaining} remaining` : `${Math.abs(remaining)} over`}
                      </span>
                    )}
                    {remaining === 0 && (
                      <span className="text-xs font-semibold text-green-600">All allocated ✓</span>
                    )}
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        remaining === 0 ? "bg-green-500" : remaining > 0 ? "bg-amber-400" : "bg-red-400"
                      }`}
                      style={{ width: `${Math.min(100, (totalAllocated / formData.employeeCount) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </>
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

      {/* Preview — 2 cols */}
      <div className="md:col-span-2 space-y-5">
        {/* Shamel Tier Card */}
        {tier && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 animate-slide-in">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={18} className="text-cyan-600" />
              <h3 className="font-bold text-gray-900">Shamel Plan</h3>
            </div>
            <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-500">Tier: <span className="font-semibold text-cyan-700">{tier.type}</span></p>
              <p className="text-xs text-gray-400 mt-0.5">{tier.label} employees</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400">Individual / year</p>
                <p className="text-lg font-bold text-gray-900">{formatEGP(tier.individualPrice)}</p>
                <p className="text-[10px] text-gray-400 line-through">{formatEGP(ORIGINAL_INDIVIDUAL_PRICE)} EGP</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400">Family / year</p>
                <p className="text-lg font-bold text-gray-900">{formatEGP(tier.familyPrice)}</p>
                <p className="text-[10px] text-gray-400 line-through">{formatEGP(ORIGINAL_FAMILY_PRICE)} EGP</p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
              <p className="text-xs text-green-600 font-medium">Enterprise Discount</p>
              <p className="text-xl font-bold text-green-700">{tier.discount.toFixed(1)}% OFF</p>
            </div>
          </div>
        )}

        {/* Mini Tier Card */}
        {miniTier && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 animate-slide-in">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={18} className="text-amber-600" />
              <h3 className="font-bold text-gray-900">Mini Plan</h3>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Limited Network</span>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-500">Tier: <span className="font-semibold text-amber-700">{miniTier.type}</span></p>
              <p className="text-xs text-gray-400 mt-0.5">{miniTier.label} employees</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400">Individual / year</p>
                <p className="text-lg font-bold text-gray-900">{formatEGP(miniTier.individualPrice)}</p>
                <p className="text-[10px] text-gray-400 line-through">{formatEGP(MINI_ORIGINAL_INDIVIDUAL_PRICE)} EGP</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400">Family / year</p>
                <p className="text-lg font-bold text-gray-900">{formatEGP(miniTier.familyPrice)}</p>
                <p className="text-[10px] text-gray-400 line-through">{formatEGP(MINI_ORIGINAL_FAMILY_PRICE)} EGP</p>
              </div>
            </div>
            {miniTier.discount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                <p className="text-xs text-amber-600 font-medium">Volume Discount</p>
                <p className="text-xl font-bold text-amber-700">{miniTier.discount.toFixed(0)}% OFF</p>
              </div>
            )}
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
