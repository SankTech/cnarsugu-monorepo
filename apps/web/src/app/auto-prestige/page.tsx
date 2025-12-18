'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useGetAllAutoPricingQuery, useGetIACProductQuery } from '@cnarsugu/store';
import { CV_RANGES, formatPrice } from '@cnarsugu/utils';
import type { AutoPricing, AutoFormulaType, CVRange } from '@cnarsugu/types';
import { useAppDispatch } from '@cnarsugu/store';
import { setAutoSelection, setIACAddOn } from '@cnarsugu/store';

// IAC Cross-sell Modal Component
function IACCrossSellModal({
  isOpen,
  onClose,
  onAddIAC,
  iacPrice,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddIAC: () => void;
  iacPrice: number;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <h3 className="text-2xl font-bold mb-4">
          Protégez-vous davantage avec l'IAC
        </h3>
        <p className="text-gray-600 mb-4">
          L'Indemnité en cas d'Accident Corporel (IAC) vous offre une protection supplémentaire en cas d'accident.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-2">Avantages inclus :</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Indemnité en cas de décès : 2,000,000 FCFA</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Indemnité en cas d'invalidité : 2,000,000 FCFA</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Frais de traitement : 500,000 FCFA</span>
            </li>
          </ul>
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 mb-1">Seulement</p>
          <p className="text-3xl font-bold text-primary">
            +{formatPrice(iacPrice)}
          </p>
          <p className="text-sm text-gray-500">par an</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onAddIAC}
            className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Ajouter l'IAC
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Continuer sans IAC
          </button>
        </div>
      </div>
    </div>
  );
}

