import { pool } from "@/lib/db";
import { requireStaff } from "@/lib/auth-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Edit, FileText, HelpCircle, Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DeleteBlogButton } from "@/components/admin/DeleteBlogButton";
import { DeleteFaqButton } from "@/components/admin/DeleteFaqButton";
import { ToggleFaqButton } from "@/components/admin/ToggleFaqButton";

async function getBlogs() {
    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT * FROM blog ORDER BY created_at DESC
        `);
        return res.rows;
    } finally {
        client.release();
    }
}

async function getFaqs() {
    const client = await pool.connect();
    try {
        const res = await client.query(`
            SELECT * FROM faq ORDER BY sort_order ASC, created_at DESC
        `);
        return res.rows;
    } finally {
        client.release();
    }
}

function getStatusVariant(status: string) {
    switch (status) {
        case "published":
            return "default";
        case "draft":
            return "secondary";
        case "archived":
            return "outline";
        default:
            return "secondary";
    }
}

function getBlogCategoryLabel(category: string) {
    const labels: Record<string, string> = {
        "general": "General",
        "market-news": "Market News",
        "investment-tips": "Investment Tips",
        "lifestyle": "Lifestyle",
        "property-guides": "Property Guides",
        "area-spotlight": "Area Spotlight",
    };
    return labels[category] || category;
}

function getFaqCategoryLabel(category: string) {
    const labels: Record<string, string> = {
        "general": "General",
        "properties": "Properties",
        "investment": "Investment",
        "buying": "Buying",
        "selling": "Selling",
        "renting": "Renting",
        "legal": "Legal",
        "finance": "Finance",
    };
    return labels[category] || category;
}

function getFaqCategoryColor(category: string) {
    const colors: Record<string, string> = {
        "general": "bg-gray-100 text-gray-700",
        "properties": "bg-blue-100 text-blue-700",
        "investment": "bg-green-100 text-green-700",
        "buying": "bg-purple-100 text-purple-700",
        "selling": "bg-orange-100 text-orange-700",
        "renting": "bg-cyan-100 text-cyan-700",
        "legal": "bg-red-100 text-red-700",
        "finance": "bg-amber-100 text-amber-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
}

export default async function MarketingPage() {
    await requireStaff();

    const [blogs, faqs] = await Promise.all([getBlogs(), getFaqs()]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Marketing</h1>
                <p className="text-muted-foreground">
                    Manage your blog posts and frequently asked questions.
                </p>
            </div>

            <Tabs defaultValue="blogs" className="space-y-6">
                <div className="flex items-center justify-between">
                    <TabsList className="grid w-[300px] grid-cols-2">
                        <TabsTrigger value="blogs" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Blogs ({blogs.length})
                        </TabsTrigger>
                        <TabsTrigger value="faqs" className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4" />
                            FAQs ({faqs.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Dynamic action button based on tab - handled by separate components */}
                </div>

                {/* Blogs Tab */}
                <TabsContent value="blogs" className="space-y-6">
                    <div className="flex justify-end">
                        <Link href="/admin/marketing/blogs/new">
                            <Button className="btn-primary">
                                <Plus className="mr-2 h-4 w-4" /> Add Blog Post
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {blogs.map((blog) => (
                            <div key={blog.id} className="bg-card rounded-xl border overflow-hidden shadow-sm flex flex-col">
                                <div className="relative aspect-video">
                                    {blog.cover_image ? (
                                        <Image
                                            src={blog.cover_image}
                                            alt={blog.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                                            No Cover Image
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2">
                                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                                            {getBlogCategoryLabel(blog.category)}
                                        </Badge>
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <Badge variant={getStatusVariant(blog.status)}>
                                            {blog.status}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-semibold text-lg line-clamp-2">{blog.title}</h3>
                                    {blog.excerpt && (
                                        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                                            {blog.excerpt}
                                        </p>
                                    )}

                                    <div className="mt-auto pt-4 text-xs text-muted-foreground">
                                        {blog.published_at ? (
                                            <span>Published {formatDistanceToNow(new Date(blog.published_at), { addSuffix: true })}</span>
                                        ) : (
                                            <span>Created {formatDistanceToNow(new Date(blog.created_at), { addSuffix: true })}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 pt-0 flex gap-2">
                                    <Link href={`/admin/marketing/blogs/${blog.id}/edit`} className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            <Edit className="w-4 h-4 mr-2" /> Edit
                                        </Button>
                                    </Link>
                                    <DeleteBlogButton id={blog.id} title={blog.title} />
                                </div>
                            </div>
                        ))}

                        {blogs.length === 0 && (
                            <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-xl border border-dashed">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No blog posts found.</p>
                                <Link href="/admin/marketing/blogs/new" className="text-accent hover:underline mt-2 inline-block">
                                    Create your first blog post
                                </Link>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* FAQs Tab */}
                <TabsContent value="faqs" className="space-y-6">
                    <div className="flex justify-end">
                        <Link href="/admin/marketing/faqs/new">
                            <Button className="btn-primary">
                                <Plus className="mr-2 h-4 w-4" /> Add FAQ
                            </Button>
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>All FAQs</CardTitle>
                            <CardDescription>
                                Manage frequently asked questions displayed on your website.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {faqs.length === 0 ? (
                                <div className="py-12 text-center text-muted-foreground">
                                    <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No FAQs found.</p>
                                    <Link href="/admin/marketing/faqs/new" className="text-accent hover:underline mt-2 inline-block">
                                        Create your first FAQ
                                    </Link>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">#</TableHead>
                                            <TableHead>Question</TableHead>
                                            <TableHead className="w-[120px]">Category</TableHead>
                                            <TableHead className="w-[100px]">Status</TableHead>
                                            <TableHead className="w-[150px] text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {faqs.map((faq, index) => (
                                            <TableRow key={faq.id}>
                                                <TableCell className="font-medium text-muted-foreground">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <p className="font-medium line-clamp-1">{faq.question}</p>
                                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                                            {faq.answer.substring(0, 80)}...
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getFaqCategoryColor(faq.category)}>
                                                        {getFaqCategoryLabel(faq.category)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <ToggleFaqButton
                                                        id={faq.id}
                                                        isActive={faq.is_active}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/admin/marketing/faqs/${faq.id}/edit`}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <DeleteFaqButton id={faq.id} question={faq.question} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
