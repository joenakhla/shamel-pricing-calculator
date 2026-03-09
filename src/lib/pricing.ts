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
  { category: "Pharmacy", discount: "Up to 16%", icon: "pill" },
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

export interface CalculationResult {
  tier: PricingTier;
  planType: "individual" | "family" | "mixed";
  employeeCount: number;
  individualCount: number;
  familyCount: number;

  // Shamel costs (monthly per person)
  shamelIndividualMonthly: number;
  shamelFamilyMonthly: number;

  // Total annual Shamel cost
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

  // Discount from original price
  discountPercent: number;
}

export function calculatePricing(
  employeeCount: number,
  planType: "individual" | "family" | "mixed",
  individualCount: number,
  familyCount: number
): CalculationResult | null {
  const tier = getTier(employeeCount);
  if (!tier) return null;

  const indCount = planType === "individual" ? employeeCount : planType === "family" ? 0 : individualCount;
  const famCount = planType === "family" ? employeeCount : planType === "individual" ? 0 : familyCount;

  const shamelTotalAnnual =
    indCount * tier.individualPrice * 12 +
    famCount * tier.familyPrice * 12;

  // Traditional insurance for comparison
  const tradIndividual = planType === "family" ? 0 : (planType === "individual" ? employeeCount : individualCount);
  const tradFamily = planType === "individual" ? 0 : (planType === "family" ? employeeCount : familyCount);

  const traditionalBasicAnnual =
    tradIndividual * traditionalInsurance.individual.basic +
    tradFamily * traditionalInsurance.family.basic;

  const traditionalStandardAnnual =
    tradIndividual * traditionalInsurance.individual.standard +
    tradFamily * traditionalInsurance.family.standard;

  const traditionalPremiumAnnual =
    tradIndividual * traditionalInsurance.individual.premium +
    tradFamily * traditionalInsurance.family.premium;

  const savingsVsBasic = traditionalBasicAnnual - shamelTotalAnnual;
  const savingsVsStandard = traditionalStandardAnnual - shamelTotalAnnual;
  const savingsVsPremium = traditionalPremiumAnnual - shamelTotalAnnual;

  const roiVsBasic = traditionalBasicAnnual > 0 ? ((savingsVsBasic / traditionalBasicAnnual) * 100) : 0;
  const roiVsStandard = traditionalStandardAnnual > 0 ? ((savingsVsStandard / traditionalStandardAnnual) * 100) : 0;
  const roiVsPremium = traditionalPremiumAnnual > 0 ? ((savingsVsPremium / traditionalPremiumAnnual) * 100) : 0;

  return {
    tier,
    planType,
    employeeCount,
    individualCount: indCount,
    familyCount: famCount,
    shamelIndividualMonthly: tier.individualPrice,
    shamelFamilyMonthly: tier.familyPrice,
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
    discountPercent: tier.discount,
  };
}
