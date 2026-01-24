import { Check, X } from "lucide-react";

export default function ResidentsVsOwners() {
    return (
        <section className="py-20 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">Value for Everyone</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Whether you are staying with us or partnering with us, Hopo Homes delivers unmatched value.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Residents Card */}
                    <div className="bg-background rounded-2xl p-8 border border-border shadow-sm flex flex-col">
                        <h3 className="text-2xl font-bold mb-6 text-foreground">For Residents</h3>
                        <ul className="space-y-4 flex-1">
                            {[
                                "Fully furnished, move-in-ready homes",
                                "Short–mid–long stay flexibility",
                                "All bills included in one monthly payment",
                                "Prime, well-connected Dubai locations",
                                "Hotel-grade cleaning and maintenance",
                                "100% digital journey from discovery to move-in"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                    <span className="text-muted-foreground">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Owners Card */}
                    <div className="bg-background rounded-2xl p-8 border border-border shadow-sm flex flex-col">
                        <h3 className="text-2xl font-bold mb-6 text-foreground">For Owners</h3>
                        <ul className="space-y-4 flex-1">
                            {[
                                "Higher, data-backed yields",
                                "End-to-end property and tenant management",
                                "Professional furnishing and listing setup",
                                "AI-based dynamic pricing and revenue forecasting",
                                "Transparent reporting and performance insights",
                                "Strong on-ground team and regulatory understanding"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                    <span className="text-muted-foreground">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
