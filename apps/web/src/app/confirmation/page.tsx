'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@cnarsugu/store';
import { clearProductSelection, resetPaymentForm } from '@cnarsugu/store';
import { selectTotalPrice } from '@cnarsugu/store';
import { ProductType, AUTO_FORMULA_LABELS, MOTO_FORMULA_LABELS } from '@cnarsugu/types';
import { formatPrice } from '@cnarsugu/utils';

// ============================================================================
// Confirmation Page Component
// ============================================================================

export default function ConfirmationPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get product selection from Redux
  const productSelection = useAppSelector((state) => state.productSelection);
  const { selectedProductType, autoSelection, motoSelection, multirisqueSelection, iacAddOn } =
    productSelection;

  // Get payment state from Redux
  const paymentState = useAppSelector((state) => state.payment);
  const totalPrice = useAppSelector(selectTotalPrice);

  const [isDownloading, setIsDownloading] = useState(false);

  // Redirect if no payment success
  useEffect(() => {
    if (paymentState.status !== 'SUCCESS' || !selectedProductType) {
      router.push('/');
    }
  }, [paymentState.status, selectedProductType, router]);

  const handleDownloadReceipt = async () => {
    setIsDownloading(true);

    try {
      // TODO: Integrate with actual receipt generation API
      console.log('Downloading receipt for payment:', paymentState.paymentId);

      // Simulate download
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create a simple receipt text
      const receiptContent = generateReceiptText();
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recu-${paymentState.paymentId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert('Reçu téléchargé avec succès!');
    } catch (error) {
      console.error('Download error:', error);
      alert('Une erreur est survenue lors du téléchargement.');
    } finally {
      setIsDownloading(false);
    }
  };

  const generateReceiptText = (): string => {
    const lines: string[] = [];
    lines.push('='.repeat(50));
    lines.push('CNAR SUGU - REÇU DE PAIEMENT');
    lines.push('='.repeat(50));
    lines.push('');
    lines.push(`Numéro de paiement: ${paymentState.paymentId}`);
    lines.push(`Date: ${new Date().toLocaleString('fr-FR')}`);
    lines.push('');
    lines.push('-'.repeat(50));
    lines.push('DÉTAILS DU PRODUIT');
    lines.push('-'.repeat(50));
    lines.push('');

    if (selectedProductType === ProductType.AUTO && autoSelection) {
      lines.push('Produit: Auto Prestige');
      lines.push(`Formule: ${AUTO_FORMULA_LABELS[autoSelection.formula]}`);
      lines.push(`Puissance: ${autoSelection.cvRange.label}`);
      lines.push(`Prix: ${formatPrice(autoSelection.price)}`);
      if (autoSelection.addIac && iacAddOn) {
        lines.push(`IAC: +${formatPrice(iacAddOn.price)}`);
      }
    } else if (selectedProductType === ProductType.MOTO && motoSelection) {
      lines.push('Produit: Moto');
      lines.push(`Catégorie: ${motoSelection.category}`);
      lines.push(`Formule: ${MOTO_FORMULA_LABELS[motoSelection.formula]}`);
      lines.push(`Prix: ${formatPrice(motoSelection.price)}`);
      if (motoSelection.includesIac) {
        lines.push('IAC: Inclus');
      }
    } else if (selectedProductType === ProductType.MULTIRISK_PRO && multirisqueSelection) {
      lines.push('Produit: Multirisque Professionnelle');
      lines.push(`Package: ${multirisqueSelection.name}`);
      lines.push(`Type d\'activité: ${multirisqueSelection.businessType}`);
      lines.push(`Prix: ${formatPrice(multirisqueSelection.price)}`);
    } else if (selectedProductType === ProductType.IAC && iacAddOn) {
      lines.push('Produit: IAC (Indemnité Accident Corporel)');
      lines.push(`Prix: ${formatPrice(iacAddOn.price)}`);
    }

    lines.push('');
    lines.push('-'.repeat(50));
    lines.push(`TOTAL: ${formatPrice(totalPrice)}`);
    lines.push('-'.repeat(50));
    lines.push('');
    lines.push('Merci pour votre confiance!');
    lines.push('CNAR SUGU - Votre partenaire assurance');
    lines.push('='.repeat(50));

    return lines.join('\n');
  };

  const handleNewSubscription = () => {
    // Clear all selections
    dispatch(clearProductSelection());
    dispatch(resetPaymentForm());
    router.push('/');
  };

  if (paymentState.status !== 'SUCCESS' || !selectedProductType) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">✓ Souscription confirmée</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Votre paiement a été traité avec succès
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-600 rounded-lg p-8 mb-8 text-center">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
              Paiement réussi!
            </h2>
            <p className="text-green-700 dark:text-green-400 mb-4">
              Votre souscription a été enregistrée avec succès.
            </p>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 inline-block shadow-sm">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Numéro de confirmation</p>
              <p className="text-xl font-mono font-bold text-gray-800 dark:text-white">
                {paymentState.paymentId}
              </p>
            </div>
          </div>

          {/* Product Summary */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-8 border dark:border-slate-700">
            <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Récapitulatif de votre souscription</h2>

            {selectedProductType === ProductType.AUTO && autoSelection && (
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Produit</span>
                  <span className="font-semibold">Auto Prestige</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Formule</span>
                  <span className="font-semibold">{AUTO_FORMULA_LABELS[autoSelection.formula]}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Puissance</span>
                  <span className="font-semibold">{autoSelection.cvRange.label}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Prix de base</span>
                  <span className="font-semibold">{formatPrice(autoSelection.price)}</span>
                </div>
                {autoSelection.addIac && iacAddOn && (
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">IAC (Indemnité Accident Corporel)</span>
                    <span className="font-semibold">+{formatPrice(iacAddOn.price)}</span>
                  </div>
                )}

                {/* Coverage Summary */}
                <div className="mt-6 pt-6 border-t-2 border-gray-300">
                  <h3 className="font-semibold mb-3">Garanties incluses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {autoSelection.coverages.map((coverage, index) => (
                      <div key={index} className="flex items-start text-sm">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">{coverage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedProductType === ProductType.MOTO && motoSelection && (
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Produit</span>
                  <span className="font-semibold">Moto</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Catégorie</span>
                  <span className="font-semibold">{motoSelection.category}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Formule</span>
                  <span className="font-semibold">{MOTO_FORMULA_LABELS[motoSelection.formula]}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Prix</span>
                  <span className="font-semibold">{formatPrice(motoSelection.price)}</span>
                </div>
                {motoSelection.includesIac && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700 font-semibold">
                      ✓ IAC (Indemnité Accident Corporel) inclus
                    </p>
                  </div>
                )}

                {/* Coverage Summary */}
                <div className="mt-6 pt-6 border-t-2 border-gray-300">
                  <h3 className="font-semibold mb-3">Garanties incluses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {motoSelection.coverages.map((coverage, index) => (
                      <div key={index} className="flex items-start text-sm">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">{coverage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedProductType === ProductType.MULTIRISK_PRO && multirisqueSelection && (
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Produit</span>
                  <span className="font-semibold">Multirisque Professionnelle</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Package</span>
                  <span className="font-semibold">{multirisqueSelection.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Type d'activité</span>
                  <span className="font-semibold">{multirisqueSelection.businessType}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Prix</span>
                  <span className="font-semibold">{formatPrice(multirisqueSelection.price)}</span>
                </div>

                {/* Coverage Summary */}
                <div className="mt-6 pt-6 border-t-2 border-gray-300">
                  <h3 className="font-semibold mb-3">Garanties incluses</h3>
                  <div className="space-y-4">
                    {multirisqueSelection.coverageDetails.chapters.map((chapter, chapterIndex) => (
                      <div key={chapterIndex}>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">
                          {chapter.name}
                        </h4>
                        <div className="space-y-1 ml-4">
                          {chapter.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-start text-sm">
                              <span className="text-green-600 mr-2">✓</span>
                              <span className="text-gray-700">{item.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedProductType === ProductType.IAC && iacAddOn && (
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Produit</span>
                  <span className="font-semibold">IAC (Indemnité Accident Corporel)</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Prix</span>
                  <span className="font-semibold">{formatPrice(iacAddOn.price)}</span>
                </div>

                {/* Coverage Details */}
                <div className="mt-6 pt-6 border-t-2 border-gray-300">
                  <h3 className="font-semibold mb-3">Garanties incluses</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Capital décès</span>
                      <span className="font-semibold">{formatPrice(iacAddOn.deathCapital)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Capital invalidité</span>
                      <span className="font-semibold">{formatPrice(iacAddOn.disabilityCapital)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Frais de traitement</span>
                      <span className="font-semibold">{formatPrice(iacAddOn.treatmentCapital)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="mt-6 pt-6 border-t-2 border-gray-300">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total payé</span>
                <span className="text-3xl font-bold text-green-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2 text-right">TTC / an</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Prochaines étapes</h3>
            <ol className="space-y-3">
              <li className="flex items-start">
                <span className="font-bold text-blue-600 dark:text-blue-400 mr-3">1.</span>
                <span className="text-gray-700 dark:text-gray-300">
                  Vous recevrez un email de confirmation avec tous les détails de votre souscription
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-600 dark:text-blue-400 mr-3">2.</span>
                <span className="text-gray-700 dark:text-gray-300">
                  Votre police d'assurance sera envoyée par email dans les 24-48 heures
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-600 dark:text-blue-400 mr-3">3.</span>
                <span className="text-gray-700 dark:text-gray-300">
                  Notre équipe vous contactera pour finaliser les derniers détails
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-600 dark:text-blue-400 mr-3">4.</span>
                <span className="text-gray-700 dark:text-gray-300">
                  Téléchargez votre reçu de paiement ci-dessous pour vos archives
                </span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDownloadReceipt}
              disabled={isDownloading}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isDownloading ? (
                <>
                  <span className="mr-2">⏳</span>
                  Téléchargement...
                </>
              ) : (
                <>
                  <span className="mr-2">📄</span>
                  Télécharger le reçu
                </>
              )}
            </button>
            <button
              onClick={handleNewSubscription}
              className="flex-1 bg-white dark:bg-transparent border-2 border-primary text-primary dark:text-primary-400 dark:border-primary-400 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            >
              Nouvelle souscription
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              Besoin d'aide? Contactez notre service client
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
              <a href="tel:+224XXXXXXXXX" className="text-primary hover:underline">
                📞 +224 XXX XXX XXX
              </a>
              <a href="mailto:support@cnarsugu.com" className="text-primary hover:underline">
                ✉️ support@cnarsugu.com
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
