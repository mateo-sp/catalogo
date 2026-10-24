import React, { useState } from 'react';
import { catalogService, CATALOG_COLLECTION } from '../services/catalogService';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { X, RefreshCw, Check, AlertCircle, Database, Shield, Flame } from 'lucide-react';

interface AdminSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSyncModal: React.FC<AdminSyncModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  if (!isOpen) return null;

  // Sync existing products from admin collection 'productos' to 'catalogo_publico'
  const handleSyncFromAdminCollection = async () => {
    setLoading(true);
    setMessage(null);
    setIsError(false);

    try {
      const snap = await getDocs(collection(db, 'productos'));
      if (snap.empty) {
        setMessage('No hay productos en la colección administrativa "productos".');
        setLoading(false);
        return;
      }

      let synced = 0;
      for (const docSnap of snap.docs) {
        const p = docSnap.data();

        // No incluir productos eliminados (papelera)
        if (p.isDeleted) continue;

        // Limpiar información privada antes de guardar en catalogo_publico
        const publicDoc = {
          nombre: p.name || p.nombre || 'Sin nombre',
          marca: p.brand || p.marca || 'General',
          categoria: p.category || 'Vapes',
          precio: Number(p.sellingPrice ?? p.precio ?? 0),
          descripcion: p.description || p.notes || '',
          imagenUrl: p.imageUrl || p.imagenUrl || '',
          visible: p.visible !== false,
          disponible: Number(p.stock ?? p.cantidad ?? 0) > 0,
          variantes: Array.isArray(p.variantes) ? p.variantes : [],
          updatedAt: Date.now()
        };

        await setDoc(doc(db, CATALOG_COLLECTION, docSnap.id), publicDoc, { merge: true });
        synced++;
      }

      setMessage(`¡Sincronización completada! ${synced} productos sincronizados a "catalogo_publico".`);
    } catch (err: any) {
      console.error(err);
      setIsError(true);
      setMessage(err.message || 'Error al sincronizar con Firebase.');
    } finally {
      setLoading(false);
    }
  };

  // Seed initial sample models with single image & text variants
  const handleSeedSampleCatalog = async () => {
    setLoading(true);
    setMessage(null);
    setIsError(false);

    try {
      const count = await catalogService.seedInitialPublicCatalog();
      setMessage(`¡Catálogo inicial creado en Firestore con ${count} modelos oficiales y sus variantes en texto!`);
    } catch (err: any) {
      console.error(err);
      setIsError(true);
      setMessage(err.message || 'Error al escribir en catalogo_publico.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md bg-zinc-950 sm:rounded-3xl rounded-t-3xl border border-zinc-800 shadow-2xl overflow-hidden z-10 animate-in slide-in-from-bottom duration-250">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                Sincronización de Catálogo Público
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono">
                Colección: {CATALOG_COLLECTION}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {message && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2 ${
                isError
                  ? 'bg-red-950/70 border-red-800 text-red-200'
                  : 'bg-emerald-950/70 border-emerald-800 text-emerald-200'
              }`}
            >
              {isError ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              ) : (
                <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              )}
              <span>{message}</span>
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-zinc-200">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Seguridad de Datos Públicos</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              La colección pública <strong className="text-violet-300">catalogo_publico</strong> almacena únicamente: nombre, marca, categoría, precio, imagen y variantes de texto.
              <br />
              <strong className="text-zinc-300">Nunca se exponen</strong> costos de compra, ventas, logs de operadores ni usuarios.
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <button
              onClick={handleSyncFromAdminCollection}
              disabled={loading}
              className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Sincronizar desde "productos" a "catalogo_publico"</span>
            </button>

            <button
              onClick={handleSeedSampleCatalog}
              disabled={loading}
              className="w-full h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 active:scale-[0.98] text-zinc-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Cargar modelos y sabores oficiales iniciales</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
