import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { apiSyncService } from '../services/apiSync';
import { firebaseService } from '../services/firebase';
import { X, Database, Globe, FileCode, Check, AlertCircle, RefreshCw, Phone, Store, RotateCcw, CloudUpload, Flame } from 'lucide-react';
import { Brand, Product } from '../types/catalog';

interface DatabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated: (brands: Brand[], products: Product[]) => void;
}

export const DatabaseConfigModal: React.FC<DatabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onDataUpdated,
}) => {
  const { config, updateConfig } = useCart();
  const [activeTab, setActiveTab] = useState<'firebase' | 'api' | 'json' | 'store'>('firebase');

  // Form states
  const [apiUrl, setApiUrl] = useState(config.remoteApiUrl || '');
  const [storeName, setStoreName] = useState(config.storeName || 'VapeStore');
  const [whatsappNumber, setWhatsappNumber] = useState(config.whatsappNumber || '');
  const [jsonInput, setJsonInput] = useState('');

  // Firebase status
  const [firebaseStatus, setFirebaseStatus] = useState<'checking' | 'connected' | 'idle'>('idle');

  // Status feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFirebaseStatus('checking');
      firebaseService.testConnection()
        .then((ok) => setFirebaseStatus(ok ? 'connected' : 'idle'))
        .catch(() => setFirebaseStatus('idle'));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSyncFromFirebase = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const data = await firebaseService.fetchCatalogFromFirestore();
      if (!data || (data.brands.length === 0 && data.products.length === 0)) {
        setErrorMessage('La base de datos en Firebase "ventas-de-vapers" está conectada pero aún no tiene colecciones de "brands" o "products". Puedes usar el botón de abajo para subir el catálogo inicial.');
      } else {
        apiSyncService.saveCatalog(data.brands, data.products);
        onDataUpdated(data.brands, data.products);
        setSuccessMessage(`¡Sincronizado con Firebase! Se descargaron ${data.brands.length} marcas y ${data.products.length} productos.`);
      }
    } catch (err: any) {
      setErrorMessage(`Error al leer desde Firebase: ${err.message || 'Verifica permisos de Firestore'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedToFirebase = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const currentBrands = apiSyncService.getBrands();
      const currentProducts = apiSyncService.getProducts();

      await firebaseService.seedCatalogToFirestore(currentBrands, currentProducts);
      setSuccessMessage(`¡Catálogo subido con éxito a tu proyecto Firebase (ventas-de-vapers)! Guardado en colecciones "brands" y "products".`);
    } catch (err: any) {
      setErrorMessage(`Error al guardar en Firebase: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStoreConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      ...config,
      storeName,
      whatsappNumber,
      remoteApiUrl: apiUrl,
    });
    setSuccessMessage('Configuración de la tienda guardada.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSyncRemoteApi = async () => {
    if (!apiUrl.trim()) {
      setErrorMessage('Por favor introduce la URL de tu API o base de datos.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const data = await apiSyncService.fetchRemoteCatalog(apiUrl.trim());
      apiSyncService.saveCatalog(data.brands, data.products);
      updateConfig({
        ...config,
        remoteApiUrl: apiUrl.trim(),
        lastSync: new Date().toLocaleTimeString(),
      });
      onDataUpdated(data.brands, data.products);
      setSuccessMessage(`¡Sincronización exitosa! Se cargaron ${data.brands.length} marcas y ${data.products.length} productos.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al conectar con la API remota.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportJson = () => {
    if (!jsonInput.trim()) {
      setErrorMessage('Pega el contenido JSON de tu base de datos.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const data = apiSyncService.parseImportedJson(jsonInput);
      apiSyncService.saveCatalog(data.brands, data.products);
      onDataUpdated(data.brands, data.products);
      setSuccessMessage(`¡Base de datos importada correctamente! ${data.brands.length} marcas y ${data.products.length} productos cargados.`);
      setJsonInput('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al procesar el formato JSON.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('¿Deseas restablecer el catálogo a los datos originales de muestra?')) {
      const { brands, products } = apiSyncService.resetToDefault();
      onDataUpdated(brands, products);
      setSuccessMessage('Catálogo restablecido a los datos iniciales.');
      setTimeout(() => setSuccessMessage(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-zinc-950 sm:rounded-3xl rounded-t-3xl border border-zinc-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-250">
        {/* Mobile Drag Handle */}
        <div className="pt-2 pb-1 sm:hidden">
          <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto" />
        </div>

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white tracking-tight">
                Base de Datos & Configuración
              </h2>
              <p className="text-[11px] text-zinc-400">
                Conectado al proyecto Firebase ventas-de-vapers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 transition-colors"
            aria-label="Cerrar configuración"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/40 px-4 pt-1 gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('firebase')}
            className={`min-h-[40px] px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'firebase'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Firebase</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`min-h-[40px] px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'api'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>API URL</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`min-h-[40px] px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'json'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Pegar JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`min-h-[40px] px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'store'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Tienda</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="px-5 py-4 overflow-y-auto space-y-4 flex-1 overscroll-contain">
          {/* Notifications */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-800/80 text-red-200 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs flex items-start gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB: FIREBASE (PROJECT VENTAS-DE-VAPERS) */}
          {activeTab === 'firebase' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-amber-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-500" />
                    <div>
                      <h4 className="font-bold text-sm text-white">Proyecto Firebase Conectado</h4>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        {firebaseService.getProjectId()}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                    Enlazado
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed pt-1 border-t border-zinc-800/60">
                  La web está configurada con las credenciales de tu archivo <code className="text-amber-400">google-services.json</code>. Puedes sincronizar los datos de tus vapers directamente con Firestore.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleSyncFromFirebase}
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/30 disabled:opacity-50 transition-all"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>{loading ? 'Consultando Firestore...' : 'Sincronizar Catálogo desde Firebase'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSeedToFirebase}
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 active:scale-[0.98] text-zinc-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                >
                  <CloudUpload className="w-4 h-4 text-amber-400" />
                  <span>Subir / Guardar catálogo actual en Firebase</span>
                </button>
              </div>

              <div className="text-[11px] text-zinc-400 bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800/50">
                💡 Los datos se guardan en las colecciones <code className="text-violet-400">brands</code> y <code className="text-violet-400">products</code> de tu base de datos Firestore en Google Cloud.
              </div>
            </div>
          )}

          {/* TAB: REMOTE API */}
          {activeTab === 'api' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/70 text-xs text-zinc-300 leading-relaxed">
                Ingresa la URL de un endpoint REST alternativo o API JSON para sincronizar tu stock de vapers.
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-200 block mb-1">
                  URL del Endpoint / API
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="https://mi-servidor.com/api/catalogo"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
                {config.lastSync && (
                  <span className="text-[11px] text-zinc-400 block mt-1">
                    Última sincronización: {config.lastSync}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleSyncRemoteApi}
                disabled={loading}
                className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 disabled:opacity-50 transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Sincronizando...' : 'Probar y Sincronizar'}</span>
              </button>
            </div>
          )}

          {/* TAB: PASTE JSON */}
          {activeTab === 'json' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/70 text-xs text-zinc-300 leading-relaxed">
                Pega el archivo JSON de tu base de datos local para cargarlo inmediatamente a la web.
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-200 block mb-1">
                  JSON de Marcas y Productos
                </label>
                <textarea
                  rows={7}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder={`{\n  "brands": [\n    { "id": "geek-bar", "name": "Geek Bar" }\n  ],\n  "products": [\n    { "id": "1", "brandId": "geek-bar", "name": "Pulse 15K", "price": 22, "flavors": ["Watermelon Ice"] }\n  ]\n}`}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                />
              </div>

              <button
                type="button"
                onClick={handleImportJson}
                disabled={loading || !jsonInput.trim()}
                className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              >
                <Database className="w-4 h-4" />
                <span>Cargar y Reemplazar Catálogo</span>
              </button>
            </div>
          )}

          {/* TAB: STORE & WHATSAPP CONFIG */}
          {activeTab === 'store' && (
            <form onSubmit={handleSaveStoreConfig} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-zinc-200 block mb-1">
                  Nombre de tu Tienda de Vaper
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Mi Vape Shop"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-200 block mb-1">
                  Número de WhatsApp de la tienda (opcional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="Ej: 5491123456789"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 font-mono-numbers"
                  />
                </div>
                <span className="text-[11px] text-zinc-400 block mt-1">
                  El cliente siempre tendrá la opción de elegir a qué contacto mandarle el pedido desde su WhatsApp en el celular.
                </span>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Datos de la Tienda</span>
              </button>
            </form>
          )}

          {/* Reset button */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-[11px] text-zinc-400">
              ¿Restablecer datos originales?
            </span>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restablecer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
