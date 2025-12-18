
import { Logo } from './Logo';

export const Footer = () => {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 transition-colors">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div>
                        <Logo />
                        <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            CNAR Sugu simplifie l'assurance au Gabon. Protection complète, 100% digitale, pour vous et vos biens.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">Produits</h4>
                        <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <li><a href="/auto-prestige" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Auto Prestige</a></li>
                            <li><a href="/moto" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Moto</a></li>
                            <li><a href="/multirisk-pro" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Multirisque Pro</a></li>
                            <li><a href="/iac" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Indemnité Accident</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">Entreprise</h4>
                        <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">À propos</a></li>
                            <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Carrières</a></li>
                            <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Partenaires</a></li>
                            <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Mentions légales</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <li className="flex items-center gap-2">
                                <span>📞</span> +241 11 11 11 11
                            </li>
                            <li className="flex items-center gap-2">
                                <span>📧</span> contact@cnar-sugu.ga
                            </li>
                            <li className="flex items-center gap-2">
                                <span>📍</span> Libreville, Gabon
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-8 text-center text-slate-400 text-sm">
                    &copy; {new Date().getFullYear()} CNAR Sugu. Tous droits réservés.
                </div>
            </div>
        </footer>
    );
};
