import React, { useState } from 'react';
import { Check, Sparkles, MessageCircle } from 'lucide-react';

interface VariantListProps {
  variantes?: string[];
  selectedVariant?: string | null;
  onSelectVariant?: (variant: string) => void;
  /** Si se pasa, muestra el botón de WhatsApp directo en cada chip */
  onWhatsAppVariant?: (variant: string) => void;
}

export const VariantList: React.FC<VariantListProps> = ({
  variantes = [],
  selectedVariant: externalSelected,
  onSelectVariant,
  onWhatsAppVariant,
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

      {/* Chips con selección y botón de WhatsApp directo */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
        {variantes.map((variant) => {
          const isSelected = activeSelected === variant;

          return (
            <div
              key={variant}
              className={`group min-h-[44px] rounded-xl flex items-center border transition-all duration-150 overflow-hidden ${
                isSelected
                  ? 'bg-violet-600/20 border-violet-500 shadow-sm ring-1 ring-violet-500/50'
                  : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850'
              }`}
            >
              {/* Área de selección del sabor */}
              <button
                type="button"
                onClick={() => handleSelect(variant)}
                className="flex-1 px-3 py-2 text-left text-xs font-medium flex items-center gap-2 active:scale-[0.98] transition-transform min-w-0"
              >
                <span className={`truncate ${isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                  {variant}
                </span>
                {isSelected ? (
                  <span className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center shrink-0 ml-auto">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-zinc-700 shrink-0 ml-auto" />
                )}
              </button>

              {/* Botón directo de WhatsApp por sabor */}
              {onWhatsAppVariant && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onWhatsAppVariant(variant);
                  }}
                  title={`Pedir "${variant}" por WhatsApp`}
                  className="h-full px-3 border-l border-zinc-700/60 text-emerald-400 hover:text-white hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center shrink-0"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {onWhatsAppVariant ? (
        <p className="text-[11px] text-zinc-400 italic pt-1">
          * Toca <span className="inline-flex items-center gap-0.5 text-emerald-400"><MessageCircle className="w-3 h-3 fill-current" /></span> en cualquier sabor para hacer tu pedido por WhatsApp directo.
        </p>
      ) : (
        <p className="text-[11px] text-zinc-400 italic pt-1">
          * Selecciona tu sabor preferido para enviar tu consulta o pedido por WhatsApp.
        </p>
      )}
    </div>
  );
};
