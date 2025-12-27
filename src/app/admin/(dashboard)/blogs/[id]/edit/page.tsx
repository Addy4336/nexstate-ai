import { pool } from "@/lib/db";
import { BlogForm } from "@/components/admin/BlogForm";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth-utils";

async function getBlog(id: string) {
    const client = await pool.connect();
    try {
        const res = await client.query(`SELECT * FROM blog WHERE id = $1`, [id]);
        return res.rows[0] || null;
    } finally {
        client.release();
    }
}

interface EditBlogPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
    // Verify staff access
    await requireStaff();

    const { id } = await params;
    const blog = await getBlog(id);

    if (!blog) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
                <p className="text-muted-foreground">
                    Update your blog post content and settings.
                </p>
            </div>

            <BlogForm initialData={blog} />
        </div>
    );
}
