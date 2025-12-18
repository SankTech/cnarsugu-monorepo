'use client';

import { useState } from 'react';
import { BUSINESS_TYPES, formatPrice } from '@cnarsugu/utils';
import type { MultirisquePackage, BusinessType } from '@cnarsugu/types';

interface MultirisquePackageCardProps {
  pkg: MultirisquePackage;
  onSubscribe: () => void;
}

export function MultirisquePackageCard({
  pkg,
  onSubscribe,
}: MultirisquePackageCardProps) {
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
