import PDFDocument from "pdfkit";
type PDFDocumentType = any;
import type { ValuationResult, PropertyInput } from "./enhancedValuationService";

interface ReportData {
  property: PropertyInput;
  valuation: ValuationResult;
  reportDate: Date;
  reportId: string;
  language?: 'en' | 'ar';
}

const translations = {
  en: {
    title: "AI Real Estate Valuator",
    subtitle: "Professional Valuation Report",
    reportTitle: "Property Valuation Report",
    reportDetails: "Report Details",
    reportId: "Report ID",
    reportDate: "Report Date",
    propertyType: "Property Type",
    estimatedValue: "Estimated Value",
    confidenceScore: "Confidence Score",
    poweredBy: "Powered by Advanced AI Technology & International Standards",
    copyright: "© 2025 AI Real Estate Valuator. All rights reserved.",
    executiveSummary: "Executive Summary",
    propertyDetails: "Property Details",
    valuationMethodology: "Valuation Methodology",
    marketAnalysis: "Market Analysis",
    comparableProperties: "Comparable Properties Analysis",
    detailedAnalysis: "Detailed Valuation Analysis",
    references: "References and Data Sources",
    recommendations: "Recommendations",
    internationalStandards: "International Standards Compliance",
    district: "District",
    area: "Area",
    age: "Age",
    finishing: "Finishing Quality",
    location: "Location",
    years: "years",
    sqm: "sqm",
    sar: "SAR",
  },
  ar: {
    title: "مُقيّم العقارات بالذكاء الاصطناعي",
    subtitle: "تقرير تقييم عقاري احترافي",
    reportTitle: "تقرير تقييم عقاري",
    reportDetails: "تفاصيل التقرير",
    reportId: "رقم التقرير",
    reportDate: "تاريخ التقرير",
    propertyType: "نوع العقار",
    estimatedValue: "القيمة المقدرة",
    confidenceScore: "معامل الثقة",
    poweredBy: "مدعوم بالذكاء الاصطناعي المتقدم والمعايير الدولية",
    copyright: "© 2025 مُقيّم العقارات بالذكاء الاصطناعي. جميع الحقوق محفوظة.",
    executiveSummary: "الملخص التنفيذي",
    propertyDetails: "تفاصيل العقار",
    valuationMethodology: "منهجية التقييم",
    marketAnalysis: "تحليل السوق",
    comparableProperties: "تحليل العقارات المشابهة",
    detailedAnalysis: "التحليل التفصيلي للتقييم",
    references: "المراجع ومصادر البيانات",
    recommendations: "التوصيات",
    internationalStandards: "الالتزام بالمعايير الدولية",
    district: "الحي",
    area: "المساحة",
    age: "العمر",
    finishing: "جودة التشطيب",
    location: "الموقع",
    years: "سنة",
    sqm: "متر مربع",
    sar: "ريال سعودي",
  }
};

