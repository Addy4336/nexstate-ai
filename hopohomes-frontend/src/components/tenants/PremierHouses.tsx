'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Bed, Bath, MapPin, Loader2 } from 'lucide-react';

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

interface Property {
    id: string;
    title: string;
    description: string | null;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area_sqft: number | null;
    status: string;
    images: string[] | null;
    cover_image: string[] | null;
    featured: boolean;
    amenities: string[] | null;
}

interface ApiResponse {
    success: boolean;
    data: Property[];
    error?: string;
}

function getPropertyImage(property: Property): string {
    if (property.cover_image && property.cover_image.length > 0) {
        return property.cover_image[0];
    }
    if (property.images && property.images.length > 0) {
        return property.images[0];
    }
    return 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60';
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export default function PremierHouses() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProperties = async () => {
            try {
                // Fetch all public available properties, limit 6
                const response = await fetch(`${CMS_API_URL}/api/properties?limit=6`, {
                    cache: 'no-store'
                });

                if (response.ok) {
                    const data: ApiResponse = await response.json();
                    if (data.success) {
                        setProperties(data.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching featured properties:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProperties();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-background px-6 lg:px-8">
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </section>
        );
    }

    if (properties.length === 0) {
        return null; // or hide section if no properties
    }

    return (
        <section className="py-20 bg-background px-6 lg:px-8">
            <div className="max-w-350 mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div className="max-w-3xl">
                        <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-foreground mb-4">
                            Explore our premier houses
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Each listing offers unique features, exceptional quality, and prime locations, ensuring an exclusive living experience.
                        </p>
                    </div>
                    <Link href="/properties">
                        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
                            See All Properties <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {properties.map((property) => (
                        <Link
                            key={property.id}
                            href={`/properties/${property.location.toLowerCase().replace(/\s+/g, '-')}/${property.id}`}
                            className="flex flex-col group cursor-pointer"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden mb-5">
                                <Image
                                    src={getPropertyImage(property)}
                                    alt={property.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Badge */}
                                <div className="absolute top-5 left-5 bg-card/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold text-card-foreground shadow-sm">
                                    {property.status === 'available' ? 'For Sale' : property.status}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex flex-col gap-2">
                                {/* Icons Row */}
                                <div className="flex items-center gap-6 text-muted-foreground text-sm mb-1">
                                    <div className="flex items-center gap-2">
                                        <Bed className="w-5 h-5 stroke-1" />
                                        <span>{property.bedrooms} Bedrooms</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Bath className="w-5 h-5 stroke-1" />
                                        <span>{property.bathrooms} Bathroom</span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-medium text-foreground tracking-tight line-clamp-1">
                                    {property.title}
                                </h3>

                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <span className="font-semibold text-foreground text-lg">{formatPrice(property.price)}</span>
                                    <span className="w-1 h-1 bg-muted-foreground/40 rounded-full"></span>
                                    <span className="flex items-center gap-1 line-clamp-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {property.location}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}
