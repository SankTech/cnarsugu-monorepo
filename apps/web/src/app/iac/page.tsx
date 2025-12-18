'use client';

import Link from 'next/link';
import { useGetIACProductQuery } from '@cnarsugu/store';
import { formatPrice } from '@cnarsugu/utils';
import { useAppDispatch } from '@cnarsugu/store';
import { setIACAddOn } from '@cnarsugu/store';

import { useRouter } from 'next/navigation';

export default function IACPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Fetch IAC product data
  const { data: iacProduct, isLoading, error } = useGetIACProductQuery();

  const handleSubscribe = () => {
    if (!iacProduct) return;

    // Set IAC selection in Redux
    dispatch(
      setIACAddOn({
        selected: true,
        price: iacProduct.price,
        deathCapital: iacProduct.deathCapital,
        disabilityCapital: iacProduct.disabilityCapital,
        treatmentCapital: iacProduct.treatmentCapital,
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
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Indemnité Accident Corporel (IAC)</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
          Protection financière en cas d'accident corporel
        </p>
      </div>

      <main className="container mx-auto px-6 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Chargement des informations...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">
              Une erreur est survenue lors du chargement des informations.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-primary hover:underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Product Content */}
        {!isLoading && !error && iacProduct && (
          <>
            {/* Hero Section */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8 text-center">
              <div className="text-6xl mb-4">🛡️</div>
              <h2 className="text-3xl font-bold mb-4">
                Protégez-vous et votre famille
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                L'Indemnité en cas d'Accident Corporel (IAC) vous offre une protection financière
                essentielle en cas d'accident. Une couverture complète pour vous et vos proches.
              </p>

              {/* Price Display */}
              <div className="inline-block bg-blue-50 border-2 border-primary rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">À partir de</p>
                <p className="text-5xl font-bold text-primary mb-2">
                  {formatPrice(iacProduct.price)}
                </p>
                <p className="text-sm text-gray-500">par an</p>
              </div>

              {/* Subscribe Button */}
              <div>
                <button
                  onClick={handleSubscribe}
                  className="bg-primary text-white px-12 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
                >
                  Souscrire maintenant
                </button>
                <p className="text-xs text-gray-500 mt-3">
                  Souscription rapide en quelques minutes
                </p>
              </div>
            </div>

            {/* Coverage Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Death Coverage */}
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-3">💔</div>
                  <h3 className="text-xl font-bold">Décès</h3>
                </div>
                <p className="text-3xl font-bold text-primary mb-2">
                  {formatPrice(iacProduct.deathCapital)}
                </p>
                <p className="text-sm text-gray-600">
                  Indemnité versée aux bénéficiaires en cas de décès suite à un accident
                </p>
              </div>

              {/* Disability Coverage */}
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-3">♿</div>
                  <h3 className="text-xl font-bold">Invalidité</h3>
                </div>
                <p className="text-3xl font-bold text-primary mb-2">
                  {formatPrice(iacProduct.disabilityCapital)}
                </p>
                <p className="text-sm text-gray-600">
                  Indemnité en cas d'invalidité permanente suite à un accident
                </p>
              </div>

              {/* Treatment Coverage */}
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-3">🏥</div>
                  <h3 className="text-xl font-bold">Frais de traitement</h3>
                </div>
                <p className="text-3xl font-bold text-primary mb-2">
                  {formatPrice(iacProduct.treatmentCapital)}
                </p>
                <p className="text-sm text-gray-600">
                  Prise en charge des frais médicaux suite à un accident
                </p>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Pourquoi choisir l'IAC ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="text-2xl mr-4 mt-1">✓</div>
                  <div>
                    <h4 className="font-semibold mb-2">Protection complète</h4>
                    <p className="text-sm text-gray-600">
                      Couverture en cas de décès, d'invalidité et prise en charge des frais médicaux
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-2xl mr-4 mt-1">✓</div>
                  <div>
                    <h4 className="font-semibold mb-2">Sécurité financière</h4>
                    <p className="text-sm text-gray-600">
                      Protégez votre famille et vos proches contre les conséquences financières d'un accident
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-2xl mr-4 mt-1">✓</div>
                  <div>
                    <h4 className="font-semibold mb-2">Souscription simple</h4>
                    <p className="text-sm text-gray-600">
                      Processus de souscription rapide et entièrement en ligne
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-2xl mr-4 mt-1">✓</div>
                  <div>
                    <h4 className="font-semibold mb-2">Prix abordable</h4>
                    <p className="text-sm text-gray-600">
                      Une protection essentielle à un tarif accessible pour tous
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-2xl mr-4 mt-1">✓</div>
                  <div>
                    <h4 className="font-semibold mb-2">Indemnisation rapide</h4>
                    <p className="text-sm text-gray-600">
                      Traitement accéléré des dossiers pour une indemnisation dans les meilleurs délais
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-2xl mr-4 mt-1">✓</div>
                  <div>
                    <h4 className="font-semibold mb-2">Complémentaire</h4>
                    <p className="text-sm text-gray-600">
                      Peut être souscrite seule ou en complément de votre assurance Auto ou Moto
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How it Works Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Comment ça marche ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h4 className="font-semibold mb-2">Souscrivez en ligne</h4>
                  <p className="text-sm text-gray-600">
                    Remplissez le formulaire de souscription en quelques minutes
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h4 className="font-semibold mb-2">Effectuez le paiement</h4>
                  <p className="text-sm text-gray-600">
                    Payez en toute sécurité par mobile money ou carte bancaire
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h4 className="font-semibold mb-2">Vous êtes protégé</h4>
                  <p className="text-sm text-gray-600">
                    Recevez votre attestation et bénéficiez immédiatement de votre couverture
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Questions fréquentes
              </h3>
              <div className="space-y-4 max-w-3xl mx-auto">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold mb-2">Qui peut souscrire à l'IAC ?</h4>
                  <p className="text-sm text-gray-600">
                    Toute personne majeure peut souscrire à l'IAC. Cette assurance peut être souscrite
                    seule ou en complément d'une assurance Auto ou Moto.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold mb-2">Quels types d'accidents sont couverts ?</h4>
                  <p className="text-sm text-gray-600">
                    L'IAC couvre tous les accidents corporels, qu'ils soient liés à la circulation routière,
                    domestiques, sportifs ou professionnels.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold mb-2">Comment déclarer un sinistre ?</h4>
                  <p className="text-sm text-gray-600">
                    En cas d'accident, contactez notre service client dans les plus brefs délais.
                    Vous devrez fournir un certificat médical et tout document justifiant l'accident.
                  </p>
                </div>

                <div className="pb-4">
                  <h4 className="font-semibold mb-2">Quel est le délai d'indemnisation ?</h4>
                  <p className="text-sm text-gray-600">
                    Une fois le dossier complet reçu, l'indemnisation est effectuée dans un délai
                    de 15 à 30 jours ouvrables selon la nature du sinistre.
                  </p>
                </div>
              </div>
            </div>

            {/* Final CTA */}
            <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">
                Prêt à vous protéger ?
              </h3>
              <p className="text-lg mb-8 opacity-90">
                Souscrivez dès maintenant et bénéficiez d'une protection complète
              </p>
              <button
                onClick={handleSubscribe}
                className="bg-white text-primary px-12 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Souscrire pour {formatPrice(iacProduct.price)}/an
              </button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && !iacProduct && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold mb-2">Produit non disponible</h3>
            <p className="text-gray-600">
              Le produit IAC n'est pas disponible pour le moment.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
