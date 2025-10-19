import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, Download, FileText } from "lucide-react";

interface ValuationDetailsProps {
  params: { id: string };
}

export default function ValuationDetails({ params }: ValuationDetailsProps) {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  
  const { data: valuation, isLoading } = trpc.valuation.get.useQuery({ id: params.id });
  
  const generateReport = trpc.valuation.generateReport.useMutation({
    onSuccess: (data) => {
      toast.success(t("success"));
      window.open(data.reportUrl, "_blank");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleGenerateReport = () => {
    generateReport.mutate({ id: params.id, language });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-accent flex items-center justify-center">
        <div className="text-white text-xl">{t("loading")}</div>
      </div>
    );
  }

  if (!valuation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-accent flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>{t("error")}: Valuation not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-accent py-12">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/valuations")}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("back")}
          </Button>
        </div>

        {/* Main Results Card */}
        <Card className="shadow-2xl border-0 mb-6">
          <CardHeader className="bg-gradient-to-r from-primary to-accent text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-center">
              {t("valuationResults")}
            </CardTitle>
            <CardDescription className="text-white/90 text-center text-lg">
              {valuation.propertyType} • {valuation.district} • {valuation.area} {t("sqm")}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Estimated Value - Highlight */}
            <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl p-8 text-center mb-8">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {t("estimatedValue")}
              </div>
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                {valuation.estimatedValue.toLocaleString()} {t("sar")}
              </div>
              
              {/* Confidence Score Bar */}
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold">{t("confidenceScore")}</span>
                  <span className="font-bold text-accent">{valuation.confidenceScore}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
                    style={{ width: `${valuation.confidenceScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="text-sm font-semibold text-muted-foreground mb-2">
                  {t("pricePerSqm")}
                </div>
                <div className="text-2xl font-bold">
                  {valuation.pricePerSqm?.toLocaleString() || 0} {t("sar")}
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="text-sm font-semibold text-muted-foreground mb-2">
                  {t("valuationMethod")}
                </div>
                <div className="text-2xl font-bold">
                  {valuation.valuationMethod}
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="border-t pt-6 mb-8">
              <h3 className="text-xl font-bold mb-4">{t("propertyDetails")}</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">{t("propertyType")}</div>
                  <div className="font-semibold">{valuation.propertyType}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{t("district")}</div>
                  <div className="font-semibold">{valuation.district}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{t("area")}</div>
                  <div className="font-semibold">{valuation.area} {t("sqm")}</div>
                </div>
                {valuation.age && (
                  <div>
                    <div className="text-sm text-muted-foreground">{t("age")}</div>
                    <div className="font-semibold">{valuation.age} years</div>
                  </div>
                )}
                {valuation.finishingQuality && (
                  <div>
                    <div className="text-sm text-muted-foreground">{t("finishingQuality")}</div>
                    <div className="font-semibold">{valuation.finishingQuality}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Generate Report Button */}
            <div className="flex gap-4">
              {valuation.reportUrl ? (
                <Button
                  onClick={() => window.open(valuation.reportUrl!, "_blank")}
                  className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  {t("viewReport")}
                </Button>
              ) : (
                <Button
                  onClick={handleGenerateReport}
                  disabled={generateReport.isPending}
                  className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  <Download className="mr-2 h-5 w-5" />
                  {generateReport.isPending ? t("generatingReport") : t("generateReport")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comparable Properties */}
        {valuation.comparables && valuation.comparables.length > 0 && (
          <Card className="shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl">{t("comparableProperties")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {valuation.comparables.map((comp, idx) => (
                  <div
                    key={comp.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-semibold">
                        {comp.district} • {comp.area} {t("sqm")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {comp.source}
                        {comp.distance && ` • ${Math.round(comp.distance / 1000)} km away`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {comp.price.toLocaleString()} {t("sar")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {comp.pricePerSqm.toLocaleString()} {t("sar")}/{t("sqm")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

