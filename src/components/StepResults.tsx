"use client";

import { CalculationResult } from "@/lib/pricing";
import {
  ArrowLeft,
  RotateCcw,
  TrendingUp,
  Wallet,
  PiggyBank,
  BadgePercent,
  Download,
  Shield,
  Sparkles,
} from "lucide-react";
import ComparisonChart from "./ComparisonChart";
import SavingsChart from "./SavingsChart";

interface Props {
  result: CalculationResult;
  companyName: string;
  onBack: () => void;
  onRestart: () => void;
}

function formatEGP(n: number) {
  return new Intl.NumberFormat("en-EG").format(Math.round(n));
}

export default function StepResults({ result, companyName, onBack, onRestart }: Props) {
  const monthlyTotal = result.shamelTotalAnnual / 12;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-cyan-100 text-sm">Pricing Report for</p>
            <h2 className="text-3xl font-bold">{companyName}</h2>
            <p className="text-cyan-100 mt-1">
              {result.employeeCount} employees &middot; {result.tier.type} tier &middot;{" "}
              {result.planType === "mixed"
                ? `${result.individualCount} individual + ${result.familyCount} family`
                : result.planType + " plan"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-cyan-100 text-sm">Total Monthly Cost</p>
            <p className="text-4xl font-bold animate-count-up">{formatEGP(monthlyTotal)} EGP</p>
            <p className="text-cyan-200 text-sm">{formatEGP(result.shamelTotalAnnual)} EGP / year</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={<Wallet size={20} />}
          label="Per Employee / mo"
          value={`${formatEGP(result.shamelTotalAnnual / 12 / result.employeeCount)} EGP`}
          color="cyan"
        />
        <MetricCard
          icon={<BadgePercent size={20} />}
          label="Enterprise Discount"
          value={`${result.discountPercent.toFixed(1)}%`}
          color="green"
        />
        <MetricCard
          icon={<PiggyBank size={20} />}
          label="Savings vs Standard"
          value={`${formatEGP(result.savingsVsStandard)} EGP`}
          color="amber"
          subtitle="per year"
        />
        <MetricCard
          icon={<TrendingUp size={20} />}
          label="ROI vs Standard"
          value={`${result.roiVsStandard.toFixed(0)}%`}
          color="purple"
          subtitle="cost reduction"
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-1">Annual TCO Comparison</h3>
          <p className="text-sm text-gray-500 mb-4">Shamel vs Traditional Insurance</p>
          <ComparisonChart result={result} />
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-1">Your Annual Savings</h3>
          <p className="text-sm text-gray-500 mb-4">By insurance tier comparison</p>
          <SavingsChart result={result} />
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Shield size={20} className="text-cyan-600" />
          Detailed Cost Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-gray-500 font-medium">Category</th>
                <th className="text-right py-3 text-gray-500 font-medium">Shamel</th>
                <th className="text-right py-3 text-gray-500 font-medium">Basic Insurance</th>
                <th className="text-right py-3 text-gray-500 font-medium">Standard Insurance</th>
                <th className="text-right py-3 text-gray-500 font-medium">Premium Insurance</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-700">Annual Total Cost</td>
                <td className="py-3 text-right font-semibold text-cyan-700">
                  {formatEGP(result.shamelTotalAnnual)} EGP
                </td>
                <td className="py-3 text-right text-gray-600">{formatEGP(result.traditionalBasicAnnual)} EGP</td>
                <td className="py-3 text-right text-gray-600">{formatEGP(result.traditionalStandardAnnual)} EGP</td>
                <td className="py-3 text-right text-gray-600">{formatEGP(result.traditionalPremiumAnnual)} EGP</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-700">Monthly Total Cost</td>
                <td className="py-3 text-right font-semibold text-cyan-700">
                  {formatEGP(result.shamelTotalAnnual / 12)} EGP
                </td>
                <td className="py-3 text-right text-gray-600">{formatEGP(result.traditionalBasicAnnual / 12)} EGP</td>
                <td className="py-3 text-right text-gray-600">{formatEGP(result.traditionalStandardAnnual / 12)} EGP</td>
                <td className="py-3 text-right text-gray-600">{formatEGP(result.traditionalPremiumAnnual / 12)} EGP</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-700">Cost per Employee / month</td>
                <td className="py-3 text-right font-semibold text-cyan-700">
                  {formatEGP(result.shamelTotalAnnual / 12 / result.employeeCount)} EGP
                </td>
                <td className="py-3 text-right text-gray-600">
                  {formatEGP(result.traditionalBasicAnnual / 12 / result.employeeCount)} EGP
                </td>
                <td className="py-3 text-right text-gray-600">
                  {formatEGP(result.traditionalStandardAnnual / 12 / result.employeeCount)} EGP
                </td>
                <td className="py-3 text-right text-gray-600">
                  {formatEGP(result.traditionalPremiumAnnual / 12 / result.employeeCount)} EGP
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="py-3 px-2 rounded-l-lg text-green-700 font-medium">Annual Savings with Shamel</td>
                <td className="py-3 text-right font-bold text-green-600">-</td>
                <td className="py-3 text-right font-bold text-green-600">
                  {result.savingsVsBasic > 0 ? "+" : ""}{formatEGP(result.savingsVsBasic)} EGP
                </td>
                <td className="py-3 text-right font-bold text-green-600">
                  {result.savingsVsStandard > 0 ? "+" : ""}{formatEGP(result.savingsVsStandard)} EGP
                </td>
                <td className="py-3 px-2 rounded-r-lg text-right font-bold text-green-600">
                  {result.savingsVsPremium > 0 ? "+" : ""}{formatEGP(result.savingsVsPremium)} EGP
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Shamel Advantages */}
      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl border border-cyan-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles size={20} className="text-cyan-600" />
          Beyond Cost: Why Shamel Wins
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { title: "No Approvals Needed", desc: "Unlimited transactions without pre-authorization or paperwork" },
            { title: "Immediate Activation", desc: "eCard activated instantly — no waiting periods" },
            { title: "No Hidden Fees", desc: "Transparent pricing with no copays or deductibles" },
            { title: "Flexible Coverage", desc: "Supplement existing insurance with dental, vision & more" },
            { title: "Egypt's Largest Network", desc: "7,000+ doctors, 1,300+ labs, 100+ hospitals nationwide" },
            { title: "Employee Wellness", desc: "Higher satisfaction & retention with better healthcare access" },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-4 border border-cyan-100">
              <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={18} />
          Modify Plan
        </button>
        <button
          onClick={onRestart}
          className="px-6 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw size={18} />
          Start Over
        </button>
        <a
          href="https://shamel-b2b.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 shadow-lg shadow-cyan-200 flex items-center justify-center gap-2 transition-all"
        >
          <Download size={18} />
          Get Started with Shamel
        </a>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  color,
  subtitle,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  subtitle?: string;
}) {
  const colorClasses: Record<string, string> = {
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
    green: "bg-green-50 text-green-600 border-green-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  const iconColorClasses: Record<string, string> = {
    cyan: "text-cyan-500",
    green: "text-green-500",
    amber: "text-amber-500",
    purple: "text-purple-500",
  };

  return (
    <div className={`rounded-2xl border p-5 ${colorClasses[color]}`}>
      <div className={`mb-2 ${iconColorClasses[color]}`}>{icon}</div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}
