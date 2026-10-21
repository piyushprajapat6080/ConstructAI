import React from 'react';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  badgeText,
  badgeVariant = 'neutral', // 'success', 'warning', 'danger', 'info', 'neutral'
  progress,
  className = '',
}) {
  const badgeStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className={`cai-card flex flex-col justify-between ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-construction-500 flex-shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2.5 my-1">
        <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
          {value}
        </span>
        {badgeText && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badgeStyles[badgeVariant] || badgeStyles.neutral}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          {subtext}
        </p>
      )}

      {typeof progress === 'number' && (
        <div className="mt-3">
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-construction-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
