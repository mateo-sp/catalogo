import React, { useState, useEffect } from 'react';
import { CatalogProduct } from '../types/CatalogProduct';
import { Brand } from '../types/catalog';
import { X, Plus, Trash2, Image, Save, Loader2, Tag } from 'lucide-react';

interface AdminProductFormProps {
  /** null = crear nuevo, CatalogProduct = editar existente */
  product: CatalogProduct | null;
  brands: Brand[];
  onSave: (data: Omit<CatalogProduct, 'id'> & { id?: string }) => Promise<void>;
  onCancel: () => void;
}

const EMPTY_FORM = {
  nombre: '',
  marca: '',
  categoria: '',
  precio: 0,
  descripcion: '',
  imagenUrl: '',
  visible: true,
  disponible: true,
  variantes: [] as string[],
};

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  product,
  brands,
  onSave,
  onCancel,
}) => {
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [newVariant, setNewVariant] = useState('');
  const [saving, setSaving] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const isEditing = product !== null;

  // Cargar datos del producto al editar
  useEffect(() => {
    if (product) {
      setForm({
        nombre: product.nombre,
        marca: product.marca,
        categoria: product.categoria,
        precio: product.precio,
        descripcion: product.descripcion || '',
        imagenUrl: product.imagenUrl || '',
        visible: product.visible,
        disponible: product.disponible,
        variantes: product.variantes ? [...product.variantes] : [],
      });
    } else {
      setForm({ ...EMPTY_FORM });
    }
    setImagePreviewError(false);
  }, [product]);

  const handleField = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleBrandChange = (brandName: string) => {
    setForm((prev) => {
      const previousBrand = brands.find(
        (brand) => brand.name.toLowerCase() === prev.marca.toLowerCase()
      );
      const nextBrand = brands.find(
        (brand) => brand.name.toLowerCase() === brandName.toLowerCase()
      );
      const canReplaceImage =
        !prev.imagenUrl || prev.imagenUrl === previousBrand?.logo;

      return {
        ...prev,
        marca: brandName,
        imagenUrl:
          canReplaceImage && nextBrand?.logo ? nextBrand.logo : prev.imagenUrl,
      };
    });
    setImagePreviewError(false);
  };

  const handleAddVariant = () => {
    const v = newVariant.trim();
    if (v && !form.variantes.includes(v)) {
      setForm((prev) => ({ ...prev, variantes: [...prev.variantes, v] }));
      setNewVariant('');
    }
  };

  const handleRemoveVariant = (v: string) => {
    setForm((prev) => ({ ...prev, variantes: prev.variantes.filter((x) => x !== v) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.marca.trim()) return;
    setSaving(true);
    try {
      await onSave({
        ...(isEditing && product ? { id: product.id } : {}),
        nombre: form.nombre.trim(),
        marca: form.marca.trim(),
        categoria: form.categoria.trim() || 'Vapes',
        precio: Number(form.precio) || 0,
        descripcion: form.descripcion.trim(),
        imagenUrl: form.imagenUrl.trim(),
        visible: form.visible,
        disponible: form.disponible,
        variantes: form.variantes,
        updatedAt: Date.now(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header del formulario */}
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-white">
          {isEditing ? `Editando: ${product?.nombre}` : 'Nuevo Producto'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nombre y Marca */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Nombre del modelo *</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => handleField('nombre', e.target.value)}
            required
            placeholder="Ej: Geek Bar Pulse 15000"
            className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 text-white text-xs outline-none transition-all placeholder:text-zinc-600"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Marca *</label>
          <input
            type="text"
            list="admin-product-brands"
            value={form.marca}
            onChange={(e) => handleBrandChange(e.target.value)}
            required
            placeholder="Elegí o escribí una marca"
            className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 text-white text-xs outline-none transition-all placeholder:text-zinc-600"
          />
          <datalist id="admin-product-brands">
            {brands.map((brand) => (
              <option key={brand.id} value={brand.name} />
            ))}
          </datalist>
          <p className="text-[11px] text-zinc-600">
            Elegir una marca carga su logo como imagen inicial; podés cambiarlo abajo.
          </p>
        </div>
      </div>

      {/* Categoría y Precio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Tag className="w-3 h-3" /> Categoría
          </label>
          <input
            type="text"
            value={form.categoria}
            onChange={(e) => handleField('categoria', e.target.value)}
            placeholder="Ej: Desechables"
            className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 text-white text-xs outline-none transition-all placeholder:text-zinc-600"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Precio (ARS)</label>
          <input
            type="number"
            value={form.precio || ''}
            onChange={(e) => handleField('precio', Number(e.target.value))}
            min={0}
            step={500}
            placeholder="26000"
            className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 text-white text-xs outline-none transition-all font-mono placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* URL de Imagen con preview */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
          <Image className="w-3 h-3" /> URL de Imagen
        </label>
        <input
          type="url"
          value={form.imagenUrl}
          onChange={(e) => { handleField('imagenUrl', e.target.value); setImagePreviewError(false); }}
          placeholder="https://i.imgur.com/ejemplo.jpg"
          className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 text-white text-xs outline-none transition-all placeholder:text-zinc-600"
        />
        {/* Preview de imagen */}
        {form.imagenUrl && !imagePreviewError && (
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 mt-2">
            <img
              src={form.imagenUrl}
              alt="Preview"
              onError={() => setImagePreviewError(true)}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {form.imagenUrl && imagePreviewError && (
          <p className="text-[11px] text-amber-400 mt-1">⚠ La URL no carga correctamente. Verificá que sea una imagen directa (termina en .jpg, .png, etc.).</p>
        )}
        <p className="text-[11px] text-zinc-600">
          Usá un link directo de imagen (Google Drive compartido, Imgur, etc.)
        </p>
      </div>

      {/* Descripción */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Descripción</label>
        <textarea
          value={form.descripcion}
          onChange={(e) => handleField('descripcion', e.target.value)}
          rows={3}
          placeholder="Descripción del producto, características, caladas, etc."
          className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 text-white text-xs outline-none transition-all resize-none placeholder:text-zinc-600"
        />
      </div>

      {/* Toggles: visible / disponible */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: 'visible' as const, label: 'Visible en catálogo', desc: 'Aparece en el listado público' },
          { key: 'disponible' as const, label: 'Disponible', desc: 'Muestra badge de stock disponible' },
        ].map(({ key, label, desc }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleField(key, !form[key])}
            className={`p-3 rounded-xl border text-left transition-all ${
              form[key]
                ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold">{label}</span>
              <div className={`w-8 h-4 rounded-full transition-all flex items-center ${form[key] ? 'bg-emerald-500 justify-end pr-0.5' : 'bg-zinc-700 justify-start pl-0.5'}`}>
                <div className="w-3 h-3 rounded-full bg-white" />
              </div>
            </div>
            <p className="text-[10px] opacity-70">{desc}</p>
          </button>
        ))}
      </div>

      {/* Sabores / Variantes */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          Sabores / Variantes ({form.variantes.length})
        </label>

        {/* Input para agregar variante */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newVariant}
            onChange={(e) => setNewVariant(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddVariant(); }}}
            placeholder="Ej: Watermelon Ice"
            className="flex-1 h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-violet-500 text-white text-xs outline-none transition-all placeholder:text-zinc-600"
          />
          <button
            type="button"
            onClick={handleAddVariant}
            className="h-9 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar
          </button>
        </div>

        {/* Lista de variantes actuales */}
        {form.variantes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
            {form.variantes.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-600/20 border border-violet-500/40 text-violet-200 text-[11px] font-medium"
              >
                {v}
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(v)}
                  className="text-violet-400 hover:text-red-400 transition-colors ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving || !form.nombre.trim() || !form.marca.trim()}
          className="flex-[2] h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Guardando…</>
          ) : (
            <><Save className="w-4 h-4" /> {isEditing ? 'Guardar cambios' : 'Crear producto'}</>
          )}
        </button>
      </div>
    </form>
  );
};
