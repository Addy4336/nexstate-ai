
import { PropertyForm } from "@/components/admin/PropertyForm";
import { pool } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    // Await params as per Next.js 15/16 requirements
    const { id } = await params;

    const client = await pool.connect();
    let property = null;
    try {
        const result = await client.query('SELECT * FROM property WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            property = result.rows[0];
        }
    } finally {
        client.release();
    }

    if (!property) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
            <PropertyForm initialData={property} />
        </div>
    );
}
