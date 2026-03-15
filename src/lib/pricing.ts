export interface PricingTier {
  type: string;
  minEmployees: number;
  maxEmployees: number;
  individualPrice: number;
  familyPrice: number;
  discount: number;
  label: string;
}

export const ORIGINAL_INDIVIDUAL_PRICE = 800;
export const ORIGINAL_FAMILY_PRICE = 1600;

export const MINI_ORIGINAL_INDIVIDUAL_PRICE = 120;
export const MINI_ORIGINAL_FAMILY_PRICE = 220;

export const pricingTiers: PricingTier[] = [
  { type: "SoHo", minEmployees: 5, maxEmployees: 10, individualPrice: 650, familyPrice: 1300, discount: 18.75, label: "5 - 10" },
  { type: "SoHo", minEmployees: 11, maxEmployees: 20, individualPrice: 625, familyPrice: 1250, discount: 21.88, label: "11 - 20" },
  { type: "SME", minEmployees: 21, maxEmployees: 50, individualPrice: 600, familyPrice: 1200, discount: 25, label: "21 - 50" },
  { type: "SME", minEmployees: 51, maxEmployees: 100, individualPrice: 575, familyPrice: 1150, discount: 28.13, label: "51 - 100" },
  { type: "Mid-Large", minEmployees: 101, maxEmployees: 250, individualPrice: 550, familyPrice: 1100, discount: 31.25, label: "101 - 250" },
  { type: "Mid-Large", minEmployees: 251, maxEmployees: 500, individualPrice: 525, familyPrice: 1050, discount: 34.38, label: "251 - 500" },
  { type: "Large Enterprise", minEmployees: 501, maxEmployees: 2000, individualPrice: 500, familyPrice: 1000, discount: 37.5, label: "500 - 2,000" },
  { type: "Large Enterprise", minEmployees: 2001, maxEmployees: 5000, individualPrice: 400, familyPrice: 800, discount: 50, label: "2,001 - 5,000" },
  { type: "Exceptional Enterprise", minEmployees: 5001, maxEmployees: 999999, individualPrice: 350, familyPrice: 700, discount: 56.25, label: "5,001+" },
];

export const miniPricingTiers: PricingTier[] = [
  { type: "SoHo", minEmployees: 5, maxEmployees: 10, individualPrice: 120, familyPrice: 220, discount: 0, label: "5 - 10" },
  { type: "SoHo", minEmployees: 11, maxEmployees: 20, individualPrice: 108, familyPrice: 198, discount: 10, label: "11 - 20" },
  { type: "SME", minEmployees: 21, maxEmployees: 50, individualPrice: 102, familyPrice: 187, discount: 15, label: "21 - 50" },
  { type: "SME", minEmployees: 51, maxEmployees: 100, individualPrice: 100, familyPrice: 183, discount: 17, label: "51 - 100" },
  { type: "Mid-Large", minEmployees: 101, maxEmployees: 250, individualPrice: 95, familyPrice: 174, discount: 21, label: "101 - 250" },
  { type: "Mid-Large", minEmployees: 251, maxEmployees: 500, individualPrice: 92, familyPrice: 167, discount: 24, label: "251 - 500" },
  { type: "Large Enterprise", minEmployees: 501, maxEmployees: 2000, individualPrice: 88, familyPrice: 161, discount: 27, label: "500 - 2,000" },
  { type: "Large Enterprise", minEmployees: 2001, maxEmployees: 5000, individualPrice: 84, familyPrice: 154, discount: 30, label: "2,001 - 5,000" },
  { type: "Exceptional Enterprise", minEmployees: 5001, maxEmployees: 999999, individualPrice: 81, familyPrice: 147, discount: 33, label: "5,001+" },
];

// Traditional insurance benchmarks for Egypt (annual per employee)
export const traditionalInsurance = {
  individual: {
    basic: 6000,    // Basic medical insurance
    standard: 10000, // Standard coverage
    premium: 18000,  // Premium coverage
  },
  family: {
    basic: 15000,
    standard: 25000,
    premium: 42000,
  },
};

export const shamelBenefits = [
  { category: "Doctor Consultations", discount: "Up to 40%", icon: "stethoscope" },
  { category: "Labs & Scans", discount: "Up to 80%", icon: "microscope" },
  { category: "Pharmacy", discount: "Co-payment model", icon: "pill" },
  { category: "Surgeries", discount: "All-inclusive pricing", icon: "hospital" },
];

export const networkStats = {
  doctors: "7,000+",
  pharmacies: "350+",
  labs: "1,300+",
  hospitals: "100+",
};

export function getTier(employeeCount: number): PricingTier | null {
  if (employeeCount < 5) return null;
  return pricingTiers.find(
    (t) => employeeCount >= t.minEmployees && employeeCount <= t.maxEmployees
  ) || null;
}

