import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    appTitle: "AI Real Estate Valuator",
    appSubtitle: "Riyadh Property Valuation Platform",
    switchLanguage: "العربية",
    
    // Home page
    heroTitle: "Intelligent Property Valuation",
    heroSubtitle: "Get instant, AI-powered property valuations for Riyadh real estate market",
    getStarted: "Get Started",
    learnMore: "Learn More",
    
    // Features
    features: "Features",
    aiPowered: "AI-Powered Analysis",
    aiPoweredDesc: "Advanced machine learning models trained on Riyadh market data",
    liveData: "Live Market Data",
    liveDataDesc: "Real-time data from verified Saudi real estate portals",
    instantReports: "Instant Reports",
    instantReportsDesc: "Generate professional PDF reports in seconds",
    bilingual: "Bilingual Support",
    bilingualDesc: "Full support for Arabic and English languages",
    
    // Valuation form
    newValuation: "New Valuation",
    propertyDetails: "Property Details",
    propertyType: "Property Type",
    selectPropertyType: "Select property type",
    apartment: "Apartment",
    villa: "Villa",
    land: "Land",
    commercial: "Commercial",
    duplex: "Duplex",
    penthouse: "Penthouse",
    studio: "Studio",
    district: "District",
    selectDistrict: "Select district",
    areaType: "Area Type",
    selectAreaType: "Select area type",
    builtUpArea: "Built-up Area (sqm)",
    landArea: "Land Area (sqm)",
    area: "Area (sqm)",
    enterArea: "Enter area in square meters",
    age: "Age (years)",
    enterAge: "Enter property age",
    finishingQuality: "Finishing Quality",
    selectFinishing: "Select finishing quality",
    excellent: "Excellent",
    good: "Good",
    average: "Average",
    poor: "Poor",
    amenities: "Amenities",
    selectAmenities: "Select amenities",
    parking: "Parking",
    pool: "Swimming Pool",
    gym: "Gym",
    garden: "Garden",
    elevator: "Elevator",
    security: "Security",
    centralAC: "Central AC",
    maidRoom: "Maid Room",
    specialFeatures: "Special Features",
    enterFeatures: "Enter special features (optional)",
    location: "Location",
    selectOnMap: "Select on Map",
    hideMap: "Hide Map",
    latitude: "Latitude",
    longitude: "Longitude",
    streetWidth: "Street Width (meters)",
    enterStreetWidth: "Enter street width",
    facingDirection: "Facing Direction",
    selectDirection: "Select direction",
    north: "North",
    south: "South",
    east: "East",
    west: "West",
    northeast: "Northeast",
    northwest: "Northwest",
    southeast: "Southeast",
    southwest: "Southwest",
    numberOfRooms: "Number of Rooms",
    numberOfBathrooms: "Number of Bathrooms",
    numberOfFloors: "Number of Floors",
    hasGarage: "Has Garage",
    hasGarden: "Has Garden",
    calculateValuation: "Calculate Valuation",
    calculating: "Calculating...",
    calculatingValuation: "Calculating Valuation",
    
    // Results
    valuationResults: "Valuation Results",
    estimatedValue: "Estimated Value",
    confidenceScore: "Confidence Score",
    pricePerSqm: "Price per Sqm",
    valuationMethod: "Valuation Method",
    comparableProperties: "Comparable Properties",
    generateReport: "Generate Report",
    generatingReport: "Generating...",
    downloadReport: "Download Report",
    viewReport: "View Report",
    
    // History
    myValuations: "My Valuations",
    noValuations: "No valuations yet",
    noValuationsDesc: "Start by creating your first property valuation",
    viewDetails: "View Details",
    
    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    back: "Back",
    next: "Next",
    sar: "SAR",
    sqm: "sqm",
    
    // Auth
    login: "Login",
    logout: "Logout",
    profile: "Profile",
    
    // Districts
    alMalaz: "Al Malaz",
    alOlaya: "Al Olaya",
    alNakheel: "Al Nakheel",
    alYasmin: "Al Yasmin",
    kingFahd: "King Fahd",
    alMuruj: "Al Muruj",
  },
  ar: {
    // Header
    appTitle: "مُقيّم العقارات الذكي",
    appSubtitle: "منصة تقييم العقارات في الرياض",
    switchLanguage: "English",
    
    // Home page
    heroTitle: "تقييم عقاري ذكي",
    heroSubtitle: "احصل على تقييم فوري للعقارات مدعوم بالذكاء الاصطناعي لسوق الرياض العقاري",
    getStarted: "ابدأ الآن",
    learnMore: "اعرف المزيد",
    
    // Features
    features: "المميزات",
    aiPowered: "تحليل بالذكاء الاصطناعي",
    aiPoweredDesc: "نماذج تعلم آلي متقدمة مدربة على بيانات سوق الرياض",
    liveData: "بيانات السوق المباشرة",
    liveDataDesc: "بيانات فورية من بوابات العقارات السعودية الموثوقة",
    instantReports: "تقارير فورية",
    instantReportsDesc: "إنشاء تقارير PDF احترافية في ثوانٍ",
    bilingual: "دعم ثنائي اللغة",
    bilingualDesc: "دعم كامل للغتين العربية والإنجليزية",
    
    // Valuation form
    newValuation: "تقييم جديد",
    propertyDetails: "تفاصيل العقار",
    propertyType: "نوع العقار",
    selectPropertyType: "اختر نوع العقار",
    apartment: "شقة",
    villa: "فيلا",
    land: "أرض",
    commercial: "تجاري",
    duplex: "دوبلكس",
    penthouse: "بنتهاوس",
    studio: "استوديو",
    district: "الحي",
    selectDistrict: "اختر الحي",
    areaType: "نوع المساحة",
    selectAreaType: "اختر نوع المساحة",
    builtUpArea: "إجمالي مساحة البناء (م²)",
    landArea: "مساحة الأرض (م²)",
    area: "المساحة (م²)",
    enterArea: "أدخل المساحة بالمتر المربع",
    age: "العمر (سنوات)",
    enterAge: "أدخل عمر العقار",
    finishingQuality: "جودة التشطيب",
    selectFinishing: "اختر جودة التشطيب",
    excellent: "ممتاز",
    good: "جيد",
    average: "متوسط",
    poor: "ضعيف",
    amenities: "المرافق",
    selectAmenities: "اختر المرافق",
    parking: "موقف سيارات",
    pool: "مسبح",
    gym: "صالة رياضية",
    garden: "حديقة",
    elevator: "مصعد",
    security: "أمن",
    centralAC: "تكييف مركزي",
    maidRoom: "غرفة خادمة",
    specialFeatures: "مميزات خاصة",
    enterFeatures: "أدخل المميزات الخاصة (اختياري)",
    location: "الموقع",
    selectOnMap: "اختر على الخريطة",
    hideMap: "إخفاء الخريطة",
    latitude: "خط العرض",
    longitude: "خط الطول",
    streetWidth: "عرض الشارع (متر)",
    enterStreetWidth: "أدخل عرض الشارع",
    facingDirection: "اتجاه الواجهة",
    selectDirection: "اختر الاتجاه",
    north: "شمالي",
    south: "جنوبي",
    east: "شرقي",
    west: "غربي",
    northeast: "شمال شرقي",
    northwest: "شمال غربي",
    southeast: "جنوب شرقي",
    southwest: "جنوب غربي",
    numberOfRooms: "عدد الغرف",
    numberOfBathrooms: "عدد دورات المياه",
    numberOfFloors: "عدد الطوابق",
    hasGarage: "يوجد موقف سيارات",
    hasGarden: "يوجد حديقة",
    calculateValuation: "احسب التقييم",
    calculating: "جاري الحساب...",
    calculatingValuation: "جاري حساب التقييم",
    
    // Results
    valuationResults: "نتائج التقييم",
    estimatedValue: "القيمة المقدرة",
    confidenceScore: "مستوى الثقة",
    pricePerSqm: "السعر للمتر المربع",
    valuationMethod: "طريقة التقييم",
    comparableProperties: "العقارات المشابهة",
    generateReport: "إنشاء تقرير",
    generatingReport: "جاري الإنشاء...",
    downloadReport: "تحميل التقرير",
    viewReport: "عرض التقرير",
    
    // History
    myValuations: "تقييماتي",
    noValuations: "لا توجد تقييمات بعد",
    noValuationsDesc: "ابدأ بإنشاء أول تقييم عقاري",
    viewDetails: "عرض التفاصيل",
    
    // Common
    loading: "جاري التحميل...",
    error: "خطأ",
    success: "نجح",
    cancel: "إلغاء",
    save: "حفظ",
    delete: "حذف",
    edit: "تعديل",
    back: "رجوع",
    next: "التالي",
    sar: "ريال",
    sqm: "م²",
    
    // Auth
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    profile: "الملف الشخصي",
    
    // Districts
    alMalaz: "الملز",
    alOlaya: "العليا",
    alNakheel: "النخيل",
    alYasmin: "الياسمين",
    kingFahd: "الملك فهد",
    alMuruj: "المروج",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved === "ar" || saved === "en") ? saved : "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

