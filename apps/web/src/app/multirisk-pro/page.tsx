'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetMultirisquePackagesQuery } from '@cnarsugu/store';
import { BUSINESS_TYPES, formatPrice } from '@cnarsugu/utils';
import type { MultirisquePackage, BusinessType } from '@cnarsugu/types';
import { useAppDispatch } from '@cnarsugu/store';
import { setMultirisqueSelection } from '@cnarsugu/store';

// Package Card Component
function PackageCard({
  pkg,
  onSubscribe,
}: {
  pkg: MultirisquePackage;
  onSubscribe: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  const businessTypeInfo = Object.values(BUSINESS_TYPES).find(
    (bt) => bt.code === pkg.businessType
  );

  const businessTypeIcons: Record<BusinessType, string> = {
    BOUTIQUE: '🏪',
    RESTAURANT: '🍽️',
    HOTEL: '🏨',
    BAR_CLUB: '🍹',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="text-5xl mb-3 text-center">
          {businessTypeIcons[pkg.businessType]}
        </div>
        <h3 className="text-2xl font-bold text-center mb-2">{pkg.name}</h3>
        <p className="text-sm text-gray-600 text-center mb-4">
          {businessTypeInfo?.description}
        </p>

        {/* Price */}
        <div className="text-center mb-4">
          <p className="text-4xl font-bold text-primary">
            {formatPrice(pkg.priceTtc)}
          </p>
          <p className="text-sm text-gray-500">TTC par an</p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {/* Details Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mb-4 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          {showDetails ? '▲ Masquer les détails' : '▼ Voir détails'}
        </button>

        {/* Coverage Details (Collapsible) */}
        {showDetails && (
          <div className="mb-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
            {pkg.coverageDetails.chapters.map((chapter, chapterIndex) => (
              <div key={chapterIndex} className="mb-4 last:mb-0">
                <h4 className="font-semibold text-sm text-gray-800 mb-2 uppercase">
                  {chapter.name}
                </h4>
                <div className="space-y-2">
                  {chapter.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="text-xs bg-white rounded p-2 border border-gray-100"
                    >
                      <div className="flex items-start mb-1">
                        <span className="text-green-600 mr-2 mt-0.5">✓</span>
                        <span className="font-medium text-gray-700 flex-1">
                          {item.description}
                        </span>
                      </div>
                      <div className="ml-5 text-gray-600">
                        <div>Capital: {formatPrice(item.capital)}</div>
                        <div className="text-xs text-gray-500">
                          Franchise: {item.franchise}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subscribe Button */}
        <button
          onClick={onSubscribe}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Souscrire
        </button>
      </div>
    </div>
  );
}

import { useRouter } from 'next/navigation';

export default function MultirisqueProPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Fetch all multirisk packages
  const { data: packages, isLoading, error } = useGetMultirisquePackagesQuery();

  const handleSubscribe = (pkg: MultirisquePackage) => {
    // Set multirisk selection in Redux
    dispatch(
      setMultirisqueSelection({
        packageCode: pkg.packageCode,
        name: pkg.name,
        businessType: pkg.businessType,
        price: pkg.priceTtc,
        coverageDetails: pkg.coverageDetails,
      })
    );

    // Navigate to enrollment page
    router.push('/enrollment');
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Breadcrumb / Title Section */}
      <div className="container mx-auto px-6 mb-8">
        <Link href="/" className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-4 inline-flex items-center transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Multirisque Professionnelle</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
          Protégez votre activité professionnelle avec nos formules adaptées
        </p>
      </div>

      <main className="container mx-auto px-6 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Chargement des formules...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">
              Une erreur est survenue lors du chargement des formules.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-primary hover:underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Packages Grid */}
        {!isLoading && !error && packages && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                Choisissez la formule adaptée à votre activité
              </h2>
              <p className="text-gray-600">
                Nos formules couvrent les risques spécifiques à chaque type d'activité professionnelle
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {packages
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    onSubscribe={() => handleSubscribe(pkg)}
                  />
                ))}
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">
                Pourquoi choisir notre Multirisque Professionnelle ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl mb-2">🛡️</div>
                  <h4 className="font-semibold mb-2">Protection complète</h4>
                  <p className="text-sm text-gray-600">
                    Couverture adaptée aux risques spécifiques de votre activité professionnelle
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">💼</div>
                  <h4 className="font-semibold mb-2">Formules métier</h4>
                  <p className="text-sm text-gray-600">
                    Des garanties pensées pour chaque type d'activité : boutique, restaurant, hôtel, bar
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">⚡</div>
                  <h4 className="font-semibold mb-2">Souscription rapide</h4>
                  <p className="text-sm text-gray-600">
                    Obtenez votre attestation en quelques minutes et protégez votre activité immédiatement
                  </p>
                </div>
              </div>
            </div>

            {/* Coverage Information */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3 text-blue-900">
                Garanties communes à toutes les formules
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-0.5">✓</span>
                  <span className="text-gray-700">
                    Responsabilité Civile Exploitation
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-0.5">✓</span>
                  <span className="text-gray-700">
                    Dommages aux biens (incendie, dégâts des eaux, vol)
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-0.5">✓</span>
                  <span className="text-gray-700">
                    Bris de glace et équipements
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-0.5">✓</span>
                  <span className="text-gray-700">
                    Pertes d'exploitation
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!packages || packages.length === 0) && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-xl font-semibold mb-2">Aucune formule disponible</h3>
            <p className="text-gray-600">
              Les formules Multirisque Professionnelle seront bientôt disponibles.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
