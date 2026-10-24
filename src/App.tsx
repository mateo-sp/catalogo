/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { catalogService } from './services/catalogService';
import { CatalogProduct, SortOption } from './types/CatalogProduct';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { LoadingState } from './components/LoadingState';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanel } from './components/AdminPanel';
import { useAdminAuth } from './hooks/useAdminAuth';
import { ShieldCheck, Database } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  // Search, Category, and Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);

  // Admin State
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const { state: authState, adminUser, errorMessage, login, logout } = useAdminAuth();

  // Cuando la autenticación se resuelve como autorizada, cerrar login y abrir panel
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  useEffect(() => {
    if (authState === 'authorized' && adminUser) {
      setIsAdminLoginOpen(false);
      setIsAdminPanelOpen(true);
    } else if (authState === 'idle') {
      setIsAdminPanelOpen(false);
    }
  }, [authState, adminUser]);

  // Real-time Firestore subscription to 'catalogo_publico'
  useEffect(() => {
    setLoading(true);
    const unsubscribe = catalogService.subscribeToCatalog(
      (updatedProducts) => {
        setProducts(updatedProducts);
        setLoading(false);
        setIsRealtimeConnected(true);
      },
      (error) => {
        console.error('Subscription error:', error);
        setLoading(false);
        setIsRealtimeConnected(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Compute available categories and item counts
  const { categories, categoryCounts } = useMemo(() => {
    const counts: Record<string, number> = {
      Todas: products.length,
    };

    const uniqueCats = new Set<string>();
    products.forEach((p) => {
      const cat = p.categoria || 'Vapes';
      uniqueCats.add(cat);
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return {
      categories: ['Todas', ...Array.from(uniqueCats).sort()],
      categoryCounts: counts,
    };
  }, [products]);

  // Filter and sort products in memory for sub-millisecond response
  const filteredProducts = useMemo(() => {
    return catalogService.filterAndSort(
      products,
      searchQuery,
      selectedCategory,
      sortBy
    );
  }, [products, searchQuery, selectedCategory, sortBy]);

  const isFiltered = searchQuery.trim() !== '' || selectedCategory !== 'Todas';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todas');
  };

  const handleAdminButtonClick = () => {
    if (authState === 'authorized' && adminUser) {
      // Ya autenticado → abrir panel directamente
      setIsAdminPanelOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLogout = async () => {
    await logout();
    setIsAdminPanelOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased selection:bg-violet-500 selection:text-white">
      {/* Top Application Header */}
      <Header
        totalProducts={products.length}
        isRealtimeConnected={isRealtimeConnected}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-5 space-y-5">

        {/* Search & Sort Bar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          resultsCount={filteredProducts.length}
        />

        {/* Category Filters */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
        />

        {/* Product Grid or Loading State */}
        {loading ? (
          <LoadingState />
        ) : (
          <ProductGrid
            products={filteredProducts}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onClearFilters={handleClearFilters}
            isFiltered={isFiltered}
          />
        )}
      </main>

      {/* Modal con detalle de producto */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen && authState !== 'authorized'}
        onClose={() => setIsAdminLoginOpen(false)}
        authState={authState}
        errorMessage={errorMessage}
        onLogin={login}
      />

      {/* Admin Panel (pantalla completa) */}
      {isAdminPanelOpen && adminUser && (
        <AdminPanel
          adminUser={adminUser}
          onLogout={handleAdminLogout}
          onClose={() => setIsAdminPanelOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-900 bg-zinc-950 px-4 py-6 text-zinc-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Catálogo público seguro conectado a Firebase Firestore</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAdminButtonClick}
              className={`text-[11px] transition-colors flex items-center gap-1.5 p-1 ${
                authState === 'authorized'
                  ? 'text-violet-400 hover:text-violet-300'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Panel de administración"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{authState === 'authorized' ? `Admin (${adminUser?.email?.split('@')[0]})` : 'Admin'}</span>
            </button>
            <span aria-hidden="true" className="text-zinc-700">·</span>
            <span className="text-[11px] text-zinc-600 font-mono">
              v2.1
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
