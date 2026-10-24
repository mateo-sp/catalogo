import React from 'react';
import { Flame, Sparkles, RefreshCw } from 'lucide-react';

interface HeaderProps {
  totalProducts: number;
  isRealtimeConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({ totalProducts, isRealtimeConnected }) => {
  return (
    <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Logo and Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/20 shrink-0">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white uppercase">
                supposhop
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-violet-400 bg-violet-950/60 border border-violet-800/60 px-2 py-0.5 rounded-full">
                Catálogo
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden xs:block">
              Modelos y sabores oficiales disponibles
            </p>
          </div>
        </div>

        {/* Real-time Firestore Connection Badge & Products Count */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
            <span
              className={`w-2 h-2 rounded-full ${
                isRealtimeConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-[11px] font-medium hidden sm:inline">
              {isRealtimeConnected ? 'En vivo' : 'Conectando'}
            </span>
            <span aria-hidden="true" className="text-zinc-600 hidden sm:inline">·</span>
            <span className="font-mono text-[11px] text-zinc-300">
              {totalProducts} {totalProducts === 1 ? 'modelo' : 'modelos'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
