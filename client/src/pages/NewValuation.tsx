import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { MapPin } from "lucide-react";
import LeafletMap from "@/components/LeafletMap";
import ValuationProgress from "@/components/ValuationProgress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PROPERTY_TYPES = ["apartment", "villa", "land", "commercial", "duplex", "penthouse", "studio"];

const RIYADH_DISTRICTS = {
  north: ["Al Olaya", "Al Narjis", "Al Malka", "Al Qirwan", "Al Yasmin", "Al Sahafa", "Al Nakheel", "Hittin", "Al Aqiq", "Al Muhammadiyah", "Al Andalus", "Al Rabwah", "Al Nada", "Al Ghadir", "Al Rabie", "Granada", "Al Wurud", "Al Murooj"],
  east: ["Al Ramal", "Al Munsiyah", "Qurtubah", "Al Yarmouk", "Ash Shimal", "Al Nasim", "Al Rayan", "Al Hamra", "Al Rawdah", "Al Fayha", "Al Khaleej", "Al Jazeera", "Al Iskan", "Al Waha", "Al Manar"],
  west: ["Dhahrat Namar", "Tuwaiq", "Irqah", "Al Badi'ah", "Al Suwaidi", "Al Aridh", "Al Shifa", "Al Aziziyah West", "Al Manakh", "Al Wizarat"],
  south: ["Al Aziziyah", "Al Dar Al Baida", "Badr", "Al Hazm", "Taybah", "Al Manfuhah", "Al Dubiyah", "Al Shamsiyah", "Al Faisaliyah", "Al Dirah"],
  central: ["Al Malaz", "Al Sulimaniyah", "Al Margab", "Al Bateha", "Al Murabba", "Al Futah", "Al Deerah", "Al Wisham", "Al Salam", "King Fahd District"]
};

const ALL_DISTRICTS = Object.values(RIYADH_DISTRICTS).flat().sort();

const FINISHING_QUALITIES = ["excellent", "good", "average", "poor"];
const AMENITIES_OPTIONS = ["parking", "pool", "gym", "garden", "elevator", "security", "centralAC", "maidRoom"];
const FACING_DIRECTIONS = ["north", "south", "east", "west", "northeast", "northwest", "southeast", "southwest"];

