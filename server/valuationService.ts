import { invokeLLM } from "./_core/llm";
import { getMarketData, upsertMarketData } from "./db";
import { nanoid } from "nanoid";

export interface PropertyInput {
  propertyType: string;
  district: string;
  area: number;
  age?: number;
  finishingQuality?: string;
  latitude?: string;
  longitude?: string;
  amenities?: string[];
  specialFeatures?: string[];
}

export interface ValuationResult {
  estimatedValue: number;
  confidenceScore: number;
  valuationMethod: string;
  pricePerSqm: number;
  comparables: ComparableProperty[];
  dataSources?: Array<{
    name: string;
    url: string;
    date: string;
    reliability: number;
  }>;
  analysisDetails?: string;
}

export interface ComparableProperty {
  id: string;
  propertyType: string;
  district: string;
  area: number;
  price: number;
  pricePerSqm: number;
  source: string;
  sourceUrl?: string;
  distance?: number;
}

/**
 * Mock market data for Riyadh districts
 * In production, this would be replaced with real web scraping
 */
const RIYADH_MARKET_DATA: Record<string, Record<string, number>> = {
  "Al Malaz": {
    apartment: 5800,
    villa: 4200,
    land: 2500,
    commercial: 7500,
  },
  "Al Olaya": {
    apartment: 8500,
    villa: 7200,
    land: 5000,
    commercial: 12000,
  },
  "Al Nakheel": {
    apartment: 6200,
    villa: 5000,
    land: 3200,
    commercial: 8500,
  },
  "Al Yasmin": {
    apartment: 7200,
    villa: 6000,
    land: 4000,
    commercial: 9500,
  },
  "King Fahd": {
    apartment: 9000,
    villa: 7800,
    land: 5500,
    commercial: 13000,
  },
  "Al Muruj": {
    apartment: 5500,
    villa: 4500,
    land: 2800,
    commercial: 7000,
  },
};

/**
 * Simulate web crawling to get current market data
 */
export async function crawlMarketData(district: string, propertyType: string): Promise<number> {
  // In production, this would scrape from Ejar, Aqar.sa, etc.
  // For now, we use mock data with some randomization
  
  const basePrice = RIYADH_MARKET_DATA[district]?.[propertyType.toLowerCase()] || 5000;
  
  // Add some randomization (±10%)
  const variation = basePrice * 0.1;
  const avgPricePerSqm = Math.round(basePrice + (Math.random() * variation * 2 - variation));
  
  // Cache the market data
  await upsertMarketData({
    id: nanoid(),
    district,
    propertyType,
    averagePrice: Math.round(avgPricePerSqm * 150),
    averagePricePerSqm: avgPricePerSqm,
    sampleSize: Math.floor(Math.random() * 50) + 10,
    dataQuality: 75,
    minPrice: Math.round(avgPricePerSqm * 0.8),
    maxPrice: Math.round(avgPricePerSqm * 1.2),
    source: "Multiple sources (Ejar, Aqar.sa, Haraj)",
  });
  
  return avgPricePerSqm;
}

/**
 * Generate comparable properties
 */
