import React from 'react';
import Image from "next/image";

const PROPERTIES = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1660361338517-8c8fbb3ac264?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdXNlfGVufDB8MnwwfHx8MA%3D%3D",
        title: "The Pink Brick Home",
        info: "Property Info"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2000&auto=format&fit=crop",
        title: "A Modern Corner House",
        info: "Property Info"
    }
];

export default function ExploreProperties() {
    return (
        <section className="bg-background py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-16 mb-10 md:mb-16 text-center md:text-left">
                    <div className="w-full md:w-1/2">
                        <span className="text-muted-foreground text-xs md:text-sm font-medium tracking-wide uppercase block mb-2 md:mb-3">
                            We'll Find You A Home
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-foreground leading-tight">
                            Explore Our Properties
                        </h2>
                    </div>

                    <div className="w-full md:w-1/2 md:pt-8">
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto md:mx-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incid idunt ut labore ellt dolore magna the alora aliqua alora the tolda on fouter.
                        </p>
                    </div>
                </div>

                {/* Properties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {PROPERTIES.map((property) => (
                        <div key={property.id} className="group cursor-pointer">
                            {/* Image Container */}
                            <div className="relative aspect-[4/3] overflow-hidden w-full">
                                <Image
                                    src={property.image}
                                    alt={property.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Content Box */}
                            <div className="bg-secondary/60 p-6 md:p-8">
                                <h3 className="text-xl md:text-2xl font-medium text-primary mb-1">
                                    {property.title}
                                </h3>
                                <p className="text-muted-foreground text-sm uppercase tracking-wide">
                                    {property.info}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