export function getMiniTier(employeeCount: number): PricingTier | null {
  if (employeeCount < 5) return null;
  return miniPricingTiers.find(
    (t) => employeeCount >= t.minEmployees && employeeCount <= t.maxEmployees
  ) || null;
}

export interface CalculationResult {
  tier: PricingTier;
  miniTier: PricingTier;
  planType: "individual" | "family" | "mixed";
  employeeCount: number;
  individualCount: number;
  familyCount: number;
  miniIndividualCount: number;
  miniFamilyCount: number;

  // Shamel costs (yearly per person)
  shamelIndividualYearly: number;
  shamelFamilyYearly: number;

  // Mini costs (yearly per person)
  miniIndividualYearly: number;
  miniFamilyYearly: number;

  // Subtotals per product
  shamelSubtotal: number;
  miniSubtotal: number;

  // Total annual combined cost (Shamel + Mini)
  shamelTotalAnnual: number;

  // Traditional insurance costs (annual)
  traditionalBasicAnnual: number;
  traditionalStandardAnnual: number;
  traditionalPremiumAnnual: number;

  // Savings vs each tier
  savingsVsBasic: number;
  savingsVsStandard: number;
  savingsVsPremium: number;

  // ROI percentages
  roiVsBasic: number;
  roiVsStandard: number;
  roiVsPremium: number;

  // Discount percentages
  discountPercent: number;
  shamelDiscountPercent: number;
  miniDiscountPercent: number;
}

export function calculatePricing(
  employeeCount: number,
  planType: "individual" | "family" | "mixed",
  individualCount: number,
  familyCount: number,
  miniIndividualCount: number = 0,
  miniFamilyCount: number = 0
): CalculationResult | null {
  const tier = getTier(employeeCount);
  const miniTier = getMiniTier(employeeCount);
  if (!tier || !miniTier) return null;

  // Use explicit counts directly (the UI now manages allocation)
  const indCount = individualCount;
  const famCount = familyCount;

  // Shamel subtotal
  const shamelSubtotal =
    indCount * tier.individualPrice +
    famCount * tier.familyPrice;

  // Mini subtotal
  const miniSubtotal =
    miniIndividualCount * miniTier.individualPrice +
    miniFamilyCount * miniTier.familyPrice;

  // Combined total
  const shamelTotalAnnual = shamelSubtotal + miniSubtotal;

  // Traditional insurance comparison — based on subscription TYPE (individual vs family)
  const totalIndividualType = indCount + miniIndividualCount;
  const totalFamilyType = famCount + miniFamilyCount;

  const traditionalBasicAnnual =
    totalIndividualType * traditionalInsurance.individual.basic +
    totalFamilyType * traditionalInsurance.family.basic;

  const traditionalStandardAnnual =
    totalIndividualType * traditionalInsurance.individual.standard +
    totalFamilyType * traditionalInsurance.family.standard;

  const traditionalPremiumAnnual =
    totalIndividualType * traditionalInsurance.individual.premium +
    totalFamilyType * traditionalInsurance.family.premium;

  const savingsVsBasic = traditionalBasicAnnual - shamelTotalAnnual;
  const savingsVsStandard = traditionalStandardAnnual - shamelTotalAnnual;
  const savingsVsPremium = traditionalPremiumAnnual - shamelTotalAnnual;

  const roiVsBasic = traditionalBasicAnnual > 0 ? ((savingsVsBasic / traditionalBasicAnnual) * 100) : 0;
  const roiVsStandard = traditionalStandardAnnual > 0 ? ((savingsVsStandard / traditionalStandardAnnual) * 100) : 0;
  const roiVsPremium = traditionalPremiumAnnual > 0 ? ((savingsVsPremium / traditionalPremiumAnnual) * 100) : 0;

  // Discount percentages
  const shamelDiscountPercent = tier.discount;
  const miniDiscountPercent = miniTier.discount;
  const discountPercent = shamelTotalAnnual > 0
    ? (shamelSubtotal / shamelTotalAnnual * shamelDiscountPercent +
       miniSubtotal / shamelTotalAnnual * miniDiscountPercent)
    : 0;

  return {
    tier,
    miniTier,
    planType,
    employeeCount,
    individualCount: indCount,
    familyCount: famCount,
    miniIndividualCount,
    miniFamilyCount,
    shamelIndividualYearly: tier.individualPrice,
    shamelFamilyYearly: tier.familyPrice,
    miniIndividualYearly: miniTier.individualPrice,
    miniFamilyYearly: miniTier.familyPrice,
    shamelSubtotal,
    miniSubtotal,
    shamelTotalAnnual,
    traditionalBasicAnnual,
    traditionalStandardAnnual,
    traditionalPremiumAnnual,
    savingsVsBasic,
    savingsVsStandard,
    savingsVsPremium,
    roiVsBasic,
    roiVsStandard,
    roiVsPremium,
    discountPercent,
    shamelDiscountPercent,
    miniDiscountPercent,
  };
}
