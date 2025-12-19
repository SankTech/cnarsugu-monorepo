'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { useGetInsuranceProductsQuery, type InsuranceProduct } from '@cnarsugu/store';

export default function Home() {
  const { data: allProductsResult, isLoading: loadingNew } = useGetInsuranceProductsQuery({});
  const { data: legacyProductsResult, isLoading: loadingLegacy } = useGetInsuranceProductsQuery({ productType: 'LEGACY' });

  const newProducts = allProductsResult?.data?.filter(p => ['AUTO', 'MOTO', 'MULTIRISK_PRO', 'IAC'].includes(p.productType)) || [];
  const legacyProducts = legacyProductsResult?.data || [];
  const loading = loadingNew || loadingLegacy;

  const getProductIcon = (productType: string): string => {
    switch (productType) {
      case 'AUTO':
        return '🚗';
      case 'MOTO':
        return '🏍️';
      case 'MULTIRISK_PRO':
        return '🏢';
      case 'IAC':
        return '🛡️';
      default:
        return '📄';
    }
  };

  const getProductHref = (product: InsuranceProduct): string => {
    switch (product.productType) {
      case 'AUTO':
        return '/auto-prestige';
      case 'MOTO':
        return '/moto';
      case 'MULTIRISK_PRO':
        return '/multirisk-pro';
      case 'IAC':
        return '/iac';
      default:
        return `/products/${product.id}`;
    }
  };
  return (
    <div className="flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-hero-gradient opacity-5 skew-y-3 transform origin-top-left scale-110"></div>
          <div className="container mx-auto px-6 relative text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-primary-400 text-sm font-semibold mb-6 border border-primary-100 dark:border-slate-700">
              Assurance 100% Digitale 🚀
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">
              L'assurance <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-500">réinventée</span>;
              <br />
              L'espace d'assurance
              par excellence
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Souscrivez en quelques minutes à nos offres exclusives. Simple, rapide et transparent. Protégez ce qui compte le plus pour vous.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#products"
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-xl shadow-primary-500/20 transition-all hover:scale-105 active:scale-95"
              >
                Découvrir nos offres
              </Link>
              <Link
                href="/enrollment"
                className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Obtenir un devis
              </Link>
            </div>
          </div>
        </section>

        {/* New Products Section */}
        <section id="products" className="py-20 bg-white dark:bg-slate-800/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Nos Solutions Digitales</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                Des produits conçus pour votre tranquillité d'esprit, accessibles en un clic.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-gray-600">Chargement des produits...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {newProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={getProductHref(product)}
                    className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-8 rounded-2xl shadow-soft hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${product.color}20`, color: product.color }}
                    >
                      {getProductIcon(product.productType)}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                      {product.description}
                    </p>
                    {product.price && (
                      <p className="text-primary font-semibold mt-2">
                        À partir de {product.price}
                      </p>
                    )}
                    <div className="mt-6 flex items-center text-primary-600 font-semibold text-sm">
                      En savoir plus
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Existing/Legacy Products Grid - simplified for cleaner look */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-6">
            <h3 className="text-2xl font-bold mb-10 text-slate-900 dark:text-white border-l-4 border-primary-500 pl-4">Autres Protections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Transposed existing items with simpler styling */}
              {[
                { icon: '🏥', title: 'Santé (+AMO)', desc: 'Couverture maladie et accident complète.' },
                { icon: '✈️', title: 'Assistance Voyage', desc: 'Voyagez l\'esprit tranquille partout dans le monde.' },
                { icon: '🚚', title: 'Transport', desc: 'Sécurité optimale pour vos marchandises.' },
                { icon: '🔧', title: 'Risques Techniques', desc: 'Protection chantiers et équipements industriels.' },
                { icon: '🎓', title: 'RC Scolaire', desc: 'Assurance scolaire pour les élèves et établissements.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start p-6 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                  <div className="text-3xl mr-4">{item.icon}</div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-slate-500 italic">
              * Ces produits sont disponibles en agence. Contactez-nous pour plus d'informations.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
