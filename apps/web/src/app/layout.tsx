import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CNAR Sugu - Assurance en Ligne',
  description: 'Plateforme d\'assurance en ligne pour l\'automobile, moto, multirisque professionnelle et plus',
  keywords: ['assurance', 'automobile', 'moto', 'multirisque', 'Gabon'],
  authors: [{ name: 'CNAR Sugu' }],
  openGraph: {
    title: 'CNAR Sugu - Assurance en Ligne',
    description: 'Plateforme d\'assurance en ligne pour l\'automobile, moto, multirisque professionnelle et plus',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 selection:bg-primary-100 selection:text-primary-900`}
      >
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
