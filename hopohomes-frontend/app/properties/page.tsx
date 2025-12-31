"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api, Property } from "@/lib/api";
import { getDriveImageUrl, formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, MapPin, Bed, Bath, Square, Heart, Loader2, Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDebouncedCallback } from "use-debounce";

const PLACEHOLDER_IMAGE = "https://placehold.co/600x400/1a1a2e/ffffff?text=No+Image";

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current filters from URL
  const query = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const bedrooms = searchParams.get("bedrooms") || "";

  // Fetch properties based on search params
  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const response = await api.properties.search({
          q: query || undefined,
          location: location || undefined,
          maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
          bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
        });
        
        if (response.success) {
          setProperties(response.data);
        } else {
          setError(response.error || "Failed to load properties");
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties");
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [query, location, maxPrice, bedrooms]);

  // Debounced search handler
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  // Filter change handler
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  // Get property image
  const getPropertyImage = (property: Property) => {
    if (property.images && property.images.length > 0 && property.images[0]) {
      return getDriveImageUrl(property.images[0]);
    }
    if (property.cover_image && property.cover_image.length > 0 && property.cover_image[0]) {
      return getDriveImageUrl(property.cover_image[0]);
    }
    return PLACEHOLDER_IMAGE;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = PLACEHOLDER_IMAGE;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Page Header */}
          <div className="max-w-xl mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Find Your Next Home</h1>
            <p className="text-muted-foreground">
              Search through our hand-picked selection of premium properties.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by location, building, or keywords..."
                  className="pl-9"
                  defaultValue={query}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                <Select
                  defaultValue={bedrooms || "all"}
                  onValueChange={(val) => handleFilterChange("bedrooms", val)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Bed</SelectItem>
                    <SelectItem value="0">Studio</SelectItem>
                    <SelectItem value="1">1 Bed</SelectItem>
                    <SelectItem value="2">2 Beds</SelectItem>
                    <SelectItem value="3">3+ Beds</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  defaultValue={maxPrice || "all"}
                  onValueChange={(val) => handleFilterChange("maxPrice", val)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Max Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Price</SelectItem>
                    <SelectItem value="5000">AED 5k</SelectItem>
                    <SelectItem value="8000">AED 8k</SelectItem>
                    <SelectItem value="12000">AED 12k</SelectItem>
                    <SelectItem value="20000">AED 20k+</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12 bg-destructive/10 rounded-2xl border border-destructive/20">
              <p className="text-destructive">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Properties Grid */}
          {!loading && !error && properties.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/properties/${property.id}`} className="block h-full">
                    <div className="group bg-card rounded-2xl overflow-hidden shadow-sm border border-border card-hover h-full flex flex-col">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={getPropertyImage(property)}
                          alt={property.title}
                          onError={handleImageError}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          {property.featured && (
                            <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                              Featured
                            </span>
                          )}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            property.status === "available"
                              ? "bg-green-500/90 text-white"
                              : "bg-card/90 text-foreground"
                          }`}>
                            {property.status}
                          </span>
                        </div>

                        {/* Favorite Button */}
                        <button 
                          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/90 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors z-10"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <Heart className="w-5 h-5" />
                        </button>

                        {/* Price */}
                        <div className="absolute bottom-4 left-4">
                          <p className="text-primary-foreground font-bold text-xl">
                            AED {formatPrice(property.price)}<span className="text-sm font-normal opacity-80">/month</span>
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors line-clamp-1">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-muted-foreground text-sm mb-4">
                          <MapPin className="w-4 h-4 mr-1 text-accent" />
                          <span className="line-clamp-1">{property.location}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 py-4 border-t border-border mt-auto">
                          <div className="flex flex-col items-center justify-center text-center">
                            <Bed className="w-5 h-5 text-accent mb-1" />
                            <span className="text-xs text-muted-foreground font-medium">{property.bedrooms} Beds</span>
                          </div>
                          <div className="flex flex-col items-center justify-center text-center border-l border-border">
                            <Bath className="w-5 h-5 text-accent mb-1" />
                            <span className="text-xs text-muted-foreground font-medium">{property.bathrooms} Baths</span>
                          </div>
                          <div className="flex flex-col items-center justify-center text-center border-l border-border">
                            <Square className="w-5 h-5 text-accent mb-1" />
                            <span className="text-xs text-muted-foreground font-medium">{property.area_sqft} sqft</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && properties.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-2xl border border-dashed">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Home className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No properties found</h3>
              <p className="text-muted-foreground text-center max-w-sm mt-1">
                Try adjusting your search filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
