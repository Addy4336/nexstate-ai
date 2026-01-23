'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function ContactNavbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="sticky top-0 left-0 right-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between transition-all duration-300">

                {/* Logo Section */}
                <div className="shrink-0 flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative h-10 w-28 md:w-36">
                            <Image
                                src="/image/logo.webp"
                                alt="Logo"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </div>
                    </Link>
                </div>

                {/* Desktop Menu - Centered */}
                <div className="hidden lg:flex items-center justify-center flex-1">
                    <div className="flex items-center gap-8 text-sm font-medium text-gray-600">
                        <Link href="/" className="hover:text-primary transition-colors">
                            Home
                        </Link>
                        <Link href="#" className="hover:text-primary transition-colors">
                            About Us
                        </Link>
                        <Link href="/properties-locations" className="hover:text-primary transition-colors">
                            Property List
                        </Link>
                        <Link href="#" className="hover:text-primary transition-colors">
                            Contact Us
                        </Link>
                    </div>
                </div>

                {/* Right Actions & Mobile Toggle */}
                <div className="flex items-center gap-3">

                    {/* Buttons - Desktop */}
                    <div className="hidden lg:flex items-center gap-3">

                        <button className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-full font-medium text-sm transition-all">
                            Login
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="lg:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-24 left-4 right-4 bg-white border border-gray-100 rounded-2xl shadow-xl animate-in slide-in-from-top-2 z-50">
                    <div className="p-4 space-y-2">
                        <Link href="/" className="block px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-base transition-colors">
                            Home
                        </Link>
                        <Link href="#" className="block px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-base transition-colors">
                            About Us
                        </Link>
                        <Link href="/properties-locations" className="block px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-base transition-colors">
                            Property List
                        </Link>
                        <Link href="#" className="block px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-base transition-colors">
                            Contact Us
                        </Link>
                        <div className="pt-4 border-t border-gray-100 mt-2 flex flex-col gap-3">

                            <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-full font-medium text-base transition-all">
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
