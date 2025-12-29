import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Saved Properties | HOPO Homes",
    description: "View your saved favorite properties",
};

export default function FavoritesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
