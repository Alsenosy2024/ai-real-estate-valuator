import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, valuations, InsertValuation, marketData, InsertMarketData } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Valuation queries
export async function createValuation(valuation: InsertValuation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(valuations).values(valuation);
  return valuation;
}

export async function getValuation(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(valuations).where(eq(valuations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserValuations(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(valuations).where(eq(valuations.userId, userId)).orderBy(desc(valuations.createdAt));
}

export async function updateValuation(id: string, data: Partial<InsertValuation>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(valuations).set(data).where(eq(valuations.id, id));
}

// Market data queries
export async function upsertMarketData(data: InsertMarketData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(marketData).values(data).onDuplicateKeyUpdate({
    set: {
      averagePrice: data.averagePrice,
      averagePricePerSqm: data.averagePricePerSqm,
      sampleSize: data.sampleSize,
      dataQuality: data.dataQuality,
      minPrice: data.minPrice,
      maxPrice: data.maxPrice,
      updatedAt: new Date(),
    },
  });
}

export async function getMarketData(district: string, propertyType: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(marketData)
    .where(and(eq(marketData.district, district), eq(marketData.propertyType, propertyType)))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllMarketData() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(marketData).orderBy(desc(marketData.updatedAt));
}

// Comparables are now stored as JSON in the valuations table
export async function getComparables(valuationId: string) {
  const db = await getDb();
  if (!db) return [];
  
  const valuation = await db.select().from(valuations).where(eq(valuations.id, valuationId)).limit(1);
  if (valuation.length === 0) return [];
  
  return (valuation[0].comparables as unknown as any[]) || [];
}

