import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="w-full bg-white dark:bg-neutral-950 border-b border-transparent">
            <div className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                        Finovia
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
                    <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
                    <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Work</Link>
                    <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Consultant</Link>
                    <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Business Solutions</Link>
                    <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Contact</Link>
                </div>

                <div>
                    <button className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                        Let's Talk
                    </button>
                </div>
            </div>
        </nav>
    );
}
