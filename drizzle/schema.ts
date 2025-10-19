import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, json, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Property valuations table with comprehensive details
 */
export const valuations = mysqlTable("valuations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  
  // Basic property info
  propertyType: varchar("propertyType", { length: 64 }).notNull(),
  district: varchar("district", { length: 128 }).notNull(),
  area: int("area").notNull(), // in square meters
  
  // Location details
  latitude: text("latitude"),
  longitude: text("longitude"),
  streetWidth: int("streetWidth"), // in meters
  facingDirection: varchar("facingDirection", { length: 32 }), // north, south, east, west, northeast, etc.
  
  // Property characteristics
  age: int("age"), // in years
  finishingQuality: varchar("finishingQuality", { length: 32 }),
  amenities: json("amenities").$type<string[]>(),
  specialFeatures: json("specialFeatures").$type<string[]>(),
  
  // Additional details
  numberOfRooms: int("numberOfRooms"),
  numberOfBathrooms: int("numberOfBathrooms"),
  numberOfFloors: int("numberOfFloors"),
  hasGarage: boolean("hasGarage"),
  hasGarden: boolean("hasGarden"),
  
  // Valuation results
  estimatedValue: int("estimatedValue").notNull(),
  pricePerSqm: int("pricePerSqm"),
  confidenceScore: int("confidenceScore").notNull(),
  valuationMethod: varchar("valuationMethod", { length: 64 }).notNull(),
  
  // Market data
  marketTrend: varchar("marketTrend", { length: 32 }),
  comparables: json("comparables").$type<Array<{
    id: string;
    district: string;
    area: number;
    price: number;
    pricePerSqm: number;
    distance?: number;
    source: string;
    date?: string;
  }>>(),
  
  // Data sources and analysis
  dataSources: json("dataSources").$type<Array<{
    name: string;
    url: string;
    date: string;
    reliability: number;
  }>>(),
  analysisDetails: text("analysisDetails"),
  
  // Report
  reportUrl: text("reportUrl"),
  
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Valuation = typeof valuations.$inferSelect;
export type InsertValuation = typeof valuations.$inferInsert;

/**
 * Market data cache for faster valuations
 */
export const marketData = mysqlTable("marketData", {
  id: varchar("id", { length: 64 }).primaryKey(),
  district: varchar("district", { length: 128 }).notNull(),
  propertyType: varchar("propertyType", { length: 64 }).notNull(),
  
  averagePrice: int("averagePrice").notNull(),
  averagePricePerSqm: int("averagePricePerSqm").notNull(),
  minPrice: int("minPrice"),
  maxPrice: int("maxPrice"),
  
  sampleSize: int("sampleSize").notNull(),
  dataQuality: int("dataQuality").notNull(), // 0-100
  
  source: varchar("source", { length: 256 }).notNull(),
  sourceUrl: text("sourceUrl"),
  
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type MarketData = typeof marketData.$inferSelect;
export type InsertMarketData = typeof marketData.$inferInsert;

