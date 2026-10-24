import React from 'react';
import { Search, X, ArrowDownUp } from 'lucide-react';
import { SortOption } from '../types/CatalogProduct';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultsCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  resultsCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
      {/* Search Input Box */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por modelo, marca o variante (ej. Pulse, Elf Bar, Mint)..."
          className="w-full bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 focus:border-violet-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:outline-none focus:ring-1 focus:ring-violet-500"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white rounded-md"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sort Select */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="relative flex-1 sm:flex-initial">
          <ArrowDownUp className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs rounded-xl pl-8 pr-7 py-2.5 appearance-none focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="name-asc">Nombre A-Z</option>
            <option value="name-desc">Nombre Z-A</option>
            <option value="brand-asc">Marca A-Z</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>
        </div>

        <span className="text-[11px] text-zinc-400 font-mono hidden md:inline whitespace-nowrap">
          {resultsCount} {resultsCount === 1 ? 'resultado' : 'resultados'}
        </span>
      </div>
    </div>
  );
};
