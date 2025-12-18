'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useGetAllMotoPricingQuery, useGetIACProductQuery } from '@cnarsugu/store';
import { MOTO_CATEGORIES, formatPrice } from '@cnarsugu/utils';
import type { MotoPricing, MotoFormulaType, MotoCategory } from '@cnarsugu/types';
import { useAppDispatch } from '@cnarsugu/store';
import { setMotoSelection } from '@cnarsugu/store';

// Category Card Component
function CategoryCard({
  category,
  isSelected,
  onSelect,
}: {
  category: { code: MotoCategory; label: string; description: string };
  isSelected: boolean;
  onSelect: () => void;
}) {
  const categoryImages: Record<MotoCategory, string> = {
    DJAKARTA: '🛵',
    GROSSE_CYLINDREE: '🏍️',
    MOTO_TAXI: '🚕',
  };

  return (
    <button
      onClick={onSelect}
      className={`flex flex-col items-center p-6 rounded-lg border-2 transition-all ${isSelected
        ? 'border-primary bg-blue-50 shadow-lg'
        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
        }`}
    >
      <div className="text-6xl mb-4">{categoryImages[category.code]}</div>
      <h3 className="text-xl font-bold mb-2">{category.label}</h3>
      <p className="text-sm text-gray-600 text-center">{category.description}</p>
      {isSelected && (
        <div className="mt-3 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
          SÉLECTIONNÉ
        </div>
      )}
    </button>
  );
}

// Formula Comparison Component
function FormulaComparison({
  tiersPrice,
  essentiellePrice,
  category,
  onSubscribe,
}: {
  tiersPrice: MotoPricing | undefined;
  essentiellePrice: MotoPricing | undefined;
  category: MotoCategory;
  onSubscribe: (formula: MotoFormulaType, pricing: MotoPricing) => void;
}) {
  const { data: iacProduct } = useGetIACProductQuery();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Tiers Formula */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h3 className="text-2xl font-bold mb-2">Tiers</h3>
        <p className="text-sm text-gray-600 mb-4">Protection de base</p>

        {tiersPrice ? (
          <>
            <div className="mb-6">
              <p className="text-4xl font-bold text-primary">
                {formatPrice(tiersPrice.price12m)}
              </p>
              <p className="text-sm text-gray-500">par an</p>
            </div>

            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-sm text-gray-700">Garanties incluses :</h4>
              {tiersPrice.coverages.map((coverage, index) => (
                <div key={index} className="flex items-start text-sm">
                  <span className="text-green-600 mr-2 mt-0.5">✓</span>
                  <span className="text-gray-700">{coverage}</span>
                </div>
              ))}
            </div>

            {iacProduct && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold mb-2">Option disponible :</p>
                <p className="text-xs text-gray-600">
                  Ajoutez l'IAC pour +{formatPrice(iacProduct.price)} par an
                </p>
              </div>
            )}

            <button
              onClick={() => onSubscribe('TIERS', tiersPrice)}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Souscrire
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">Non disponible</p>
          </div>
        )}
      </div>

      {/* Essentielle Formula */}
      <div className="border-2 border-primary rounded-lg p-6 bg-blue-50 shadow-lg relative">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs font-semibold px-4 py-1 rounded-full">
          RECOMMANDÉ
        </div>

        <h3 className="text-2xl font-bold mb-2 mt-2">Essentielle</h3>
        <p className="text-sm text-gray-600 mb-4">Protection complète avec IAC inclus</p>

        {essentiellePrice ? (
          <>
            <div className="mb-6">
              <p className="text-4xl font-bold text-primary">
                {formatPrice(essentiellePrice.price12m)}
              </p>
              <p className="text-sm text-gray-500">par an</p>
            </div>

            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-sm text-gray-700">Garanties incluses :</h4>
              {essentiellePrice.coverages.map((coverage, index) => (
                <div key={index} className="flex items-start text-sm">
                  <span className="text-green-600 mr-2 mt-0.5">✓</span>
                  <span className="text-gray-700">{coverage}</span>
                </div>
              ))}
            </div>

            {essentiellePrice.includesIac && iacProduct && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <span className="text-green-600 mr-2">✓</span>
                  <p className="text-sm font-semibold text-green-800">IAC INCLUS</p>
                </div>
                <ul className="space-y-1 text-xs text-gray-700 ml-6">
                  <li>Décès : {formatPrice(iacProduct.deathCapital)}</li>
                  <li>Invalidité : {formatPrice(iacProduct.disabilityCapital)}</li>
                  <li>Frais de traitement : {formatPrice(iacProduct.treatmentCapital)}</li>
                </ul>
              </div>
            )}

            <button
              onClick={() => onSubscribe('ESSENTIELLE', essentiellePrice)}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Souscrire
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">Non disponible</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Upgrade Modal Component
function UpgradeModal({
  isOpen,
  onClose,
  onUpgrade,
  tiersPrice,
  essentiellePrice,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  tiersPrice: number;
  essentiellePrice: number;
}) {
  if (!isOpen) return null;

  const additionalPrice = essentiellePrice - tiersPrice;
  const { data: iacProduct } = useGetIACProductQuery();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <h3 className="text-2xl font-bold mb-4">
          Passez à la formule Essentielle
        </h3>
        <p className="text-gray-600 mb-4">
          Bénéficiez d'une protection complète avec l'IAC inclus pour seulement {formatPrice(additionalPrice)} de plus par an.
        </p>

        {iacProduct && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-2 text-green-800">Avantages IAC inclus :</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Indemnité en cas de décès : {formatPrice(iacProduct.deathCapital)}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Indemnité en cas d'invalidité : {formatPrice(iacProduct.disabilityCapital)}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Frais de traitement : {formatPrice(iacProduct.treatmentCapital)}</span>
              </li>
            </ul>
          </div>
        )}

        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 mb-1">Seulement</p>
          <p className="text-3xl font-bold text-primary">
            +{formatPrice(additionalPrice)}
          </p>
          <p className="text-sm text-gray-500">par an</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onUpgrade}
            className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Passer à Essentielle
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Rester sur Tiers
          </button>
        </div>
      </div>
    </div>
  );
}

