import { getFirebaseDB } from './firebase';
import { nanoid } from 'nanoid';

// Collections
const USERS_COLLECTION = 'users';
const VALUATIONS_COLLECTION = 'valuations';
const MARKET_DATA_COLLECTION = 'marketData';

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
  lastSignedIn: Date;
}

export interface Valuation {
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

export interface MarketData {
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

// User operations
export async function upsertUser(user: Partial<User> & { id: string }): Promise<void> {
  const db = getFirebaseDB();
  const userRef = db.collection(USERS_COLLECTION).doc(user.id);
  
  const existingUser = await userRef.get();
  
  if (existingUser.exists) {
    // Update existing user
    await userRef.update({
      ...user,
      lastSignedIn: new Date(),
      updatedAt: new Date(),
    });
  } else {
    // Create new user
    await userRef.set({
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
  const db = getFirebaseDB();
  const userDoc = await db.collection(USERS_COLLECTION).doc(id).get();
  
  if (!userDoc.exists) {
    return undefined;
  }
  
  return userDoc.data() as User;
}

// Valuation operations
export async function createValuation(valuation: Omit<Valuation, 'createdAt' | 'updatedAt'>): Promise<Valuation> {
  const db = getFirebaseDB();
  const valuationRef = db.collection(VALUATIONS_COLLECTION).doc(valuation.id);
  
  const newValuation: Valuation = {
    ...valuation,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  await valuationRef.set(newValuation);
  return newValuation;
}

export async function getValuation(id: string): Promise<Valuation | undefined> {
  const db = getFirebaseDB();
  const valuationDoc = await db.collection(VALUATIONS_COLLECTION).doc(id).get();
  
  if (!valuationDoc.exists) {
    return undefined;
  }
  
  return valuationDoc.data() as Valuation;
}

export async function getUserValuations(userId: string): Promise<Valuation[]> {
  const db = getFirebaseDB();
  const valuationsSnapshot = await db
    .collection(VALUATIONS_COLLECTION)
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();
  
  return valuationsSnapshot.docs.map(doc => doc.data() as Valuation);
}

export async function updateValuation(id: string, data: Partial<Valuation>): Promise<void> {
  const db = getFirebaseDB();
  await db.collection(VALUATIONS_COLLECTION).doc(id).update({
    ...data,
    updatedAt: new Date(),
  });
}

// Market data operations
export async function upsertMarketData(data: Omit<MarketData, 'createdAt' | 'updatedAt'>): Promise<void> {
  const db = getFirebaseDB();
  const marketDataRef = db.collection(MARKET_DATA_COLLECTION).doc(data.id);
  
  const existingData = await marketDataRef.get();
  
  if (existingData.exists) {
    await marketDataRef.update({
      ...data,
      updatedAt: new Date(),
    });
  } else {
    await marketDataRef.set({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

export async function getMarketData(district: string, propertyType: string): Promise<MarketData | undefined> {
  const db = getFirebaseDB();
  const marketDataSnapshot = await db
    .collection(MARKET_DATA_COLLECTION)
    .where('district', '==', district)
    .where('propertyType', '==', propertyType)
    .limit(1)
    .get();
  
  if (marketDataSnapshot.empty) {
    return undefined;
  }
  
  return marketDataSnapshot.docs[0].data() as MarketData;
}

export async function getAllMarketData(): Promise<MarketData[]> {
  const db = getFirebaseDB();
  const marketDataSnapshot = await db
    .collection(MARKET_DATA_COLLECTION)
    .orderBy('updatedAt', 'desc')
    .get();
  
  return marketDataSnapshot.docs.map(doc => doc.data() as MarketData);
}

export async function getComparables(valuationId: string): Promise<any[]> {
  const valuation = await getValuation(valuationId);
  return valuation?.comparables || [];
}
