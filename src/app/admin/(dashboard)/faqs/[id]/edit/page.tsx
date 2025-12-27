import { pool } from "@/lib/db";
import { FaqForm } from "@/components/admin/FaqForm";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth-utils";

async function getFaq(id: string) {
    const client = await pool.connect();
    try {
        const res = await client.query(`SELECT * FROM faq WHERE id = $1`, [id]);
        return res.rows[0] || null;
    } finally {
        client.release();
    }
}

interface EditFaqPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditFaqPage({ params }: EditFaqPageProps) {
    await requireStaff();

    const { id } = await params;
    const faq = await getFaq(id);

    if (!faq) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit FAQ</h1>
                <p className="text-muted-foreground">
                    Update this frequently asked question.
                </p>
            </div>

            <FaqForm initialData={faq} />
        </div>
    );
}