import { useRouter } from 'next/navigation';

export default function MotoPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState<MotoCategory | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [pendingTiersSelection, setPendingTiersSelection] = useState<MotoPricing | null>(null);

  // Fetch all moto pricing data
  const { data: allPricing, isLoading, error } = useGetAllMotoPricingQuery();

  // Filter pricing based on selected category
  const filteredPricing = useMemo(() => {
    if (!allPricing || !selectedCategory) return [];
    return allPricing.filter((p) => p.category === selectedCategory);
  }, [allPricing, selectedCategory]);

  // Organize pricing by formula type
  const pricingByFormula = useMemo(() => {
    const result: Partial<Record<MotoFormulaType, MotoPricing>> = {};
    filteredPricing.forEach((pricing) => {
      result[pricing.formulaType] = pricing;
    });
    return result;
  }, [filteredPricing]);

  const handleSubscribe = (formula: MotoFormulaType, pricing: MotoPricing) => {
    // If Tiers formula, show upgrade modal
    if (formula === 'TIERS' && pricingByFormula.ESSENTIELLE) {
      setPendingTiersSelection(pricing);
      setShowUpgradeModal(true);
    } else {
      // For Essentielle, proceed directly
      proceedToEnrollment(formula, pricing);
    }
  };

  const handleUpgrade = () => {
    if (pricingByFormula.ESSENTIELLE) {
      proceedToEnrollment('ESSENTIELLE', pricingByFormula.ESSENTIELLE);
    }
    setShowUpgradeModal(false);
    setPendingTiersSelection(null);
  };

  const handleCloseUpgradeModal = () => {
    if (pendingTiersSelection) {
      proceedToEnrollment('TIERS', pendingTiersSelection);
    }
    setShowUpgradeModal(false);
    setPendingTiersSelection(null);
  };

  const proceedToEnrollment = (formula: MotoFormulaType, pricing: MotoPricing) => {
    if (!selectedCategory) return;

    // Set moto selection in Redux
    dispatch(
      setMotoSelection({
        category: selectedCategory,
        formula,
        price: pricing.price12m,
        coverages: pricing.coverages,
        includesIac: pricing.includesIac,
      })
    );

    // Navigate to enrollment page
    router.push('/enrollment');
  };

  const categories = Object.values(MOTO_CATEGORIES);

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
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Assurance Moto</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
          Protégez votre deux-roues avec nos formules adaptées
        </p>
      </div>

      <main className="container mx-auto px-6 py-8">
        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Sélectionnez votre catégorie de moto</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.code}
                category={category}
                isSelected={selectedCategory === category.code}
                onSelect={() => setSelectedCategory(category.code)}
              />
            ))}
          </div>
        </div>

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

        {/* Formula Comparison */}
        {!isLoading && !error && selectedCategory && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                Comparez nos formules pour {MOTO_CATEGORIES[selectedCategory].label}
              </h2>
              <p className="text-gray-600">
                Choisissez la protection qui correspond à vos besoins
              </p>
            </div>

            <FormulaComparison
              tiersPrice={pricingByFormula.TIERS}
              essentiellePrice={pricingByFormula.ESSENTIELLE}
              category={selectedCategory}
              onSubscribe={handleSubscribe}
            />

            {/* Additional Information */}
            <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">
                Pourquoi assurer votre moto avec nous ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl mb-2">🏍️</div>
                  <h4 className="font-semibold mb-2">Toutes catégories</h4>
                  <p className="text-sm text-gray-600">
                    Des formules adaptées à tous les types de deux-roues
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🛡️</div>
                  <h4 className="font-semibold mb-2">Protection complète</h4>
                  <p className="text-sm text-gray-600">
                    Responsabilité civile et options de protection corporelle
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">⚡</div>
                  <h4 className="font-semibold mb-2">Souscription rapide</h4>
                  <p className="text-sm text-gray-600">
                    Obtenez votre attestation en quelques minutes
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Prompt to select category */}
        {!isLoading && !error && !selectedCategory && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">🏍️</div>
            <h3 className="text-xl font-semibold mb-2">Sélectionnez votre catégorie</h3>
            <p className="text-gray-600">
              Choisissez la catégorie de votre moto pour voir les formules disponibles
            </p>
          </div>
        )}
      </main>

      {/* Upgrade Modal */}
      {pricingByFormula.TIERS && pricingByFormula.ESSENTIELLE && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={handleCloseUpgradeModal}
          onUpgrade={handleUpgrade}
          tiersPrice={pricingByFormula.TIERS.price12m}
          essentiellePrice={pricingByFormula.ESSENTIELLE.price12m}
        />
      )}
    </div>
  );
}
