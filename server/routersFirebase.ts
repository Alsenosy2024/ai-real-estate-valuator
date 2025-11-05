import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { nanoid } from "nanoid";
import * as firebaseDb from "./firebaseDb";
import { calculateEnhancedValuation, PropertyInput } from "./enhancedValuationService";
import { generateEnhancedProfessionalReport } from "./enhancedProfessionalReport";
import { uploadToFirebaseStorage } from "./firebaseStorage";

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

        // Save to Firebase
        const valuationId = nanoid();
        await firebaseDb.createValuation({
          id: valuationId,
          userId: ctx.user.id,
          propertyType: input.propertyType,
          district: input.district,
          area: input.area,
          age: input.age || null,
          finishingQuality: input.finishingQuality || null,
          latitude: input.latitude || null,
          longitude: input.longitude || null,
          streetWidth: input.streetWidth || null,
          facingDirection: input.facingDirection || null,
          numberOfRooms: input.numberOfRooms || null,
          numberOfBathrooms: input.numberOfBathrooms || null,
          numberOfFloors: input.numberOfFloors || null,
          hasGarage: input.hasGarage || false,
          hasGarden: input.hasGarden || false,
          amenities: input.amenities || [],
          specialFeatures: input.specialFeatures || [],
          estimatedValue: result.estimatedValue,
          confidenceScore: result.confidenceScore,
          valuationMethod: result.valuationMethod,
          pricePerSqm: result.pricePerSqm,
          comparables: result.comparables,
          dataSources: result.dataSources,
          analysisDetails: result.analysisDetails,
        });

        return {
          id: valuationId,
          ...result,
        };
      }),

    // Get user's valuations
    list: protectedProcedure.query(async ({ ctx }) => {
      const valuations = await firebaseDb.getUserValuations(ctx.user.id);
      return valuations;
    }),

    // Get single valuation with comparables
    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        const valuation = await firebaseDb.getValuation(input.id);
        if (!valuation || valuation.userId !== ctx.user.id) {
          throw new Error("Valuation not found");
        }

        return valuation;
      }),

    // Generate PDF report
    generateReport: protectedProcedure
      .input(z.object({
        id: z.string(),
        language: z.enum(["en", "ar"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const valuation = await firebaseDb.getValuation(input.id);
        if (!valuation || valuation.userId !== ctx.user.id) {
          throw new Error("Valuation not found");
        }

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
            amenities: valuation.amenities || [],
            specialFeatures: valuation.specialFeatures || [],
          },
          valuation: {
            estimatedValue: valuation.estimatedValue,
            confidenceScore: valuation.confidenceScore,
            valuationMethod: valuation.valuationMethod,
            pricePerSqm: valuation.pricePerSqm || 0,
            comparables: valuation.comparables || [],
            analysisDetails: valuation.analysisDetails || `This property valuation is based on comprehensive market analysis of ${valuation.district} district in Riyadh.`,
            dataSources: valuation.dataSources || [],
          },
          reportDate: new Date(),
          reportId: valuation.id,
          language: input.language,
        });

        // Upload to Firebase Storage
        const fileName = `reports/valuation-report-${valuation.id}-${Date.now()}.pdf`;
        const { url: reportUrl } = await uploadToFirebaseStorage(
          fileName,
          pdfBuffer,
          'application/pdf'
        );

        // Update valuation with report URL
        await firebaseDb.updateValuation(input.id, {
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
      return await firebaseDb.getAllMarketData();
    }),

    // Get all valuations (admin view)
    allValuations: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      // Admin can view all valuations - would need to implement this in firebaseDb
      return [];
    }),
  }),
});

export type AppRouter = typeof appRouter;
