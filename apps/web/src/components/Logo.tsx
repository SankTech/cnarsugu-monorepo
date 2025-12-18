
import React from 'react';

export const Logo = () => {
    return (
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                <span className="text-xl">C</span>
            </div>
            <span className="text-secondary-900 dark:text-white">
                CNAR <span className="text-primary-600">Sugu</span>
            </span>
        </div>
    );
};
