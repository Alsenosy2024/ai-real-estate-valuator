import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { 
  Brain, 
  TrendingUp, 
  FileText, 
  Globe, 
  ArrowRight,
  Sparkles,
  Building2,
  BarChart3
} from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: t("aiPowered"),
      description: t("aiPoweredDesc"),
    },
    {
      icon: TrendingUp,
      title: t("liveData"),
      description: t("liveDataDesc"),
    },
    {
      icon: FileText,
      title: t("instantReports"),
      description: t("instantReportsDesc"),
    },
    {
      icon: Globe,
      title: t("bilingual"),
      description: t("bilingualDesc"),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("appTitle")}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="font-semibold"
            >
              {t("switchLanguage")}
            </Button>
            
            {isAuthenticated ? (
              <Link href="/valuations">
                <Button size="sm" className="bg-gradient-to-r from-primary to-accent">
                  {t("myValuations")}
                </Button>
              </Link>
            ) : (
              <Button 
                size="sm" 
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-gradient-to-r from-primary to-accent"
              >
                {t("login")}
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent py-24 md:py-32">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
              <Sparkles className="h-4 w-4" />
              <span>Powered by Advanced AI Technology</span>
            </div>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              {t("heroTitle")}
            </h1>
            
            <p className="mb-10 text-xl text-white/90 md:text-2xl">
              {t("heroSubtitle")}
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {isAuthenticated ? (
                <Link href="/new-valuation">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-14 px-8 text-lg font-semibold">
                    {t("getStarted")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="lg" 
                  onClick={() => window.location.href = getLoginUrl()}
                  className="bg-white text-primary hover:bg-white/90 h-14 px-8 text-lg font-semibold"
                >
                  {t("getStarted")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 h-14 px-8 text-lg font-semibold"
              >
                {t("learnMore")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 md:text-4xl">
              {t("features")}
            </h2>
            <p className="text-lg text-muted-foreground">
              Advanced technology meets real estate expertise
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="border-2 hover:border-accent transition-colors">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-muted/50">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                95%
              </div>
              <div className="text-lg text-muted-foreground">Average Accuracy</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                &lt;30s
              </div>
              <div className="text-lg text-muted-foreground">Valuation Time</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-lg text-muted-foreground">Market Data Updates</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary/90 to-accent">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Ready to value your property?
            </h2>
            <p className="mb-8 text-xl text-white/90">
              Join thousands of property owners and investors using AI-powered valuations
            </p>
            {isAuthenticated ? (
              <Link href="/new-valuation">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-14 px-8 text-lg font-semibold">
                  Start Free Valuation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-white text-primary hover:bg-white/90 h-14 px-8 text-lg font-semibold"
              >
                Start Free Valuation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-semibold">{t("appTitle")}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AI Real Estate Valuator. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

