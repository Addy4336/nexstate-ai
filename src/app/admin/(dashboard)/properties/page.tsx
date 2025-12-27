import { pool } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import Link from "next/link";
import { DeletePropertyButton } from "@/components/admin/DeletePropertyButton";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { requireStaff } from "@/lib/auth-utils";
import { getDriveImageUrl } from "@/lib/utils";

async function getProperties() {
    const client = await pool.connect();
    try {
        const res = await client.query(`
      SELECT * FROM property ORDER BY created_at DESC
    `);
        return res.rows;
    } finally {
        client.release();
    }
}

export default async function PropertiesPage() {
    // Verify staff access
    await requireStaff();

    const properties = await getProperties();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
                    <p className="text-muted-foreground">
                        Manage your property listings.
                    </p>
                </div>
                <Link href="/admin/properties/new">
                    <Button className="btn-primary">
                        <Plus className="mr-2 h-4 w-4" /> Add Property
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => (
                    <div key={property.id} className="bg-card rounded-xl border overflow-hidden shadow-sm flex flex-col">
                        <div className="relative aspect-video">
                            {property.images && property.images.length > 0 ? (
                                <Image
                                    src={getDriveImageUrl(property.images[0])}
                                    alt={property.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                                    No Image
                                </div>
                            )}
                            {property.featured && (
                                <div className="absolute top-2 left-2">
                                    <Badge className="bg-gradient-gold text-white border-0">Featured</Badge>
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                                    {property.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                            <p className="text-muted-foreground text-sm mb-2">{property.location}</p>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                <span>{property.bedrooms} Beds</span>
                                <span>{property.bathrooms} Baths</span>
                                <span>{property.area_sqft} sqft</span>
                            </div>

                            <div className="text-xl font-bold text-primary mt-auto">
                                AED {property.price.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                            </div>
                        </div>

                        <div className="p-4 pt-0 flex gap-2">
                            <Link href={`/admin/properties/${property.id}/edit`} className="flex-1">
                                <Button variant="outline" className="w-full">
                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                </Button>
                            </Link>
                            <DeletePropertyButton id={property.id} />
                        </div>
                    </div>
                ))}

                {properties.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-xl border border-dashed">
                        <p>No properties found.</p>
                        <Link href="/admin/properties/new" className="text-accent hover:underline mt-2 inline-block">
                            Create your first property
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
