'use client';

import Image from 'next/image';
import { ArrowRight, Bed, Bath } from 'lucide-react';

const PROPERTIES = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60",
        title: "The Pinnacle at Highland Park",
        price: "$3,567,798.00",
        address: "123 Maple Street, New York",
        beds: 5,
        baths: 2,
        status: "For Sale"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
        title: "The Pinnacle at Highland Park",
        price: "$2,490,899.99",
        address: "789 Forest Lane, Denver, CO",
        beds: 5,
        baths: 2,
        status: "For Sale"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop&q=60",
        title: "The Pinnacle at Highland Park",
        price: "$4,567,450.00",
        address: "123 Serenity Drive, Austin, TX",
        beds: 5,
        baths: 2,
        status: "For Sale"
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&auto=format&fit=crop&q=60",
        title: "The Pinnacle at Highland Park",
        price: "$3,567,798.00",
        address: "123 Maple Street, New York",
        beds: 5,
        baths: 2,
        status: "For Sale"
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&auto=format&fit=crop&q=60",
        title: "The Pinnacle at Highland Park",
        price: "$2,490,899.99",
        address: "789 Forest Lane, Denver, CO",
        beds: 5,
        baths: 2,
        status: "For Sale"
    },
    {
        id: 6,
        image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&auto=format&fit=crop&q=60",
        title: "The Pinnacle at Highland Park",
        price: "$4,567,450.00",
        address: "123 Serenity Drive, Austin, TX",
        beds: 5,
        baths: 2,
        status: "For Sale"
    }
];

export default function PremierHouses() {
    return (
        <section className="py-20  bg-background px-6 lg:px-8">
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
                    <button className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
                        See All Properties <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {PROPERTIES.map((property) => (
                        <div key={property.id} className="flex flex-col group cursor-pointer">
                            {/* Image Container */}
                            <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden mb-5">
                                <Image
                                    src={property.image}
                                    alt={property.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Badge */}
                                <div className="absolute top-5 left-5 bg-card/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold text-card-foreground shadow-sm">
                                    {property.status}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex flex-col gap-2">
                                {/* Icons Row */}
                                <div className="flex items-center gap-6 text-muted-foreground text-sm mb-1">
                                    <div className="flex items-center gap-2">
                                        <Bed className="w-5 h-5 stroke-1" />
                                        <span>{property.beds} Bedrooms</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Bath className="w-5 h-5 stroke-1" />
                                        <span>{property.baths} Bathroom</span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-medium text-foreground tracking-tight">
                                    {property.title}
                                </h3>

                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <span className="font-semibold text-foreground">{property.price}</span>
                                    <span className="w-1 h-1 bg-muted-foreground/40 rounded-full"></span>
                                    <span>{property.address}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
