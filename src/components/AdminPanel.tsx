import React, { useState, useEffect } from 'react';
import {
  collection, onSnapshot, doc, setDoc, deleteDoc, getDoc, updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { CATALOG_COLLECTION, catalogService } from '../services/catalogService';
import { CatalogProduct } from '../types/CatalogProduct';
import { Brand } from '../types/catalog';
import { AdminProductForm } from './AdminProductForm';
import { AdminUser } from '../hooks/useAdminAuth';
import {
  X, Plus, Pencil, Trash2, LogOut, Shield, Search,
  Eye, EyeOff, Package, Settings, Users, Flame,
  ChevronRight, AlertCircle, Check, Loader2, Store
} from 'lucide-react';

interface AdminPanelProps {
  adminUser: AdminUser;
  onLogout: () => void;
  onClose: () => void;
}

type PanelView = 'products' | 'new' | 'edit' | 'settings';

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ adminUser, onLogout, onClose }) => {
  const [view, setView] = useState<PanelView>('products');
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [inventoryBrands, setInventoryBrands] = useState<Brand[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Settings state
  const [storeName, setStoreName] = useState('supposhop');
  const [savingSettings, setSavingSettings] = useState(false);
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const showToast = (text: string, ok = true) => {
    setToastMsg({ text, ok });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Suscripción en tiempo real a catalogo_publico
  useEffect(() => {
    const unsub = onSnapshot(collection(db, CATALOG_COLLECTION), (snap) => {
      const items: CatalogProduct[] = [];
      snap.forEach((d) => {
        const data = d.data();
        if (data.inventoryDeleted === true) return;
        items.push({
          id: d.id,
          nombre: data.nombre || '',
          marca: data.marca || '',
          categoria: data.categoria || '',
          precio: Number(data.precio ?? 0),
          descripcion: data.descripcion || '',
          imagenUrl:
            data.imagenUrl ||
            catalogService.getBrandImage(String(data.marca || data.brand || '')),
          visible: data.visible !== false,
          disponible: data.disponible !== false,
          variantes: Array.isArray(data.variantes) ? data.variantes : [],
          updatedAt: data.updatedAt,
        });
      });
      items.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setProducts(items);
      setLoadingProducts(false);
    }, (error) => {
      console.error('Error al cargar productos del catálogo:', error);
      setLoadingProducts(false);
      showToast('No se pudieron cargar los productos.', false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    catalogService.fetchInventoryBrands()
      .then(setInventoryBrands)
      .catch((error) => {
        console.error('Error al cargar las marcas del inventario:', error);
        showToast('No se pudieron cargar las marcas del inventario.', false);
      });
  }, []);

  // Cargar configuración de la tienda
  useEffect(() => {
    (async () => {
      try {
        const configDoc = await getDoc(doc(db, 'admin_config', 'store'));
        if (configDoc.exists()) {
          setStoreName(configDoc.data().storeName || 'supposhop');
        }
        const emailsDoc = await getDoc(doc(db, 'admin_config', 'emails'));
        if (emailsDoc.exists()) {
          setAdminEmails(emailsDoc.data().list || []);
        }
      } catch (error) {
        console.error('Error al cargar la configuración de administración:', error);
        showToast('No se pudo cargar la configuración de administración.', false);
      }
    })();
  }, []);

  /** Guardar o crear producto en Firestore */
  const handleSaveProduct = async (data: Omit<CatalogProduct, 'id'> & { id?: string }) => {
    try {
      const { id, ...fields } = data;
      const productId = id || `prod-${Date.now()}`;
      await setDoc(doc(db, CATALOG_COLLECTION, productId), {
        ...fields,
        updatedAt: Date.now(),
      }, { merge: true });
      showToast(id ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.');
      setView('products');
      setEditingProduct(null);
    } catch (error) {
      showToast(getErrorMessage(error, 'Error al guardar el producto.'), false);
    }
  };

  /** Eliminar producto */
  const handleDeleteProduct = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, CATALOG_COLLECTION, id));
      showToast('Producto eliminado del catálogo.');
      setConfirmDeleteId(null);
    } catch (error) {
      showToast(getErrorMessage(error, 'Error al eliminar.'), false);
    } finally {
      setDeletingId(null);
    }
  };

  /** Toggle rápido de visibilidad */
  const handleToggleVisible = async (product: CatalogProduct) => {
    try {
      await updateDoc(doc(db, CATALOG_COLLECTION, product.id), {
        visible: !product.visible,
        updatedAt: Date.now(),
      });
    } catch (error) {
      showToast(getErrorMessage(error, 'Error al cambiar visibilidad.'), false);
    }
  };

  /** Guardar config de la tienda */
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await setDoc(doc(db, 'admin_config', 'store'), {
        storeName: storeName.trim() || 'supposhop',
        updatedAt: Date.now(),
      }, { merge: true });
      showToast('Configuración guardada.');
    } catch (error) {
      showToast(getErrorMessage(error, 'Error al guardar configuración.'), false);
    } finally {
      setSavingSettings(false);
    }
  };

  /** Agregar email de admin */
  const handleAddAdminEmail = async () => {
    const email = newAdminEmail.trim().toLowerCase();
    if (!email || adminEmails.includes(email)) return;
    const updated = [...adminEmails, email];
    try {
      await setDoc(doc(db, 'admin_config', 'emails'), { list: updated }, { merge: true });
      setAdminEmails(updated);
      setNewAdminEmail('');
      showToast(`${email} agregado como administrador.`);
    } catch (error) {
      showToast(getErrorMessage(error, 'Error al agregar admin.'), false);
    }
  };

  /** Quitar email de admin */
  const handleRemoveAdminEmail = async (email: string) => {
    const updated = adminEmails.filter((e) => e !== email);
    try {
      await setDoc(doc(db, 'admin_config', 'emails'), { list: updated }, { merge: true });
      setAdminEmails(updated);
      showToast(`${email} eliminado de administradores.`);
    } catch (error) {
      showToast(getErrorMessage(error, 'Error al eliminar admin.'), false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.marca.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const brandOptions = [
    ...inventoryBrands,
    ...products
      .filter((product) =>
        !inventoryBrands.some(
          (brand) => brand.name.toLowerCase() === product.marca.toLowerCase()
        )
      )
      .map((product) => ({
        id: product.marca,
        name: product.marca,
        logo: catalogService.getBrandImage(product.marca),
        description: '',
      })),
  ];

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col animate-in fade-in duration-200">
      {/* Toast */}
      {toastMsg && (
        <div className={`fixed top-4 right-4 z-[70] flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-semibold shadow-2xl border animate-in slide-in-from-top duration-200 ${
          toastMsg.ok
            ? 'bg-emerald-950 border-emerald-700 text-emerald-200'
            : 'bg-red-950 border-red-700 text-red-200'
        }`}>
          {toastMsg.ok ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          {toastMsg.text}
        </div>
      )}

      {/* Top Bar */}
      <header className="shrink-0 px-4 sm:px-6 py-4 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-600/30 shrink-0">
            <Shield className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-white leading-tight">Panel de Administración</h1>
            <p className="text-[11px] text-zinc-400">supposhop · Catálogo</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Avatar del admin */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800">
            {adminUser.photoURL ? (
              <img src={adminUser.photoURL} className="w-5 h-5 rounded-full" alt="" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-white text-[10px] font-bold">
                {adminUser.email[0].toUpperCase()}
              </div>
            )}
            <span className="text-[11px] text-zinc-300 max-w-[120px] truncate">{adminUser.email}</span>
          </div>

          <button
            onClick={onLogout}
            className="h-9 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs flex items-center gap-1.5 transition-all"
            title="Cerrar sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>

          <button
            onClick={onClose}
            className="h-9 w-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all"
            title="Cerrar panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Nav tabs */}
      <nav className="shrink-0 flex gap-1 px-4 sm:px-6 pt-3 pb-0 border-b border-zinc-800/60">
        {[
          { id: 'products' as PanelView, icon: Package, label: 'Productos' },
          { id: 'settings' as PanelView, icon: Settings, label: 'Configuración' },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => { setView(id); setEditingProduct(null); }}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 -mb-px ${
              view === id || (view === 'new' && id === 'products') || (view === 'edit' && id === 'products')
                ? 'border-violet-500 text-violet-300 bg-violet-500/10'
                : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            {id === 'products' && (
              <span className="px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-mono">{products.length}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">

        {/* ── VISTA: PRODUCTOS ── */}
        {(view === 'products') && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 space-y-4">
            {/* Barra de acciones */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar producto o marca…"
                  className="w-full h-9 pl-9 pr-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-violet-500 text-white text-xs outline-none transition-all placeholder:text-zinc-600"
                />
              </div>
              <button
                onClick={() => { setView('new'); setEditingProduct(null); }}
                className="h-9 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-violet-600/20 transition-all active:scale-95 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Nuevo
              </button>
            </div>

            {/* Lista de productos */}
            {loadingProducts ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 text-sm">
                {searchQuery ? 'No hay resultados para la búsqueda.' : 'No hay productos en el catálogo aún.'}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`group flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                      !product.visible
                        ? 'bg-zinc-900/30 border-zinc-800/40 opacity-60'
                        : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {/* Imagen miniatura */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700/40">
                      {product.imagenUrl ? (
                        <img src={product.imagenUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Flame className="w-5 h-5 text-zinc-600" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white truncate">{product.nombre}</span>
                        {!product.visible && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700 shrink-0">Oculto</span>
                        )}
                        {!product.disponible && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-950/50 text-red-400 border border-red-800/40 shrink-0">Sin stock</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-violet-400 font-bold">{product.marca}</span>
                        <span className="text-zinc-600 text-[10px]">·</span>
                        <span className="text-[11px] text-zinc-500">{product.categoria}</span>
                        <span className="text-zinc-600 text-[10px]">·</span>
                        <span className="text-[11px] text-emerald-400 font-mono">${product.precio.toLocaleString('es-AR')}</span>
                        {product.variantes && product.variantes.length > 0 && (
                          <>
                            <span className="text-zinc-600 text-[10px]">·</span>
                            <span className="text-[11px] text-zinc-500">{product.variantes.length} sabores</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Toggle visibilidad */}
                      <button
                        onClick={() => handleToggleVisible(product)}
                        title={product.visible ? 'Ocultar del catálogo' : 'Mostrar en catálogo'}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
                      >
                        {product.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Editar */}
                      <button
                        onClick={() => { setEditingProduct(product); setView('edit'); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-violet-400 hover:bg-violet-950/40 transition-all"
                        title="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {/* Eliminar */}
                      {confirmDeleteId === product.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={deletingId === product.id}
                            className="h-7 px-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold flex items-center gap-1 transition-all"
                          >
                            {deletingId === product.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                            Confirmar
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="h-7 px-2 rounded-lg bg-zinc-800 text-zinc-400 text-[10px] font-semibold hover:bg-zinc-700 transition-all"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(product.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-all"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── VISTA: NUEVO / EDITAR ── */}
        {(view === 'new' || view === 'edit') && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[11px] text-zinc-500 mb-4">
              <button onClick={() => { setView('products'); setEditingProduct(null); }} className="hover:text-zinc-300 transition-colors">
                Productos
              </button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-zinc-300">{view === 'new' ? 'Nuevo producto' : `Editar: ${editingProduct?.nombre}`}</span>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5">
              <AdminProductForm
                product={view === 'edit' ? editingProduct : null}
                brands={brandOptions}
                onSave={handleSaveProduct}
                onCancel={() => { setView('products'); setEditingProduct(null); }}
              />
            </div>
          </div>
        )}

        {/* ── VISTA: CONFIGURACIÓN ── */}
        {view === 'settings' && (
          <div className="max-w-xl mx-auto px-4 sm:px-6 py-5 space-y-6">

            {/* Nombre de la tienda */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-violet-400" />
                <h3 className="font-bold text-sm text-white">Nombre de la Tienda</h3>
              </div>
              <p className="text-[11px] text-zinc-400">Este nombre aparece en el mensaje de WhatsApp enviado a los clientes.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="supposhop"
                  className="flex-1 h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-violet-500 text-white text-sm outline-none transition-all"
                />
                <button
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="h-10 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {savingSettings ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  Guardar
                </button>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-[11px] text-zinc-400">
                Vista previa del mensaje: <span className="text-zinc-200">🛒 <strong>HOLA {storeName || 'supposhop'}!</strong> Quiero consultar / hacer un pedido...</span>
              </div>
            </div>

            {/* Gestión de administradores */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-400" />
                <h3 className="font-bold text-sm text-white">Administradores</h3>
              </div>
              <p className="text-[11px] text-zinc-400">
                Solo estos emails pueden acceder al panel de admin. Tu email actual (<span className="text-violet-300">{adminUser.email}</span>) siempre tendrá acceso.
              </p>

              {/* Lista de admins */}
              <div className="space-y-1.5">
                {adminEmails.map((email) => (
                  <div key={email} className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-950/60 border border-zinc-800">
                    <span className="text-xs text-zinc-300 font-mono">{email}</span>
                    {email !== adminUser.email && (
                      <button
                        onClick={() => handleRemoveAdminEmail(email)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {email === adminUser.email && (
                      <span className="text-[10px] text-violet-400 font-medium">Tú</span>
                    )}
                  </div>
                ))}
                {adminEmails.length === 0 && (
                  <p className="text-[11px] text-zinc-600 text-center py-2">No hay admins registrados (usando lista de fallback).</p>
                )}
              </div>

              {/* Agregar nuevo admin */}
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAdminEmail(); }}}
                  placeholder="nuevo@gmail.com"
                  className="flex-1 h-9 px-3 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-violet-500 text-white text-xs outline-none transition-all placeholder:text-zinc-600"
                />
                <button
                  onClick={handleAddAdminEmail}
                  className="h-9 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Agregar
                </button>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300">
                ⚠ Para seguridad completa, también actualizá la lista en <code className="font-mono">firestore.rules</code> y redesplegá las reglas.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
