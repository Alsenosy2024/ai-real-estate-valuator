import { storagePut } from "./storage";
import { ValuationResult, PropertyInput } from "./valuationService";
import { nanoid } from "nanoid";

interface ReportData {
  property: PropertyInput;
  valuation: ValuationResult;
  language: "en" | "ar";
}

/**
 * Generate a PDF report for property valuation
 * Returns the S3 URL of the generated report
 */
export async function generateReport(data: ReportData): Promise<string> {
  const { property, valuation, language } = data;
  
  // Generate HTML content for the report
  const html = generateReportHTML(property, valuation, language);
  
  // Convert HTML to PDF-ready format (in production, use a proper PDF library)
  // For now, we'll store the HTML and return it
  const reportId = nanoid();
  const fileName = `reports/${reportId}.html`;
  
  // Upload to S3
  const { url } = await storagePut(
    fileName,
    Buffer.from(html, 'utf-8'),
    'text/html'
  );
  
  return url;
}

/**
 * Generate HTML content for the valuation report
 */
function generateReportHTML(
  property: PropertyInput,
  valuation: ValuationResult,
  language: "en" | "ar"
): string {
  const isArabic = language === "ar";
  const dir = isArabic ? "rtl" : "ltr";
  
  const translations = {
    title: isArabic ? "تقرير تقييم العقار" : "Property Valuation Report",
    propertyDetails: isArabic ? "تفاصيل العقار" : "Property Details",
    propertyType: isArabic ? "نوع العقار" : "Property Type",
    district: isArabic ? "الحي" : "District",
    area: isArabic ? "المساحة" : "Area",
    age: isArabic ? "العمر" : "Age",
    finishing: isArabic ? "جودة التشطيب" : "Finishing Quality",
    valuationResults: isArabic ? "نتائج التقييم" : "Valuation Results",
    estimatedValue: isArabic ? "القيمة المقدرة" : "Estimated Value",
    confidenceScore: isArabic ? "مستوى الثقة" : "Confidence Score",
    pricePerSqm: isArabic ? "السعر للمتر المربع" : "Price per Sqm",
    method: isArabic ? "طريقة التقييم" : "Valuation Method",
    comparables: isArabic ? "العقارات المشابهة" : "Comparable Properties",
    source: isArabic ? "المصدر" : "Source",
    price: isArabic ? "السعر" : "Price",
    sqm: isArabic ? "م²" : "sqm",
    sar: isArabic ? "ريال" : "SAR",
    years: isArabic ? "سنوات" : "years",
    dataUpdate: isArabic ? "آخر تحديث للبيانات" : "Last Data Update",
    generatedOn: isArabic ? "تاريخ التقرير" : "Generated On",
  };
  
  const comparablesHTML = valuation.comparables.map((comp, idx) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${idx + 1}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${comp.district}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${comp.area} ${translations.sqm}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${comp.price.toLocaleString()} ${translations.sar}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${comp.pricePerSqm.toLocaleString()} ${translations.sar}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${comp.source}</td>
    </tr>
  `).join('');
  
  return `
<!DOCTYPE html>
<html lang="${language}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${translations.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: ${isArabic ? "'Cairo', sans-serif" : "'Poppins', sans-serif"};
      background: linear-gradient(135deg, #0A1128 0%, #1a2744 100%);
      color: #1f2937;
      padding: 40px 20px;
      min-height: 100vh;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #0A1128 0%, #1a2744 50%, #4FD1C5 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 10px;
    }
    
    .header p {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .content {
      padding: 40px;
    }
    
    .section {
      margin-bottom: 40px;
    }
    
    .section-title {
      font-size: 24px;
      font-weight: 600;
      color: #0A1128;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 3px solid #4FD1C5;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .info-item {
      background: #f9fafb;
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid #4FD1C5;
    }
    
    .info-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    
    .info-value {
      font-size: 18px;
      font-weight: 600;
      color: #0A1128;
    }
    
    .highlight-box {
      background: linear-gradient(135deg, #4FD1C5 0%, #38b2ac 100%);
      color: white;
      padding: 30px;
      border-radius: 16px;
      text-align: center;
      margin: 30px 0;
    }
    
    .highlight-value {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 10px;
    }
    
    .highlight-label {
      font-size: 16px;
      opacity: 0.95;
    }
    
    .confidence-bar {
      background: rgba(255, 255, 255, 0.3);
      height: 8px;
      border-radius: 4px;
      margin-top: 15px;
      overflow: hidden;
    }
    
    .confidence-fill {
      background: white;
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    th {
      background: #0A1128;
      color: white;
      padding: 16px 12px;
      text-align: ${isArabic ? 'right' : 'left'};
      font-weight: 600;
      font-size: 14px;
    }
    
    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    .footer {
      background: #f9fafb;
      padding: 30px 40px;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    
    .footer p {
      margin: 5px 0;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${translations.title}</h1>
      <p>${translations.generatedOn}: ${new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</p>
    </div>
    
    <div class="content">
      <!-- Property Details -->
      <div class="section">
        <h2 class="section-title">${translations.propertyDetails}</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">${translations.propertyType}</div>
            <div class="info-value">${property.propertyType}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${translations.district}</div>
            <div class="info-value">${property.district}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${translations.area}</div>
            <div class="info-value">${property.area} ${translations.sqm}</div>
          </div>
          ${property.age ? `
          <div class="info-item">
            <div class="info-label">${translations.age}</div>
            <div class="info-value">${property.age} ${translations.years}</div>
          </div>
          ` : ''}
          ${property.finishingQuality ? `
          <div class="info-item">
            <div class="info-label">${translations.finishing}</div>
            <div class="info-value">${property.finishingQuality}</div>
          </div>
          ` : ''}
        </div>
      </div>
      
      <!-- Valuation Results -->
      <div class="section">
        <h2 class="section-title">${translations.valuationResults}</h2>
        
        <div class="highlight-box">
          <div class="highlight-value">${valuation.estimatedValue.toLocaleString()} ${translations.sar}</div>
          <div class="highlight-label">${translations.estimatedValue}</div>
          <div class="confidence-bar">
            <div class="confidence-fill" style="width: ${valuation.confidenceScore}%"></div>
          </div>
          <p style="margin-top: 10px; font-size: 14px;">${translations.confidenceScore}: ${valuation.confidenceScore}%</p>
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">${translations.pricePerSqm}</div>
            <div class="info-value">${valuation.pricePerSqm.toLocaleString()} ${translations.sar}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${translations.method}</div>
            <div class="info-value">${valuation.valuationMethod}</div>
          </div>
        </div>
      </div>
      
      <!-- Comparable Properties -->
      <div class="section">
        <h2 class="section-title">${translations.comparables}</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>${translations.district}</th>
              <th>${translations.area}</th>
              <th>${translations.price}</th>
              <th>${translations.pricePerSqm}</th>
              <th>${translations.source}</th>
            </tr>
          </thead>
          <tbody>
            ${comparablesHTML}
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="footer">
      <p>${translations.dataUpdate}: ${new Date().toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}</p>
      <p>AI Real Estate Valuator – Riyadh</p>
      <p>© ${new Date().getFullYear()} All rights reserved</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

