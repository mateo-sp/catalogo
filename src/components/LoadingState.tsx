import React from 'react';
import { Flame } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-center gap-2.5 text-zinc-400 py-4">
        <Flame className="w-5 h-5 text-violet-500 animate-bounce" />
        <span className="text-sm font-semibold tracking-tight">Cargando catálogo...</span>
      </div>

      {/* Grid of Skeleton Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-3 sm:p-3.5 space-y-3 animate-pulse"
          >
            {/* Image Skeleton */}
            <div className="w-full aspect-square rounded-xl bg-zinc-800/60" />

            {/* Title & Brand Skeleton */}
            <div className="space-y-1.5">
              <div className="w-16 h-2.5 bg-zinc-800 rounded" />
              <div className="w-full h-4 bg-zinc-800 rounded" />
            </div>

            {/* Price Skeleton */}
            <div className="pt-2 border-t border-zinc-800/60 flex justify-between items-center">
              <div className="w-14 h-4 bg-zinc-800 rounded" />
              <div className="w-10 h-3 bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
