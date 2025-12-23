'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useProductFormulas } from '@/lib/hooks';
import { useAppSelector, useAppDispatch, CoverageFormula } from '@cnarsugu/store';
// Using simple HTML entities and text for icons

export default function CoveragePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get product selection from Redux
  const productSelection = useAppSelector((state) => state.productSelection);
  const { selectedProductType, autoSelection, motoSelection, multirisqueSelection } = productSelection;

  const [selectedFormula, setSelectedFormula] = useState<CoverageFormula | null>(null);

  // For now, we'll use a mock product ID since we don't have the exact product structure
  // In a real implementation, you'd get this from the product selection
  const mockProductId = selectedProductType === 'AUTO' ? 1 :
    selectedProductType === 'MOTO' ? 2 :
      selectedProductType === 'MULTIRISK_PRO' ? 3 : 4;

  // Get formulas for the selected product
  const { data: formulas, loading, error } = useProductFormulas(mockProductId);

  useEffect(() => {
    // Redirect to products if no product selected
    if (!selectedProductType) {
      router.push('/products');
    }
  }, [selectedProductType, router]);

  const handleFormulaSelect = (formula: CoverageFormula) => {
    setSelectedFormula(formula);
  };

  const handleContinue = () => {
    if (selectedFormula) {
      // Store the selected formula in Redux (you'd need to add this action)
      // For now, just navigate to enrollment
      router.push('/enrollment');
    }
  };

  const handleBack = () => {
    router.push('/products');
  };

  const formatPrice = (price: string) => {
    return `${price} FCFA`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'essentiel': 'bg-blue-100 text-blue-800',
      'confort': 'bg-green-100 text-green-800',
      'premium': 'bg-purple-100 text-purple-800',
      'excellence': 'bg-gold-100 text-gold-800',
    };
    return colors[category.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (!selectedProductType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Aucun produit sélectionné</p>
          <Button onClick={() => router.push('/products')}>Choisir un produit</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner className="w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des formules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur lors du chargement des formules</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mr-4"
            >
              ← Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Choisissez votre formule
              </h1>
              <p className="text-gray-600">
                {selectedProductType === 'AUTO' ? 'Auto Prestige' :
                  selectedProductType === 'MOTO' ? 'Moto' :
                    selectedProductType === 'MULTIRISK_PRO' ? 'Multirisque Professionnelle' :
                      selectedProductType === 'IAC' ? 'IAC' : 'Produit sélectionné'}
              </p>
            </div>
          </div>

          {/* Product Summary */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <h3 className="font-medium text-blue-900">
                  {selectedProductType === 'AUTO' ? 'Auto Prestige' :
                    selectedProductType === 'MOTO' ? 'Moto' :
                      selectedProductType === 'MULTIRISK_PRO' ? 'Multirisque Professionnelle' :
                        selectedProductType === 'IAC' ? 'IAC' : 'Produit sélectionné'}
                </h3>
                <p className="text-sm text-blue-700">
                  {selectedProductType === 'AUTO' ? 'Assurance automobile complète avec plusieurs formules' :
                    selectedProductType === 'MOTO' ? 'Protection complète pour votre deux-roues' :
                      selectedProductType === 'MULTIRISK_PRO' ? 'Packages professionnels adaptés à votre activité' :
                        selectedProductType === 'IAC' ? 'Indemnité Accident Corporel - Protection en cas d\'accident' :
                          'Description du produit sélectionné'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulas */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {formulas && Array.isArray(formulas) && formulas.length > 0 ? (
          <div className="space-y-6">
            {formulas.map((formula) => (
              <Card
                key={formula.id}
                className={`cursor-pointer transition-all duration-200 ${selectedFormula?.id === formula.id
                    ? 'ring-2 ring-blue-500 shadow-lg'
                    : 'hover:shadow-md'
                  }`}
                onClick={() => handleFormulaSelect(formula)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-xl">
                          {formula.type}
                        </CardTitle>
                        <Badge className={getCategoryColor(formula.category)}>
                          {formula.category}
                        </Badge>
                        {selectedFormula?.id === formula.id && (
                          <div className="flex items-center text-blue-600">
                            <span className="mr-1">✓</span>
                            <span className="text-sm font-medium">Sélectionné</span>
                          </div>
                        )}
                      </div>
                      <CardDescription className="text-base">
                        {formula.description}
                      </CardDescription>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-green-600">
                        {formatPrice(formula.price)}
                      </div>
                      <p className="text-sm text-gray-500">par mois</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Coverage Details */}
                  {formula.coverage && formula.coverage.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <span className="mr-2">🛡️</span>
                        Garanties incluses
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {formula.coverage.map((coverage: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span className="text-green-500 flex-shrink-0">✓</span>
                            <span className="text-sm text-gray-700">{coverage}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Coverage Link */}
                  {formula.coverageLink && (
                    <div className="mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(formula.coverageLink, '_blank');
                        }}
                      >
                        ℹ️ Voir les conditions détaillées
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛡️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune formule disponible
            </h3>
            <p className="text-gray-600 mb-4">
              Aucune formule n'est actuellement disponible pour ce produit.
            </p>
            <Button onClick={handleBack}>
              Choisir un autre produit
            </Button>
          </div>
        )}

        {/* Continue Button */}
        {selectedFormula && (
          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">
                  Formule sélectionnée : {selectedFormula.type}
                </h3>
                <p className="text-sm text-gray-600">
                  {formatPrice(selectedFormula.price)} par mois
                </p>
              </div>
              <Button
                onClick={handleContinue}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continuer l'inscription
              </Button>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8">
          <Alert>
            <AlertDescription>
              <strong>Besoin d'aide ?</strong> Nos conseillers sont disponibles pour vous aider à choisir
              la formule qui correspond le mieux à vos besoins.
              <Button variant="link" className="p-0 h-auto font-normal underline ml-1">
                Contactez-nous
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}