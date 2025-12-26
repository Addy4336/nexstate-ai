import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "@fontsource/plus-jakarta-sans/300.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HOPO Homes - Premium Furnished Rentals in Dubai",
    template: "%s | HOPO Homes",
  },
  description:
    "Find your perfect fully-furnished apartment, villa, or co-living space in Dubai. HOPO Homes offers ready-to-move-in properties with flexible leases and AI-powered property matching.",
  keywords: [
    "Dubai rentals",
    "furnished apartments Dubai",
    "co-living Dubai",
    "short-term rentals UAE",
    "property management Dubai",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
