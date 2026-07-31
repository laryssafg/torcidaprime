import React, { useState, useRef } from 'react';
import { adminService } from '../../services/adminService';
import { Category } from '../../types';
import { supabase } from '../../lib/supabase';
import { 
  X, 
  Image as ImageIcon, 
  Check, 
  ChevronDown,
  Upload,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface Props {
  onSuccess: () => void;
  productToEdit?: any;
}

// Converte File para base64 data URL (fallback confiável)
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Tenta upload no Supabase Storage; se falhar, usa base64
async function uploadImage(file: File): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
      .from('produtos')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data } = supabase.storage.from('produtos').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    // Storage falhou → converte para base64 e salva direto no banco
    console.warn('Storage indisponível, usando base64:', err);
    return await fileToBase64(file);
  }
}

export const AddProductForm: React.FC<Props> = ({ onSuccess, productToEdit }) => {
  const [loading, setLoading] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: productToEdit?.name || '',
    price: productToEdit?.price?.toString() || '',
    category: productToEdit?.category || Category.BRASIL,
    personalizable: productToEdit?.personalizable || false,
    description: productToEdit?.description || '',
  });
  const [images, setImages] = useState<string[]>(productToEdit?.images || []);
  const [sizes, setSizes] = useState<string[]>(productToEdit?.sizes || []);

  const processFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    for (let i = 0; i < arr.length; i++) {
      const file = arr[i];
      if (!file.type.startsWith('image/')) continue;

      setUploadingIdx(i);
      try {
        const url = await uploadImage(file);
        setImages(prev => [...prev, url]);
      } catch (err) {
        console.error('Falha no upload:', err);
        alert(`Erro ao processar "${file.name}"`);
      }
    }
    setUploadingIdx(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSize = (size: string) => {
    setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert('Adicione pelo menos uma imagem ao produto.');
      return;
    }
    setLoading(true);
    
    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        personalizable: formData.personalizable,
        images: images.filter(img => img.trim() !== ''),
        sizes,
        description: formData.description,
        soldOut: productToEdit?.soldOut || false
      };

      if (productToEdit?.id) {
        await adminService.updateProduct(productToEdit.id, productData);
      } else {
        await adminService.addProduct(productData);
      }
      onSuccess();
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message?.includes('Já existe um produto') 
        ? error.message 
        : 'Erro ao salvar produto.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const commonSizes = ['P', 'M', 'G', 'GG', '2XL (G1 - XXL)', '3XL', '4XL'];
  const isUploading = uploadingIdx !== null;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ── Coluna Esquerda: Dados ── */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Nome do Produto</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Tailandesa Flamengo 2024"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Preço (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  min="0"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Categoria</label>
                <div className="relative">
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as Category})}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold appearance-none transition-colors"
                  >
                    {Object.values(Category).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Tamanhos Disponíveis</label>
              <div className="flex flex-wrap gap-2">
                {commonSizes.map(size => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all ${
                      sizes.includes(size) 
                        ? 'bg-gold border-gold text-black' 
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-black/30 border border-neutral-800 rounded-2xl">
              <input 
                type="checkbox" 
                id="personalizable"
                checked={formData.personalizable}
                onChange={e => setFormData({...formData, personalizable: e.target.checked})}
                className="w-5 h-5 accent-gold cursor-pointer"
              />
              <label htmlFor="personalizable" className="text-sm font-medium cursor-pointer">
                Permitir personalização (nome/número)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Breve Descrição (Opcional)</label>
              <textarea 
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Detalhes sobre tecido, ano, edição, etc."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold resize-none transition-colors"
              />
            </div>
          </div>

          {/* ── Coluna Direita: Imagens ── */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-neutral-400">
              Imagens do Produto
              <span className="ml-2 text-neutral-600 font-normal">({images.length} adicionada{images.length !== 1 ? 's' : ''})</span>
            </label>

            {/* Drop Zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer transition-all select-none ${
                dragOver 
                  ? 'border-gold bg-gold/10' 
                  : isUploading 
                    ? 'border-neutral-600 bg-neutral-800/30 cursor-wait' 
                    : 'border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 hover:border-gold'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-gold animate-spin" />
                  <p className="text-sm text-gold font-medium">Carregando imagem...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-neutral-700/50 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-neutral-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-neutral-300">
                      <span className="font-semibold text-gold">Clique para selecionar</span> ou arraste aqui
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">PNG, JPG, WEBP — múltiplas imagens permitidas</p>
                  </div>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
            </div>

            {/* Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="relative group rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700"
                    style={{ aspectRatio: '1' }}
                  >
                    <img 
                      src={img} 
                      alt={`Imagem ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                        const errDiv = document.createElement('div');
                        errDiv.className = 'text-center p-2';
                        errDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><p style="color:#666;font-size:10px;margin-top:4px">Erro</p>';
                        target.parentElement!.appendChild(errDiv);
                      }}
                    />
                    {/* Overlay com número */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1 text-center">
                      <span className="text-[10px] text-white/70 font-bold">#{i + 1}</span>
                    </div>
                    {/* Botão remover */}
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); handleRemoveImage(i); }}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 rounded-lg text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length === 0 && !isUploading && (
              <div className="flex items-center gap-2 text-xs text-neutral-500 bg-neutral-800/40 border border-neutral-800 rounded-xl p-3">
                <AlertCircle size={14} className="shrink-0 text-amber-500" />
                Adicione pelo menos uma imagem para o produto aparecer na loja.
              </div>
            )}
          </div>
        </div>

        {/* ── Rodapé ── */}
        <div className="pt-6 border-t border-neutral-800 flex justify-end gap-4">
          <button 
            type="button" 
            onClick={onSuccess}
            className="px-6 py-3 rounded-xl font-bold bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading || isUploading}
            className="px-8 py-3 rounded-xl font-bold bg-gold text-black hover:bg-gold/90 transition-all shadow-lg shadow-gold/10 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading 
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <Check size={20} />
            }
            {productToEdit ? 'Salvar Alterações' : 'Adicionar Produto'}
          </button>
        </div>
      </form>
    </div>
  );
};
