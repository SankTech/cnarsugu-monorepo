'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dataService from '@/lib/dataService';
import type { TermsAndConditions } from '@/lib/api';

export default function TermsPage() {
  const [terms, setTerms] = useState<TermsAndConditions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTerms = async () => {
      try {
        setLoading(true);
        const termsData = await dataService.getTermsAndConditions();
        setTerms(termsData);
      } catch (err) {
        setError('Erreur lors du chargement des conditions d\'utilisation');
        console.error('Error loading terms:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTerms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Chargement des conditions d'utilisation...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-primary hover:underline"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeTerms = terms.find(t => t.isActive) || terms[0];

  if (!activeTerms) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <p className="text-gray-600">Aucune condition d'utilisation disponible</p>
              <Link href="/" className="mt-4 inline-block text-primary hover:underline">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Header */}
      <div className="container mx-auto px-6 mb-8">
        <Link href="/" className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-4 inline-flex items-center transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          {activeTerms.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
          {activeTerms.description}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Dernière mise à jour: {new Date(activeTerms.createdAt).toLocaleDateString('fr-FR')}
        </p>
      </div>

      <main className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            {/* Table of Contents */}
            {activeTerms.content && activeTerms.content.length > 0 && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Table des matières</h2>
                <ul className="space-y-2">
                  {activeTerms.content.map((section: any, index: number) => (
                    <li key={index}>
                      <a
                        href={`#section-${index}`}
                        className="text-primary hover:underline"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Content Sections */}
            <div className="prose prose-lg max-w-none">
              {activeTerms.content && activeTerms.content.length > 0 ? (
                activeTerms.content.map((section: any, index: number) => (
                  <section key={index} id={`section-${index}`} className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900">
                      {section.title}
                    </h2>
                    <div className="text-gray-700 leading-relaxed">
                      {typeof section.content === 'string' ? (
                        <p>{section.content}</p>
                      ) : Array.isArray(section.content) ? (
                        section.content.map((paragraph: string, pIndex: number) => (
                          <p key={pIndex} className="mb-4">{paragraph}</p>
                        ))
                      ) : (
                        <p>{JSON.stringify(section.content)}</p>
                      )}
                    </div>
                  </section>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">Contenu des conditions d'utilisation en cours de mise à jour.</p>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-700 mb-4">
                Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter :
              </p>
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-semibold">Email:</span>{' '}
                  <a href="mailto:contact@cnarsugu.com" className="text-primary hover:underline">
                    contact@cnarsugu.com
                  </a>
                </p>
                <p>
                  <span className="font-semibold">Téléphone:</span>{' '}
                  <a href="tel:+224XXXXXXXXX" className="text-primary hover:underline">
                    +224 XXX XXX XXX
                  </a>
                </p>
                <p>
                  <span className="font-semibold">Adresse:</span> Libreville, Gabon
                </p>
              </div>
            </div>

            {/* Back to Top */}
            <div className="mt-8 text-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-primary hover:underline"
              >
                ↑ Retour en haut
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}