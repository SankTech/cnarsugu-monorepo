
import React from 'react';

export const Logo = () => {
    return (
        <div className="flex items-center gap-2">
            <img
                src="/assets/logocnar.png"
                alt="CNAR Sugu Logo"
                className="h-10 w-auto"
            />
            <span className="font-bold text-2xl tracking-tight text-secondary-900 dark:text-white">
                CNAR <span className="text-primary-600">Sugu</span>
            </span>
        </div>
    );
};
