import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Plus, FileText, TrendingUp } from "lucide-react";

export default function Valuations() {
  const { t } = useLanguage();
  
  const { data: valuations, isLoading } = trpc.valuation.list.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-accent flex items-center justify-center">
        <div className="text-white text-xl">{t("loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-accent py-12">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{t("myValuations")}</h1>
            <p className="text-white/80">{t("viewDetails")}</p>
          </div>
          <Link href="/new-valuation">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
              <Plus className="mr-2 h-5 w-5" />
              {t("newValuation")}
            </Button>
          </Link>
        </div>

        {/* Valuations List */}
        {!valuations || valuations.length === 0 ? (
          <Card className="shadow-2xl border-0">
            <CardContent className="py-16 text-center">
              <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">{t("noValuations")}</h3>
              <p className="text-muted-foreground mb-6">{t("noValuationsDesc")}</p>
              <Link href="/new-valuation">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
                  <Plus className="mr-2 h-5 w-5" />
                  {t("newValuation")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {valuations.map((valuation) => (
              <Card key={valuation.id} className="shadow-xl border-0 hover:shadow-2xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-1">
                        {valuation.propertyType} • {valuation.district}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {valuation.area} {t("sqm")}
                        {valuation.age && ` • ${valuation.age} years old`}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">{t("estimatedValue")}</div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {valuation.estimatedValue.toLocaleString()} {t("sar")}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-6">
                      <div>
                        <div className="text-sm text-muted-foreground">{t("confidenceScore")}</div>
                        <div className="font-semibold text-lg">{valuation.confidenceScore}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t("pricePerSqm")}</div>
                        <div className="font-semibold text-lg">
                          {valuation.pricePerSqm?.toLocaleString() || 0} {t("sar")}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Created</div>
                        <div className="font-semibold text-lg">
                          {new Date(valuation.createdAt!).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      {valuation.reportUrl && (
                        <Button
                          variant="outline"
                          onClick={() => window.open(valuation.reportUrl!, "_blank")}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Report
                        </Button>
                      )}
                      <Link href={`/valuation/${valuation.id}`}>
                        <Button className="bg-gradient-to-r from-primary to-accent">
                          {t("viewDetails")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

