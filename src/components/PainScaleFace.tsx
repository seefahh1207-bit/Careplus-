import React from 'react';

interface PainScaleFaceProps {
  level: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
}

export const PAIN_LEVEL_CONFIG: Record<number, {
  label: string;
  sublabel: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}> = {
  0: {
    label: 'ไม่ปวดเลย',
    sublabel: 'No Hurt (0)',
    colorClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-300'
  },
  2: {
    label: 'ปวดเล็กน้อย',
    sublabel: 'Hurts Little (2)',
    colorClass: 'text-teal-700',
    bgClass: 'bg-teal-50',
    borderClass: 'border-teal-300'
  },
  4: {
    label: 'ปวดปานกลาง',
    sublabel: 'Hurts Moderate (4)',
    colorClass: 'text-amber-700',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-300'
  },
  6: {
    label: 'ปวดค่อนข้างมาก',
    sublabel: 'Hurts More (6)',
    colorClass: 'text-orange-700',
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-300'
  },
  8: {
    label: 'ปวดรุนแรง',
    sublabel: 'Hurts Whole Lot (8)',
    colorClass: 'text-rose-700',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-300'
  },
  10: {
    label: 'ปวดที่สุดในชีวิต',
    sublabel: 'Hurts Worst (10)',
    colorClass: 'text-rose-950',
    bgClass: 'bg-rose-100',
    borderClass: 'border-rose-400'
  }
};

export const getNormalizedPainLevel = (score: number): number => {
  if (score <= 1) return 0;
  if (score <= 3) return 2;
  if (score <= 5) return 4;
  if (score <= 7) return 6;
  if (score <= 9) return 8;
  return 10;
};

export const PainScaleFace: React.FC<PainScaleFaceProps> = ({
  level,
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const norm = getNormalizedPainLevel(level);
  const info = PAIN_LEVEL_CONFIG[norm] || PAIN_LEVEL_CONFIG[0];

  const sizeDimensions = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const dim = sizeDimensions[size] || sizeDimensions.md;

  const renderFaceSvg = () => {
    switch (norm) {
      case 0:
        // Happy smiling face - Level 0
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" aria-label="Pain 0: No hurt">
            <circle cx="50" cy="50" r="46" fill="#10B981" stroke="#047857" strokeWidth="4" />
            {/* Eyes */}
            <circle cx="34" cy="42" r="5.5" fill="#FFFFFF" />
            <circle cx="66" cy="42" r="5.5" fill="#FFFFFF" />
            <circle cx="34" cy="42" r="3" fill="#064E3B" />
            <circle cx="66" cy="42" r="3" fill="#064E3B" />
            {/* Cheeks */}
            <circle cx="25" cy="54" r="5" fill="#34D399" opacity="0.6" />
            <circle cx="75" cy="54" r="5" fill="#34D399" opacity="0.6" />
            {/* Big Smile */}
            <path d="M 30 55 Q 50 78 70 55" fill="none" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
          </svg>
        );

      case 2:
        // Calm slightly smiling face - Level 2
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" aria-label="Pain 2: Hurts little bit">
            <circle cx="50" cy="50" r="46" fill="#0D9488" stroke="#0F766E" strokeWidth="4" />
            {/* Eyes */}
            <circle cx="35" cy="42" r="5" fill="#FFFFFF" />
            <circle cx="65" cy="42" r="5" fill="#FFFFFF" />
            <circle cx="35" cy="42" r="2.8" fill="#134E4A" />
            <circle cx="65" cy="42" r="2.8" fill="#134E4A" />
            {/* Gentle Smile */}
            <path d="M 35 60 Q 50 71 65 60" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
          </svg>
        );

      case 4:
        // Neutral / Slight flat frown face - Level 4
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" aria-label="Pain 4: Hurts little more">
            <circle cx="50" cy="50" r="46" fill="#F59E0B" stroke="#D97706" strokeWidth="4" />
            {/* Eyes with slightly furrowed look */}
            <circle cx="34" cy="43" r="5" fill="#FFFFFF" />
            <circle cx="66" cy="43" r="5" fill="#FFFFFF" />
            <circle cx="34" cy="43" r="2.8" fill="#78350F" />
            <circle cx="66" cy="43" r="2.8" fill="#78350F" />
            {/* Eyebrows angled slightly */}
            <path d="M 28 35 L 40 37" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
            <path d="M 72 35 L 60 37" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
            {/* Flat neutral mouth */}
            <line x1="36" y1="63" x2="64" y2="63" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
          </svg>
        );

      case 6:
        // Sad frowning face - Level 6
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" aria-label="Pain 6: Hurts even more">
            <circle cx="50" cy="50" r="46" fill="#EA580C" stroke="#C2410C" strokeWidth="4" />
            {/* Frowning brows */}
            <path d="M 26 36 L 42 39" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 74 36 L 58 39" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            {/* Eyes */}
            <circle cx="34" cy="46" r="4.5" fill="#FFFFFF" />
            <circle cx="66" cy="46" r="4.5" fill="#FFFFFF" />
            {/* Downturned frown mouth */}
            <path d="M 33 69 Q 50 54 67 69" fill="none" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
          </svg>
        );

      case 8:
        // Tearful crying sad face - Level 8
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" aria-label="Pain 8: Hurts whole lot">
            <circle cx="50" cy="50" r="46" fill="#E11D48" stroke="#BE123C" strokeWidth="4" />
            {/* Distressed angled brows */}
            <path d="M 26 34 L 42 40" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <path d="M 74 34 L 58 40" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            {/* Squeezed sad eyes */}
            <path d="M 28 47 Q 35 43 42 47" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <path d="M 58 47 Q 65 43 72 47" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            {/* Tear drop on right cheek */}
            <path d="M 70 54 C 67 61, 74 65, 71 69 C 68 65, 66 61, 70 54 Z" fill="#67E8F9" stroke="#0891B2" strokeWidth="1" />
            {/* Wavy sad crying mouth */}
            <path d="M 32 72 Q 50 56 68 72" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
          </svg>
        );

      case 10:
      default:
        // Screaming agonized grimace - Level 10
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" aria-label="Pain 10: Hurts worst">
            <circle cx="50" cy="50" r="46" fill="#991B1B" stroke="#7F1D1D" strokeWidth="4" />
            {/* Deep frown lines */}
            <path d="M 24 30 L 42 39" stroke="#FEE2E2" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 76 30 L 58 39" stroke="#FEE2E2" strokeWidth="4.5" strokeLinecap="round" />
            {/* Clenched closed angled eyes (> <) */}
            <path d="M 27 44 L 39 48 L 27 52" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 73 44 L 61 48 L 73 52" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {/* Dual tear drops */}
            <path d="M 24 55 C 22 62, 28 66, 25 70 C 22 66, 20 62, 24 55 Z" fill="#A5F3FC" />
            <path d="M 76 55 C 74 62, 80 66, 77 70 C 74 66, 72 62, 76 55 Z" fill="#A5F3FC" />
            {/* Wide grimacing open screaming mouth */}
            <path d="M 32 64 Q 50 57 68 64 Q 69 77 50 78 Q 31 77 32 64 Z" fill="#FFFFFF" stroke="#F87171" strokeWidth="2" />
          </svg>
        );
    }
  };

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <div className={`${dim} shrink-0 transition-transform`}>
        {renderFaceSvg()}
      </div>
      {showLabel && (
        <div className="text-center mt-1">
          <p className="text-[11px] font-bold text-slate-800 leading-tight">{info.label}</p>
          <p className="text-[9px] text-slate-500">{info.sublabel}</p>
        </div>
      )}
    </div>
  );
};
