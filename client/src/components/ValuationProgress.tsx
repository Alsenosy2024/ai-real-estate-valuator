import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProgressStep {
  id: string;
  labelEn: string;
  labelAr: string;
  estimatedTime: number; // in seconds
  status: "pending" | "active" | "completed";
}

interface ValuationProgressProps {
  onComplete?: () => void;
}

export default function ValuationProgress({ onComplete }: ValuationProgressProps) {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const steps: ProgressStep[] = [
    {
      id: "data-received",
      labelEn: "Data received successfully",
      labelAr: "تم استلام البيانات بنجاح",
      estimatedTime: 1,
      status: "pending",
    },
    {
      id: "searching-internet",
      labelEn: "Searching the internet for market data",
      labelAr: "جاري البحث على الإنترنت لجلب بيانات السوق",
      estimatedTime: 15,
      status: "pending",
    },
    {
      id: "ai-analysis",
      labelEn: "AI analyzing data and comparable properties",
      labelAr: "الذكاء الاصطناعي يحلل البيانات والعقارات المشابهة",
      estimatedTime: 10,
      status: "pending",
    },
    {
      id: "preparing-report",
      labelEn: "Preparing detailed valuation report",
      labelAr: "جاري تجهيز تقرير التقييم المفصل",
      estimatedTime: 5,
      status: "pending",
    },
    {
      id: "completed",
      labelEn: "Valuation completed successfully",
      labelAr: "اكتمل التقييم بنجاح",
      estimatedTime: 1,
      status: "pending",
    },
  ];

  const [progressSteps, setProgressSteps] = useState(steps);

  useEffect(() => {
    if (currentStep >= steps.length) {
      if (onComplete) {
        setTimeout(onComplete, 1000);
      }
      return;
    }

    const currentStepData = steps[currentStep];
    
    // Update step status to active
    setProgressSteps(prev => 
      prev.map((step, index) => ({
        ...step,
        status: index < currentStep ? "completed" : index === currentStep ? "active" : "pending",
      }))
    );

    // Simulate step progress
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    // Move to next step after estimated time
    const timeout = setTimeout(() => {
      setElapsedTime(0);
      setCurrentStep(prev => prev + 1);
    }, currentStepData.estimatedTime * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [currentStep, onComplete]);

  const getStepIcon = (status: string) => {
    if (status === "completed") {
      return <CheckCircle2 className="h-6 w-6 text-green-500" />;
    } else if (status === "active") {
      return <Loader2 className="h-6 w-6 text-primary animate-spin" />;
    } else {
      return <Clock className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const totalEstimatedTime = steps.reduce((sum, step) => sum + step.estimatedTime, 0);
  const completedTime = steps.slice(0, currentStep).reduce((sum, step) => sum + step.estimatedTime, 0);
  const progressPercentage = Math.min(100, ((completedTime + elapsedTime) / totalEstimatedTime) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 p-6 bg-card rounded-lg border">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{language === "ar" ? "التقدم الإجمالي" : "Overall Progress"}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {progressSteps.map((step, index) => {
          const isActive = step.status === "active";
          const isCompleted = step.status === "completed";
          const label = language === "ar" ? step.labelAr : step.labelEn;

          return (
            <div 
              key={step.id}
              className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                isActive ? "bg-primary/5 border-2 border-primary/20" : 
                isCompleted ? "bg-green-50 dark:bg-green-950/20" : 
                "bg-muted/50"
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {getStepIcon(step.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${isActive ? "text-primary" : isCompleted ? "text-green-700 dark:text-green-400" : "text-muted-foreground"}`}>
                  {label}
                </p>
                {isActive && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === "ar" 
                      ? `الوقت المتوقع: ${step.estimatedTime} ثانية` 
                      : `Estimated time: ${step.estimatedTime}s`}
                  </p>
                )}
              </div>
              {isCompleted && (
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Estimated Time Remaining */}
      {currentStep < steps.length && (
        <div className="text-center text-sm text-muted-foreground">
          {language === "ar" 
            ? `الوقت المتبقي المتوقع: ${totalEstimatedTime - completedTime - elapsedTime} ثانية` 
            : `Estimated time remaining: ${totalEstimatedTime - completedTime - elapsedTime}s`}
        </div>
      )}
    </div>
  );
}

