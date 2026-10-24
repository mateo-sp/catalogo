import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <div className="overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none flex items-center gap-1.5">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat;
        const count = categoryCounts[cat];

        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all active:scale-95 ${
              isActive
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
            }`}
          >
            <span>{cat}</span>
            {count !== undefined && (
              <span
                className={`ml-1.5 text-[10px] font-mono ${
                  isActive ? 'text-violet-200' : 'text-zinc-500'
                }`}
              >
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
