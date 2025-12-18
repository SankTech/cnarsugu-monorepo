'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppSelector, useAppDispatch, updateEnrollmentForm } from '@cnarsugu/store';
import {
  nameSchema,
  phoneNumberSchema,
  emailSchema,
  autoEnrollmentSchema,
  motoEnrollmentSchema,
  multirisqueEnrollmentSchema,
  iacEnrollmentSchema,
} from '@cnarsugu/schemas';
import { ProductType, AUTO_FORMULA_LABELS, MOTO_FORMULA_LABELS } from '@cnarsugu/types';
import { formatPrice } from '@cnarsugu/utils';

// ============================================================================
// Client Type Selection
// ============================================================================

type ClientType = 'INDIVIDUAL' | 'BUSINESS';

// ============================================================================
// Base Enrollment Schema
// ============================================================================

const baseEnrollmentSchema = z.object({
  clientType: z.enum(['INDIVIDUAL', 'BUSINESS']),
  // Individual fields
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  // Business fields
  businessName: z.string().optional(),
  businessRegistrationNumber: z.string().optional(),
  // Common fields
  email: emailSchema,
  phoneNumber: phoneNumberSchema,
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
});

// ============================================================================
// Product-Specific Schemas
// ============================================================================

const autoEnrollmentFormSchema = baseEnrollmentSchema.extend({
  vehicleRegistration: z.string().min(1, "Le numéro d'immatriculation est requis").optional(),
  vehicleMake: z.string().min(1, 'La marque du véhicule est requise').optional(),
  vehicleModel: z.string().min(1, 'Le modèle du véhicule est requis').optional(),
  vehicleYear: z
    .number()
    .int("L'année doit être un entier")
    .min(1900, "L'année doit être supérieure à 1900")
    .max(new Date().getFullYear() + 1, "L'année ne peut pas être dans le futur")
    .optional(),
  driverLicenseNumber: z.string().optional(),
  businessAddress: z.string().optional(),
  estimatedAnnualRevenue: z.number().nonnegative().optional(),
  numberOfEmployees: z.number().int().nonnegative().optional(),
  beneficiaryName: z.string().optional(),
  beneficiaryRelationship: z.string().optional(),
  beneficiaryPhone: phoneNumberSchema.optional(),
  medicalHistory: z.string().max(1000).optional(),
});

// Use a single comprehensive schema for all product types
type EnrollmentFormData = z.infer<typeof autoEnrollmentFormSchema>;

// ============================================================================
// Enrollment Page Component
// ============================================================================

