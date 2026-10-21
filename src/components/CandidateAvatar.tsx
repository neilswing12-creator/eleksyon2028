import React from "react";

interface CandidateAvatarProps {
  photoUrl?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
}

export function getOptimizedImageUrl(url?: string | null): { webp?: string; fallback?: string } {
  if (!url) return {};
  if (url.startsWith("/uploads/candidates/") && /\.(jpg|jpeg|png)$/i.test(url)) {
    return {
      webp: url.replace(/\.(jpg|jpeg|png)$/i, ".webp"),
      fallback: url,
    };
  }
  return { fallback: url };
}

export default function CandidateAvatar({
  photoUrl,
  name,
  size = "md",
  className = "",
  priority = false,
}: CandidateAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-24 h-24 sm:w-28 sm:h-28 text-xl",
  };

  const { webp, fallback } = getOptimizedImageUrl(photoUrl);

  if (!fallback) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 flex-shrink-0 ${className}`}
      >
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden border border-slate-200 shadow-xs flex-shrink-0 bg-slate-100 ${className}`}
    >
      <picture>
        {webp && <source srcSet={webp} type="image/webp" />}
        <img
          src={fallback}
          alt={`Official portrait of ${name}`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="w-full h-full object-cover object-top"
          width={size === "xl" ? 112 : size === "lg" ? 64 : size === "sm" ? 32 : 48}
          height={size === "xl" ? 112 : size === "lg" ? 64 : size === "sm" ? 32 : 48}
        />
      </picture>
    </div>
  );
}
