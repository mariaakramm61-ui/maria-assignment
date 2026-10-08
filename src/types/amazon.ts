export interface CriteriaDefinition {
  rowNumber: number;
  key: string;
  attributeName: string;
  standardValue: string;
  categoryGroup: 'Demand & Revenue' | 'Competition & Reviews' | 'Product Specifications' | 'Market Stability' | 'Economics & Sourcing';
  urduExplanation: string;
  englishExplanation: string;
  benchmarkRule: string;
}

export interface CompetitorListing {
  rank: number;
  asin: string;
  title: string;
  brand: string;
  price: number;
  sales: number;
  revenue: number;
  bsr: number;
  rating: number;
  reviews: number;
  fbaFee: number;
  yearLaunched: number;
  sizeTier: string;
  weight: number;
}

export interface ProductSample {
  id: string;
  sampleNumber: number;
  name: string;
  category: string;
  amazonUrl: string;
  imageUrl: string;
  values: {
    monthlySearchVolume: string | number;
    averageRevenue: string | number;
    averageMonthlyUnits: string | number;
    averageSellingPrice: string | number;
    averageReviews: string | number;
    sellersUnder500: string | number;
    sellersUnder200: string | number;
    h10CompetingProducts: string | number;
    amazonListingsTop15: string | number;
    sameBrandListingsTop15: string | number;
    productWeight: string | number;
    sizeTier: string;
    avgVariationsTop5: string | number;
    listingsOver10kRevenue: string | number;
    listings2025Over10k: string | number;
    listings2026Over10k: string | number;
    averageRatingTop5: string | number;
    revenueConsistency: string;
    priceDepthStability: string;
    seasonality: string;
    landingCost: string | number;
    fbaFee: string | number;
    referralFee: string | number;
    tentativeProfit: string | number;
    tentativeProfitMargin: string | number;
    alibabaLink: string;
    patentVerification: string;
    shortListedStatus: string;
    finalRemarks: string;
    packageItems: string;
  };
  remarks: {
    monthlySearchVolume: string;
    averageRevenue: string;
    averageMonthlyUnits: string;
    averageSellingPrice: string;
    averageReviews: string;
    sellersUnder500: string;
    sellersUnder200: string;
    h10CompetingProducts: string;
    amazonListingsTop15: string;
    sameBrandListingsTop15: string;
    productWeight: string;
    sizeTier: string;
    avgVariationsTop5: string;
    listingsOver10kRevenue: string;
    listings2025Over10k: string;
    listings2026Over10k: string;
    averageRatingTop5: string;
    revenueConsistency: string;
    priceDepthStability: string;
    seasonality: string;
    landingCost?: string;
    profitMargin?: string;
    generalRemarks?: string;
  };
  topCompetitors?: CompetitorListing[];
}

export interface AssignmentMetadata {
  studentName: string;
  studentId: string;
  batch: string;
  mentorName: string;
  submissionDate: string;
  targetMarket: string;
  currency: string;
}