export default function EnrollmentPage() {
  const router = useRouter();
  const [clientType, setClientType] = useState<ClientType>('INDIVIDUAL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get product selection from Redux
  const productSelection = useAppSelector((state) => state.productSelection);
  const { selectedProductType, autoSelection, motoSelection, multirisqueSelection, iacAddOn } =
    productSelection;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(autoEnrollmentFormSchema),
    defaultValues: {
      clientType: 'INDIVIDUAL' as ClientType,
    },
  });

  // Watch client type changes
  const watchedClientType = watch('clientType');

  useEffect(() => {
    setClientType(watchedClientType as ClientType);
  }, [watchedClientType]);

  // Redirect if no product selected
  useEffect(() => {
    if (!selectedProductType) {
      router.push('/');
    }
  }, [selectedProductType, router]);

  const dispatch = useAppDispatch();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      // Map form data to Redux state format
      // Note: Backend expects name/surname. For business, we use businessName as surname and 'ENTREPRISE' as name or similar logic.
      // But actually, for business, we likely want the contact person OR the business legal name.
      // Let's use:
      // Individual: name=firstName, surname=lastName
      // Business: name="ENTREPRISE", surname=businessName

      const mappedData = {
        clientType: data.clientType,
        name: data.clientType === 'INDIVIDUAL' ? data.firstName : 'ENTREPRISE',
        surname: data.clientType === 'INDIVIDUAL' ? data.lastName : data.businessName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        address: data.address,
        // Store technical details in extraData or productDetails if needed, 
        // but product data is already in productSelectionSlice.
        // We'll merge them in the Payment page when creating subscription.
        extraData: JSON.stringify({
          businessRegistrationNumber: data.businessRegistrationNumber,
          businessAddress: data.businessAddress,
          ...data
        }),
      };

      dispatch(updateEnrollmentForm(mappedData));

      // Navigate to payment page
      router.push('/payment');
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedProductType) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="text-primary hover:underline text-sm mb-2 inline-block">
            ← Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-bold">Inscription</h1>
          <p className="text-gray-600 mt-2">
            Complétez vos informations pour finaliser votre souscription
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Product Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Récapitulatif de votre sélection</h2>

            {selectedProductType === ProductType.AUTO && autoSelection && (
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Produit:</span> Auto Prestige
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Formule:</span>{' '}
                  {AUTO_FORMULA_LABELS[autoSelection.formula]}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Puissance:</span> {autoSelection.cvRange.label}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Prix:</span> {formatPrice(autoSelection.price)}
                </p>
                {autoSelection.addIac && iacAddOn && (
                  <p className="text-gray-700">
                    <span className="font-semibold">IAC:</span> +{formatPrice(iacAddOn.price)}
                  </p>
                )}
                <p className="text-2xl font-bold text-primary mt-4">
                  Total: {formatPrice(autoSelection.price + (autoSelection.addIac && iacAddOn ? iacAddOn.price : 0))}
                </p>
              </div>
            )}

            {selectedProductType === ProductType.MOTO && motoSelection && (
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Produit:</span> Moto
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Catégorie:</span> {motoSelection.category}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Formule:</span>{' '}
                  {MOTO_FORMULA_LABELS[motoSelection.formula]}
                </p>
                {motoSelection.includesIac && (
                  <p className="text-green-600 text-sm">✓ IAC inclus</p>
                )}
                <p className="text-2xl font-bold text-primary mt-4">
                  Total: {formatPrice(motoSelection.price)}
                </p>
              </div>
            )}

            {selectedProductType === ProductType.MULTIRISK_PRO && multirisqueSelection && (
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Produit:</span> Multirisque Professionnelle
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Package:</span> {multirisqueSelection.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Type d'activité:</span>{' '}
                  {multirisqueSelection.businessType}
                </p>
                <p className="text-2xl font-bold text-primary mt-4">
                  Total: {formatPrice(multirisqueSelection.price)}
                </p>
              </div>
            )}

            {selectedProductType === ProductType.IAC && iacAddOn && (
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Produit:</span> IAC (Indemnité Accident Corporel)
                </p>
                <p className="text-2xl font-bold text-primary mt-4">
                  Total: {formatPrice(iacAddOn.price)}
                </p>
              </div>
            )}
          </div>

          {/* Enrollment Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Vos informations</h2>

            {/* Client Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">Type de client</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setValue('clientType', 'INDIVIDUAL')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${clientType === 'INDIVIDUAL'
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="text-3xl mb-2">👤</div>
                  <div className="font-semibold">Particulier</div>
                </button>
                <button
                  type="button"
                  onClick={() => setValue('clientType', 'BUSINESS')}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${clientType === 'BUSINESS'
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="text-3xl mb-2">🏢</div>
                  <div className="font-semibold">Entreprise</div>
                </button>
              </div>
              <input type="hidden" {...register('clientType')} />
            </div>

            {/* Individual Fields */}
            {clientType === 'INDIVIDUAL' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('firstName')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Votre prénom"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('lastName')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Votre nom"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message as string}</p>
                  )}
                </div>
              </div>
            )}

            {/* Business Fields */}
            {clientType === 'BUSINESS' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Nom de l'entreprise <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('businessName')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Nom de votre entreprise"
                  />
                  {errors.businessName && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessName.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Numéro d'enregistrement
                  </label>
                  <input
                    type="text"
                    {...register('businessRegistrationNumber')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Numéro RCCM"
                  />
                  {errors.businessRegistrationNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.businessRegistrationNumber.message as string}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Common Contact Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register('phoneNumber')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+224XXXXXXXXX"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message as string}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Adresse <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('address')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Votre adresse complète"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message as string}</p>
              )}
            </div>

            {/* Product-Specific Fields */}
            {(selectedProductType === ProductType.AUTO || selectedProductType === ProductType.MOTO) && (
              <>
                <h3 className="text-lg font-bold mb-4 mt-8">
                  Informations du véhicule
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Numéro d'immatriculation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('vehicleRegistration')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ex: AB-1234-CD"
                    />
                    {errors.vehicleRegistration && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.vehicleRegistration.message as string}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Marque <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('vehicleMake')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ex: Toyota"
                    />
                    {errors.vehicleMake && (
                      <p className="text-red-500 text-sm mt-1">{errors.vehicleMake.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Modèle <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('vehicleModel')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ex: Corolla"
                    />
                    {errors.vehicleModel && (
                      <p className="text-red-500 text-sm mt-1">{errors.vehicleModel.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Année <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      {...register('vehicleYear', { valueAsNumber: true })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="2024"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                    />
                    {errors.vehicleYear && (
                      <p className="text-red-500 text-sm mt-1">{errors.vehicleYear.message as string}</p>
                    )}
                  </div>
                </div>

                {selectedProductType === ProductType.MOTO && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">
                      Numéro de permis de conduire
                    </label>
                    <input
                      type="text"
                      {...register('driverLicenseNumber')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Optionnel"
                    />
                    {errors.driverLicenseNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.driverLicenseNumber.message as string}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {selectedProductType === ProductType.MULTIRISK_PRO && (
              <>
                <h3 className="text-lg font-bold mb-4 mt-8">
                  Informations de l'entreprise
                </h3>

                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">
                    Adresse de l'entreprise <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('businessAddress')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Adresse complète de votre établissement"
                  />
                  {errors.businessAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessAddress.message as string}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Chiffre d'affaires annuel estimé (FCFA)
                    </label>
                    <input
                      type="number"
                      {...register('estimatedAnnualRevenue', { valueAsNumber: true })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Optionnel"
                      min="0"
                    />
                    {errors.estimatedAnnualRevenue && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.estimatedAnnualRevenue.message as string}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Nombre d'employés
                    </label>
                    <input
                      type="number"
                      {...register('numberOfEmployees', { valueAsNumber: true })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Optionnel"
                      min="0"
                    />
                    {errors.numberOfEmployees && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.numberOfEmployees.message as string}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {selectedProductType === ProductType.IAC && (
              <>
                <h3 className="text-lg font-bold mb-4 mt-8">
                  Informations du bénéficiaire
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Nom du bénéficiaire
                    </label>
                    <input
                      type="text"
                      {...register('beneficiaryName')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Optionnel"
                    />
                    {errors.beneficiaryName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.beneficiaryName.message as string}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Relation avec le bénéficiaire
                    </label>
                    <input
                      type="text"
                      {...register('beneficiaryRelationship')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ex: Conjoint, Enfant"
                    />
                    {errors.beneficiaryRelationship && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.beneficiaryRelationship.message as string}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Téléphone du bénéficiaire
                    </label>
                    <input
                      type="tel"
                      {...register('beneficiaryPhone')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+224XXXXXXXXX"
                    />
                    {errors.beneficiaryPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.beneficiaryPhone.message as string}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">
                    Antécédents médicaux
                  </label>
                  <textarea
                    {...register('medicalHistory')}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Optionnel - Informations médicales pertinentes"
                    maxLength={1000}
                  />
                  {errors.medicalHistory && (
                    <p className="text-red-500 text-sm mt-1">{errors.medicalHistory.message as string}</p>
                  )}
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Traitement...' : 'Continuer vers le paiement'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
