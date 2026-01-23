import Image from "next/image";

const LIST_DATA = [
    {
        title: "Latest",
        items: [
            {
                id: 1,
                image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop",
                text: "Lorem Ipsum is simply dummy text of the printing"
            },
            {
                id: 2,
                image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop",
                text: "Lorem Ipsum is simply dummy text of the printing"
            },
            {
                id: 3,
                image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop",
                text: "Lorem Ipsum is simply dummy text of the printing"
            },
            {
                id: 4,
                image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop",
                text: "Lorem Ipsum is simply dummy text of the printing"
            }
        ]
    },
    {
        title: "Most Viewed",
        items: [
            {
                id: 5,
                image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=2070&auto=format&fit=crop",
                text: "Lorem Ipsum is simply dummy text of the printing"
            },
            {
                id: 6,
                image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop",
                text: "Lorem Ipsum is simply dummy text of the printing"
            },
            {
                id: 7,
                image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop",
                text: "Lorem Ipsum is simply dummy text of the printing"
            },
            {
                id: 8,
                image: "https://plus.unsplash.com/premium_photo-1676823571650-bae964e7010f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG91c2V8ZW58MHwyfDB8fHww",
                text: "Lorem Ipsum is simply dummy text of the printing"
            }
        ]
    },
    {
        title: "Stormy Choice",
        items: [
            {
                id: 9,
                image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop",
                text: "Lorem Ipsum is simply dummy text of the printing"
            },
            {
                id: 10,
                image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=2076&auto=format&fit=crop",
                text: "Lorem Ipsum is simply dummy text of the printing"
            },
            {
                id: 11,
                image: "https://images.unsplash.com/photo-1719887805632-de5be825f72b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG91c2V8ZW58MHwyfDB8fHww",
                text: "Lorem Ipsum is simply dummy text of the printing"
            },
            {
                id: 12,
                image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
                text: "Lorem Ipsum is simply dummy text of the printing"
            }
        ]
    }
];

export default function BlogLists() {
    return (
        <section className="py-8 md:py-12 bg-background">
            <div className="container mx-auto px-4 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {LIST_DATA.map((list, index) => (
                        <div key={index} className="bg-card rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-border p-4 md:p-6">

                            {/* Header */}
                            <div className="relative mb-4 md:mb-6 border-b border-border pb-2">
                                <span className={`${list.title === "Most Viewed" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"} px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-medium`}>
                                    {list.title}
                                </span>
                            </div>

                            {/* Items */}
                            <div className="flex flex-col gap-4 md:gap-6">
                                {list.items.map((item, itemIndex) => (
                                    <div key={item.id} className="group flex gap-3 md:gap-4 items-start">
                                        {/* Image */}
                                        <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                                            <Image
                                                src={item.image}
                                                alt="Blog thumbnail"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>

                                        {/* Text */}
                                        <div className="flex-1 py-1 border-b border-border pb-4 md:pb-6 last:border-0 last:pb-0">
                                            <p className="text-card-foreground text-xs md:text-sm font-medium leading-relaxed group-hover:text-primary transition-colors line-clamp-3 md:line-clamp-none">
                                                {item.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
