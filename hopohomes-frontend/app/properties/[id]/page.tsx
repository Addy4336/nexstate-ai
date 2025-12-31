"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api, Property } from "@/lib/api";
import { getDriveImageUrl, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  Check,
  Share2,
  Heart,
  Home,
  Loader2,
  Phone,
  Mail,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const PLACEHOLDER_IMAGE = "https://placehold.co/800x600/1a1a2e/ffffff?text=No+Image";

// Default amenities for properties without any
const DEFAULT_AMENITIES = [
  "Fully Furnished",
  "High-Speed Wi-Fi",
  "Kitchen Appliances",
  "Swimming Pool",
  "Gym Access",
  "Parking",
];

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Fetch property
  useEffect(() => {
    async function fetchProperty() {
      try {
        const response = await api.properties.getById(propertyId);
        if (response.success && response.data) {
          setProperty(response.data);
          setFormData((prev) => ({
            ...prev,
            message: `Hi, I'm interested in "${response.data?.title}". Please contact me with more details.`,
          }));
        } else {
          setError("Property not found");
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property");
      } finally {
        setLoading(false);
      }
    }

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  // Get images array
  const getImages = () => {
    if (!property) return [PLACEHOLDER_IMAGE];
    
    const images: string[] = [];
    if (property.images && property.images.length > 0) {
      images.push(...property.images.map((img) => getDriveImageUrl(img)));
    }
    if (images.length === 0 && property.cover_image && property.cover_image.length > 0) {
      images.push(...property.cover_image.map((img) => getDriveImageUrl(img)));
    }
    
    return images.length > 0 ? images : [PLACEHOLDER_IMAGE];
  };

  const images = getImages();

  // Navigate images
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = PLACEHOLDER_IMAGE;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await api.enquiries.submit({
        type: "tenant_enquiry",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        propertyId: property?.id,
        propertyTitle: property?.title,
      });

      if (response.success) {
        toast.success("Enquiry submitted successfully! We'll contact you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: `Hi, I'm interested in "${property?.title}". Please contact me with more details.`,
        });
      } else {
        toast.error(response.error || "Failed to submit enquiry");
      }
    } catch (err) {
      console.error("Error submitting enquiry:", err);
      toast.error("Failed to submit enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Share property
  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: `Check out this property: ${property?.title}`,
          url,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Home className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Property Not Found</h1>
          <p className="text-muted-foreground mb-4">{error || "The property you're looking for doesn't exist."}</p>
          <Link href="/properties">
            <Button>Browse Properties</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const amenities = property.amenities && property.amenities.length > 0 
    ? property.amenities 
    : DEFAULT_AMENITIES;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/properties"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <Home className="w-3 h-3" /> Properties /{" "}
              <span className="text-foreground font-medium">{property.title}</span>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Images & Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Main Image with Navigation */}
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-sm bg-muted group">
                <img
                  src={images[currentImageIndex]}
                  alt={property.title}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-background/80 text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-background/90 text-foreground hover:bg-background">
                    {property.status}
                  </Badge>
                  {property.featured && (
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden bg-muted ${
                        i === currentImageIndex ? "ring-2 ring-accent" : ""
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${property.title} ${i + 1}`}
                        onError={handleImageError}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Title & Key Specs */}
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        AED {formatPrice(property.price)}
                      </div>
                      <div className="text-sm text-muted-foreground">per month</div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="icon" onClick={handleShare}>
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-accent/10 rounded-full text-accent">
                      <BedDouble className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                      <p className="font-semibold">{property.bedrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-accent/10 rounded-full text-accent">
                      <Bath className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                      <p className="font-semibold">{property.bathrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-accent/10 rounded-full text-accent">
                      <Maximize className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Area</p>
                      <p className="font-semibold">{property.area_sqft} sqft</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-bold mb-4">About this Property</h2>
                <div className="prose text-muted-foreground max-w-none">
                  <p>{property.description || "No description available."}</p>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-accent" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Enquiry Form */}
            <div className="space-y-6">
              <div className="sticky top-24 space-y-6">
                {/* Enquiry Form */}
                <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold mb-1">Interested?</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Send us an enquiry to book a viewing.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="John Doe"
                          className="pl-9"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          className="pl-9"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          placeholder="+971 50 123 4567"
                          className="pl-9"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your requirements..."
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Enquiry"
                      )}
                    </Button>
                  </form>
                </div>

                {/* Contact Info */}
                <div className="p-4 bg-muted/30 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg">
                    HO
                  </div>
                  <div>
                    <p className="font-semibold text-sm">HOPO Homes Team</p>
                    <p className="text-xs text-muted-foreground">Property Management</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