export default function NewValuation() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  
  const [formData, setFormData] = useState({
    propertyType: "",
    district: "",
    areaType: "built-up", // built-up or land
    area: "",
    age: "",
    finishingQuality: "",
    latitude: "",
    longitude: "",
    streetWidth: "",
    facingDirection: "",
    numberOfRooms: "",
    numberOfBathrooms: "",
    numberOfFloors: "",
    hasGarage: false,
    hasGarden: false,
    amenities: [] as string[],
    specialFeatures: "",
  });

  const [showMap, setShowMap] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const createValuation = trpc.valuation.create.useMutation({
    onSuccess: (data) => {
      // Progress will be shown, don't close yet
      setTimeout(() => {
        setShowProgress(false);
        toast.success("Valuation completed successfully!");
        setLocation(`/valuation/${data.id}`);
      }, 1000);
    },
    onError: (error) => {
      setShowProgress(false);
      toast.error(error.message || "Failed to create valuation");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.propertyType || !formData.district || !formData.area) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Show progress dialog
    setShowProgress(true);

    createValuation.mutate({
      propertyType: formData.propertyType,
      district: formData.district,
      area: parseFloat(formData.area),
      age: formData.age ? parseInt(formData.age) : undefined,
      finishingQuality: formData.finishingQuality || undefined,
      latitude: formData.latitude || undefined,
      longitude: formData.longitude || undefined,
      streetWidth: formData.streetWidth ? parseFloat(formData.streetWidth) : undefined,
      facingDirection: formData.facingDirection || undefined,
      numberOfRooms: formData.numberOfRooms ? parseInt(formData.numberOfRooms) : undefined,
      numberOfBathrooms: formData.numberOfBathrooms ? parseInt(formData.numberOfBathrooms) : undefined,
      numberOfFloors: formData.numberOfFloors ? parseInt(formData.numberOfFloors) : undefined,
      hasGarage: formData.hasGarage,
      hasGarden: formData.hasGarden,
      amenities: formData.amenities.length > 0 ? formData.amenities : undefined,
      specialFeatures: formData.specialFeatures ? [formData.specialFeatures] : undefined,
    });
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    setFormData({
      ...formData,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    });
    
    // Reverse geocode to get district
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
      );
      const data = await response.json();
      
      // Try to extract district/neighborhood from the address
      const suburb = data.address?.suburb || data.address?.neighbourhood || data.address?.quarter;
      
      if (suburb) {
        // Try to match with our districts list
        const allDistricts = Object.values(RIYADH_DISTRICTS).flat();
        const matchedDistrict = allDistricts.find(d => 
          d.toLowerCase().includes(suburb.toLowerCase()) || 
          suburb.toLowerCase().includes(d.toLowerCase())
        );
        
        if (matchedDistrict) {
          setFormData(prev => ({
            ...prev,
            district: matchedDistrict,
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6),
          }));
          toast.success(`Location selected: ${matchedDistrict}`);
        } else {
          toast.info(`Location selected. Please select the district manually.`);
        }
      } else {
        toast.info(`Location selected. Please select the district manually.`);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      toast.success("Location selected successfully");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-accent py-12">
      <div className="container max-w-4xl">
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("newValuation")}
            </CardTitle>
            <CardDescription className="text-center text-base">
              {t("propertyDetails")}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Property Type */}
              <div className="space-y-2">
                <Label htmlFor="propertyType" className="text-base font-semibold">
                  {t("propertyType")} *
                </Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                >
                  <SelectTrigger id="propertyType" className="h-12">
                    <SelectValue placeholder={t("selectPropertyType")} />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {t(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label htmlFor="district" className="text-base font-semibold">
                  {t("district")} *
                </Label>
                <Select
                  value={formData.district}
                  onValueChange={(value) => setFormData({ ...formData, district: value })}
                >
                  <SelectTrigger id="district" className="h-12">
                    <SelectValue placeholder={t("selectDistrict")} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {ALL_DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Selection */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {t("location")}
                </Label>
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowMap(!showMap)}
                    className="w-full h-12 justify-start"
                  >
                    <MapPin className="mr-2 h-5 w-5" />
                    {showMap ? t("hideMap") : t("selectOnMap")}
                  </Button>
                  
                  {showMap && (
                    <div className="space-y-3">
                      <LeafletMap
                        onLocationSelect={handleLocationSelect}
                        initialLat={formData.latitude ? parseFloat(formData.latitude) : undefined}
                        initialLng={formData.longitude ? parseFloat(formData.longitude) : undefined}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="latitude" className="text-sm">{t("latitude")}</Label>
                          <Input
                            id="latitude"
                            placeholder="24.7136"
                            value={formData.latitude}
                            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                            className="h-10 mt-1"
                            readOnly
                          />
                        </div>
                        <div>
                          <Label htmlFor="longitude" className="text-sm">{t("longitude")}</Label>
                          <Input
                            id="longitude"
                            placeholder="46.6753"
                            value={formData.longitude}
                            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                            className="h-10 mt-1"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Area Type */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {t("areaType")} *
                </Label>
                <Select
                  value={formData.areaType}
                  onValueChange={(value) => setFormData({ ...formData, areaType: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={t("selectAreaType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="built-up">{t("builtUpArea")}</SelectItem>
                    <SelectItem value="land">{t("landArea")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Area */}
              <div className="space-y-2">
                <Label htmlFor="area" className="text-base font-semibold">
                  {formData.areaType === "built-up" ? t("builtUpArea") : t("landArea")} *
                </Label>
                <Input
                  id="area"
                  type="number"
                  placeholder={t("enterArea")}
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  required
                  className="h-12"
                />
              </div>

              {/* Property Details Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-base font-semibold">
                    {t("age")}
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder={t("enterAge")}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="h-12"
                    min="0"
                  />
                </div>

                {/* Street Width */}
                <div className="space-y-2">
                  <Label htmlFor="streetWidth" className="text-base font-semibold">
                    {t("streetWidth")}
                  </Label>
                  <Input
                    id="streetWidth"
                    type="number"
                    placeholder={t("enterStreetWidth")}
                    value={formData.streetWidth}
                    onChange={(e) => setFormData({ ...formData, streetWidth: e.target.value })}
                    className="h-12"
                    min="1"
                  />
                </div>

                {/* Facing Direction */}
                <div className="space-y-2">
                  <Label htmlFor="facing" className="text-base font-semibold">
                    {t("facingDirection")}
                  </Label>
                  <Select
                    value={formData.facingDirection}
                    onValueChange={(value) => setFormData({ ...formData, facingDirection: value })}
                  >
                    <SelectTrigger id="facing" className="h-12">
                      <SelectValue placeholder={t("selectDirection")} />
                    </SelectTrigger>
                    <SelectContent>
                      {FACING_DIRECTIONS.map((dir) => (
                        <SelectItem key={dir} value={dir}>
                          {t(dir)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Finishing Quality */}
                <div className="space-y-2">
                  <Label htmlFor="finishing" className="text-base font-semibold">
                    {t("finishingQuality")}
                  </Label>
                  <Select
                    value={formData.finishingQuality}
                    onValueChange={(value) => setFormData({ ...formData, finishingQuality: value })}
                  >
                    <SelectTrigger id="finishing" className="h-12">
                      <SelectValue placeholder={t("selectFinishing")} />
                    </SelectTrigger>
                    <SelectContent>
                      {FINISHING_QUALITIES.map((quality) => (
                        <SelectItem key={quality} value={quality}>
                          {t(quality)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Number of Rooms */}
                <div className="space-y-2">
                  <Label htmlFor="rooms" className="text-base font-semibold">
                    {t("numberOfRooms")}
                  </Label>
                  <Input
                    id="rooms"
                    type="number"
                    placeholder="3"
                    value={formData.numberOfRooms}
                    onChange={(e) => setFormData({ ...formData, numberOfRooms: e.target.value })}
                    className="h-12"
                    min="0"
                  />
                </div>

                {/* Number of Bathrooms */}
                <div className="space-y-2">
                  <Label htmlFor="bathrooms" className="text-base font-semibold">
                    {t("numberOfBathrooms")}
                  </Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    placeholder="2"
                    value={formData.numberOfBathrooms}
                    onChange={(e) => setFormData({ ...formData, numberOfBathrooms: e.target.value })}
                    className="h-12"
                    min="0"
                  />
                </div>

                {/* Number of Floors */}
                <div className="space-y-2">
                  <Label htmlFor="floors" className="text-base font-semibold">
                    {t("numberOfFloors")}
                  </Label>
                  <Input
                    id="floors"
                    type="number"
                    placeholder="1"
                    value={formData.numberOfFloors}
                    onChange={(e) => setFormData({ ...formData, numberOfFloors: e.target.value })}
                    className="h-12"
                    min="1"
                  />
                </div>
              </div>

              {/* Garage and Garden */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasGarage: !formData.hasGarage })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.hasGarage
                      ? "border-accent bg-accent/10 text-accent font-semibold"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  {t("hasGarage")}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasGarden: !formData.hasGarden })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.hasGarden
                      ? "border-accent bg-accent/10 text-accent font-semibold"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  {t("hasGarden")}
                </button>
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">{t("amenities")}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {AMENITIES_OPTIONS.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.amenities.includes(amenity)
                          ? "border-accent bg-accent/10 text-accent font-semibold"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      {t(amenity)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Features */}
              <div className="space-y-2">
                <Label htmlFor="features" className="text-base font-semibold">
                  {t("specialFeatures")}
                </Label>
                <Input
                  id="features"
                  placeholder={t("enterFeatures")}
                  value={formData.specialFeatures}
                  onChange={(e) => setFormData({ ...formData, specialFeatures: e.target.value })}
                  className="h-12"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold"
                disabled={createValuation.isPending}
              >
                {createValuation.isPending ? t("calculating") : t("calculateValuation")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Progress Dialog */}
      <Dialog open={showProgress} onOpenChange={setShowProgress}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              {t("calculatingValuation")}
            </DialogTitle>
          </DialogHeader>
          <ValuationProgress onComplete={() => {}} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

