'use client';

import { formatPrice } from '@cnarsugu/utils';

interface IACCrossSellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIAC: () => void;
  iacPrice: number;
  deathCapital?: number;
  disabilityCapital?: number;
  treatmentCapital?: number;
}

export function IACCrossSellModal({
  isOpen,
  onClose,
  onAddIAC,
  iacPrice,
  deathCapital = 2000000,
  disabilityCapital = 2000000,
  treatmentCapital = 500000,
}: IACCrossSellModalProps) {
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
              <span>Indemnité en cas de décès : {formatPrice(deathCapital)}</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Indemnité en cas d'invalidité : {formatPrice(disabilityCapital)}</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Frais de traitement : {formatPrice(treatmentCapital)}</span>
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
