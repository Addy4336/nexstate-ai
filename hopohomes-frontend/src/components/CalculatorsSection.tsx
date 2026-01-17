"use client";

import { useState } from "react";
import TenantCostCalculator from "@/components/tenants/TenantCostCalculator";
import OwnerROICalculator from "@/components/owner/OwnerROICalculator";

export default function CalculatorsSection() {
    const [activeTab, setActiveTab] = useState<'tenant' | 'owner'>('tenant');

    return (
        <section className="py-12 bg-background relative" id="calculator">

            {/* Tab Switcher (Centered in Container) */}
            <div className="container px-4 mx-auto relative z-20 mb-[-40px]">
                <div className="flex justify-center">
                    <div className="inline-flex items-center bg-white/80 dark:bg-zinc-800/80 p-1.5 rounded-2xl border border-border/50 backdrop-blur-md shadow-lg z-20">
                        <button
                            onClick={() => setActiveTab('tenant')}
                            className={`px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${activeTab === 'tenant'
                                    ? 'bg-primary text-primary-foreground shadow-md scale-100'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                🏠 True Cost Calculator
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('owner')}
                            className={`px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${activeTab === 'owner'
                                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-100'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                💼 ROI Calculator
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area (Full Width) */}
            <div className="relative min-h-[800px] transition-all duration-500 pt-10">
                <div className={`transition-all duration-500 absolute w-full top-0 left-0 ${activeTab === 'tenant' ? 'opacity-100 z-10 translate-y-0' : 'opacity-0 z-0 translate-y-4 pointer-events-none'}`}>
                    <TenantCostCalculator />
                </div>

                <div className={`transition-all duration-500 absolute w-full top-0 left-0 ${activeTab === 'owner' ? 'opacity-100 z-10 translate-y-0' : 'opacity-0 z-0 translate-y-4 pointer-events-none'}`}>
                    <OwnerROICalculator />
                </div>
            </div>
        </section>
    );
}
