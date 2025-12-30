import { BlogForm } from "@/components/admin/BlogForm";
import { requireStaff } from "@/lib/auth-utils";

export default async function NewBlogPage() {
    await requireStaff();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Blog Post</h1>
                <p className="text-muted-foreground">
                    Add a new blog post to your website.
                </p>
            </div>

            <BlogForm />
        </div>
    );
}
