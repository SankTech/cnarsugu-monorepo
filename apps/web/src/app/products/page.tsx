'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dataService from '@/lib/dataService';
import type { InsuranceProduct } from '@/lib/api';

// Product Card Component
function ProductCard({ product }: { product: InsuranceProduct }) {
  const router = useRouter();

  const getProductHref = (product: InsuranceProduct) => {
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

  const handleClick = () => {
    const href = getProductHref(product);
    router.push(href);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-white border border-slate-100 dark:border-slate-700 p-6 rounded-2xl shadow-soft hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* New Product Badge */}
      {['AUTO', 'MOTO', 'MULTIRISK_PRO', 'IAC'].includes(product.productType) && (
        <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
          NOUVEAU
        </div>
      )}

      {/* Icon */}
      <div 
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform"
        style={{ backgroundColor: `${product.color}20`, color: product.color }}
      >
        {getProductIcon(product.productType)}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-primary transition-colors">
        {product.title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm mb-4">
        {product.description}
      </p>

      {/* Coverage Preview */}
      {product.coverage && product.coverage.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">Garanties incluses:</p>
          <ul className="space-y-1">
            {product.coverage.slice(0, 3).map((coverage: string, index: number) => (
              <li key={index} className="text-xs text-gray-600 flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>{coverage}</span>
              </li>
            ))}
            {product.coverage.length > 3 && (
              <li className="text-xs text-gray-500 italic">
                + {product.coverage.length - 3} autres garanties
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Price */}
      {product.price && (
        <div className="mb-4">
          <p className="text-lg font-bold text-primary">
            À partir de {product.price}
          </p>
        </div>
      )}

      {/* Action */}
      <div className="flex items-center text-primary font-semibold text-sm">
        En savoir plus
        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
  );
}

// Helper function to get product icons
function getProductIcon(productType: string): string {
  switch (productType) {
    case 'AUTO':
      return '🚗';
    case 'MOTO':
      return '🏍️';
    case 'MULTIRISK_PRO':
      return '🏢';
    case 'IAC':
      return '🛡️';
    case 'LEGACY':
      return '📋';
    default:
      return '📄';
  }
}

// Search Component
function ProductSearch({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Rechercher un produit..."
        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </form>
  );
}

// Filter Component
function ProductFilters({ 
  selectedFilter, 
  onFilterChange 
}: { 
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}) {
  const filters = [
    { id: 'all', label: 'Tous les produits' },
    { id: 'new', label: 'Nouveaux produits' },
    { id: 'individual', label: 'Particuliers' },
    { id: 'business', label: 'Entreprises' },
    { id: 'legacy', label: 'Autres produits' },
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedFilter === filter.id
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<InsuranceProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<InsuranceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await dataService.getInsuranceProducts();
        setAllProducts(products);
        setFilteredProducts(products);
      } catch (err) {
        setError('Erreur lors du chargement des produits');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = [...allProducts];

    // Apply filter
    switch (selectedFilter) {
      case 'new':
        filtered = filtered.filter(p => ['AUTO', 'MOTO', 'MULTIRISK_PRO', 'IAC'].includes(p.productType));
        break;
      case 'individual':
        filtered = filtered.filter(p => p.clientType === 1 || p.clientType === 3);
        break;
      case 'business':
        filtered = filtered.filter(p => p.clientType === 2 || p.clientType === 3);
        break;
      case 'legacy':
        filtered = filtered.filter(p => p.productType === 'LEGACY');
        break;
      case 'all':
      default:
        // No additional filtering
        break;
    }

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [allProducts, selectedFilter, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Chargement des produits...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-primary hover:underline"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Header */}
      <div className="container mx-auto px-6 mb-8">
        <Link href="/" className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-4 inline-flex items-center transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Nos Produits d'Assurance
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
          Découvrez notre gamme complète de produits d'assurance adaptés à vos besoins, 
          que vous soyez particulier ou entreprise.
        </p>
      </div>

      <main className="container mx-auto px-6">
        {/* Search and Filters */}
        <div className="mb-12 space-y-6">
          <ProductSearch onSearch={handleSearch} />
          <ProductFilters 
            selectedFilter={selectedFilter} 
            onFilterChange={handleFilterChange} 
          />
        </div>

        {/* Results Summary */}
        <div className="mb-8">
          <p className="text-gray-600">
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
            {searchQuery && ` pour "${searchQuery}"`}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? `Aucun produit ne correspond à votre recherche "${searchQuery}"`
                : 'Aucun produit ne correspond aux filtres sélectionnés'
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Voir tous les produits
            </button>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Besoin d'aide pour choisir ?</h3>
          <p className="text-gray-700 mb-6">
            Nos conseillers sont là pour vous accompagner dans le choix de votre assurance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+224XXXXXXXXX"
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              📞 Nous appeler
            </a>
            <a
              href="mailto:contact@cnarsugu.com"
              className="bg-white border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              ✉️ Nous écrire
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}