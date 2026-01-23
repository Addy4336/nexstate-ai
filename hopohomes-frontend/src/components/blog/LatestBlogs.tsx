import Image from "next/image";

const BLOG_POSTS = [
    {
        id: 1,
        author: {
            name: "Desirae Curtis",
            avatar: "https://randomuser.me/api/portraits/women/1.jpg",
            date: "5 Aug 2024",
            readTime: "5 mins"
        },
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000&auto=format&fit=crop",
        title: "Lorem Ipsum is simply dummy text of the printing and",
        description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece"
    },
    {
        id: 2,
        author: {
            name: "Gustavo George",
            avatar: "https://randomuser.me/api/portraits/men/2.jpg",
            date: "5 Aug 2024",
            readTime: "5 mins"
        },
        image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=2070&auto=format&fit=crop",
        title: "Lorem Ipsum is simply dummy text of the printing",
        description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in"
    },
    {
        id: 3,
        author: {
            name: "Allison Rhiel",
            avatar: "https://randomuser.me/api/portraits/women/3.jpg",
            date: "5 Aug 2024",
            readTime: "5 mins"
        },
        image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=2070&auto=format&fit=crop",
        title: "Lorem Ipsum is simply dummy text of the printing",
        description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in"
    },
    {
        id: 4,
        author: {
            name: "Gretchen Ekstrom",
            avatar: "https://randomuser.me/api/portraits/women/4.jpg",
            date: "5 Aug 2024",
            readTime: "5 mins"
        },
        image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2070&auto=format&fit=crop",
        title: "Lorem Ipsum is simply dummy text of the printing",
        description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a"
    },
    {
        id: 5,
        author: {
            name: "Corey Mango",
            avatar: "https://randomuser.me/api/portraits/men/5.jpg",
            date: "5 Aug 2024",
            readTime: "5 mins"
        },
        image: "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=2070&auto=format&fit=crop",
        title: "Lorem Ipsum is simply dummy text of the printing",
        description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a"
    },
    {
        id: 6,
        author: {
            name: "Wilson Workman",
            avatar: "https://randomuser.me/api/portraits/men/6.jpg",
            date: "5 Aug 2024",
            readTime: "5 mins"
        },
        image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cm9vbXxlbnwwfDJ8MHx8fDA%3D",
        title: "Lorem Ipsum is simply dummy text of the printing",
        description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a"
    },
    {
        id: 7,
        author: {
            name: "Erin Franci",
            avatar: "https://randomuser.me/api/portraits/women/7.jpg",
            date: "5 Aug 2024",
            readTime: "5 mins"
        },
        image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=2070&auto=format&fit=crop",
        title: "Lorem Ipsum is simply dummy text of the printing",
        description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a"
    },
    {
        id: 8,
        author: {
            name: "Kaiya Westervelt",
            avatar: "https://randomuser.me/api/portraits/women/8.jpg",
            date: "5 Aug 2024",
            readTime: "5 mins"
        },
        image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2000&auto=format&fit=crop",
        title: "Lorem Ipsum is simply dummy text of the printing",
        description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a"
    },
    {
        id: 9,
        author: {
            name: "Carter Vetrovs",
            avatar: "https://randomuser.me/api/portraits/men/9.jpg",
            date: "5 Aug 2024",
            readTime: "5 mins"
        },
        image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=2000&auto=format&fit=crop",
        title: "Lorem Ipsum is simply dummy text of the printing",
        description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a"
    }
];

export default function LatestBlogs() {
    return (
        <section className="py-12 md:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-12">

                {/* Header */}
                <div className="mb-8 md:mb-12 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Here is the latest blogs</h2>
                    <p className="text-muted-foreground text-sm">lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {BLOG_POSTS.map((post) => (
                        <div key={post.id} className="group flex flex-col p-3 md:p-4 rounded-2xl border border-border bg-card shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-shadow duration-300">
                            {/* Image */}
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 md:mb-4">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Author & Meta */}
                            <div className="flex items-center justify-between gap-3 mb-2 md:mb-3 w-full">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                                        <Image
                                            src={post.author.avatar}
                                            alt={post.author.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="font-medium text-xs md:text-sm text-card-foreground truncate max-w-[80px] md:max-w-none">{post.author.name}</span>
                                </div>
                                <span className="text-[10px] md:text-xs text-muted-foreground shrink-0">{post.author.date} • {post.author.readTime}</span>
                            </div>

                            {/* Content */}
                            <div className="space-y-1 md:space-y-2">
                                <h3 className="text-base md:text-lg font-bold text-card-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                                    {post.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
