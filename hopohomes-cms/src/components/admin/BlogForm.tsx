"use client";

import { useState } from "react";
import { ImageUpload } from "./ImageUpload";
import { RichTextEditor } from "./RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createBlogPost, updateBlogPost } from "@/actions/blog-actions";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface BlogFormProps {
    initialData?: any;
}

const categories = [
    { value: "general", label: "General" },
    { value: "market-news", label: "Market News" },
    { value: "investment-tips", label: "Investment Tips" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "property-guides", label: "Property Guides" },
    { value: "area-spotlight", label: "Area Spotlight" },
];

export function BlogForm({ initialData }: BlogFormProps) {
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [folderId, setFolderId] = useState(initialData?.drive_folder_id || "");
    const router = useRouter();

    // Auto-generate slug from title
    const generateSlug = (titleValue: string) => {
        return titleValue
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        // Only auto-generate slug if creating new post or slug hasn't been manually edited
        if (!initialData?.id || slug === generateSlug(initialData?.title || "")) {
            setSlug(generateSlug(newTitle));
        }
    };

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        formData.set("images", images.join(","));
        formData.set("folderId", folderId);
        formData.set("slug", slug);
        formData.set("content", content);

        try {
            let result;
            if (initialData?.id) {
                result = await updateBlogPost(initialData.id, formData);
            } else {
                result = await createBlogPost(formData);
            }

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(initialData ? "Blog post updated!" : "Blog post created!");
                router.push("/admin/blogs");
            }
        } catch (e: any) {
            console.error("Form error:", e);
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Blog Title</Label>
                    <Input
                        id="title"
                        name="title"
                        placeholder="e.g. Top 10 Investment Opportunities in Dubai"
                        required
                        value={title}
                        onChange={handleTitleChange}
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                        id="slug"
                        name="slug"
                        placeholder="auto-generated-from-title"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                        The URL will be: /blog/{slug || "your-post-slug"}
                    </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                        id="excerpt"
                        name="excerpt"
                        placeholder="A short summary of the blog post..."
                        className="h-20"
                        defaultValue={initialData?.excerpt}
                    />
                    <p className="text-xs text-muted-foreground">
                        This will be shown in blog listings and previews.
                    </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label>Content</Label>
                    <RichTextEditor
                        content={content}
                        onChange={setContent}
                        placeholder="Write your blog content here..."
                    />
                    <input type="hidden" name="content" value={content} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" defaultValue={initialData?.category || "general"}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                    {cat.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={initialData?.status || "draft"}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <ImageUpload
                        onImagesChange={setImages}
                        onFolderIdChange={setFolderId}
                        defaultImages={initialData?.images}
                        folderName={title ? `blog-${title}` : "blog-images"}
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <Save className="w-4 h-4 mr-2" />
                    )}
                    {initialData ? "Update Blog Post" : "Create Blog Post"}
                </Button>
            </div>
        </form>
    );
}

