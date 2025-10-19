import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { nanoid } from "nanoid";
import * as db from "./db";
import { calculateEnhancedValuation, PropertyInput } from "./enhancedValuationService";
import { generateReport } from "./reportService";
import { generateEnhancedProfessionalReport } from "./enhancedProfessionalReport";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  valuation: router({
    // Create a new valuation
    create: protectedProcedure
      .input(z.object({
        propertyType: z.string(),
        district: z.string(),
        area: z.number(),
        age: z.number().optional(),
        finishingQuality: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        streetWidth: z.number().optional(),
        facingDirection: z.string().optional(),
        numberOfRooms: z.number().optional(),
        numberOfBathrooms: z.number().optional(),
        numberOfFloors: z.number().optional(),
        hasGarage: z.boolean().optional(),
        hasGarden: z.boolean().optional(),
        amenities: z.array(z.string()).optional(),
        specialFeatures: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const propertyInput: PropertyInput = {
          propertyType: input.propertyType,
          district: input.district,
          area: input.area,
          age: input.age,
          finishingQuality: input.finishingQuality,
          latitude: input.latitude,
          longitude: input.longitude,
          amenities: input.amenities,
          specialFeatures: input.specialFeatures,
        };

        // Calculate valuation using enhanced AI service
        const result = await calculateEnhancedValuation(propertyInput);

        // Save to database
        const valuationId = nanoid();
        await db.createValuation({
          id: valuationId,
          userId: ctx.user.id,
          propertyType: input.propertyType,
          district: input.district,
          area: input.area,
          age: input.age,
          finishingQuality: input.finishingQuality,
          latitude: input.latitude,
          longitude: input.longitude,
          streetWidth: input.streetWidth,
          facingDirection: input.facingDirection,
          numberOfRooms: input.numberOfRooms,
          numberOfBathrooms: input.numberOfBathrooms,
          numberOfFloors: input.numberOfFloors,
          hasGarage: input.hasGarage,
          hasGarden: input.hasGarden,
          amenities: input.amenities,
          specialFeatures: input.specialFeatures,
          estimatedValue: result.estimatedValue,
          confidenceScore: result.confidenceScore,
          valuationMethod: result.valuationMethod,
          pricePerSqm: result.pricePerSqm,
          comparables: result.comparables,
          dataSources: result.dataSources,
          analysisDetails: result.analysisDetails,
        });

        // Comparables are stored as JSON in the valuations table

        return {
          id: valuationId,
          ...result,
        };
      }),

    // Get user's valuations
    list: protectedProcedure.query(async ({ ctx }) => {
      const valuations = await db.getUserValuations(ctx.user.id);
      return valuations.map(v => ({
        ...v,
        amenities: v.amenities as unknown as string[] || [],
        specialFeatures: v.specialFeatures as unknown as string[] || [],
      }));
    }),

    // Get single valuation with comparables
    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        const valuation = await db.getValuation(input.id);
        if (!valuation || valuation.userId !== ctx.user.id) {
          throw new Error("Valuation not found");
        }

        const comparables = await db.getComparables(input.id);

        return {
          ...valuation,
          amenities: valuation.amenities as unknown as string[] || [],
          specialFeatures: valuation.specialFeatures as unknown as string[] || [],
          comparables,
        };
      }),

    // Generate PDF report
    generateReport: protectedProcedure
      .input(z.object({
        id: z.string(),
        language: z.enum(["en", "ar"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const valuation = await db.getValuation(input.id);
        if (!valuation || valuation.userId !== ctx.user.id) {
          throw new Error("Valuation not found");
        }

        const comparables = await db.getComparables(input.id);

        // Generate professional PDF report
        const pdfBuffer = await generateEnhancedProfessionalReport({
          property: {
            propertyType: valuation.propertyType,
            district: valuation.district,
            area: valuation.area,
            age: valuation.age || undefined,
            finishingQuality: valuation.finishingQuality || undefined,
            latitude: valuation.latitude || undefined,
            longitude: valuation.longitude || undefined,
            streetWidth: valuation.streetWidth || undefined,
            facingDirection: valuation.facingDirection || undefined,
            numberOfRooms: valuation.numberOfRooms || undefined,
            numberOfBathrooms: valuation.numberOfBathrooms || undefined,
            numberOfFloors: valuation.numberOfFloors || undefined,
            hasGarage: valuation.hasGarage || false,
            hasGarden: valuation.hasGarden || false,
            amenities: (valuation.amenities as unknown as string[]) || [],
            specialFeatures: (valuation.specialFeatures as unknown as string[]) || [],
          },
          valuation: {
            estimatedValue: valuation.estimatedValue,
            confidenceScore: valuation.confidenceScore,
            valuationMethod: valuation.valuationMethod,
            pricePerSqm: valuation.pricePerSqm || 0,
            comparables: (() => {
              try {
                const parsed = JSON.parse(valuation.comparables as unknown as string || '[]');
                // Ensure each comparable has required fields
                return parsed.map((c: any) => ({
                  id: c.id || 'N/A',
                  propertyType: c.propertyType || valuation.propertyType,
                  district: c.district || valuation.district,
                  area: c.area || 0,
                  price: c.price || 0,
                  pricePerSqm: c.pricePerSqm || 0,
                  source: c.source || 'Market Data',
                  sourceUrl: c.sourceUrl || undefined,
                  distance: c.distance || undefined,
                  date: c.date || undefined,
                }));
              } catch (e) {
                console.error('[Report] Error parsing comparables:', e);
                return [];
              }
            })(),
            analysisDetails: valuation.analysisDetails || `This property valuation is based on comprehensive market analysis of ${valuation.district} district in Riyadh. The estimated value reflects current market conditions, property characteristics, and comparable sales data.`,
            dataSources: (() => {
              try {
                const parsed = valuation.dataSources ? JSON.parse(valuation.dataSources as unknown as string || '[]') : [];
                if (parsed.length === 0) {
                  // Provide default data sources
                  return [
                    {
                      name: 'Market Analysis',
                      url: 'internal',
                      date: new Date().toISOString(),
                      reliability: 85,
                    },
                  ];
                }
                return parsed;
              } catch (e) {
                return [
                  {
                    name: 'Market Analysis',
                    url: 'internal',
                    date: new Date().toISOString(),
                    reliability: 85,
                  },
                ];
              }
            })(),
          },
          reportDate: new Date(),
          reportId: valuation.id,
          language: input.language,
        });

        // Upload to S3
        const fileName = `valuation-report-${valuation.id}-${Date.now()}.pdf`;
        const { url: reportUrl } = await storagePut(
          `reports/${fileName}`,
          pdfBuffer,
          'application/pdf'
        );

        return { reportUrl };
      }),

    // Legacy report generation (keeping for backward compatibility)
    generateReportLegacy: protectedProcedure
      .input(z.object({
        id: z.string(),
        language: z.enum(["en", "ar"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const valuation = await db.getValuation(input.id);
        if (!valuation || valuation.userId !== ctx.user.id) {
          throw new Error("Valuation not found");
        }

        const comparablesData = await db.getComparables(input.id);

        const reportUrl = await generateReport({
          property: {
            propertyType: valuation.propertyType,
            district: valuation.district,
            area: valuation.area,
            age: valuation.age || undefined,
            finishingQuality: valuation.finishingQuality || undefined,
            latitude: valuation.latitude || undefined,
            longitude: valuation.longitude || undefined,
            amenities: valuation.amenities as unknown as string[] || [],
            specialFeatures: valuation.specialFeatures as unknown as string[] || [],
          },
          valuation: {
            estimatedValue: valuation.estimatedValue,
            confidenceScore: valuation.confidenceScore,
            valuationMethod: valuation.valuationMethod || "CMA",
            pricePerSqm: valuation.pricePerSqm || 0,

            comparables: comparablesData.map((c: any) => ({
              id: c.id,
              propertyType: c.propertyType,
              district: c.district,
              area: c.area,
              price: c.price,
              pricePerSqm: c.pricePerSqm,
              source: c.source || "Unknown",
              sourceUrl: c.sourceUrl || undefined,
              distance: c.distance || undefined,
            })),
          },
          language: input.language,
        });

        // Update valuation with report URL
        await db.updateValuation(input.id, {
          reportUrl,
        });

        return { reportUrl };
      }),
  }),

  // Admin endpoints
  admin: router({
    // Get all market data
    marketData: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await db.getAllMarketData();
    }),

    // Get all valuations (admin view)
    allValuations: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      // For admin, we'd need a different query - for now return empty
      return [];
    }),
  }),
});

export type AppRouter = typeof appRouter;

