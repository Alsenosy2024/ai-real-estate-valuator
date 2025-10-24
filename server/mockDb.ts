// Simple in-memory database for demonstration purposes
// This allows the app to work without Firebase or MySQL configuration

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
  lastSignedIn: Date;
}

interface Valuation {
  id: string;
  userId: string;
  propertyType: string;
  district: string;
  area: number;
  latitude?: string | null;
  longitude?: string | null;
  streetWidth?: number | null;
  facingDirection?: string | null;
  age?: number | null;
  finishingQuality?: string | null;
  amenities?: string[];
  specialFeatures?: string[];
  numberOfRooms?: number | null;
  numberOfBathrooms?: number | null;
  numberOfFloors?: number | null;
  hasGarage?: boolean;
  hasGarden?: boolean;
  estimatedValue: number;
  pricePerSqm?: number;
  confidenceScore: number;
  valuationMethod: string;
  marketTrend?: string | null;
  comparables?: any[];
  dataSources?: any[];
  analysisDetails?: string | null;
  reportUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface MarketData {
  id: string;
  district: string;
  propertyType: string;
  averagePrice: number;
  averagePricePerSqm: number;
  minPrice?: number;
  maxPrice?: number;
  sampleSize: number;
  dataQuality: number;
  source: string;
  sourceUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage
const users = new Map<string, User>();
const valuations = new Map<string, Valuation>();
const marketDataStore = new Map<string, MarketData>();

// User operations
export async function upsertUser(user: Partial<User> & { id: string }): Promise<void> {
  const existing = users.get(user.id);
  
  if (existing) {
    users.set(user.id, {
      ...existing,
      ...user,
      lastSignedIn: new Date(),
    });
  } else {
    users.set(user.id, {
      id: user.id,
      name: user.name || null,
      email: user.email || null,
      loginMethod: user.loginMethod || null,
      role: user.role || 'user',
      createdAt: new Date(),
      lastSignedIn: new Date(),
    });
  }
}

export async function getUser(id: string): Promise<User | undefined> {
  return users.get(id);
}

// Valuation operations
export async function createValuation(valuation: Omit<Valuation, 'createdAt' | 'updatedAt'>): Promise<Valuation> {
  const newValuation: Valuation = {
    ...valuation,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  valuations.set(valuation.id, newValuation);
  return newValuation;
}

export async function getValuation(id: string): Promise<Valuation | undefined> {
  return valuations.get(id);
}

export async function getUserValuations(userId: string): Promise<Valuation[]> {
  const userValuations: Valuation[] = [];
  
  for (const valuation of valuations.values()) {
    if (valuation.userId === userId) {
      userValuations.push(valuation);
    }
  }
  
  // Sort by creation date descending
  return userValuations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function updateValuation(id: string, data: Partial<Valuation>): Promise<void> {
  const existing = valuations.get(id);
  if (existing) {
    valuations.set(id, {
      ...existing,
      ...data,
      updatedAt: new Date(),
    });
  }
}

// Market data operations
export async function upsertMarketData(data: Omit<MarketData, 'createdAt' | 'updatedAt'>): Promise<void> {
  const key = `${data.district}-${data.propertyType}`;
  const existing = marketDataStore.get(key);
  
  if (existing) {
    marketDataStore.set(key, {
      ...existing,
      ...data,
      updatedAt: new Date(),
    });
  } else {
    marketDataStore.set(key, {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

export async function getMarketData(district: string, propertyType: string): Promise<MarketData | undefined> {
  const key = `${district}-${propertyType}`;
  return marketDataStore.get(key);
}

export async function getAllMarketData(): Promise<MarketData[]> {
  return Array.from(marketDataStore.values())
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function getComparables(valuationId: string): Promise<any[]> {
  const valuation = valuations.get(valuationId);
  return valuation?.comparables || [];
}

console.log('[MockDB] In-memory database initialized - No external database required!');