// Formula Column Component
function FormulaColumn({
  formula,
  pricing,
  cvRange,
  onSubscribe,
  isHighlighted = false,
}: {
  formula: AutoFormulaType;
  pricing: AutoPricing | undefined;
  cvRange: CVRange;
  onSubscribe: () => void;
  isHighlighted?: boolean;
}) {
  const formulaLabels: Record<AutoFormulaType, string> = {
    TIERS: 'Tiers',
    ESSENTIELLE: 'Essentielle',
    ETENDUE: 'Étendue',
    CONFORT: 'Confort',
  };

  const formulaDescriptions: Record<AutoFormulaType, string> = {
    TIERS: 'Protection de base',
    ESSENTIELLE: 'Protection complète',
    ETENDUE: 'Protection étendue',
    CONFORT: 'Protection maximale',
  };

  return (
    <div
      className={`flex-1 border rounded-lg p-6 ${isHighlighted
        ? 'border-primary border-2 shadow-lg bg-blue-50'
        : 'border-gray-200 bg-white'
        }`}
    >
      {isHighlighted && (
        <div className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
          RECOMMANDÉ
        </div>
      )}

      <h3 className="text-xl font-bold mb-1">{formulaLabels[formula]}</h3>
      <p className="text-sm text-gray-600 mb-4">{formulaDescriptions[formula]}</p>

      {pricing ? (
        <>
          <div className="mb-6">
            <p className="text-3xl font-bold text-primary">
              {formatPrice(pricing.price12m)}
            </p>
            <p className="text-sm text-gray-500">par an</p>
          </div>

          <div className="space-y-3 mb-6">
            {pricing.coverages.map((coverage, index) => (
              <div key={index} className="flex items-start text-sm">
                <span className="text-green-600 mr-2 mt-0.5">✓</span>
                <span className="text-gray-700">{coverage}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onSubscribe}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${isHighlighted
              ? 'bg-primary text-white hover:opacity-90'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
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
  );
}

import { useRouter } from 'next/navigation';

export default function AutoPrestigePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedCVRange, setSelectedCVRange] = useState<CVRange>(CV_RANGES[1]); // Default to 2-4 CV
  const [showIACModal, setShowIACModal] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<{
    formula: AutoFormulaType;
    pricing: AutoPricing;
  } | null>(null);

  // Fetch all auto pricing data
  const { data: allPricing, isLoading, error } = useGetAllAutoPricingQuery();

  // Fetch IAC product data
  const { data: iacProduct } = useGetIACProductQuery();

  // Filter pricing based on selected CV range
  const filteredPricing = useMemo(() => {
    if (!allPricing) return [];
    return allPricing.filter(
      (p) => p.cvMin === selectedCVRange.min && p.cvMax === selectedCVRange.max
    );
  }, [allPricing, selectedCVRange]);

  // Organize pricing by formula type
  const pricingByFormula = useMemo(() => {
    const result: Partial<Record<AutoFormulaType, AutoPricing>> = {};
    filteredPricing.forEach((pricing) => {
      result[pricing.formulaType] = pricing;
    });
    return result;
  }, [filteredPricing]);

  const handleSubscribe = (formula: AutoFormulaType, pricing: AutoPricing) => {
    // If Tiers formula, show IAC cross-sell modal
    if (formula === 'TIERS' && iacProduct) {
      setPendingSelection({ formula, pricing });
      setShowIACModal(true);
    } else {
      // For other formulas, proceed directly
      proceedToEnrollment(formula, pricing, false);
    }
  };

  const handleAddIAC = () => {
    if (pendingSelection && iacProduct) {
      // Set IAC add-on in Redux
      dispatch(
        setIACAddOn({
          selected: true,
          price: iacProduct.price,
          deathCapital: iacProduct.deathCapital,
          disabilityCapital: iacProduct.disabilityCapital,
          treatmentCapital: iacProduct.treatmentCapital,
        })
      );
      proceedToEnrollment(pendingSelection.formula, pendingSelection.pricing, true);
    }
    setShowIACModal(false);
    setPendingSelection(null);
  };

  const handleCloseIACModal = () => {
    if (pendingSelection) {
      proceedToEnrollment(pendingSelection.formula, pendingSelection.pricing, false);
    }
    setShowIACModal(false);
    setPendingSelection(null);
  };

  const proceedToEnrollment = (
    formula: AutoFormulaType,
    pricing: AutoPricing,
    addIac: boolean
  ) => {
    // Set auto selection in Redux
    dispatch(
      setAutoSelection({
        cvRange: selectedCVRange,
        formula,
        price: pricing.price12m,
        coverages: pricing.coverages,
        addIac,
      })
    );

    // Navigate to coverage selection page
    router.push('/coverage');
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
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Auto Prestige</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
          Choisissez la formule d'assurance automobile adaptée à votre véhicule
        </p>
      </div>

      <main className="container mx-auto px-6 py-8">
        {/* CV Range Selector */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <label className="block text-sm font-semibold mb-3">
            Sélectionnez la puissance de votre véhicule (CV)
          </label>
          <select
            value={`${selectedCVRange.min}-${selectedCVRange.max}`}
            onChange={(e) => {
              const [min, max] = e.target.value.split('-').map(Number);
              const range = CV_RANGES.find((r) => r.min === min && r.max === max);
              if (range) setSelectedCVRange(range);
            }}
            className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
          >
            {CV_RANGES.map((range) => (
              <option key={`${range.min}-${range.max}`} value={`${range.min}-${range.max}`}>
                {range.label}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-2">
            Les prix varient selon la puissance fiscale de votre véhicule
          </p>
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

        {/* Comparison Table */}
        {!isLoading && !error && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                Comparez nos formules pour {selectedCVRange.label}
              </h2>
              <p className="text-gray-600">
                Toutes nos formules incluent la responsabilité civile obligatoire
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormulaColumn
                formula="TIERS"
                pricing={pricingByFormula.TIERS}
                cvRange={selectedCVRange}
                onSubscribe={() =>
                  pricingByFormula.TIERS &&
                  handleSubscribe('TIERS', pricingByFormula.TIERS)
                }
              />
              <FormulaColumn
                formula="ESSENTIELLE"
                pricing={pricingByFormula.ESSENTIELLE}
                cvRange={selectedCVRange}
                onSubscribe={() =>
                  pricingByFormula.ESSENTIELLE &&
                  handleSubscribe('ESSENTIELLE', pricingByFormula.ESSENTIELLE)
                }
                isHighlighted
              />
              <FormulaColumn
                formula="ETENDUE"
                pricing={pricingByFormula.ETENDUE}
                cvRange={selectedCVRange}
                onSubscribe={() =>
                  pricingByFormula.ETENDUE &&
                  handleSubscribe('ETENDUE', pricingByFormula.ETENDUE)
                }
              />
              <FormulaColumn
                formula="CONFORT"
                pricing={pricingByFormula.CONFORT}
                cvRange={selectedCVRange}
                onSubscribe={() =>
                  pricingByFormula.CONFORT &&
                  handleSubscribe('CONFORT', pricingByFormula.CONFORT)
                }
              />
            </div>

            {/* Additional Information */}
            <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">
                Pourquoi choisir Auto Prestige ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl mb-2">🚗</div>
                  <h4 className="font-semibold mb-2">Protection adaptée</h4>
                  <p className="text-sm text-gray-600">
                    Des formules conçues pour tous les types de véhicules et tous les budgets
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">⚡</div>
                  <h4 className="font-semibold mb-2">Souscription rapide</h4>
                  <p className="text-sm text-gray-600">
                    Obtenez votre attestation d'assurance en quelques minutes
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">💰</div>
                  <h4 className="font-semibold mb-2">Prix transparents</h4>
                  <p className="text-sm text-gray-600">
                    Aucun frais caché, le prix affiché est le prix final
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* IAC Cross-sell Modal */}
      <IACCrossSellModal
        isOpen={showIACModal}
        onClose={handleCloseIACModal}
        onAddIAC={handleAddIAC}
        iacPrice={iacProduct?.price || 5000}
      />
    </div>
  );
}
