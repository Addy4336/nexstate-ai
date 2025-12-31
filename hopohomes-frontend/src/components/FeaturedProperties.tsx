"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Square, Heart, ArrowRight, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { api, Property } from "@/lib/api";
import { getDriveImageUrl, formatPrice } from "@/lib/utils";

// Placeholder image for properties without images
const PLACEHOLDER_IMAGE = "https://placehold.co/600x400/1a1a2e/ffffff?text=No+Image";

export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        console.log("Fetching featured properties...");
        const response = await api.properties.getFeatured(6);
        console.log("API Response:", response);
        
        if (response.success) {
          console.log("Properties loaded:", response.data.length);
          setProperties(response.data);
        } else {
          console.error("API Error:", response.error);
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
  }, []);

  // Get property image URL
  const getPropertyImage = (property: Property) => {
    console.log("Property images:", property.images, "Cover:", property.cover_image);
    
    if (property.images && property.images.length > 0 && property.images[0]) {
      const url = getDriveImageUrl(property.images[0]);
      console.log("Using images[0]:", property.images[0], "→", url);
      return url;
    }
    if (property.cover_image && property.cover_image.length > 0 && property.cover_image[0]) {
      const url = getDriveImageUrl(property.cover_image[0]);
      console.log("Using cover_image[0]:", property.cover_image[0], "→", url);
      return url;
    }
    console.log("No image found, using placeholder");
    return PLACEHOLDER_IMAGE;
  };

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = PLACEHOLDER_IMAGE;
  };

  return (
    <section className="section-padding bg-background" id="properties">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-accent font-semibold text-sm uppercase tracking-wider"
            >
              Featured Listings
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-foreground mt-2"
            >
              Ready-to-Move Properties
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground mt-3 max-w-lg"
            >
              Fully furnished homes across Dubai's most sought-after locations. Book today, move in tomorrow.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/properties">
              <Button variant="outline" className="group">
                View All Properties
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
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
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card rounded-2xl overflow-hidden shadow-sm border border-border card-hover"
              >
                <Link href={`/properties/${property.id}`}>
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
                        // TODO: Implement favorite toggle
                      }}
                    >
                      <Heart className="w-5 h-5" />
                    </button>

                    {/* Price */}
                    <div className="absolute bottom-4 left-4">
                      <p className="text-primary-foreground font-bold text-xl">
                        AED {formatPrice(property.price)}<span className="text-sm font-normal">/month</span>
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-card-foreground mb-2 group-hover:text-accent transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                      <MapPin className="w-4 h-4 text-accent" />
                      {property.location}
                    </div>

                    {/* Features */}
                    <div className="flex items-center gap-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Bed className="w-4 h-4" />
                        {property.bedrooms} Bed
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Bath className="w-4 h-4" />
                        {property.bathrooms} Bath
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Square className="w-4 h-4" />
                        {property.area_sqft || 0} sqft
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-16 bg-card rounded-2xl border border-border"
          >
            <Home className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Properties Available
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're currently updating our listings. Please check back soon for exciting new properties.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
