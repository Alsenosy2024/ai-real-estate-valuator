import { generateProfessionalReport } from "./server/professionalReportService";

async function test() {
  try {
    const testData = {
      property: {
        propertyType: "apartment",
        district: "Al Faisaliyah",
        area: 150,
        age: 5,
        finishingQuality: "luxury",
      },
      valuation: {
        estimatedValue: 811200,
        confidenceScore: 0.82,
        valuationMethod: "AI-Enhanced Comparative Market Analysis",
        pricePerSqm: 5408,
        comparables: [
          {
            id: "1",
            propertyType: "apartment",
            district: "Al Faisaliyah",
            area: 145,
            price: 780000,
            pricePerSqm: 5379,
            source: "Aqar.fm",
            sourceUrl: "https://aqar.fm/example",
          },
        ],
        analysisDetails: "Test analysis",
        dataSources: [
          {
            name: "Market Analysis",
            url: "internal",
            date: new Date().toISOString(),
            reliability: 85,
          },
        ],
      },
      reportDate: new Date(),
      reportId: "test-123",
    };

    console.log("Generating report...");
    const pdfBuffer = await generateProfessionalReport(testData);
    console.log("Report generated successfully! Size:", pdfBuffer.length, "bytes");
  } catch (error) {
    console.error("Error generating report:", error);
    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
    }
  }
}

test();

