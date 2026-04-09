"use client";

import { QuotationData } from "@/app/page";
import { CalculationResult } from "@/lib/pricing";
import {
  ArrowLeft,
  ArrowRight,
  User,
  UserCheck,
  Calendar,
  Globe,
  CreditCard,
  BadgePercent,
  StickyNote,
  Clock,
  PencilLine,
  RotateCcw,
} from "lucide-react";

interface Props {
  quotationData: QuotationData;
  setQuotationData: (data: QuotationData) => void;
  result: CalculationResult;
  onNext: () => void;
  onBack: () => void;
}

function formatEGP(n: number) {
  return new Intl.NumberFormat("en-EG").format(Math.round(n));
}

export default function StepQuotationInfo({
  quotationData,
  setQuotationData,
  result,
  onNext,
  onBack,
}: Props) {
  const canProceed =
    quotationData.salesName.trim() !== "" &&
    quotationData.salesTitle.trim() !== "" &&
    quotationData.recipientName.trim() !== "" &&
    quotationData.recipientTitle.trim() !== "" &&
    quotationData.quotationDate !== "" &&
    (quotationData.offerValidity !== "custom" || quotationData.customValidityDate !== "");

  // Effective prices (custom override or calculated)
  const effShamelInd = quotationData.customShamelIndividualPrice ?? result.shamelIndividualYearly;
  const effShamelFam = quotationData.customShamelFamilyPrice ?? result.shamelFamilyYearly;
  const effMiniInd = quotationData.customMiniIndividualPrice ?? result.miniIndividualYearly;
  const effMiniFam = quotationData.customMiniFamilyPrice ?? result.miniFamilyYearly;
  const effShamelSubtotal = result.individualCount * effShamelInd + result.familyCount * effShamelFam;
  const effMiniSubtotal = result.miniIndividualCount * effMiniInd + result.miniFamilyCount * effMiniFam;
  const effTotal = effShamelSubtotal + effMiniSubtotal;

  const hasCustomPrices =
    quotationData.customShamelIndividualPrice !== null ||
    quotationData.customShamelFamilyPrice !== null ||
    quotationData.customMiniIndividualPrice !== null ||
    quotationData.customMiniFamilyPrice !== null;

  const discountAmount =
    quotationData.lumpSumDiscount > 0
      ? effTotal * (quotationData.lumpSumDiscount / 100)
      : 0;
  const finalTotal = effTotal - discountAmount;

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Form - 2 columns */}
      <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quotation Details</h2>
        <p className="text-gray-500 mb-8">
          Fill in the details to generate a professional proposal
        </p>

        <div className="space-y-8">
          {/* Sales Rep Info */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <User size={16} className="text-cyan-600" />
              Sales Representative
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={quotationData.salesName}
                  onChange={(e) => setQuotationData({ ...quotationData, salesName: e.target.value })}
                  placeholder="e.g. Ahmed Hassan"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Title / Position</label>
                <input
                  type="text"
                  value={quotationData.salesTitle}
                  onChange={(e) => setQuotationData({ ...quotationData, salesTitle: e.target.value })}
                  placeholder="e.g. Enterprise Account Manager"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Recipient Info */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <UserCheck size={16} className="text-cyan-600" />
              Recipient (Client)
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={quotationData.recipientName}
                  onChange={(e) => setQuotationData({ ...quotationData, recipientName: e.target.value })}
                  placeholder="e.g. Mohamed Ali"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Title / Position</label>
                <input
                  type="text"
                  value={quotationData.recipientTitle}
                  onChange={(e) => setQuotationData({ ...quotationData, recipientTitle: e.target.value })}
                  placeholder="e.g. HR Director"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Date & Language */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-cyan-600" />
                Quotation Date
              </h3>
              <input
                type="date"
                value={quotationData.quotationDate}
                onChange={(e) => setQuotationData({ ...quotationData, quotationDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-gray-900"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Globe size={16} className="text-cyan-600" />
                Quotation Language
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: "en", label: "English" },
                  { value: "ar", label: "Arabic" },
                  { value: "both", label: "Both" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setQuotationData({ ...quotationData, language: opt.value })}
                    className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
                      quotationData.language === opt.value
                        ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Terms & Offer Validity */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <CreditCard size={16} className="text-cyan-600" />
                Payment Terms
              </h3>
              <select
                value={quotationData.paymentTerms}
                onChange={(e) => setQuotationData({ ...quotationData, paymentTerms: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-gray-900 bg-white"
              >
                <option value="100_upfront">100% upfront upon contracting</option>
                <option value="50_50">50% upfront + 50% within 30 days</option>
                <option value="quarterly">Quarterly installments (25% each)</option>
                <option value="net_30">Net 30 days</option>
                <option value="net_60">Net 60 days</option>
              </select>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Clock size={16} className="text-cyan-600" />
                Offer Validity
              </h3>
              <select
                value={quotationData.offerValidity}
                onChange={(e) => setQuotationData({ ...quotationData, offerValidity: e.target.value, customValidityDate: "" })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-gray-900 bg-white"
              >
                <option value="1_week">1 week from quotation date</option>
                <option value="2_weeks">2 weeks from quotation date</option>
                <option value="1_month">1 month from quotation date</option>
                <option value="custom">Custom date</option>
              </select>
              {quotationData.offerValidity === "custom" && (
                <input
                  type="date"
                  value={quotationData.customValidityDate}
                  onChange={(e) => setQuotationData({ ...quotationData, customValidityDate: e.target.value })}
                  className="w-full mt-3 px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-gray-900"
                />
              )}
            </div>
          </div>

          {/* Custom Pricing Override */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <PencilLine size={16} className="text-cyan-600" />
                Custom Pricing (Optional)
              </span>
              {hasCustomPrices && (
                <button
                  onClick={() =>
                    setQuotationData({
                      ...quotationData,
                      customShamelIndividualPrice: null,
                      customShamelFamilyPrice: null,
                      customMiniIndividualPrice: null,
                      customMiniFamilyPrice: null,
                    })
                  }
                  className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                >
                  <RotateCcw size={12} />
                  Reset to calculated
                </button>
              )}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Override the calculated unit prices if you negotiated a custom rate with the client.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {result.individualCount > 0 && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Shamel Individual <span className="text-gray-400">(calculated: {formatEGP(result.shamelIndividualYearly)} EGP)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={quotationData.customShamelIndividualPrice ?? ""}
                      onChange={(e) =>
                        setQuotationData({
                          ...quotationData,
                          customShamelIndividualPrice: e.target.value === "" ? null : Math.round(parseFloat(e.target.value) || 0),
                        })
                      }
                      placeholder={String(result.shamelIndividualYearly)}
                      className={`w-full px-4 py-3 pr-14 rounded-xl border ${
                        quotationData.customShamelIndividualPrice !== null
                          ? "border-cyan-400 bg-cyan-50/30"
                          : "border-gray-200"
                      } focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-gray-900 placeholder-gray-400`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">EGP/yr</span>
                  </div>
                </div>
              )}
              {result.familyCount > 0 && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Shamel Family <span className="text-gray-400">(calculated: {formatEGP(result.shamelFamilyYearly)} EGP)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={quotationData.customShamelFamilyPrice ?? ""}
                      onChange={(e) =>
                        setQuotationData({
                          ...quotationData,
                          customShamelFamilyPrice: e.target.value === "" ? null : Math.round(parseFloat(e.target.value) || 0),
                        })
                      }
                      placeholder={String(result.shamelFamilyYearly)}
                      className={`w-full px-4 py-3 pr-14 rounded-xl border ${
                        quotationData.customShamelFamilyPrice !== null
                          ? "border-cyan-400 bg-cyan-50/30"
                          : "border-gray-200"
                      } focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-gray-900 placeholder-gray-400`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">EGP/yr</span>
                  </div>
                </div>
              )}
              {result.miniIndividualCount > 0 && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Mini Individual <span className="text-gray-400">(calculated: {formatEGP(result.miniIndividualYearly)} EGP)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={quotationData.customMiniIndividualPrice ?? ""}
                      onChange={(e) =>
                        setQuotationData({
                          ...quotationData,
                          customMiniIndividualPrice: e.target.value === "" ? null : Math.round(parseFloat(e.target.value) || 0),
                        })
                      }
                      placeholder={String(result.miniIndividualYearly)}
                      className={`w-full px-4 py-3 pr-14 rounded-xl border ${
                        quotationData.customMiniIndividualPrice !== null
                          ? "border-cyan-400 bg-cyan-50/30"
                          : "border-gray-200"
                      } focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-gray-900 placeholder-gray-400`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">EGP/yr</span>
                  </div>
                </div>
              )}
              {result.miniFamilyCount > 0 && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Mini Family <span className="text-gray-400">(calculated: {formatEGP(result.miniFamilyYearly)} EGP)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={quotationData.customMiniFamilyPrice ?? ""}
                      onChange={(e) =>
                        setQuotationData({
                          ...quotationData,
                          customMiniFamilyPrice: e.target.value === "" ? null : Math.round(parseFloat(e.target.value) || 0),
                        })
                      }
                      placeholder={String(result.miniFamilyYearly)}
                      className={`w-full px-4 py-3 pr-14 rounded-xl border ${
                        quotationData.customMiniFamilyPrice !== null
                          ? "border-cyan-400 bg-cyan-50/30"
                          : "border-gray-200"
                      } focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-gray-900 placeholder-gray-400`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">EGP/yr</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lump Sum Discount */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <BadgePercent size={16} className="text-cyan-600" />
              Additional Lump Sum Discount (Optional)
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-[200px]">
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={quotationData.lumpSumDiscount || ""}
                  onChange={(e) =>
                    setQuotationData({
                      ...quotationData,
                      lumpSumDiscount: Math.min(50, Math.max(0, parseFloat(e.target.value) || 0)),
                    })
                  }
                  placeholder="0"
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>
              </div>
              {quotationData.lumpSumDiscount > 0 && (
                <div className="text-sm text-green-600 font-medium">
                  Saves {formatEGP(discountAmount)} EGP &rarr; Final: {formatEGP(finalTotal)} EGP
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <StickyNote size={16} className="text-cyan-600" />
              Additional Notes (Optional)
            </h3>
            <textarea
              value={quotationData.notes}
              onChange={(e) => setQuotationData({ ...quotationData, notes: e.target.value })}
              placeholder="Any additional terms or notes to include in the quotation..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-gray-900 placeholder-gray-400 resize-none"
            />
          </div>
        </div>

        {/* Actions */}
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
            Generate Quotation
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Summary sidebar */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Quotation Summary</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Tier</span>
              <span className="font-medium text-gray-900">{result.tier.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Employees</span>
              <span className="font-medium text-gray-900">{result.employeeCount}</span>
            </div>
            {result.individualCount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Shamel Individual</span>
                <span className="font-medium text-gray-900">
                  {result.individualCount} x {formatEGP(effShamelInd)} EGP
                  {quotationData.customShamelIndividualPrice !== null && (
                    <span className="text-cyan-600 text-xs ml-1">*</span>
                  )}
                </span>
              </div>
            )}
            {result.familyCount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Shamel Family</span>
                <span className="font-medium text-gray-900">
                  {result.familyCount} x {formatEGP(effShamelFam)} EGP
                  {quotationData.customShamelFamilyPrice !== null && (
                    <span className="text-cyan-600 text-xs ml-1">*</span>
                  )}
                </span>
              </div>
            )}
            {result.miniIndividualCount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Mini Individual</span>
                <span className="font-medium text-gray-900">
                  {result.miniIndividualCount} x {formatEGP(effMiniInd)} EGP
                  {quotationData.customMiniIndividualPrice !== null && (
                    <span className="text-cyan-600 text-xs ml-1">*</span>
                  )}
                </span>
              </div>
            )}
            {result.miniFamilyCount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Mini Family</span>
                <span className="font-medium text-gray-900">
                  {result.miniFamilyCount} x {formatEGP(effMiniFam)} EGP
                  {quotationData.customMiniFamilyPrice !== null && (
                    <span className="text-cyan-600 text-xs ml-1">*</span>
                  )}
                </span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <span className="text-gray-500">Subtotal (annual)</span>
              <span className="font-bold text-gray-900">{formatEGP(effTotal)} EGP</span>
            </div>
            {hasCustomPrices && (
              <p className="text-xs text-cyan-600">* Custom negotiated price</p>
            )}
            {quotationData.lumpSumDiscount > 0 && (
              <>
                <div className="flex justify-between text-green-600">
                  <span>Lump sum discount ({quotationData.lumpSumDiscount}%)</span>
                  <span className="font-medium">-{formatEGP(discountAmount)} EGP</span>
                </div>
                <div className="border-t border-green-100 pt-3 flex justify-between">
                  <span className="text-gray-700 font-semibold">Final Total</span>
                  <span className="font-bold text-cyan-700 text-lg">{formatEGP(finalTotal)} EGP</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-700">
          <p className="font-semibold mb-1">Note</p>
          <p>All prices include 14% VAT. The quotation will include full terms and conditions.</p>
        </div>
      </div>
    </div>
  );
}
