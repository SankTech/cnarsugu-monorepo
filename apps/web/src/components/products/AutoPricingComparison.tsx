'use client';

import { useMemo } from 'react';
import { formatPrice } from '@cnarsugu/utils';
import type { AutoPricing, AutoFormulaType, CVRange } from '@cnarsugu/types';

interface FormulaColumnProps {
  formula: AutoFormulaType;
  pricing: AutoPricing | undefined;
  cvRange: CVRange;
  onSubscribe: () => void;
  isHighlighted?: boolean;
}

function FormulaColumn({
  formula,
  pricing,
  cvRange,
  onSubscribe,
  isHighlighted = false,
}: FormulaColumnProps) {
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
      className={`flex-1 border rounded-lg p-6 ${
        isHighlighted
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
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              isHighlighted
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

interface AutoPricingComparisonProps {
  allPricing: AutoPricing[] | undefined;
  selectedCVRange: CVRange;
  onSubscribe: (formula: AutoFormulaType, pricing: AutoPricing) => void;
}

export function AutoPricingComparison({
  allPricing,
  selectedCVRange,
  onSubscribe,
}: AutoPricingComparisonProps) {
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

  return (
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
            onSubscribe('TIERS', pricingByFormula.TIERS)
          }
        />
        <FormulaColumn
          formula="ESSENTIELLE"
          pricing={pricingByFormula.ESSENTIELLE}
          cvRange={selectedCVRange}
          onSubscribe={() =>
            pricingByFormula.ESSENTIELLE &&
            onSubscribe('ESSENTIELLE', pricingByFormula.ESSENTIELLE)
          }
          isHighlighted
        />
        <FormulaColumn
          formula="ETENDUE"
          pricing={pricingByFormula.ETENDUE}
          cvRange={selectedCVRange}
          onSubscribe={() =>
            pricingByFormula.ETENDUE &&
            onSubscribe('ETENDUE', pricingByFormula.ETENDUE)
          }
        />
        <FormulaColumn
          formula="CONFORT"
          pricing={pricingByFormula.CONFORT}
          cvRange={selectedCVRange}
          onSubscribe={() =>
            pricingByFormula.CONFORT &&
            onSubscribe('CONFORT', pricingByFormula.CONFORT)
          }
        />
      </div>
    </>
  );
}
