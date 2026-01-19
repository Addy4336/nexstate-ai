import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Star, Home, BedDouble, Bath } from 'lucide-react';
import Link from 'next/link';

// Property interface matching the CMS API response
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
    created_at: string;
    updated_at: string;
}

interface ApiResponse {
    success: boolean;
    data: Property[];
    error?: string;
}

interface LocationPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// CMS API base URL
const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

// Fetch properties from CMS API by location
async function getPropertiesByLocation(location: string): Promise<Property[]> {
    try {
        // Decode and format the location for search
        const searchLocation = decodeURIComponent(location).replace(/-/g, ' ');
        const url = `${CMS_API_URL}/api/properties/search?location=${encodeURIComponent(searchLocation)}`;

        console.log(`Fetching properties for location: ${searchLocation} from ${url}`);

        const response = await fetch(url, {
            cache: 'no-store', // Disable cache to ensure fresh data
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch properties:', response.status);
            return [];
        }

        const data: ApiResponse = await response.json();

        if (data.success) {
            console.log(`Found ${data.data.length} properties for ${searchLocation}`);
            return data.data;
        }

        console.error('API error:', data.error);
        return [];
    } catch (error) {
        console.error('Error fetching properties:', error);
        return [];
    }
}

// Get a display-friendly image URL
function getPropertyImage(property: Property): string {
    // Check cover_image first
    if (property.cover_image && property.cover_image.length > 0) {
        return property.cover_image[0];
    }

    // Then check images array
    if (property.images && property.images.length > 0) {
        return property.images[0];
    }

    // Fallback placeholder
    return 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60';
}

// Format price for display
function formatPrice(price: number): string {
    if (price >= 1000000) {
        return `AED ${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
        return `AED ${(price / 1000).toFixed(0)}K`;
    }
    return `AED ${price.toLocaleString()}`;
}

// Format location name for display
function formatLocationName(slug: string): string {
    return decodeURIComponent(slug)
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
}

export default async function LocationPage({ params }: LocationPageProps) {
    const { slug } = await params;
    const locationName = formatLocationName(slug);
    const properties = await getPropertiesByLocation(slug);

    return (
        <div className="min-h-[85vh] bg-background">
            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGR1YmFpJTIwcmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D"
                    alt={locationName}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />

                {/* Back Button */}
                {/* <div className="absolute top-32 left-6 z-10">
                    <Link href="/">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-full bg-white/20 backdrop-blur-sm border-white/20 hover:bg-white/30"
                        >
                            <ArrowLeft className="w-4 h-4 text-white" />
                        </Button>
                    </Link>
                </div> */}

                {/* Welcome Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center text-center text-white z-10 pt-32">
                    <div className="max-w-4xl mx-auto px-6">
                        <h1
                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
                            style={{ fontFamily: 'cursive, serif' }}
                        >
                            Properties in
                            <br />
                            {locationName}
                        </h1>
                        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
                            Discover exceptional living spaces in {locationName}. Beautiful villas, apartments,
                            and exclusive residences with world-class amenities.
                        </p>
                        <div className="flex items-center justify-center gap-6 mt-8">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-yellow-400" />
                                <span className="font-semibold">{locationName}</span>
                            </div>
                            <div className="text-white/80">
                                {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Available
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Properties Section */}
            <div className="py-16 bg-background">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Available Properties
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Handpicked quality rentals in {locationName}
                        </p>
                    </div>

                    {properties.length === 0 ? (
                        // Empty State
                        <div className="text-center py-16">
                            <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                No Properties Found
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                We couldn&apos;t find any properties in {locationName} at the moment.
                            </p>
                            <Link href="/">
                                <Button variant="default">Browse All Properties</Button>
                            </Link>
                        </div>
                    ) : (
                        // Properties Grid
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {properties.map((property) => (
                                <Link
                                    key={property.id}
                                    href={`/properties/${slug}/${property.id}`}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 bg-card">
                                        <div className="relative h-72 overflow-hidden">
                                            <Image
                                                src={getPropertyImage(property)}
                                                alt={property.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                            {/* Featured Badge */}
                                            {property.featured && (
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        Featured
                                                    </span>
                                                </div>
                                            )}

                                            {/* Property Details Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                                                        <BedDouble className="w-3 h-3" />
                                                        {property.bedrooms} BR
                                                    </span>
                                                    <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                                                        <Bath className="w-3 h-3" />
                                                        {property.bathrooms} Bath
                                                    </span>
                                                    {property.area_sqft && (
                                                        <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                                            {property.area_sqft.toLocaleString()} sqft
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-xl font-bold group-hover:text-yellow-300 transition-colors mb-1 line-clamp-1">
                                                    {property.title}
                                                </h3>
                                                <div className="flex items-center gap-1 text-sm text-white/80 mb-2">
                                                    <MapPin className="w-3 h-3" />
                                                    {property.location}
                                                </div>
                                                <p className="text-lg font-semibold text-yellow-400">
                                                    {formatPrice(property.price)}/night
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}