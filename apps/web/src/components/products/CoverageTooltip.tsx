'use client';

import { useState, useRef, useEffect } from 'react';

interface CoverageTooltipProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function CoverageTooltip({
  title,
  description,
  children,
}: CoverageTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const spaceAbove = triggerRect.top;
      const spaceBelow = window.innerHeight - triggerRect.bottom;

      // If not enough space above, show below
      if (spaceAbove < tooltipRect.height + 10 && spaceBelow > tooltipRect.height + 10) {
        setPosition('bottom');
      } else {
        setPosition('top');
      }
    }
  }, [isVisible]);

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg ${
            position === 'top'
              ? 'bottom-full mb-2 left-1/2 transform -translate-x-1/2'
              : 'top-full mt-2 left-1/2 transform -translate-x-1/2'
          }`}
          role="tooltip"
        >
          {/* Arrow */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-transparent ${
              position === 'top'
                ? 'top-full border-t-8 border-t-gray-900'
                : 'bottom-full border-b-8 border-b-gray-900'
            }`}
          />

          <div className="font-semibold mb-1">{title}</div>
          <div className="text-xs text-gray-300">{description}</div>
        </div>
      )}
    </div>
  );
}

interface CoverageInfoIconProps {
  title: string;
  description: string;
}

export function CoverageInfoIcon({ title, description }: CoverageInfoIconProps) {
  return (
    <CoverageTooltip title={title} description={description}>
      <span className="inline-flex items-center justify-center w-4 h-4 text-xs bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition-colors">
        ?
      </span>
    </CoverageTooltip>
  );
}
