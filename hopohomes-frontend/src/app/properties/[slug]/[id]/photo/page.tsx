"use client"
import React, { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PropertyPhotosPage({ params }: { params: Promise<{ slug: string, id: string }> }) {
    const { slug, id } = use(params);

    // Format slug for display
    const propertyName = slug
        ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : 'Property';

    const [selectedCategory, setSelectedCategory] = useState("Property");

    const categories = ["Property", "Deluxe Room (with balcony)", "Deluxe Room (with city view)", "Standard Room"];

    const galleryPhotos = [
        // Property
        { src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?h=1080&q=80", alt: "Property Exterior", category: "Property" },
        { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?h=1080&q=80", alt: "Pool Area", category: "Property" },
        { src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?h=1080&q=80", alt: "Kitchen", category: "Property" },
        { src: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?h=1080&q=80", alt: "Lounge", category: "Property" },
        { src: "https://plus.unsplash.com/premium_photo-1738099067683-d1a020a3988a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZHViYWklMjBnYXJkZW58ZW58MHx8MHx8fDA%3D", alt: "Garden", category: "Property" },
        { src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?h=1080&q=80", alt: "Patio", category: "Property" },

        // Deluxe Room (with balcony)
        { src: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?h=1080&q=80", alt: "Deluxe Balcony Bedroom", category: "Deluxe Room (with balcony)" },
        { src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?h=1080&q=80", alt: "Deluxe Balcony View", category: "Deluxe Room (with balcony)" },
        { src: "https://images.unsplash.com/photo-1591088398332-8a7791972843?h=1080&q=80", alt: "Deluxe Balcony Bathroom", category: "Deluxe Room (with balcony)" },
        { src: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?h=1080&q=80", alt: "Deluxe Balcony Interior", category: "Deluxe Room (with balcony)" },

        // Deluxe Room (with city view)
        { src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?h=1080&q=80", alt: "Deluxe City View Bedroom", category: "Deluxe Room (with city view)" },
        { src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?h=1080&q=80", alt: "Deluxe City View Living Area", category: "Deluxe Room (with city view)" },
        { src: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?h=1080&q=80", alt: "Deluxe City View Window", category: "Deluxe Room (with city view)" },

        // Standard Room
        { src: "https://images.unsplash.com/photo-1648634158203-199accfd7afc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3RhbmRhcmQlMjByb29tJTIwYmVkcm9vbXxlbnwwfHwwfHx8MA%3D%3D", alt: "Standard Room Bedroom", category: "Standard Room" },
        { src: "https://images.unsplash.com/photo-1724228319129-7cc33c9e8a2a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RhbmRhcmQlMjByb29tJTIwZGV0YWlsfGVufDB8fDB8fHww", alt: "Standard Room Interior", category: "Standard Room" },
        { src: "https://images.unsplash.com/photo-1745221847962-0397cc719b8e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN0YW5kYXJkJTIwcm9vbSUyMGRldGFpbHxlbnwwfHwwfHx8MA%3D%3D", alt: "Standard Room Detail", category: "Standard Room" },
    ];

    const filteredPhotos = galleryPhotos.filter(photo => photo.category === selectedCategory);

    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="max-w-[1224px] w-full mx-auto px-4 xl:px-0 py-8">
                <div className="relative flex items-center justify-center mb-8">
                    <Link
                        href={`/properties/${slug}/${id}`}
                        className="absolute left-0 p-2 hover:bg-accent rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-lg font-semibold text-center">Hopo Homes - {propertyName}</h1>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 mb-8 scrollbar-hide">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-all duration-200 ${selectedCategory === category
                                    ? 'border-black text-black font-medium bg-transparent shadow-sm'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredPhotos.map((photo, index) => (
                        <div key={index} className="aspect-[4/3] relative rounded-xl overflow-hidden group bg-muted">
                            <img
                                src={photo.src}
                                alt={photo.alt}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