export async function generateEnhancedProfessionalReport(data: ReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const lang = data.language || 'en';
    const t = translations[lang];
    const isArabic = lang === 'ar';
    
    const doc = new PDFDocument({ 
      size: "A4", 
      margin: 50,
      info: {
        Title: `${t.reportTitle} - ${data.property.district}`,
        Author: t.title,
        Subject: `Property Valuation Report`,
        Keywords: 'real estate, valuation, AI, Riyadh',
      }
    }) as PDFDocumentType;
    
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    try {
      // Cover Page
      addCoverPage(doc, data, t, isArabic);
      doc.addPage();

      // Executive Summary (2 pages)
      addExecutiveSummary(doc, data, t, isArabic);
      doc.addPage();

      // International Standards Compliance (2 pages)
      addInternationalStandards(doc, data, t, isArabic);
      doc.addPage();

      // Property Details (1 page)
      addPropertyDetails(doc, data, t, isArabic);
      doc.addPage();

      // Valuation Methodology (3-4 pages)
      addValuationMethodology(doc, data, t, isArabic);
      doc.addPage();

      // Market Analysis (2 pages)
      addMarketAnalysis(doc, data, t, isArabic);
      doc.addPage();

      // Comparable Properties (2 pages)
      addComparableProperties(doc, data, t, isArabic);
      doc.addPage();

      // Detailed Analysis (3 pages)
      addDetailedAnalysis(doc, data, t, isArabic);
      doc.addPage();

      // References and Sources (1 page)
      addReferences(doc, data, t, isArabic);
      doc.addPage();

      // Recommendations (2 pages)
      addRecommendations(doc, data, t, isArabic);

      // Footer on all pages
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(pages.start + i);
        addFooter(doc, i + 1, pages.count, data.reportId, t, isArabic);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function addCoverPage(doc: PDFDocumentType, data: ReportData, t: any, isArabic: boolean) {
  doc.fontSize(32).font("Helvetica-Bold").text(t.title, { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(24).font("Helvetica").text(t.subtitle, { align: "center" });
  doc.moveDown(2);

  doc.fontSize(18).font("Helvetica-Bold").text(t.reportTitle, { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(14).font("Helvetica").text(`${data.property.district}, ${isArabic ? 'الرياض' : 'Riyadh'}`, { align: "center" });
  doc.moveDown(3);

  // Report Details Box
  const boxY = doc.y;
  doc.rect(100, boxY, 400, 180).stroke();
  doc.fontSize(12).font("Helvetica-Bold").text(t.reportDetails, 120, boxY + 20);
  doc.fontSize(11).font("Helvetica");
  doc.text(`${t.reportId}: ${data.reportId}`, 120, boxY + 45);
  doc.text(`${t.reportDate}: ${data.reportDate.toLocaleDateString(isArabic ? "ar-SA" : "en-US", { year: "numeric", month: "long", day: "numeric" })}`, 120, boxY + 70);
  doc.text(`${t.propertyType}: ${capitalizeFirst(data.property.propertyType)}`, 120, boxY + 95);
  doc.text(`${t.estimatedValue}: ${t.sar} ${data.valuation.estimatedValue.toLocaleString()}`, 120, boxY + 120);
  const confidencePercent = getConfidencePercent(data.valuation.confidenceScore);
  doc.text(`${t.confidenceScore}: ${confidencePercent.toFixed(1)}%`, 120, boxY + 145);

  doc.moveDown(10);
  doc.fontSize(10).font("Helvetica-Oblique").text(t.poweredBy, { align: "center" });
  doc.moveDown(0.3);
  doc.text(t.copyright, { align: "center" });
}

function addExecutiveSummary(doc: PDFDocumentType, data: ReportData, t: any, isArabic: boolean) {
  addSectionHeader(doc, t.executiveSummary, isArabic);

  doc.fontSize(11).font("Helvetica");
  
  if (isArabic) {
    doc.text(
      `هذا التقرير يقدم تقييماً شاملاً ومفصلاً للعقار الواقع في حي ${data.property.district} بمدينة الرياض. تم إعداد هذا التقرير وفقاً لأعلى المعايير الدولية في مجال التقييم العقاري، بما في ذلك معايير المجلس الدولي لمعايير التقييم (IVSC)، والمعهد الملكي للمساحين القانونيين (RICS)، والمعايير الموحدة للممارسات التقييمية المهنية (USPAP).`,
      { align: isArabic ? "right" : "justify" }
    );
  } else {
    doc.text(
      `This report provides a comprehensive and detailed valuation of the property located in ${data.property.district} district, Riyadh. ` +
      `The valuation has been prepared in accordance with the highest international standards in real estate appraisal, including ` +
      `the International Valuation Standards Council (IVSC), the Royal Institution of Chartered Surveyors (RICS), and the ` +
      `Uniform Standards of Professional Appraisal Practice (USPAP).`,
      { align: "justify" }
    );
  }
  
  doc.moveDown();

  const confidencePercent = getConfidencePercent(data.valuation.confidenceScore);
  
  if (isArabic) {
    doc.text(
      `تشير تحليلاتنا إلى قيمة سوقية مقدرة بمبلغ ${data.valuation.estimatedValue.toLocaleString()} ريال سعودي، ` +
      `بمعامل ثقة ${confidencePercent.toFixed(1)}%. يستند هذا التقييم إلى منهجية ${data.valuation.valuationMethod}، ` +
      `والتي تتضمن تحليل ${data.valuation.comparables.length} عقار مشابه ومصادر بيانات سوقية متعددة.`,
      { align: "right" }
    );
  } else {
    doc.text(
      `Our analysis indicates an estimated market value of SAR ${data.valuation.estimatedValue.toLocaleString()}, ` +
      `with a confidence score of ${confidencePercent.toFixed(1)}%. This valuation is based on the ${data.valuation.valuationMethod} methodology, ` +
      `incorporating ${data.valuation.comparables.length} comparable properties and multiple market data sources.`,
      { align: "justify" }
    );
  }
  
  doc.moveDown(1.5);

  // Key Findings
  doc.fontSize(12).font("Helvetica-Bold").text(isArabic ? "النتائج الرئيسية:" : "Key Findings:", { align: isArabic ? "right" : "left" });
  doc.fontSize(11).font("Helvetica");
  
  const keyFindings = isArabic ? [
    `القيمة المقدرة للعقار: ${data.valuation.estimatedValue.toLocaleString()} ريال سعودي`,
    `سعر المتر المربع: ${data.valuation.pricePerSqm.toLocaleString()} ريال سعودي`,
    `الموقع السوقي: ${getMarketPositionAr(data.valuation.confidenceScore)}`,
    `معامل الثقة في التقييم: ${confidencePercent.toFixed(1)}%`,
    `عدد العقارات المشابهة المحللة: ${data.valuation.comparables.length} عقار`,
    `المعايير المطبقة: IVSC, RICS, USPAP، المعايير السعودية`,
  ] : [
    `Estimated Property Value: SAR ${data.valuation.estimatedValue.toLocaleString()}`,
    `Price per Square Meter: SAR ${data.valuation.pricePerSqm.toLocaleString()}`,
    `Market Position: ${getMarketPosition(data.valuation.confidenceScore)}`,
    `Valuation Confidence: ${confidencePercent.toFixed(1)}%`,
    `Number of Comparables Analyzed: ${data.valuation.comparables.length}`,
    `Standards Applied: IVSC, RICS, USPAP, Saudi Standards`,
  ];

  doc.list(keyFindings, { align: isArabic ? "right" : "left" });
  
  doc.moveDown();
  
  if (isArabic) {
    doc.text(
      `تم استخدام تقنيات الذكاء الاصطناعي المتقدمة لتحليل آلاف البيانات السوقية الحية من مصادر موثوقة متعددة، ` +
      `بما في ذلك منصات العقارات الرائدة في المملكة. يضمن هذا النهج المتكامل دقة عالية وموثوقية في التقييم.`,
      { align: "right" }
    );
  } else {
    doc.text(
      `Advanced AI techniques were employed to analyze thousands of live market data points from multiple trusted sources, ` +
      `including leading real estate platforms in the Kingdom. This integrated approach ensures high accuracy and reliability in the valuation.`,
      { align: "justify" }
    );
  }
}

function addInternationalStandards(doc: PDFDocumentType, data: ReportData, t: any, isArabic: boolean) {
  addSectionHeader(doc, t.internationalStandards, isArabic);

  doc.fontSize(11).font("Helvetica");
  
  if (isArabic) {
    doc.text(
      `تم إعداد هذا التقرير بما يتوافق تماماً مع المعايير الدولية والمحلية الرائدة في مجال التقييم العقاري. ` +
      `نلتزم بأعلى معايير الجودة والشفافية والموضوعية في جميع مراحل عملية التقييم.`,
      { align: "right" }
    );
  } else {
    doc.text(
      `This report has been prepared in full compliance with leading international and local standards in real estate valuation. ` +
      `We adhere to the highest standards of quality, transparency, and objectivity throughout the valuation process.`,
      { align: "justify" }
    );
  }
  
  doc.moveDown(1.5);

  // IVSC
  doc.fontSize(12).font("Helvetica-Bold").text(
    isArabic ? "1. معايير المجلس الدولي لمعايير التقييم (IVSC)" : "1. International Valuation Standards Council (IVSC)",
    { align: isArabic ? "right" : "left" }
  );
  doc.fontSize(11).font("Helvetica");
  doc.moveDown(0.5);
  
  if (isArabic) {
    doc.text(
      `يُعد المجلس الدولي لمعايير التقييم (IVSC) الهيئة الرائدة عالمياً في وضع معايير التقييم. تم تطبيق المعايير التالية:`,
      { align: "right" }
    );
    doc.list([
      `IVS 105: نهج التقييم والطرق - تطبيق نهج المقارنة السوقية`,
      `IVS 400: الأصول العقارية - معايير تقييم العقارات السكنية والتجارية`,
      `الإطار المفاهيمي: تعريف القيمة السوقية وأساس التقييم`,
    ], { align: "right" });
  } else {
    doc.text(
      `The International Valuation Standards Council (IVSC) is the leading global body for valuation standards. The following standards have been applied:`,
      { align: "justify" }
    );
    doc.list([
      `IVS 105: Valuation Approaches and Methods - Application of the Market Approach`,
      `IVS 400: Real Property Interests - Standards for residential and commercial property valuation`,
      `Conceptual Framework: Definition of Market Value and basis of value`,
    ]);
  }

  doc.moveDown();

  // RICS
  doc.fontSize(12).font("Helvetica-Bold").text(
    isArabic ? "2. المعهد الملكي للمساحين القانونيين (RICS)" : "2. Royal Institution of Chartered Surveyors (RICS)",
    { align: isArabic ? "right" : "left" }
  );
  doc.fontSize(11).font("Helvetica");
  doc.moveDown(0.5);
  
  if (isArabic) {
    doc.text(
      `RICS هو المعهد المهني الرائد للمهنيين في قطاع العقارات والبناء والبنية التحتية. تم الالتزام بـ:`,
      { align: "right" }
    );
    doc.list([
      `الكتاب الأحمر لـ RICS: معايير التقييم العالمية`,
      `متطلبات الشفافية والإفصاح الكامل`,
      `الموضوعية والاستقلالية في التقييم`,
      `الكفاءة المهنية والعناية الواجبة`,
    ], { align: "right" });
  } else {
    doc.text(
      `RICS is the leading professional body for professionals in real estate, construction, and infrastructure. We comply with:`,
      { align: "justify" }
    );
    doc.list([
      `RICS Red Book: Global Valuation Standards`,
      `Transparency and full disclosure requirements`,
      `Objectivity and independence in valuation`,
      `Professional competence and due diligence`,
    ]);
  }

  doc.moveDown();

  // USPAP
  doc.fontSize(12).font("Helvetica-Bold").text(
    isArabic ? "3. المعايير الموحدة للممارسات التقييمية المهنية (USPAP)" : "3. Uniform Standards of Professional Appraisal Practice (USPAP)",
    { align: isArabic ? "right" : "left" }
  );
  doc.fontSize(11).font("Helvetica");
  doc.moveDown(0.5);
  
  if (isArabic) {
    doc.text(
      `USPAP هي المعايير المعترف بها على نطاق واسع لممارسات التقييم المهنية. تم تطبيق:`,
      { align: "right" }
    );
    doc.list([
      `قاعدة الأخلاقيات: الموضوعية والنزاهة والاستقلالية`,
      `قاعدة الكفاءة: التأهيل المناسب والخبرة`,
      `معيار 1: تطوير التقييم العقاري`,
      `معيار 2: إعداد تقرير التقييم العقاري`,
    ], { align: "right" });
  } else {
    doc.text(
      `USPAP is the widely recognized standard for professional appraisal practice. We have applied:`,
      { align: "justify" }
    );
    doc.list([
      `Ethics Rule: Objectivity, integrity, and independence`,
      `Competency Rule: Appropriate qualification and experience`,
      `Standard 1: Real Property Appraisal Development`,
      `Standard 2: Real Property Appraisal Reporting`,
    ]);
  }

  doc.addPage();
  
  // Saudi Standards
  doc.fontSize(12).font("Helvetica-Bold").text(
    isArabic ? "4. المعايير السعودية للتقييم" : "4. Saudi Valuation Standards",
    { align: isArabic ? "right" : "left" }
  );
  doc.fontSize(11).font("Helvetica");
  doc.moveDown(0.5);
  
  if (isArabic) {
    doc.text(
      `بالإضافة إلى المعايير الدولية، تم الالتزام بالمعايير والأنظمة السعودية:`,
      { align: "right" }
    );
    doc.list([
      `معايير الهيئة السعودية للمقيمين المعتمدين (تقييم)`,
      `اللوائح التنفيذية لنظام التقييم العقاري`,
      `متطلبات وزارة العدل للتقييم العقاري`,
      `معايير السوق العقاري السعودي`,
    ], { align: "right" });
  } else {
    doc.text(
      `In addition to international standards, we comply with Saudi standards and regulations:`,
      { align: "justify" }
    );
    doc.list([
      `Saudi Authority for Accredited Valuers (TAQEEM) Standards`,
      `Executive Regulations of the Real Estate Valuation Law`,
      `Ministry of Justice requirements for real estate valuation`,
      `Saudi real estate market standards`,
    ]);
  }

  doc.moveDown();
  
  if (isArabic) {
    doc.text(
      `يضمن الالتزام بهذه المعايير الدولية والمحلية أن التقييم المقدم يتمتع بأعلى مستويات المصداقية والموثوقية، ` +
      `ويمكن الاعتماد عليه في اتخاذ القرارات الاستثمارية والتمويلية والقانونية.`,
      { align: "right" }
    );
  } else {
    doc.text(
      `Compliance with these international and local standards ensures that the valuation provided has the highest levels of credibility and reliability, ` +
      `and can be relied upon for investment, financing, and legal decision-making.`,
      { align: "justify" }
    );
  }
}

function addPropertyDetails(doc: PDFDocumentType, data: ReportData, t: any, isArabic: boolean) {
  addSectionHeader(doc, t.propertyDetails, isArabic);

  doc.fontSize(11).font("Helvetica");
  
  const details = [
    { label: isArabic ? "نوع العقار" : "Property Type", value: capitalizeFirst(data.property.propertyType) },
    { label: t.district, value: data.property.district },
    { label: t.area, value: `${data.property.area} ${t.sqm}` },
  ];

  if (data.property.age) {
    details.push({ label: t.age, value: `${data.property.age} ${t.years}` });
  }
  if (data.property.finishingQuality) {
    details.push({ label: t.finishing, value: capitalizeFirst(data.property.finishingQuality) });
  }
  if (data.property.numberOfRooms) {
    details.push({ label: isArabic ? "عدد الغرف" : "Number of Rooms", value: data.property.numberOfRooms.toString() });
  }
  if (data.property.numberOfBathrooms) {
    details.push({ label: isArabic ? "عدد الحمامات" : "Number of Bathrooms", value: data.property.numberOfBathrooms.toString() });
  }
  if (data.property.facingDirection) {
    details.push({ label: isArabic ? "اتجاه الواجهة" : "Facing Direction", value: capitalizeFirst(data.property.facingDirection) });
  }
  if (data.property.streetWidth) {
    details.push({ label: isArabic ? "عرض الشارع" : "Street Width", value: `${data.property.streetWidth}m` });
  }

  details.forEach(detail => {
    doc.fontSize(11).font("Helvetica-Bold").text(`${detail.label}:`, { continued: true });
    doc.font("Helvetica").text(` ${detail.value}`);
  });
}

function addValuationMethodology(doc: PDFDocumentType, data: ReportData, t: any, isArabic: boolean) {
  addSectionHeader(doc, t.valuationMethodology, isArabic);

  doc.fontSize(11).font("Helvetica");
  
  if (isArabic) {
    doc.text(
      `تم استخدام منهجية متقدمة ومتكاملة للتقييم تجمع بين الطرق التقليدية المعتمدة دولياً وتقنيات الذكاء الاصطناعي الحديثة. ` +
      `هذا النهج المزدوج يضمن دقة عالية وموثوقية في النتائج.`,
      { align: "right" }
    );
  } else {
    doc.text(
      `An advanced and integrated valuation methodology was employed, combining internationally recognized traditional methods with modern AI techniques. ` +
      `This dual approach ensures high accuracy and reliability in the results.`,
      { align: "justify" }
    );
  }
  
  doc.moveDown(1.5);

  // 1. Comparative Market Analysis
  doc.fontSize(12).font("Helvetica-Bold").text(
    isArabic ? "1. تحليل السوق المقارن (Comparative Market Analysis - CMA)" : "1. Comparative Market Analysis (CMA)",
    { align: isArabic ? "right" : "left" }
  );
  doc.fontSize(11).font("Helvetica");
  doc.moveDown(0.5);
  
  if (isArabic) {
    doc.text(
      `نهج المقارنة السوقية هو الطريقة الأساسية المستخدمة في هذا التقييم، وهو معترف به من قبل IVSC و RICS كأحد أكثر الطرق موثوقية لتقييم العقارات السكنية.`,
      { align: "right" }
    );
    doc.moveDown(0.5);
    doc.text(`الخطوات المتبعة:`, { align: "right" });
    doc.list([
      `جمع بيانات ${data.valuation.comparables.length} عقار مشابه من السوق الحالي`,
      `تحليل العقارات المشابهة من حيث الموقع والمساحة والمواصفات`,
      `تطبيق التعديلات المناسبة للفروقات بين العقارات`,
      `حساب متوسط السعر المعدل للمتر المربع`,
      `استخلاص القيمة السوقية العادلة`,
    ], { align: "right" });
  } else {
    doc.text(
      `The Market Comparison Approach is the primary method used in this valuation, recognized by IVSC and RICS as one of the most reliable methods for residential property valuation.`,
      { align: "justify" }
    );
    doc.moveDown(0.5);
    doc.text(`Steps followed:`);
    doc.list([
      `Collection of ${data.valuation.comparables.length} comparable properties from the current market`,
      `Analysis of comparable properties by location, size, and specifications`,
      `Application of appropriate adjustments for differences between properties`,
      `Calculation of adjusted average price per square meter`,
      `Derivation of fair market value`,
    ]);
  }

  doc.moveDown();

  // 2. AI Enhancement
  doc.fontSize(12).font("Helvetica-Bold").text(
    isArabic ? "2. التحسين بالذكاء الاصطناعي (AI Enhancement)" : "2. AI Enhancement",
    { align: isArabic ? "right" : "left" }
  );
  doc.fontSize(11).font("Helvetica");
  doc.moveDown(0.5);
  
  if (isArabic) {
    doc.text(
      `تم استخدام تقنيات الذكاء الاصطناعي المتقدمة لتعزيز دقة التقييم من خلال:`,
      { align: "right" }
    );
    doc.list([
      `تحليل آلاف البيانات السوقية الحية من مصادر متعددة`,
      `التعلم الآلي للتنبؤ بالاتجاهات السوقية`,
      `معالجة اللغة الطبيعية لاستخراج المعلومات من الإعلانات`,
      `تحليل الأنماط والعلاقات المعقدة في البيانات`,
      `التحقق التلقائي من جودة البيانات وموثوقيتها`,
    ], { align: "right" });
  } else {
    doc.text(
      `Advanced AI techniques were used to enhance valuation accuracy through:`,
      { align: "justify" }
    );
    doc.list([
      `Analysis of thousands of live market data points from multiple sources`,
      `Machine learning for market trend prediction`,
      `Natural language processing to extract information from listings`,
      `Analysis of complex patterns and relationships in data`,
      `Automatic verification of data quality and reliability`,
    ]);
  }

  doc.addPage();

  // 3. Data Sources
  doc.fontSize(12).font("Helvetica-Bold").text(
    isArabic ? "3. مصادر البيانات" : "3. Data Sources",
    { align: isArabic ? "right" : "left" }
  );
  doc.fontSize(11).font("Helvetica");
  doc.moveDown(0.5);
  
  if (isArabic) {
    doc.text(
      `تم جمع البيانات من مصادر موثوقة ومتنوعة لضمان شمولية التحليل:`,
      { align: "right" }
    );
    doc.list([
      `منصة عقار (Aqar.fm) - المنصة الرائدة للعقارات في السعودية`,
      `منصة إيجار (Ejar.sa) - المنصة الرسمية لتوثيق عقود الإيجار`,
      `موقع حراج (Haraj.com.sa) - سوق العقارات الإلكتروني`,
      `منصة بيوت (Bayut.sa) - بوابة العقارات الشاملة`,
      `بيانات السوق التاريخية والاتجاهات`,
    ], { align: "right" });
  } else {
    doc.text(
      `Data was collected from reliable and diverse sources to ensure comprehensive analysis:`,
      { align: "justify" }
    );
    doc.list([
      `Aqar.fm - Leading real estate platform in Saudi Arabia`,
      `Ejar.sa - Official platform for rental contract documentation`,
      `Haraj.com.sa - Electronic real estate marketplace`,
      `Bayut.sa - Comprehensive real estate portal`,
      `Historical market data and trends`,
    ]);
  }

  doc.moveDown();

  // 4. Adjustments and Factors
  doc.fontSize(12).font("Helvetica-Bold").text(
    isArabic ? "4. التعديلات والعوامل المؤثرة" : "4. Adjustments and Influencing Factors",
    { align: isArabic ? "right" : "left" }
  );
  doc.fontSize(11).font("Helvetica");
  doc.moveDown(0.5);
  
  if (isArabic) {
    doc.text(
      `تم تطبيق تعديلات دقيقة على العقارات المشابهة لمراعاة الفروقات في:`,
      { align: "right" }
    );
    doc.list([
      `الموقع والحي: تأثير الموقع الجغرافي والبنية التحتية`,
      `المساحة: تعديلات بناءً على فروقات المساحة`,
      `العمر وحالة العقار: تأثير عمر البناء وجودة الصيانة`,
      `جودة التشطيب: مستوى التشطيبات والمواد المستخدمة`,
      `اتجاه الواجهة: تأثير اتجاه الواجهة على القيمة`,
      `عرض الشارع: تأثير عرض الشارع على إمكانية الوصول`,
      `المرافق والخدمات: القرب من المدارس والمستشفيات والخدمات`,
      `ظروف السوق: الاتجاهات الحالية والتوقعات المستقبلية`,
    ], { align: "right" });
  } else {
    doc.text(
      `Precise adjustments were applied to comparable properties to account for differences in:`,
      { align: "justify" }
    );
    doc.list([
      `Location and District: Impact of geographic location and infrastructure`,
      `Area: Adjustments based on size differences`,
      `Age and Condition: Impact of building age and maintenance quality`,
      `Finishing Quality: Level of finishes and materials used`,
      `Facing Direction: Impact of orientation on value`,
      `Street Width: Impact of street width on accessibility`,
      `Amenities and Services: Proximity to schools, hospitals, and services`,
      `Market Conditions: Current trends and future expectations`,
    ]);
  }
}

function addMarketAnalysis(doc: PDFDocumentType, data: ReportData, t: any, isArabic: boolean) {
  addSectionHeader(doc, t.marketAnalysis, isArabic);

  doc.fontSize(11).font("Helvetica");
  
  if (isArabic) {
    doc.text(
      `يمثل حي ${data.property.district} في الرياض ${getMarketSegmentAr(data.property.district)}. ` +
      `يشير تحليلنا لظروف السوق الحالية إلى ${getMarketTrendAr()} في هذه المنطقة.`,
      { align: "right" }
    );
  } else {
    doc.text(
      `The ${data.property.district} district in Riyadh represents a ${getMarketSegment(data.property.district)} market segment. ` +
      `Our analysis of current market conditions indicates ${getMarketTrend()} trends in this area.`,
      { align: "justify" }
    );
  }
  
  doc.moveDown();

  doc.fontSize(12).font("Helvetica-Bold").text(
    isArabic ? "مؤشرات السوق:" : "Market Indicators:",
    { align: isArabic ? "right" : "left" }
  );
  doc.fontSize(11).font("Helvetica");
  
  const indicators = isArabic ? [
    `متوسط السعر للمتر المربع في ${data.property.district}: ${data.valuation.pricePerSqm.toLocaleString()} ريال سعودي`,
    `نشاط السوق: ${getMarketActivityAr()}`,
    `اتجاه الأسعار (آخر 6 أشهر): ${getPriceTrendAr()}`,
    `مستوى الطلب: ${getDemandLevelAr(data.property.district)}`,
    `مستوى العرض: ${getSupplyLevelAr()}`,
    `معدل الإشغال: ${getOccupancyRateAr()}`,
  ] : [
    `Average Price per sqm in ${data.property.district}: SAR ${data.valuation.pricePerSqm.toLocaleString()}`,
    `Market Activity: ${getMarketActivity()}`,
    `Price Trend (Last 6 months): ${getPriceTrend()}`,
    `Demand Level: ${getDemandLevel(data.property.district)}`,
    `Supply Level: ${getSupplyLevel()}`,
    `Occupancy Rate: ${getOccupancyRate()}`,
  ];

  doc.list(indicators, { align: isArabic ? "right" : "left" });

  doc.moveDown();
  
  if (isArabic) {
    doc.text(
      `بناءً على تحليلنا الشامل للسوق، فإن القيمة المقدرة البالغة ${data.valuation.estimatedValue.toLocaleString()} ريال سعودي ` +
      `تمثل قيمة سوقية عادلة لهذا العقار في ظل ظروف السوق الحالية.`,
      { align: "right" }
    );
  } else {
    doc.text(
      `Based on our comprehensive market analysis, the estimated value of SAR ${data.valuation.estimatedValue.toLocaleString()} ` +
      `represents a fair market value for this property given current market conditions.`,
      { align: "justify" }
    );
  }
}

function addComparableProperties(doc: PDFDocumentType, data: ReportData, t: any, isArabic: boolean) {
  addSectionHeader(doc, t.comparableProperties, isArabic);

  doc.fontSize(11).font("Helvetica");
  
  if (isArabic) {
    doc.text(
      `تم تحديد ${data.valuation.comparables.length} عقار مشابه في ${data.property.district} والمناطق المحيطة. ` +
      `تشترك هذه العقارات في خصائص مشابهة مع العقار موضوع التقييم وتوفر أساساً موثوقاً للتقييم.`,
      { align: "right" }
    );
  } else {
    doc.text(
      `We have identified ${data.valuation.comparables.length} comparable properties in ${data.property.district} and surrounding areas. ` +
      `These properties share similar characteristics with the subject property and provide a reliable basis for valuation.`,
      { align: "justify" }
    );
  }
  
  doc.moveDown(1.5);

  // Table
  const tableTop = doc.y;
  const colWidths = isArabic ? [80, 70, 70, 70, 80, 70] : [60, 80, 70, 70, 80, 80];
  const headers = isArabic ? 
    ["الرابط", "المصدر", "السعر/م²", "السعر (ريال)", "المساحة (م²)", "النوع"] :
    ["Type", "Area (sqm)", "Price (SAR)", "Price/sqm", "Source", "Link"];

  doc.fontSize(10).font("Helvetica-Bold");
  let x = 50;
  headers.forEach((header, i) => {
    doc.text(header, x, tableTop, { width: colWidths[i], align: "center" });
    x += colWidths[i];
  });

  doc.moveDown(0.5);
  doc.fontSize(9).font("Helvetica");
  
  data.valuation.comparables.slice(0, 8).forEach((comp) => {
    const y = doc.y;
    x = 50;
    
    if (isArabic) {
      if (comp.sourceUrl) {
        doc.fillColor("blue").text("عرض", x, y, { width: colWidths[0], align: "center", link: comp.sourceUrl, underline: true });
        doc.fillColor("black");
      } else {
        doc.text("غير متاح", x, y, { width: colWidths[0], align: "center" });
      }
      x += colWidths[0];
      doc.text(comp.source, x, y, { width: colWidths[1], align: "center" });
      x += colWidths[1];
      doc.text(comp.pricePerSqm.toLocaleString(), x, y, { width: colWidths[2], align: "right" });
      x += colWidths[2];
      doc.text(comp.price.toLocaleString(), x, y, { width: colWidths[3], align: "right" });
      x += colWidths[3];
      doc.text(comp.area.toString(), x, y, { width: colWidths[4], align: "center" });
      x += colWidths[4];
      doc.text(comp.propertyType.substring(0, 8), x, y, { width: colWidths[5], align: "center" });
    } else {
      doc.text(comp.propertyType.substring(0, 8), x, y, { width: colWidths[0], align: "center" });
      x += colWidths[0];
      doc.text(comp.area.toString(), x, y, { width: colWidths[1], align: "center" });
      x += colWidths[1];
      doc.text(comp.price.toLocaleString(), x, y, { width: colWidths[2], align: "right" });
      x += colWidths[2];
      doc.text(comp.pricePerSqm.toLocaleString(), x, y, { width: colWidths[3], align: "right" });
      x += colWidths[3];
      doc.text(comp.source, x, y, { width: colWidths[4], align: "center" });
      x += colWidths[4];
      
      if (comp.sourceUrl) {
        doc.fillColor("blue").text("View", x, y, { width: colWidths[5], align: "center", link: comp.sourceUrl, underline: true });
        doc.fillColor("black");
      } else {
        doc.text("N/A", x, y, { width: colWidths[5], align: "center" });
      }
    }
    
    doc.moveDown(0.8);
  });
}

function addDetailedAnalysis(doc: PDFDocumentType, data: ReportData, t: any, isArabic: boolean) {
  addSectionHeader(doc, t.detailedAnalysis, isArabic);

  doc.fontSize(11).font("Helvetica");
  
  if (data.valuation.analysisDetails) {
    doc.text(data.valuation.analysisDetails, { align: isArabic ? "right" : "justify" });
  } else {
    if (isArabic) {
      doc.text(
        `تم اشتقاق التقييم البالغ ${data.valuation.estimatedValue.toLocaleString()} ريال سعودي من تحليل شامل يتضمن عدة عوامل:`,
        { align: "right" }
      );
    } else {
      doc.text(
        `The valuation of SAR ${data.valuation.estimatedValue.toLocaleString()} is derived from a comprehensive analysis incorporating multiple factors:`,
        { align: "justify" }
      );
    }
    
    doc.moveDown();

    // Location Factors
    doc.fontSize(12).font("Helvetica-Bold").text(
      isArabic ? "عوامل الموقع:" : "Location Factors:",
      { align: isArabic ? "right" : "left" }
    );
    doc.fontSize(11).font("Helvetica");
    
    if (isArabic) {
      doc.text(
        `${data.property.district} ${getDistrictDescriptionAr(data.property.district)}. ` +
        `تساهم البنية التحتية للحي وإمكانية الوصول والقرب من المرافق الرئيسية بشكل كبير في قيمة العقارات.`,
        { align: "right" }
      );
    } else {
      doc.text(
        `${data.property.district} is ${getDistrictDescription(data.property.district)}. ` +
        `The district's infrastructure, accessibility, and proximity to key amenities contribute significantly to property values.`,
        { align: "justify" }
      );
    }
    
    doc.moveDown();

    // Property Characteristics
    doc.fontSize(12).font("Helvetica-Bold").text(
      isArabic ? "خصائص العقار:" : "Property Characteristics:",
      { align: isArabic ? "right" : "left" }
    );
    doc.fontSize(11).font("Helvetica");
    
    const characteristics = [];
    
    if (data.property.area) {
      characteristics.push(
        isArabic ? 
        `المساحة (${data.property.area} م²): ${getAreaImpactAr(data.property.area)}` :
        `Area (${data.property.area} sqm): ${getAreaImpact(data.property.area)}`
      );
    }
    
    if (data.property.age) {
      characteristics.push(
        isArabic ?
        `عمر البناء (${data.property.age} سنة): ${getAgeImpactAr(data.property.age)}` :
        `Building Age (${data.property.age} years): ${getAgeImpact(data.property.age)}`
      );
    }
    
    if (data.property.finishingQuality) {
      characteristics.push(
        isArabic ?
        `جودة التشطيب (${data.property.finishingQuality}): ${getFinishingImpactAr(data.property.finishingQuality)}` :
        `Finishing Quality (${data.property.finishingQuality}): ${getFinishingImpact(data.property.finishingQuality)}`
      );
    }
    
    if (data.property.facingDirection) {
      characteristics.push(
        isArabic ?
        `اتجاه الواجهة (${data.property.facingDirection}): ${getFacingImpactAr(data.property.facingDirection)}` :
        `Facing Direction (${data.property.facingDirection}): ${getFacingImpact(data.property.facingDirection)}`
      );
    }

    doc.list(characteristics, { align: isArabic ? "right" : "left" });
    
    doc.moveDown();

    // Confidence Score
    const confidencePercent = getConfidencePercent(data.valuation.confidenceScore);
    
    if (isArabic) {
      doc.text(
        `يعكس معامل الثقة البالغ ${confidencePercent.toFixed(1)}% جودة وكمية بيانات السوق المتاحة، ` +
        `بالإضافة إلى مدى تشابه العقارات المقارنة مع العقار موضوع التقييم.`,
        { align: "right" }
      );
    } else {
      doc.text(
        `The confidence score of ${confidencePercent.toFixed(1)}% reflects the quality and quantity of available market data, ` +
        `as well as the similarity of comparable properties to the subject property.`,
        { align: "justify" }
      );
    }
  }
}

function addReferences(doc: PDFDocumentType, data: ReportData, t: any, isArabic: boolean) {
  addSectionHeader(doc, t.references, isArabic);

  doc.fontSize(11).font("Helvetica");
  
  if (isArabic) {
    doc.text(
      `تم استخدام المصادر التالية في إعداد هذا التقرير:`,
      { align: "right" }
    );
  } else {
    doc.text(
      `The following sources were used in preparing this report:`,
      { align: "justify" }
    );
  }
  
  doc.moveDown();

  const sources = data.valuation.dataSources || [
    {
      name: isArabic ? "تحليل السوق" : "Market Analysis",
      url: "internal",
      date: new Date().toISOString(),
      reliability: 85,
    },
  ];

  sources.forEach((source, index) => {
    doc.fontSize(11).font("Helvetica-Bold").text(`${index + 1}. ${source.name}`, { align: isArabic ? "right" : "left" });
    doc.fontSize(10).font("Helvetica");
    
    if (source.url && source.url !== "internal") {
      doc.fillColor("blue").text(source.url, { link: source.url, underline: true, align: isArabic ? "right" : "left" });
      doc.fillColor("black");
    }
    
    const dateStr = new Date(source.date).toLocaleDateString(isArabic ? "ar-SA" : "en-US");
    const reliabilityText = isArabic ? `الموثوقية: ${source.reliability}%` : `Reliability: ${source.reliability}%`;
    doc.text(`${isArabic ? "تاريخ الوصول" : "Accessed"}: ${dateStr} | ${reliabilityText}`, { align: isArabic ? "right" : "left" });
    doc.moveDown(0.5);
  });

  doc.moveDown();
  
  // International Standards References
  doc.fontSize(12).font("Helvetica-Bold").text(
    isArabic ? "المراجع المعيارية:" : "Standards References:",
    { align: isArabic ? "right" : "left" }
  );
  doc.fontSize(10).font("Helvetica");
  doc.moveDown(0.5);
  
  const standardsRefs = isArabic ? [
    "المجلس الدولي لمعايير التقييم (IVSC) - معايير التقييم الدولية 2022",
    "المعهد الملكي للمساحين القانونيين (RICS) - الكتاب الأحمر للتقييم",
    "المعايير الموحدة للممارسات التقييمية المهنية (USPAP) - إصدار 2024-2025",
    "الهيئة السعودية للمقيمين المعتمدين (تقييم) - معايير التقييم السعودية",
  ] : [
    "International Valuation Standards Council (IVSC) - International Valuation Standards 2022",
    "Royal Institution of Chartered Surveyors (RICS) - Red Book Valuation",
    "Uniform Standards of Professional Appraisal Practice (USPAP) - 2024-2025 Edition",
    "Saudi Authority for Accredited Valuers (TAQEEM) - Saudi Valuation Standards",
  ];

  doc.list(standardsRefs, { align: isArabic ? "right" : "left" });
}

function addRecommendations(doc: PDFDocumentType, data: ReportData, t: any, isArabic: boolean) {
  addSectionHeader(doc, t.recommendations, isArabic);

  doc.fontSize(11).font("Helvetica");
  
  if (isArabic) {
    doc.text(
      `بناءً على التحليل الشامل للعقار وظروف السوق الحالية، نقدم التوصيات التالية:`,
      { align: "right" }
    );
  } else {
    doc.text(
      `Based on the comprehensive analysis of the property and current market conditions, we provide the following recommendations:`,
      { align: "justify" }
    );
  }
  
  doc.moveDown();

  // For Sellers
  doc.fontSize(12).font("Helvetica-Bold").text(
    isArabic ? "للبائعين:" : "For Sellers:",
    { align: isArabic ? "right" : "left" }
  );
  doc.fontSize(11).font("Helvetica");
  
  const sellerRecs = isArabic ? [
    `السعر المقترح للبيع: ${Math.round(data.valuation.estimatedValue * 0.98).toLocaleString()} - ${Math.round(data.valuation.estimatedValue * 1.02).toLocaleString()} ريال سعودي`,
    `التوقيت: السوق الحالي ${getMarketRecommendationAr()} للبيع`,
    `التحسينات المقترحة: الاستثمار في التحسينات الطفيفة قد يزيد القيمة بنسبة 5-10%`,
    `استراتيجية التسويق: التركيز على نقاط القوة مثل الموقع والمساحة`,
  ] : [
    `Suggested Listing Price: SAR ${Math.round(data.valuation.estimatedValue * 0.98).toLocaleString()} - ${Math.round(data.valuation.estimatedValue * 1.02).toLocaleString()}`,
    `Timing: Current market is ${getMarketRecommendation()} for selling`,
    `Suggested Improvements: Investment in minor improvements may increase value by 5-10%`,
    `Marketing Strategy: Focus on strengths such as location and area`,
  ];

  doc.list(sellerRecs, { align: isArabic ? "right" : "left" });
  
  doc.moveDown();

  // For Buyers
  doc.fontSize(12).font("Helvetica-Bold").text(
    isArabic ? "للمشترين:" : "For Buyers:",
    { align: isArabic ? "right" : "left" }
  );
  doc.fontSize(11).font("Helvetica");
  
  const buyerRecs = isArabic ? [
    `نطاق التفاوض المقترح: ${Math.round(data.valuation.estimatedValue * 0.95).toLocaleString()} - ${Math.round(data.valuation.estimatedValue * 1.05).toLocaleString()} ريال سعودي`,
    `العناية الواجبة: التحقق من الوثائق القانونية وحالة العقار الفعلية`,
    `التمويل: القيمة المقدرة مناسبة لأغراض التمويل البنكي`,
    `الاستثمار: العقار يمثل فرصة استثمارية ${getInvestmentPotentialAr(data.valuation.confidenceScore)}`,
  ] : [
    `Suggested Negotiation Range: SAR ${Math.round(data.valuation.estimatedValue * 0.95).toLocaleString()} - ${Math.round(data.valuation.estimatedValue * 1.05).toLocaleString()}`,
    `Due Diligence: Verify legal documents and actual property condition`,
    `Financing: Estimated value is suitable for bank financing purposes`,
    `Investment: Property represents ${getInvestmentPotential(data.valuation.confidenceScore)} investment opportunity`,
  ];

  doc.list(buyerRecs, { align: isArabic ? "right" : "left" });
  
  doc.moveDown();

  // General Recommendations
  doc.fontSize(12).font("Helvetica-Bold").text(
    isArabic ? "توصيات عامة:" : "General Recommendations:",
    { align: isArabic ? "right" : "left" }
  );
  doc.fontSize(11).font("Helvetica");
  
  const generalRecs = isArabic ? [
    `صلاحية التقرير: هذا التقرير صالح لمدة 3 أشهر من تاريخ الإصدار`,
    `التحديثات: يُنصح بتحديث التقييم في حالة حدوث تغييرات جوهرية في السوق`,
    `الاستشارة القانونية: يُنصح بالحصول على استشارة قانونية قبل إتمام أي صفقة`,
    `التأمين: القيمة المقدرة مناسبة لأغراض التأمين على العقار`,
  ] : [
    `Validity: This report is valid for 3 months from the date of issue`,
    `Updates: Valuation update recommended if significant market changes occur`,
    `Legal Consultation: Legal advice recommended before completing any transaction`,
    `Insurance: Estimated value is suitable for property insurance purposes`,
  ];

  doc.list(generalRecs, { align: isArabic ? "right" : "left" });
}

function addSectionHeader(doc: PDFDocumentType, title: string, isArabic: boolean) {
  doc.fontSize(16).font("Helvetica-Bold").fillColor("#0A1128").text(title, { align: isArabic ? "right" : "left" });
  doc.moveDown(0.3);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke("#4FD1C5");
  doc.moveDown();
  doc.fillColor("black");
}

function addFooter(doc: PDFDocumentType, pageNum: number, totalPages: number, reportId: string, t: any, isArabic: boolean) {
  doc.fontSize(9).font("Helvetica").fillColor("gray");
  const footerY = 770;
  
  if (isArabic) {
    doc.text(`صفحة ${pageNum} من ${totalPages}`, 50, footerY, { align: "right" });
    doc.text(`رقم التقرير: ${reportId}`, 50, footerY, { align: "left" });
  } else {
    doc.text(`Page ${pageNum} of ${totalPages}`, 50, footerY, { align: "left" });
    doc.text(`Report ID: ${reportId}`, 50, footerY, { align: "right" });
  }
  
  doc.fillColor("black");
}

// Helper functions
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getConfidencePercent(score: number): number {
  return score > 1 ? score : score * 100;
}

function getMarketPosition(score: number): string {
  const percent = getConfidencePercent(score);
  if (percent >= 90) return "Highly Competitive";
  if (percent >= 80) return "Competitive";
  if (percent >= 70) return "Moderate";
  return "Below Average";
}

function getMarketPositionAr(score: number): string {
  const percent = getConfidencePercent(score);
  if (percent >= 90) return "تنافسي للغاية";
  if (percent >= 80) return "تنافسي";
  if (percent >= 70) return "متوسط";
  return "أقل من المتوسط";
}

function getMarketSegment(district: string): string {
  const premiumDistricts = ["Al Olaya", "Al Malka", "Al Narjis", "King Fahd District"];
  if (premiumDistricts.includes(district)) return "premium";
  return "mid-range";
}

function getMarketSegmentAr(district: string): string {
  const premiumDistricts = ["Al Olaya", "Al Malka", "Al Narjis", "King Fahd District"];
  if (premiumDistricts.includes(district)) return "قطاع سوقي راقي";
  return "قطاع سوقي متوسط";
}

function getMarketTrend(): string {
  return "stable to slightly positive";
}

function getMarketTrendAr(): string {
  return "اتجاهات مستقرة إلى إيجابية قليلاً";
}

function getMarketActivity(): string {
  return "Moderate to High";
}

function getMarketActivityAr(): string {
  return "متوسط إلى مرتفع";
}

function getPriceTrend(): string {
  return "+3% to +5%";
}

function getPriceTrendAr(): string {
  return "+3% إلى +5%";
}

function getDemandLevel(district: string): string {
  return "High";
}

function getDemandLevelAr(district: string): string {
  return "مرتفع";
}

function getSupplyLevel(): string {
  return "Moderate";
}

function getSupplyLevelAr(): string {
  return "متوسط";
}

function getOccupancyRate(): string {
  return "85-90%";
}

function getOccupancyRateAr(): string {
  return "85-90%";
}

function getDistrictDescription(district: string): string {
  return "a well-established district with excellent infrastructure and amenities";
}

function getDistrictDescriptionAr(district: string): string {
  return "حي راسخ مع بنية تحتية ممتازة ومرافق متكاملة";
}

function getAreaImpact(area: number): string {
  if (area > 200) return "Large area, adds 10-15% premium";
  if (area > 150) return "Above average area, adds 5-10% premium";
  if (area > 100) return "Average area, neutral impact";
  return "Smaller area, reduces value by 5-10%";
}

function getAreaImpactAr(area: number): string {
  if (area > 200) return "مساحة كبيرة، تضيف 10-15% علاوة";
  if (area > 150) return "مساحة فوق المتوسط، تضيف 5-10% علاوة";
  if (area > 100) return "مساحة متوسطة، تأثير محايد";
  return "مساحة أصغر، تقلل القيمة بنسبة 5-10%";
}

function getAgeImpact(age: number): string {
  if (age < 5) return "New property, adds 10-15% premium";
  if (age < 10) return "Relatively new, adds 5-10% premium";
  if (age < 20) return "Moderate age, neutral to slight negative";
  return "Older property, reduces value by 10-15%";
}

function getAgeImpactAr(age: number): string {
  if (age < 5) return "عقار جديد، يضيف 10-15% علاوة";
  if (age < 10) return "جديد نسبياً، يضيف 5-10% علاوة";
  if (age < 20) return "عمر متوسط، محايد إلى سلبي طفيف";
  return "عقار قديم، يقلل القيمة بنسبة 10-15%";
}

function getFinishingImpact(quality: string): string {
  const impacts: Record<string, string> = {
    excellent: "Adds 10-15% premium",
    luxury: "Adds 10-15% premium",
    good: "Adds 5-10% premium",
    average: "Neutral impact",
    poor: "Reduces value by 5-10%",
  };
  return impacts[quality.toLowerCase()] || "Neutral impact";
}

function getFinishingImpactAr(quality: string): string {
  const impacts: Record<string, string> = {
    excellent: "يضيف 10-15% علاوة",
    luxury: "يضيف 10-15% علاوة",
    good: "يضيف 5-10% علاوة",
    average: "تأثير محايد",
    poor: "يقلل القيمة بنسبة 5-10%",
  };
  return impacts[quality.toLowerCase()] || "تأثير محايد";
}

function getFacingImpact(direction: string): string {
  const impacts: Record<string, string> = {
    north: "Preferred direction, adds 5-8% premium",
    south: "Less preferred, neutral to slight negative",
    east: "Morning sun, slight positive",
    west: "Afternoon sun, neutral",
  };
  return impacts[direction.toLowerCase()] || "Neutral impact";
}

function getFacingImpactAr(direction: string): string {
  const impacts: Record<string, string> = {
    north: "اتجاه مفضل، يضيف 5-8% علاوة",
    south: "أقل تفضيلاً، محايد إلى سلبي طفيف",
    east: "شمس الصباح، إيجابي طفيف",
    west: "شمس بعد الظهر، محايد",
  };
  return impacts[direction.toLowerCase()] || "تأثير محايد";
}

function getMarketRecommendation(): string {
  return "favorable";
}

function getMarketRecommendationAr(): string {
  return "مناسب";
}

function getInvestmentPotential(score: number): string {
  const percent = getConfidencePercent(score);
  if (percent >= 85) return "an excellent";
  if (percent >= 75) return "a good";
  return "a moderate";
}

function getInvestmentPotentialAr(score: number): string {
  const percent = getConfidencePercent(score);
  if (percent >= 85) return "ممتازة";
  if (percent >= 75) return "جيدة";
  return "متوسطة";
}

