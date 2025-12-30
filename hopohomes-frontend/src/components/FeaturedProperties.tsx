import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Square, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const properties = [
  {
    id: 1,
    title: "Luxury Marina Apartment",
    location: "Dubai Marina",
    price: "8,500",
    type: "Apartment",
    beds: 2,
    baths: 2,
    sqft: 1200,
    image: property1,
    featured: true,
  },
  {
    id: 2,
    title: "JLT Premium Suite",
    location: "Jumeirah Lake Towers",
    price: "6,200",
    type: "Apartment",
    beds: 1,
    baths: 1,
    sqft: 850,
    image: property2,
    featured: false,
  },
  {
    id: 3,
    title: "Downtown Co-Living Space",
    location: "Downtown Dubai",
    price: "3,500",
    type: "Co-Living",
    beds: 1,
    baths: 1,
    sqft: 450,
    image: property3,
    featured: false,
  },
];

export function FeaturedProperties() {
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
            <Button variant="outline" className="group">
              View All Properties
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {/* Properties Grid */}
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
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image 
                  src={property.image} 
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {property.featured && (
                    <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                      Featured
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-card/90 text-foreground text-xs font-medium">
                    {property.type}
                  </span>
                </div>

                {/* Favorite Button */}
                <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/90 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Heart className="w-5 h-5" />
                </button>

                {/* Price */}
                <div className="absolute bottom-4 left-4">
                  <p className="text-primary-foreground font-bold text-xl">
                    AED {property.price}<span className="text-sm font-normal">/month</span>
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
                    {property.beds} Bed
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Bath className="w-4 h-4" />
                    {property.baths} Bath
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Square className="w-4 h-4" />
                    {property.sqft} sqft
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
