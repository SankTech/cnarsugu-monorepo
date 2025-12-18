'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dataService from '@/lib/dataService';
import type { InsuranceProduct, CoverageFormula } from '@/lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);

  const [product, setProduct] = useState<InsuranceProduct | null>(null);
  const [formulas, setFormulas] = useState<CoverageFormula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        
        // Load product details
        const productData = await dataService.getInsuranceProductById(productId);
        if (!productData) {
          setError('Produit non trouvé');
          return;
        }
        
        setProduct(productData);

        // Load formulas if available
        try {
          const formulasData = await dataService.getProductFormulas(productId);
          setFormulas(formulasData);
        } catch (formulaError) {
          console.warn('No formulas available for this product:', formulaError);
          // This is not an error for legacy products
        }
      } catch (err) {
        setError('Erreur lors du chargement du produit');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProductData();
    }
  }, [productId]);

  const handleSubscribe = () => {
    // For legacy products, redirect to enrollment with product info
    // You might want to store the product selection in Redux here
    router.push('/enrollment');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Chargement du produit...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">{error || 'Produit non trouvé'}</p>
              <div className="mt-4 space-x-4">
                <button
                  onClick={() => router.back()}
                  className="text-primary hover:underline"
                >
                  Retour
                </button>
                <Link href="/products" className="text-primary hover:underline">
                  Voir tous les produits
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Header */}
      <div className="container mx-auto px-6 mb-8">
        <Link href="/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-4 inline-flex items-center transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux produits
        </Link>
        
        <div className="flex items-start gap-6">
          {/* Product Icon */}
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
            style={{ backgroundColor: `${product.color}20`, color: product.color }}
          >
            {getProductIcon(product.productType)}
          </div>
          
          {/* Product Info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {product.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {product.description}
            </p>
            
            {/* Product Type Badge */}
            <div className="mt-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                product.productType === 'LEGACY' 
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {product.productType === 'LEGACY' ? 'Produit Existant' : 'Nouveau Produit'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Coverage Details */}
              {product.coverage && product.coverage.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4">Garanties incluses</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.coverage.map((coverage: string, index: number) => (
                      <div key={index} className="flex items-start">
                        <span className="text-green-600 mr-3 mt-1">✓</span>
                        <span className="text-gray-700">{coverage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulas (if available) */}
              {formulas.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4">Formules disponibles</h2>
                  <div className="space-y-4">
                    {formulas.map((formula) => (
                      <div key={formula.id} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-2">{formula.type}</h3>
                        <p className="text-gray-600 mb-3">{formula.description}</p>
                        
                        {formula.coverage && formula.coverage.length > 0 && (
                          <div className="mb-3">
                            <h4 className="font-medium mb-2">Garanties:</h4>
                            <ul className="space-y-1">
                              {formula.coverage.map((coverage: string, index: number) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start">
                                  <span className="text-green-600 mr-2">✓</span>
                                  <span>{coverage}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {formula.price && (
                          <div className="text-lg font-bold text-primary">
                            {formula.price}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-3">Information importante</h3>
                <p className="text-gray-700 mb-4">
                  {product.productType === 'LEGACY' 
                    ? 'Ce produit est disponible en agence. Pour plus d\'informations ou pour souscrire, veuillez nous contacter directement.'
                    : 'Ce produit peut être souscrit en ligne ou en agence selon vos préférences.'
                  }
                </p>
                
                {product.coverageLink && (
                  <a
                    href={product.coverageLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Consulter les conditions générales →
                  </a>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h3 className="text-xl font-bold mb-4">Souscrire</h3>
                
                {/* Price */}
                {product.price && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-1">À partir de</p>
                    <p className="text-2xl font-bold text-primary">{product.price}</p>
                    <p className="text-sm text-gray-500">par an</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  {product.productType === 'LEGACY' ? (
                    <>
                      <div className="text-center mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Disponible en agence
                        </p>
                      </div>
                      <a
                        href="tel:+224XXXXXXXXX"
                        className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-center block"
                      >
                        📞 Nous appeler
                      </a>
                      <a
                        href="mailto:contact@cnarsugu.com"
                        className="w-full bg-white border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center block"
                      >
                        ✉️ Nous écrire
                      </a>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSubscribe}
                        className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                      >
                        Souscrire en ligne
                      </button>
                      <a
                        href="tel:+224XXXXXXXXX"
                        className="w-full bg-white border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center block"
                      >
                        Obtenir un devis par téléphone
                      </a>
                    </>
                  )}
                </div>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold mb-3">Besoin d'aide ?</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>📞 +224 XXX XXX XXX</p>
                    <p>✉️ contact@cnarsugu.com</p>
                    <p>🕒 Lun-Ven: 8h-17h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}