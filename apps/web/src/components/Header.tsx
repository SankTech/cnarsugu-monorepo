
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

export const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/">
                    <Logo />
                </Link>
                
                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <Link href="/products" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        Produits
                    </Link>
                    <Link href="/terms" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        Conditions
                    </Link>
                    <Link href="#contact" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        Contact
                    </Link>
                    <Link
                        href="/enrollment"
                        className="ml-4 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors shadow-lg shadow-primary-500/30"
                    >
                        Obtenir un devis
                    </Link>
                </nav>
                
                {/* Mobile menu button */}
                <button 
                    onClick={toggleMobileMenu}
                    className="md:hidden text-slate-600 dark:text-slate-300 p-2"
                    aria-label="Toggle mobile menu"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                    <nav className="container mx-auto px-6 py-4 space-y-4">
                        <Link 
                            href="/products" 
                            className="block text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Produits
                        </Link>
                        <Link 
                            href="/terms" 
                            className="block text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Conditions
                        </Link>
                        <Link 
                            href="#contact" 
                            className="block text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Contact
                        </Link>
                        <Link
                            href="/enrollment"
                            className="block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors text-center font-semibold"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Obtenir un devis
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
};
