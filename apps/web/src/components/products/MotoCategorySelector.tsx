'use client';

import { MOTO_CATEGORIES } from '@cnarsugu/utils';
import type { MotoCategory } from '@cnarsugu/types';

interface CategoryCardProps {
  category: { code: MotoCategory; label: string; description: string };
  isSelected: boolean;
  onSelect: () => void;
}

function CategoryCard({ category, isSelected, onSelect }: CategoryCardProps) {
  const categoryImages: Record<MotoCategory, string> = {
    DJAKARTA: '🛵',
    GROSSE_CYLINDREE: '🏍️',
    MOTO_TAXI: '🚕',
  };

  return (
    <button
      onClick={onSelect}
      className={`flex flex-col items-center p-6 rounded-lg border-2 transition-all ${
        isSelected
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

interface MotoCategorySelectorProps {
  selectedCategory: MotoCategory | null;
  onSelectCategory: (category: MotoCategory) => void;
}

export function MotoCategorySelector({
  selectedCategory,
  onSelectCategory,
}: MotoCategorySelectorProps) {
  const categories = Object.values(MOTO_CATEGORIES);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Sélectionnez votre catégorie de moto</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard
            key={category.code}
            category={category}
            isSelected={selectedCategory === category.code}
            onSelect={() => onSelectCategory(category.code)}
          />
        ))}
      </div>
    </div>
  );
}
