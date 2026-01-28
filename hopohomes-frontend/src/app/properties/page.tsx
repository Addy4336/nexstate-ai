'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    Bed,
    Bath,
    Search,
    MapPin,
    Home,
    Loader2,
    Star,
    SlidersHorizontal,
    Heart
} from 'lucide-react';

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
}

interface ApiResponse {
    success: boolean;
    data: Property[];
    error?: string;
}

interface LocationsResponse {
    success: boolean;
    data: string[];
}

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

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

function formatStatus(status: string): string {
    const statusMap: Record<string, string> = {
        'available': 'For Sale',
        'rented': 'Rented',
        'sold': 'Sold',
        'maintenance': 'Maintenance'
    };
    return statusMap[status] || 'For Sale';
}

export default function Properties() {
    const searchParams = useSearchParams();

    const [properties, setProperties] = useState<Property[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Filter states - initialized from URL params
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedBeds, setSelectedBeds] = useState('');
    const [selectedBaths, setSelectedBaths] = useState('');
    const [selectedPropertyType, setSelectedPropertyType] = useState('');

    // Read URL params on initial load
    useEffect(() => {
        const location = searchParams.get('location') || '';
        const minPriceParam = searchParams.get('minPrice') || '';
        const maxPriceParam = searchParams.get('maxPrice') || '';
        const bedrooms = searchParams.get('bedrooms') || '';
        const propertyType = searchParams.get('propertyType') || '';

        setSelectedLocation(location);
        setMinPrice(minPriceParam);
        setMaxPrice(maxPriceParam);
        setSelectedBeds(bedrooms);
        setSelectedPropertyType(propertyType);

        // Show filters panel if any URL params are present
        if (location || minPriceParam || maxPriceParam || bedrooms || propertyType) {
            setShowFilters(true);
        }

        setIsInitialized(true);
    }, [searchParams]);

    useEffect(() => {
        async function fetchLocations() {
            try {
                const response = await fetch(`${CMS_API_URL}/api/properties/meta/locations`);
                if (response.ok) {
                    const data: LocationsResponse = await response.json();
                    if (data.success) setLocations(data.data);
                }
            } catch (err) {
                console.error('Error fetching locations:', err);
            }
        }
        fetchLocations();
    }, []);

    const fetchProperties = useCallback(async () => {
        if (!isInitialized) return; // Don't fetch until URL params are read

        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('q', searchQuery);
            if (selectedLocation) params.append('location', selectedLocation);
            if (minPrice) params.append('minPrice', minPrice);
            if (maxPrice) params.append('maxPrice', maxPrice);
            if (selectedBeds) params.append('bedrooms', selectedBeds);

            const response = await fetch(`${CMS_API_URL}/api/properties/search?${params.toString()}`);

            if (!response.ok) throw new Error('Failed to fetch properties');

            const data: ApiResponse = await response.json();

            if (data.success) {
                let filtered = data.data;
                // Apply property type filter client-side if selected
                if (selectedPropertyType) {
                    filtered = filtered.filter(p =>
                        p.title.toLowerCase().includes(selectedPropertyType.toLowerCase()) ||
                        (p.description && p.description.toLowerCase().includes(selectedPropertyType.toLowerCase()))
                    );
                }
                // Apply bathrooms filter
                if (selectedBaths) filtered = filtered.filter(p => p.bathrooms >= parseInt(selectedBaths));
                setProperties(filtered);
            } else {
                throw new Error(data.error || 'Failed to fetch properties');
            }
        } catch (err) {
            console.error('Error fetching properties:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            setProperties([]);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedLocation, minPrice, maxPrice, selectedBeds, selectedBaths, selectedPropertyType, isInitialized]);

    useEffect(() => {
        const timer = setTimeout(fetchProperties, 300);
        return () => clearTimeout(timer);
    }, [fetchProperties]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedLocation('');
        setMinPrice('');
        setMaxPrice('');
        setSelectedBeds('');
        setSelectedBaths('');
        setSelectedPropertyType('');
        // Update URL without params
        window.history.replaceState({}, '', '/properties');
    };

    const hasActiveFilters = searchQuery || selectedLocation || minPrice || maxPrice || selectedBeds || selectedBaths || selectedPropertyType;

    return (
        <div className="min-h-screen bg-background">
            {/* Clean Hero Section */}
            <section className="relative pt-32  px-6 lg:px-8 bg-gradient-to-b from-muted/50 to-background">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Simple Headline */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight mb-6">
                        Find your perfect home
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
                        Browse through our curated collection of premium properties in prime locations.
                    </p>

                    {/* Clean Search Bar */}
                    <div className="max-w-3xl mx-auto">
                        <div className="flex flex-col sm:flex-row gap-3 p-2 bg-card border border-border rounded-2xl shadow-sm">
                            {/* Search Input */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search properties..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                                />
                            </div>

                            {/* Location Select */}
                            <div className="relative sm:w-48 border-t sm:border-t-0 sm:border-l border-border">
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-transparent text-foreground focus:outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">All Locations</option>
                                    {locations.map((loc) => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>

                            {/* Search Button */}
                            <button
                                onClick={fetchProperties}
                                className="px-8 py-3.5 bg-foreground text-background font-medium rounded-xl hover:opacity-90 transition-opacity"
                            >
                                Search
                            </button>
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            {showFilters ? 'Hide filters' : 'More filters'}
                        </button>
                    </div>
                </div>
            </section>

            {/* Filters Panel */}
            {showFilters && (
                <section className="px-6 lg:px-8 pb-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-card border border-border rounded-xl p-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1.5 block">Min Price</label>
                                    <input
                                        type="number"
                                        placeholder="$0"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1.5 block">Max Price</label>
                                    <input
                                        type="number"
                                        placeholder="Any"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1.5 block">Bedrooms</label>
                                    <select
                                        value={selectedBeds}
                                        onChange={(e) => setSelectedBeds(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20 appearance-none"
                                    >
                                        <option value="">Any</option>
                                        <option value="1">1+</option>
                                        <option value="2">2+</option>
                                        <option value="3">3+</option>
                                        <option value="4">4+</option>
                                        <option value="5">5+</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1.5 block">Bathrooms</label>
                                    <select
                                        value={selectedBaths}
                                        onChange={(e) => setSelectedBaths(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20 appearance-none"
                                    >
                                        <option value="">Any</option>
                                        <option value="1">1+</option>
                                        <option value="2">2+</option>
                                        <option value="3">3+</option>
                                        <option value="4">4+</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1.5 block">Property Type</label>
                                    <select
                                        value={selectedPropertyType}
                                        onChange={(e) => setSelectedPropertyType(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20 appearance-none"
                                    >
                                        <option value="">Any</option>
                                        <option value="apartment">Apartment</option>
                                        <option value="villa">Villa</option>
                                        <option value="townhouse">Townhouse</option>
                                        <option value="penthouse">Penthouse</option>
                                        <option value="studio">Studio</option>
                                        <option value="house">House</option>
                                    </select>
                                </div>
                            </div>
                            {hasActiveFilters && (
                                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">{properties.length} results</span>
                                    <button onClick={clearFilters} className="text-sm text-foreground hover:underline">
                                        Clear all
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Properties Section */}
            <section className="py-12 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Results Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-semibold text-foreground">
                            {loading ? 'Loading...' : `${properties.length} Properties`}
                        </h2>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {/* Error */}
                    {error && !loading && (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground mb-4">{error}</p>
                            <button onClick={fetchProperties} className="text-foreground underline">
                                Try again
                            </button>
                        </div>
                    )}

                    {/* Empty */}
                    {!loading && !error && properties.length === 0 && (
                        <div className="text-center py-20">
                            <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">No properties found</h3>
                            <p className="text-muted-foreground mb-6">Try adjusting your search filters</p>
                            <button onClick={clearFilters} className="text-foreground underline">
                                Clear filters
                            </button>
                        </div>
                    )}

                    {/* Properties Grid */}
                    {!loading && !error && properties.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {properties.map((property) => (
                                <Link
                                    key={property.id}
                                    href={`/properties/${property.location.toLowerCase().replace(/\s+/g, '-')}/${property.id}`}
                                    className="group"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                                        <Image
                                            src={getPropertyImage(property)}
                                            alt={property.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />

                                        {/* Status Badge */}
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                                            {formatStatus(property.status)}
                                        </div>

                                        {/* Featured Badge */}
                                        {property.featured && (
                                            <div className="absolute top-4 right-4 bg-amber-400 text-amber-950 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                                <Star className="w-3 h-3" />
                                                Featured
                                            </div>
                                        )}

                                        {/* Wishlist */}
                                        <button className="absolute bottom-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                                            <Heart className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-3">
                                        {/* Title and Price Row */}
                                        <div className="flex justify-between items-start gap-4">
                                            <h3 className="text-lg font-medium text-foreground group-hover:underline line-clamp-1 flex-1">
                                                {property.title}
                                            </h3>
                                            <p className="text-lg font-semibold text-foreground whitespace-nowrap">
                                                {formatPrice(property.price)}
                                            </p>
                                        </div>

                                        {/* Location */}
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {property.location}
                                        </p>

                                        {/* Features */}
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
                                            <span className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-md">
                                                <Bed className="w-4 h-4" />
                                                {property.bedrooms} beds
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-md">
                                                <Bath className="w-4 h-4" />
                                                {property.bathrooms} baths
                                            </span>
                                            {property.area_sqft && (
                                                <span className="bg-muted/50 px-2.5 py-1 rounded-md">
                                                    {property.area_sqft.toLocaleString()} sqft
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
