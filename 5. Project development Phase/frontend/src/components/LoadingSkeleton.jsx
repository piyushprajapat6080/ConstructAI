import React from 'react';

export function SkeletonLine({ className = 'h-4 w-full' }) {
  return (
    <div className={`rounded-md bg-slate-200/80 animate-pulse ${className}`} />
  );
}

export function CardSkeleton({ lines = 3 }) {
  return (
    <div className="cai-card space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonLine className="h-4 w-28" />
        <SkeletonLine className="h-7 w-7 rounded-lg" />
      </div>
      <SkeletonLine className="h-7 w-36" />
      <div className="space-y-2 pt-2">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLine
            key={i}
            className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
          />
        ))}
      </div>
    </div>
  );
}

export function AnalysisShimmerOverlay({ message = "AI Neural Model Processing..." }) {
  return (
    <div className="cai-card relative overflow-hidden border-orange-200/60 bg-gradient-to-br from-orange-50/40 via-white to-slate-50/50 p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
      <div className="relative mb-5">
        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center animate-bounce">
          <div className="w-7 h-7 rounded-lg bg-construction-500 animate-pulse" />
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-orange-500/20 blur-md -z-10 animate-pulse" />
      </div>

      <h4 className="text-base font-semibold text-slate-800 mb-1.5 tracking-tight">
        {message}
      </h4>
      <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
        Evaluating multimodal visual features against Indian Standards (IS Codes, NBC 2016) and structural engineering rules.
      </p>

      {/* Shimmer skeleton mock lines */}
      <div className="w-full max-w-md space-y-2.5">
        <div className="h-3 bg-slate-200/80 rounded-full animate-shimmer" />
        <div className="h-3 bg-slate-200/80 rounded-full w-4/5 mx-auto animate-shimmer" />
        <div className="h-3 bg-slate-200/80 rounded-full w-3/5 mx-auto animate-shimmer" />
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ type = 'card', count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
