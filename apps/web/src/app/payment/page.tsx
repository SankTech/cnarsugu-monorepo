'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useAppSelector,
  useAppDispatch,
  setPaymentMethod,
  setPaymentAmount,
  startPaymentProcessing,
  paymentSuccess,
  paymentFailed,
  selectEnrollmentForm,
} from '@cnarsugu/store';

import {
  useCreatePaymentV2Mutation,
  useCreateSubscriptionV2Mutation,
  selectTotalPrice
} from '@cnarsugu/store';
import { ProductType, AUTO_FORMULA_LABELS, MOTO_FORMULA_LABELS } from '@cnarsugu/types';
import { formatPrice } from '@cnarsugu/utils';
import type { PaymentMethod } from '@cnarsugu/store';

// ============================================================================
// Payment Page Component
// ============================================================================

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get product selection from Redux
  const productSelection = useAppSelector((state) => state.productSelection);
  const { selectedProductType, autoSelection, motoSelection, multirisqueSelection, iacAddOn } =
    productSelection;

  // Get payment state from Redux
  const paymentState = useAppSelector((state) => state.payment);
  const totalPrice = useAppSelector(selectTotalPrice);

  // Local state
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState('ORANGE_MONEY');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ phoneNumber?: string }>({});

  // Redirect if no product selected
  useEffect(() => {
    if (!selectedProductType) {
      router.push('/');
    }
  }, [selectedProductType, router]);

  // Set payment amount when total price changes
  useEffect(() => {
    if (totalPrice > 0) {
      dispatch(setPaymentAmount(totalPrice.toString()));
    }
  }, [totalPrice, dispatch]);

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    dispatch(setPaymentMethod(method));
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: { phoneNumber?: string } = {};

    if (!selectedMethod) {
      alert('Veuillez sélectionner un mode de paiement');
      return false;
    }

    if (selectedMethod === 'MOBILE_MONEY') {
      if (!phoneNumber.trim()) {
        newErrors.phoneNumber = 'Le numéro de téléphone est requis';
      } else if (!/^\+?[0-9]{10,15}$/.test(phoneNumber.replace(/\s/g, ''))) {
        newErrors.phoneNumber = 'Numéro de téléphone invalide';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // API Mutations
  const [createPayment, { isLoading: isPaymentLoading }] = useCreatePaymentV2Mutation();
  const [createSubscription, { isLoading: isSubscriptionLoading }] = useCreateSubscriptionV2Mutation();

  // Get enrollment form data
  const enrollmentForm = useAppSelector(selectEnrollmentForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    dispatch(startPaymentProcessing());

    try {
      // 1. Create Payment
      console.log('Processing payment...');
      const paymentResponse = await createPayment({
        amount: totalPrice.toString(),
        phoneNumber: selectedMethod === 'MOBILE_MONEY' ? phoneNumber : '00000000', // Handle other methods
        serviceCode: selectedMethod === 'MOBILE_MONEY' ? mobileMoneyProvider : 'CASH',
        includeIac: (selectedProductType === ProductType.AUTO && autoSelection?.addIac) ||
          (selectedProductType === ProductType.MOTO && motoSelection?.includesIac) ||
          selectedProductType === ProductType.IAC,
        productType: selectedProductType || 'UNKNOWN',
      }).unwrap();

      console.log('Payment successful:', paymentResponse);
      const paymentId = paymentResponse.id || paymentResponse.paymentId; // Adjust based on actual response structure
      dispatch(paymentSuccess(paymentId));

      // 2. Create Subscription
      console.log('Creating subscription...');
      const formData = new FormData();

      // Common fields
      formData.append('name', enrollmentForm.name);
      formData.append('surname', enrollmentForm.surname);
      formData.append('phoneNumber', enrollmentForm.phoneNumber);
      formData.append('coverage', getCoverageLabel()); // Helper function needed
      formData.append('insurance', selectedProductType || 'UNKNOWN'); // Legacy field?
      formData.append('productType', selectedProductType || 'UNKNOWN');
      formData.append('price', totalPrice.toString());
      if (paymentId) {
        formData.append('paymentId', paymentId.toString());
      }
      if (enrollmentForm.extraData) {
        formData.append('extraData', enrollmentForm.extraData);
      }

      // Product Details
      if (selectedProductType === ProductType.AUTO && autoSelection) {
        formData.append('productDetails[formula]', autoSelection.formula);
        formData.append('productDetails[addIac]', String(autoSelection.addIac));
        formData.append('productDetails[cvRange][min]', String(autoSelection.cvRange.min));
        formData.append('productDetails[cvRange][max]', String(autoSelection.cvRange.max));
        formData.append('productDetails[cvRange][label]', autoSelection.cvRange.label);
      } else if (selectedProductType === ProductType.MOTO && motoSelection) {
        formData.append('productDetails[formula]', motoSelection.formula);
        formData.append('productDetails[motoCategory]', motoSelection.category);
        formData.append('productDetails[addIac]', String(motoSelection.includesIac));
      } else if (selectedProductType === ProductType.MULTIRISK_PRO && multirisqueSelection) {
        formData.append('productDetails[packageCode]', multirisqueSelection.packageCode);
        formData.append('productDetails[businessType]', multirisqueSelection.businessType);
      }

      await createSubscription(formData).unwrap();
      console.log('Subscription created successfully');

      // Navigate to confirmation page
      router.push('/confirmation');
    } catch (error: any) {
      console.error('Payment/Subscription error:', error);
      dispatch(paymentFailed(error.data?.message || 'Une erreur est survenue'));
      alert(`Erreur: ${error.data?.message || 'Une erreur est survenue lors du traitement.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCoverageLabel = () => {
    if (selectedProductType === ProductType.AUTO && autoSelection) return autoSelection.formula;
    if (selectedProductType === ProductType.MOTO && motoSelection) return motoSelection.formula;
    if (selectedProductType === ProductType.MULTIRISK_PRO && multirisqueSelection) return multirisqueSelection.name;
    if (selectedProductType === ProductType.IAC) return 'IAC Standard';
    return 'Standard';
  };

  const getPaymentMethodLabel = (method: PaymentMethod): string => {
    switch (method) {
      case 'MOBILE_MONEY':
        return 'Mobile Money';
      case 'CREDIT_CARD':
        return 'Carte Bancaire';
      case 'PAYPAL':
        return 'PayPal';
      default:
        return '';
    }
  };

  if (!selectedProductType) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <Link href="/enrollment" className="text-primary hover:underline text-sm mb-2 inline-block">
            ← Retour à l'inscription
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Paiement</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Choisissez votre mode de paiement pour finaliser votre souscription
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form - Left Column */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border dark:border-slate-700">
                <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Mode de paiement</h2>

                {/* Payment Method Selection */}
                <div className="space-y-4 mb-8">
                  {/* Mobile Money */}
                  <button
                    type="button"
                    onClick={() => handleMethodSelect('MOBILE_MONEY')}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all flex items-center ${selectedMethod === 'MOBILE_MONEY'
                      ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500'
                      }`}
                  >
                    <div className="mr-4 w-12 h-12 relative flex-shrink-0">
                      <img src="/assets/payment1.png" alt="Mobile Money" className="object-contain w-full h-full" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-slate-900 dark:text-white">Mobile Money</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Orange Money, MTN Mobile Money, Moov Money
                      </div>
                    </div>
                    {selectedMethod === 'MOBILE_MONEY' && (
                      <div className="text-primary text-2xl">✓</div>
                    )}
                  </button>

                  {/* Mobile Money Phone Number Input */}
                  {selectedMethod === 'MOBILE_MONEY' && (
                    <div className="ml-12 mt-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">
                          Opérateur <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={mobileMoneyProvider}
                          onChange={(e) => setMobileMoneyProvider(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white mb-2"
                        >
                          <option value="ORANGE_MONEY">Orange Money</option>
                          <option value="MOOV_MONEY">Moov Money</option>
                          <option value="MTN_MONEY">MTN Mobile Money</option>
                          <option value="WAVE">Wave</option>
                        </select>
                      </div>

                      <label className="block text-sm font-semibold mb-2">
                        Numéro de téléphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        placeholder="+223XXXXXXXX"
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Vous recevrez une notification pour confirmer le paiement
                      </p>
                    </div>
                  )}

                  {/* Credit Card */}
                  <button
                    type="button"
                    onClick={() => handleMethodSelect('CREDIT_CARD')}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all flex items-center ${selectedMethod === 'CREDIT_CARD'
                      ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500'
                      }`}
                  >
                    <div className="mr-4 w-12 h-12 relative flex-shrink-0">
                      <img src="/assets/payment2.png" alt="Carte Bancaire" className="object-contain w-full h-full" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-slate-900 dark:text-white">Carte Bancaire</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Visa, Mastercard, American Express
                      </div>
                    </div>
                    {selectedMethod === 'CREDIT_CARD' && (
                      <div className="text-primary text-2xl">✓</div>
                    )}
                  </button>

                  {selectedMethod === 'CREDIT_CARD' && (
                    <div className="ml-12 mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">Note:</span> Le paiement par carte bancaire
                        sera disponible prochainement. Veuillez utiliser Mobile Money pour le moment.
                      </p>
                    </div>
                  )}

                  {/* PayPal */}
                  <button
                    type="button"
                    onClick={() => handleMethodSelect('PAYPAL')}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all flex items-center ${selectedMethod === 'PAYPAL'
                      ? 'border-primary bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500'
                      }`}
                  >
                    <div className="mr-4 w-12 h-12 relative flex-shrink-0">
                      <img src="/assets/payment3.png" alt="PayPal" className="object-contain w-full h-full" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">PayPal</div>
                      <div className="text-sm text-gray-600">
                        Paiement sécurisé via PayPal
                      </div>
                    </div>
                    {selectedMethod === 'PAYPAL' && (
                      <div className="text-primary text-2xl">✓</div>
                    )}
                  </button>

                  {selectedMethod === 'PAYPAL' && (
                    <div className="ml-12 mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">Note:</span> Le paiement via PayPal
                        sera disponible prochainement. Veuillez utiliser Mobile Money pour le moment.
                      </p>
                    </div>
                  )}
                </div>

                {/* Security Notice */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">🔒</div>
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-300 mb-1">Paiement sécurisé</h4>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        Toutes les transactions sont cryptées et sécurisées. Vos informations
                        bancaires ne sont jamais stockées sur nos serveurs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-slate-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedMethod}
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Traitement...' : `Payer ${formatPrice(totalPrice)}`}
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary - Right Column */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 sticky top-8 border dark:border-slate-700">
                <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Récapitulatif</h2>

                {/* Product Summary */}
                <div className="space-y-4 mb-6">
                  {selectedProductType === ProductType.AUTO && autoSelection && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Produit</p>
                        <p className="font-semibold">Auto Prestige</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Formule</p>
                        <p className="font-semibold">{AUTO_FORMULA_LABELS[autoSelection.formula]}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Puissance</p>
                        <p className="font-semibold">{autoSelection.cvRange.label}</p>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700">Assurance Auto</span>
                          <span className="font-semibold">{formatPrice(autoSelection.price)}</span>
                        </div>
                        {autoSelection.addIac && iacAddOn && (
                          <div className="flex justify-between mb-2 text-sm">
                            <span className="text-gray-700">+ IAC</span>
                            <span className="font-semibold">{formatPrice(iacAddOn.price)}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {selectedProductType === ProductType.MOTO && motoSelection && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Produit</p>
                        <p className="font-semibold">Moto</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Catégorie</p>
                        <p className="font-semibold">{motoSelection.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Formule</p>
                        <p className="font-semibold">{MOTO_FORMULA_LABELS[motoSelection.formula]}</p>
                      </div>
                      {motoSelection.includesIac && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-sm text-green-700 font-semibold">✓ IAC inclus</p>
                        </div>
                      )}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700">Assurance Moto</span>
                          <span className="font-semibold">{formatPrice(motoSelection.price)}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedProductType === ProductType.MULTIRISK_PRO && multirisqueSelection && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Produit</p>
                        <p className="font-semibold">Multirisque Professionnelle</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Package</p>
                        <p className="font-semibold">{multirisqueSelection.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Type d'activité</p>
                        <p className="font-semibold">{multirisqueSelection.businessType}</p>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700">Assurance Multirisque</span>
                          <span className="font-semibold">{formatPrice(multirisqueSelection.price)}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedProductType === ProductType.IAC && iacAddOn && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Produit</p>
                        <p className="font-semibold">IAC (Indemnité Accident Corporel)</p>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700">Assurance IAC</span>
                          <span className="font-semibold">{formatPrice(iacAddOn.price)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Total */}
                <div className="pt-4 border-t-2 border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-right">TTC / an</p>
                </div>

                {/* Coverage Summary */}
                {(autoSelection || motoSelection) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold mb-3 text-sm">Garanties incluses</h3>
                    <ul className="space-y-2">
                      {(autoSelection?.coverages || motoSelection?.coverages || [])
                        .slice(0, 5)
                        .map((coverage, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start">
                            <span className="text-green-600 mr-2">✓</span>
                            <span>{coverage}</span>
                          </li>
                        ))}
                      {((autoSelection?.coverages || motoSelection?.coverages || []).length > 5) && (
                        <li className="text-xs text-gray-500 italic">
                          + {(autoSelection?.coverages || motoSelection?.coverages || []).length - 5} autres garanties
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