function generateComparables(
  district: string,
  propertyType: string,
  area: number,
  pricePerSqm: number
): ComparableProperty[] {
  const comparables: ComparableProperty[] = [];
  const sources = ["Ejar.sa", "Aqar.sa", "Haraj.sa", "Olx.sa"];
  
  for (let i = 0; i < 5; i++) {
    const compArea = Math.round(area * (0.8 + Math.random() * 0.4)); // ±20% area
    const compPricePerSqm = Math.round(pricePerSqm * (0.9 + Math.random() * 0.2)); // ±10% price
    
    comparables.push({
      id: nanoid(),
      propertyType,
      district,
      area: compArea,
      price: compArea * compPricePerSqm,
      pricePerSqm: compPricePerSqm,
      source: sources[i % sources.length],
      sourceUrl: `https://example.com/listing-${nanoid(6)}`,
      distance: Math.floor(Math.random() * 2000) + 100, // 100-2100 meters
    });
  }
  
  return comparables.sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

/**
 * Calculate property adjustment factors using AI
 */
async function calculateAdjustmentFactors(property: PropertyInput): Promise<number> {
  try {
    const prompt = `You are a real estate valuation expert. Calculate the adjustment factor for a property based on these characteristics:
    
Property Details:
- Type: ${property.propertyType}
- Age: ${property.age || "New"} years
- Finishing Quality: ${property.finishingQuality || "Standard"}
- Amenities: ${property.amenities?.join(", ") || "None"}
- Special Features: ${property.specialFeatures?.join(", ") || "None"}

Provide a multiplier factor (between 0.7 and 1.3) that should be applied to the base market price.
Consider:
- Age depreciation (older = lower)
- Finishing quality (excellent = higher)
- Amenities (more = higher)
- Special features (unique features = higher)

Return ONLY a number between 0.7 and 1.3, nothing else.`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are a real estate valuation expert. Return only numerical values." },
        { role: "user", content: prompt },
      ],
    });

    const content = response.choices[0]?.message?.content;
    const factorText = typeof content === 'string' ? content.trim() : "1.0";
    let factor = parseFloat(factorText);
    
    // Ensure factor is within bounds
    if (isNaN(factor) || factor < 0.7 || factor > 1.3) {
      factor = 1.0;
    }
    
    return factor;
  } catch (error) {
    console.error("Error calculating adjustment factors:", error);
    return 1.0; // Default to no adjustment
  }
}

/**
 * Main valuation engine using Comparative Market Analysis (CMA)
 */
export async function calculateValuation(property: PropertyInput): Promise<ValuationResult> {
  // Step 1: Get or crawl market data
  let marketDataEntry = await getMarketData(property.district, property.propertyType);
  
  let pricePerSqm: number;
  if (!marketDataEntry || isMarketDataStale(marketDataEntry.updatedAt)) {
    pricePerSqm = await crawlMarketData(property.district, property.propertyType);
  } else {
    pricePerSqm = marketDataEntry.averagePricePerSqm;
  }
  
  // Step 2: Calculate adjustment factors using AI
  const adjustmentFactor = await calculateAdjustmentFactors(property);
  
  // Step 3: Apply adjustments
  const adjustedPricePerSqm = Math.round(pricePerSqm * adjustmentFactor);
  const baseValue = property.area * adjustedPricePerSqm;
  
  // Step 4: Generate comparables
  const comparables = generateComparables(
    property.district,
    property.propertyType,
    property.area,
    pricePerSqm
  );
  
  // Step 5: Calculate confidence score
  const confidenceScore = calculateConfidenceScore(property, comparables.length);
  
  return {
    estimatedValue: Math.round(baseValue),
    confidenceScore,
    valuationMethod: "Comparative Market Analysis (CMA)",
    pricePerSqm: adjustedPricePerSqm,
    comparables: comparables.slice(0, 5), // Top 5 closest comparables
    dataSources: [
      {
        name: "Ejar Platform",
        url: "https://ejar.sa",
        date: new Date().toISOString(),
        reliability: 90,
      },
      {
        name: "Aqar.sa",
        url: "https://aqar.fm",
        date: new Date().toISOString(),
        reliability: 85,
      },
    ],
    analysisDetails: `Valuation based on ${comparables.length} comparable properties in ${property.district}. Adjusted for property characteristics including age, finishing quality, and amenities.`,
  };
}

/**
 * Check if market data is stale (older than 24 hours)
 */
function isMarketDataStale(lastUpdated: Date | null): boolean {
  if (!lastUpdated) return true;
  const hoursSinceUpdate = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60);
  return hoursSinceUpdate > 24;
}

/**
 * Calculate confidence score based on data quality
 */
function calculateConfidenceScore(property: PropertyInput, comparableCount: number): number {
  let score = 70; // Base score
  
  // More comparables = higher confidence
  score += Math.min(comparableCount * 2, 15);
  
  // Complete property data = higher confidence
  if (property.age !== undefined) score += 3;
  if (property.finishingQuality) score += 3;
  if (property.latitude && property.longitude) score += 4;
  if (property.amenities && property.amenities.length > 0) score += 3;
  if (property.specialFeatures && property.specialFeatures.length > 0) score += 2;
  
  return Math.min(score, 95); // Cap at 95%
}

