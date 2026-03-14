"use client";

import { FormData, QuotationData } from "@/app/page";
import { CalculationResult } from "@/lib/pricing";
import { ArrowLeft, RotateCcw, Printer } from "lucide-react";

interface Props {
  formData: FormData;
  quotationData: QuotationData;
  result: CalculationResult;
  onBack: () => void;
  onRestart: () => void;
}

function formatEGP(n: number) {
  return new Intl.NumberFormat("en-EG").format(Math.round(n));
}

function formatDate(dateStr: string, lang: "en" | "ar") {
  const d = new Date(dateStr + "T00:00:00");
  if (lang === "ar") {
    return d.toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
  }
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function getPaymentTermsEN(key: string) {
  const map: Record<string, string> = {
    "100_upfront": "100% of the total amount is due upon signing the contract, payable via bank transfer or certified check.",
    "50_50": "50% of the total amount is due upon signing the contract. The remaining 50% is due within 30 days of contract signing.",
    "quarterly": "Payment is made in four equal quarterly installments (25% each), with the first installment due upon signing.",
    "net_30": "Full payment is due within 30 days of the invoice date.",
    "net_60": "Full payment is due within 60 days of the invoice date.",
  };
  return map[key] || map["100_upfront"];
}

function getPaymentTermsAR(key: string) {
  const map: Record<string, string> = {
    "100_upfront": "يتم دفع ١٠٠٪ من إجمالي المبلغ عند توقيع العقد، عن طريق تحويل بنكي أو شيك مصرفي مقبول الدفع.",
    "50_50": "يتم دفع ٥٠٪ من إجمالي المبلغ عند توقيع العقد. والـ ٥٠٪ المتبقية خلال ٣٠ يومًا من تاريخ التوقيع.",
    "quarterly": "يتم الدفع على أربعة أقساط ربع سنوية متساوية (٢٥٪ لكل قسط)، ويستحق القسط الأول عند التوقيع.",
    "net_30": "يستحق الدفع الكامل خلال ٣٠ يومًا من تاريخ الفاتورة.",
    "net_60": "يستحق الدفع الكامل خلال ٦٠ يومًا من تاريخ الفاتورة.",
  };
  return map[key] || map["100_upfront"];
}

function getValidityEN(key: string, customDate?: string) {
  if (key === "custom" && customDate) {
    const d = new Date(customDate + "T00:00:00");
    const formatted = d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    return `This quotation is valid until ${formatted}.`;
  }
  const map: Record<string, string> = {
    "1_week": "This quotation is valid for one (1) week from the date of issuance.",
    "2_weeks": "This quotation is valid for two (2) weeks from the date of issuance.",
    "1_month": "This quotation is valid for one (1) month from the date of issuance.",
  };
  return map[key] || map["1_week"];
}

function getValidityAR(key: string, customDate?: string) {
  if (key === "custom" && customDate) {
    const d = new Date(customDate + "T00:00:00");
    const formatted = d.toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
    return `هذا العرض صالح حتى ${formatted}.`;
  }
  const map: Record<string, string> = {
    "1_week": "هذا العرض صالح لمدة أسبوع واحد (١) من تاريخ إصداره.",
    "2_weeks": "هذا العرض صالح لمدة أسبوعين (٢) من تاريخ إصداره.",
    "1_month": "هذا العرض صالح لمدة شهر واحد (١) من تاريخ إصداره.",
  };
  return map[key] || map["1_week"];
}

// ─── English Quotation ───────────────────────────────────────────
function QuotationEN({
  formData,
  quotationData,
  result,
}: {
  formData: FormData;
  quotationData: QuotationData;
  result: CalculationResult;
}) {
  const discountAmount = result.shamelTotalAnnual * (quotationData.lumpSumDiscount / 100);
  const finalTotal = result.shamelTotalAnnual - discountAmount;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden print:shadow-none print:border-none">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-700 px-10 py-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Shamel for Business</h1>
                <p className="text-cyan-100 text-sm">Healthcare Benefits by Vezeeta</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold">QUOTATION</h2>
            <p className="text-cyan-100 text-sm mt-1">Date: {formatDate(quotationData.quotationDate, "en")}</p>
          </div>
        </div>
      </div>

      <div className="px-10 py-8 space-y-8">
        {/* From / To */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">From</p>
            <p className="font-semibold text-gray-900">{quotationData.salesName}</p>
            <p className="text-sm text-gray-600">{quotationData.salesTitle}</p>
            <p className="text-sm text-gray-600">Vezeeta - Shamel Business</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">To</p>
            <p className="font-semibold text-gray-900">{quotationData.recipientName}</p>
            <p className="text-sm text-gray-600">{quotationData.recipientTitle}</p>
            <p className="text-sm text-gray-600">{formData.companyName}</p>
          </div>
        </div>

        {/* Introduction */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-cyan-500 pb-2 inline-block">Introduction</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            At Vezeeta, we present <strong>Shamel</strong> — a comprehensive healthcare program designed specifically for businesses.
            Shamel provides your employees with high-quality healthcare at an affordable cost, ensuring they get the care they need
            while helping your company optimize healthcare spending. With access to Egypt&apos;s largest medical network,
            Shamel covers doctor consultations, laboratory tests, radiology scans, pharmacy supplies, and surgical operations.
          </p>
        </div>

        {/* Why Shamel */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-cyan-500 pb-2 inline-block">Why Shamel for Your Business?</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {[
              { title: "Employee Retention", desc: "65% of employees rank health benefits as the most important benefit type." },
              { title: "Best Market Prices", desc: "Leverage discounted rates offered to 200,000+ Shamel members nationwide." },
              { title: "Budget Control", desc: "Full control over healthcare budgets — pay only for what is consumed." },
              { title: "Boost Productivity", desc: "Easy access to healthcare reduces absenteeism and sick days." },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-lg p-3">
                <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Discount Network */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-cyan-500 pb-2 inline-block">Shamel Discount Network</h3>
          <div className="overflow-hidden rounded-lg border border-gray-200 mt-2">
            <table className="w-full text-sm">
              <thead className="bg-cyan-50">
                <tr>
                  <th className="text-left px-4 py-2.5 text-cyan-800 font-semibold">Service</th>
                  <th className="text-left px-4 py-2.5 text-cyan-800 font-semibold">Discount</th>
                  <th className="text-left px-4 py-2.5 text-cyan-800 font-semibold">Network</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { service: "Doctor Consultations", discount: "Up to 40%", network: "7,000+ doctors" },
                  { service: "Laboratory Tests", discount: "Up to 70%", network: "1,300+ lab branches" },
                  { service: "Radiology & Scans", discount: "Up to 40%", network: "1,300+ centers" },
                  { service: "Pharmacy Supplies", discount: "Co-payment model", network: "350+ pharmacies" },
                  { service: "Surgical Operations", discount: "All-inclusive pricing", network: "100+ hospitals" },
                ].map((row, i) => (
                  <tr key={row.service} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2.5 text-gray-700">{row.service}</td>
                    <td className="px-4 py-2.5 font-semibold text-cyan-700">{row.discount}</td>
                    <td className="px-4 py-2.5 text-gray-600">{row.network}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Offer */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-cyan-500 pb-2 inline-block">Financial Offer</h3>
          <div className="overflow-hidden rounded-lg border border-gray-200 mt-2">
            <table className="w-full text-sm">
              <thead className="bg-cyan-50">
                <tr>
                  <th className="text-left px-4 py-2.5 text-cyan-800 font-semibold">Plan</th>
                  <th className="text-right px-4 py-2.5 text-cyan-800 font-semibold">Unit Price (EGP/yr)</th>
                  <th className="text-right px-4 py-2.5 text-cyan-800 font-semibold">Qty</th>
                  <th className="text-right px-4 py-2.5 text-cyan-800 font-semibold">Total (EGP)</th>
                </tr>
              </thead>
              <tbody>
                {result.individualCount > 0 && (
                  <tr className="bg-white">
                    <td className="px-4 py-2.5 text-gray-700">Shamel Individual</td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{formatEGP(result.shamelIndividualYearly)}</td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{result.individualCount}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-gray-900">
                      {formatEGP(result.individualCount * result.shamelIndividualYearly)}
                    </td>
                  </tr>
                )}
                {result.familyCount > 0 && (
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2.5 text-gray-700">Shamel Family (up to 4 members)</td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{formatEGP(result.shamelFamilyYearly)}</td>
                    <td className="px-4 py-2.5 text-right text-gray-700">{result.familyCount}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-gray-900">
                      {formatEGP(result.familyCount * result.shamelFamilyYearly)}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-200">
                  <td colSpan={3} className="px-4 py-2.5 text-right font-semibold text-gray-700">Subtotal</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-gray-900">{formatEGP(result.shamelTotalAnnual)}</td>
                </tr>
                {quotationData.lumpSumDiscount > 0 && (
                  <tr className="border-t border-green-200 bg-green-50">
                    <td colSpan={3} className="px-4 py-2.5 text-right font-semibold text-green-700">
                      Lump Sum Discount ({quotationData.lumpSumDiscount}%)
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-green-700">
                      -{formatEGP(discountAmount)}
                    </td>
                  </tr>
                )}
                <tr className="bg-cyan-600 text-white">
                  <td colSpan={3} className="px-4 py-3 text-right font-bold">Total (incl. 14% VAT)</td>
                  <td className="px-4 py-3 text-right font-bold text-lg">{formatEGP(finalTotal)} EGP</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Implementation Timeline */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-cyan-500 pb-2 inline-block">Implementation Timeline</h3>
          <div className="space-y-2 mt-2">
            {[
              { step: "1", text: "Contract signing via purchase order or signed quotation with company stamp" },
              { step: "2", text: "Client sends employee list and dependents information" },
              { step: "3", text: "3-5 business days: Employee registration in the Shamel database" },
              { step: "4", text: "Launch and ongoing support" },
            ].map((item) => (
              <div key={item.step} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {item.step}
                </div>
                <p className="text-sm text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Terms */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-cyan-500 pb-2 inline-block">Payment Terms</h3>
          <p className="text-sm text-gray-700 mt-2">{getPaymentTermsEN(quotationData.paymentTerms)}</p>
        </div>

        {/* Offer Validity */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-cyan-500 pb-2 inline-block">Offer Validity</h3>
          <p className="text-sm text-gray-700 mt-2">{getValidityEN(quotationData.offerValidity, quotationData.customValidityDate)}</p>
        </div>

        {/* Terms & Conditions */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-cyan-500 pb-2 inline-block">Terms &amp; Conditions</h3>
          <ul className="text-xs text-gray-600 space-y-1.5 mt-2 list-disc list-inside">
            <li>The Subscription is activated starting from the payment date and is valid for the duration of the selected plan.</li>
            <li>Subscription fees will be automatically deducted at the end of each selected plan duration unless cancelled.</li>
            <li>The subscription can be refunded if the request occurs within 24 hours of subscription and no service has been utilized.</li>
            <li>The subscription can be cancelled at any time; auto-renewal will be disabled upon cancellation.</li>
            <li>Discount percentages vary according to the provider and the service, and are subject to modifications from time to time.</li>
            <li>All prices are in Egyptian Pounds (EGP) and are inclusive of 14% VAT.</li>
          </ul>
        </div>

        {/* Notes */}
        {quotationData.notes && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-cyan-500 pb-2 inline-block">Additional Notes</h3>
            <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{quotationData.notes}</p>
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-8 mt-8 border-t border-gray-200">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-8">For Vezeeta - Shamel</p>
            <div className="border-t border-gray-300 pt-2">
              <p className="text-sm font-semibold text-gray-900">{quotationData.salesName}</p>
              <p className="text-xs text-gray-500">{quotationData.salesTitle}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-8">For {formData.companyName}</p>
            <div className="border-t border-gray-300 pt-2">
              <p className="text-sm font-semibold text-gray-900">{quotationData.recipientName}</p>
              <p className="text-xs text-gray-500">{quotationData.recipientTitle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Arabic Quotation ────────────────────────────────────────────
function QuotationAR({
  formData,
  quotationData,
  result,
}: {
  formData: FormData;
  quotationData: QuotationData;
  result: CalculationResult;
}) {
  const discountAmount = result.shamelTotalAnnual * (quotationData.lumpSumDiscount / 100);
  const finalTotal = result.shamelTotalAnnual - discountAmount;

  return (
    <div dir="rtl" className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden print:shadow-none print:border-none font-sans">
      {/* Header */}
      <div className="bg-gradient-to-l from-cyan-600 to-teal-700 px-10 py-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">شامل للأعمال</h1>
                <p className="text-cyan-100 text-sm">مزايا الرعاية الصحية من فيزيتا</p>
              </div>
            </div>
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold">عرض أسعار</h2>
            <p className="text-cyan-100 text-sm mt-1">التاريخ: {formatDate(quotationData.quotationDate, "ar")}</p>
          </div>
        </div>
      </div>

      <div className="px-10 py-8 space-y-8">
        {/* From / To */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-bold text-gray-400 mb-2">من</p>
            <p className="font-semibold text-gray-900">{quotationData.salesName}</p>
            <p className="text-sm text-gray-600">{quotationData.salesTitle}</p>
            <p className="text-sm text-gray-600">فيزيتا - شامل للأعمال</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 mb-2">إلى</p>
            <p className="font-semibold text-gray-900">{quotationData.recipientName}</p>
            <p className="text-sm text-gray-600">{quotationData.recipientTitle}</p>
            <p className="text-sm text-gray-600">{formData.companyName}</p>
          </div>
        </div>

        {/* Introduction */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-cyan-500 pb-2 inline-block">المقدمة</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            في فيزيتا، نُقدم &quot;شامل&quot;، وهو نظام رعاية صحية متكامل مصمَّم خصيصًا للشركات.
            &quot;شامل&quot; يُوفّر لموظفيكم رعاية صحية عالية الجودة بتكلفة مناسبة، ويضمن لهم الحصول على الرعاية التي يحتاجون إليها،
            وفي الوقت نفسه يساعد شركتكم على تحسين إدارة تكاليف الرعاية الصحية.
          </p>
        </div>

        {/* Why Shamel */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-cyan-500 pb-2 inline-block">لماذا شامل لشركتكم؟</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {[
              { title: "نمو معدل الاحتفاظ بالموظفين", desc: "٦٥٪ من الموظفين صنفوا المزايا الصحية على أنها أهم نوع من المزايا." },
              { title: "أفضل الأسعار في السوق", desc: "استفد بالأسعار المخفضة التي نقدمها لأكثر من ٢٠٠ ألف عضو." },
              { title: "تحكم كامل في الميزانية", desc: "ادفع فقط ما تم استهلاكه وتحكم في نسبة تحمل الشركة." },
              { title: "تعزيز الإنتاجية", desc: "إتاحة زيارة مقدمي الخدمات الصحية للموظفين يقلل من الغياب عن العمل." },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-lg p-3">
                <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Discount Network */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-cyan-500 pb-2 inline-block">شبكة خصومات شامل</h3>
          <div className="overflow-hidden rounded-lg border border-gray-200 mt-2">
            <table className="w-full text-sm">
              <thead className="bg-cyan-50">
                <tr>
                  <th className="text-right px-4 py-2.5 text-cyan-800 font-semibold">الخدمة</th>
                  <th className="text-right px-4 py-2.5 text-cyan-800 font-semibold">الخصم</th>
                  <th className="text-right px-4 py-2.5 text-cyan-800 font-semibold">الشبكة</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { service: "كشف الأطباء", discount: "حتى ٤٠٪", network: "أكثر من ٧,٠٠٠ طبيب" },
                  { service: "التحاليل المعملية", discount: "حتى ٧٠٪", network: "أكثر من ١,٣٠٠ فرع" },
                  { service: "الأشعة والمسح", discount: "حتى ٤٠٪", network: "أكثر من ١,٣٠٠ مركز" },
                  { service: "الصيدليات", discount: "نظام المساهمة", network: "أكثر من ٣٥٠ صيدلية" },
                  { service: "العمليات الجراحية", discount: "أسعار شاملة", network: "أكثر من ١٠٠ مستشفى" },
                ].map((row, i) => (
                  <tr key={row.service} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2.5 text-gray-700">{row.service}</td>
                    <td className="px-4 py-2.5 font-semibold text-cyan-700">{row.discount}</td>
                    <td className="px-4 py-2.5 text-gray-600">{row.network}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Offer */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-cyan-500 pb-2 inline-block">العرض المالي</h3>
          <div className="overflow-hidden rounded-lg border border-gray-200 mt-2">
            <table className="w-full text-sm">
              <thead className="bg-cyan-50">
                <tr>
                  <th className="text-right px-4 py-2.5 text-cyan-800 font-semibold">الباقة</th>
                  <th className="text-left px-4 py-2.5 text-cyan-800 font-semibold">سعر الوحدة (ج.م/سنة)</th>
                  <th className="text-left px-4 py-2.5 text-cyan-800 font-semibold">العدد</th>
                  <th className="text-left px-4 py-2.5 text-cyan-800 font-semibold">الإجمالي (ج.م)</th>
                </tr>
              </thead>
              <tbody>
                {result.individualCount > 0 && (
                  <tr className="bg-white">
                    <td className="px-4 py-2.5 text-gray-700">شامل للأفراد</td>
                    <td className="px-4 py-2.5 text-left text-gray-700">{formatEGP(result.shamelIndividualYearly)}</td>
                    <td className="px-4 py-2.5 text-left text-gray-700">{result.individualCount}</td>
                    <td className="px-4 py-2.5 text-left font-semibold text-gray-900">
                      {formatEGP(result.individualCount * result.shamelIndividualYearly)}
                    </td>
                  </tr>
                )}
                {result.familyCount > 0 && (
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2.5 text-gray-700">شامل للعائلات (حتى ٤ أفراد)</td>
                    <td className="px-4 py-2.5 text-left text-gray-700">{formatEGP(result.shamelFamilyYearly)}</td>
                    <td className="px-4 py-2.5 text-left text-gray-700">{result.familyCount}</td>
                    <td className="px-4 py-2.5 text-left font-semibold text-gray-900">
                      {formatEGP(result.familyCount * result.shamelFamilyYearly)}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-200">
                  <td colSpan={3} className="px-4 py-2.5 text-left font-semibold text-gray-700">المجموع الفرعي</td>
                  <td className="px-4 py-2.5 text-left font-semibold text-gray-900">{formatEGP(result.shamelTotalAnnual)}</td>
                </tr>
                {quotationData.lumpSumDiscount > 0 && (
                  <tr className="border-t border-green-200 bg-green-50">
                    <td colSpan={3} className="px-4 py-2.5 text-left font-semibold text-green-700">
                      خصم إجمالي ({quotationData.lumpSumDiscount}%)
                    </td>
                    <td className="px-4 py-2.5 text-left font-semibold text-green-700">
                      -{formatEGP(discountAmount)}
                    </td>
                  </tr>
                )}
                <tr className="bg-cyan-600 text-white">
                  <td colSpan={3} className="px-4 py-3 text-left font-bold">الإجمالي (شامل ١٤٪ ض.ق.م)</td>
                  <td className="px-4 py-3 text-left font-bold text-lg">{formatEGP(finalTotal)} ج.م</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Implementation Timeline */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-cyan-500 pb-2 inline-block">الجدول الزمني للتنفيذ</h3>
          <div className="space-y-2 mt-2">
            {[
              { step: "١", text: "إتمام التعاقد عن طريق إرسال أمر شراء أو التوقيع على هذا العرض مرفق بختم الشركة" },
              { step: "٢", text: "إرسال قائمة موظفي الشركة وأسماء التابعين لهم" },
              { step: "٣", text: "من ٣ إلى ٥ أيام عمل: تسجيل الموظفين في قاعدة بيانات شامل" },
              { step: "٤", text: "الإطلاق والدعم المستمر" },
            ].map((item) => (
              <div key={item.step} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {item.step}
                </div>
                <p className="text-sm text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Terms */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-cyan-500 pb-2 inline-block">شروط الدفع</h3>
          <p className="text-sm text-gray-700 mt-2">{getPaymentTermsAR(quotationData.paymentTerms)}</p>
        </div>

        {/* Offer Validity */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-cyan-500 pb-2 inline-block">صلاحية العرض</h3>
          <p className="text-sm text-gray-700 mt-2">{getValidityAR(quotationData.offerValidity, quotationData.customValidityDate)}</p>
        </div>

        {/* Terms & Conditions */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-cyan-500 pb-2 inline-block">الشروط والأحكام</h3>
          <ul className="text-xs text-gray-600 space-y-1.5 mt-2 list-disc list-inside">
            <li>يتم تفعيل الاشتراك بدءًا من تاريخ الدفع ويكون صالحًا طوال مدة الخطة المحددة.</li>
            <li>سيتم خصم رسوم الاشتراك تلقائيًا في نهاية كل مدة محددة للخطة ما لم يتم الإلغاء.</li>
            <li>يمكن استرداد الاشتراك إذا حدث هذا الطلب خلال ٢٤ ساعة من الاشتراك ولم يتم الاستفادة من أي خدمة.</li>
            <li>يمكن إلغاء الاشتراك في أي وقت وسيتم تعطيل التجديد التلقائي.</li>
            <li>تختلف نسب الخصم حسب مقدم الخدمة ونوع الخدمة، وتخضع للتعديلات من وقت لآخر.</li>
            <li>جميع الأسعار بالجنيه المصري وشاملة ضريبة القيمة المضافة (١٤٪).</li>
          </ul>
        </div>

        {/* Notes */}
        {quotationData.notes && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-cyan-500 pb-2 inline-block">ملاحظات إضافية</h3>
            <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{quotationData.notes}</p>
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-8 mt-8 border-t border-gray-200">
          <div>
            <p className="text-xs font-bold text-gray-400 mb-8">عن فيزيتا - شامل</p>
            <div className="border-t border-gray-300 pt-2">
              <p className="text-sm font-semibold text-gray-900">{quotationData.salesName}</p>
              <p className="text-xs text-gray-500">{quotationData.salesTitle}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 mb-8">عن {formData.companyName}</p>
            <div className="border-t border-gray-300 pt-2">
              <p className="text-sm font-semibold text-gray-900">{quotationData.recipientName}</p>
              <p className="text-xs text-gray-500">{quotationData.recipientTitle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────
export default function StepQuotation({ formData, quotationData, result, onBack, onRestart }: Props) {
  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-6">
      {/* Actions bar - hidden when printing */}
      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={18} />
          Edit Details
        </button>
        <button
          onClick={onRestart}
          className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw size={18} />
          New Quotation
        </button>
        <button
          onClick={handlePrint}
          className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 shadow-lg shadow-cyan-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Printer size={18} />
          Print / Save as PDF
        </button>
      </div>

      {/* Quotation(s) */}
      <div className="space-y-8" id="quotation-content">
        {(quotationData.language === "en" || quotationData.language === "both") && (
          <QuotationEN formData={formData} quotationData={quotationData} result={result} />
        )}
        {quotationData.language === "both" && (
          <div className="print:break-before-page" />
        )}
        {(quotationData.language === "ar" || quotationData.language === "both") && (
          <QuotationAR formData={formData} quotationData={quotationData} result={result} />
        )}
      </div>
    </div>
  );
}
