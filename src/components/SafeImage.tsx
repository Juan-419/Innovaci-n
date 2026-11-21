import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: string;
  fallbackLabel?: string;
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackIcon = 'pets',
  fallbackLabel,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-primary-fixed/40 text-primary select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="material-symbols-outlined text-[28px]">{fallbackIcon}</span>
        {fallbackLabel && (
          <span className="text-[11px] font-bold mt-0.5 truncate max-w-full px-1">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
