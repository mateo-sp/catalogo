import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

interface VariantListProps {
  variantes?: string[];
  selectedVariant?: string | null;
  onSelectVariant?: (variant: string) => void;
}

export const VariantList: React.FC<VariantListProps> = ({
  variantes = [],
  selectedVariant: externalSelected,
  onSelectVariant,
}) => {
  const [internalSelected, setInternalSelected] = useState<string | null>(
    variantes.length > 0 ? variantes[0] : null
  );

  const activeSelected = externalSelected !== undefined ? externalSelected : internalSelected;

  const handleSelect = (variant: string) => {
    if (onSelectVariant) {
      onSelectVariant(variant);
    } else {
      setInternalSelected(variant);
    }
  };

  if (!variantes || variantes.length === 0) {
    return (
      <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 text-center">
        No se especificaron variantes para este modelo.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Sabores / Variantes ({variantes.length})</span>
        </label>
        {activeSelected && (
          <span className="text-[11px] text-zinc-400 truncate max-w-[180px]">
            Elegido: <strong className="text-violet-300">{activeSelected}</strong>
          </span>
        )}
      </div>

      {/* Pure text chips with visual highlight on selection (NO duplicate images) */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
        {variantes.map((variant) => {
          const isSelected = activeSelected === variant;

          return (
            <button
              key={variant}
              type="button"
              onClick={() => handleSelect(variant)}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between gap-2 border active:scale-[0.98] ${
                isSelected
                  ? 'bg-violet-600/20 border-violet-500 text-white shadow-sm ring-1 ring-violet-500/50'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white hover:bg-zinc-850'
              }`}
            >
              <span className="truncate">{variant}</span>
              {isSelected ? (
                <span className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </span>
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-zinc-700 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-zinc-400 italic pt-1">
        * Selecciona tu sabor preferido para enviar tu consulta o pedido por WhatsApp.
      </p>
    </div>
  );
};
