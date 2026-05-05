import React, { useState } from 'react';
import { adminService } from '../../services/adminService';
import { Category } from '../../types';
import { 
  Plus, 
  X, 
  Image as ImageIcon, 
  Check, 
  ChevronDown,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onSuccess: () => void;
  productToEdit?: any;
}

export const AddProductForm: React.FC<Props> = ({ onSuccess, productToEdit }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: productToEdit?.name || '',
    price: productToEdit?.price?.toString() || '',
    category: productToEdit?.category || Category.BRASIL,
    personalizable: productToEdit?.personalizable || false,
    description: productToEdit?.description || '',
  });
  const [images, setImages] = useState<string[]>(productToEdit?.images || ['']);
  const [sizes, setSizes] = useState<string[]>(productToEdit?.sizes || []);

  const handleAddImage = () => setImages([...images, '']);
  const handleRemoveImage = (index: number) => setImages(images.filter((_, i) => i !== index));
  const handleImageChange = (index: number, val: string) => {
    const newImages = [...images];
    newImages[index] = val;
    setImages(newImages);
  };

  const toggleSize = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter(s => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        personalizable: formData.personalizable,
        images: images.filter(img => img.trim() !== ''),
        sizes: sizes,
        description: formData.description,
        soldOut: productToEdit?.soldOut || false
      };

      if (productToEdit?.id) {
        await adminService.updateProduct(productToEdit.id, productData);
      } else {
        await adminService.addProduct(productData);
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar produto.');
    } finally {
      setLoading(false);
    }
  };

  const commonSizes = ['P', 'M', 'G', 'GG', '2XL (G1 - XXL)', '3XL', '4XL'];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Nome do Produto</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Tailandesa Flamengo 2024"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Preço (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Categoria</label>
                <div className="relative">
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as Category})}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold appearance-none"
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
              <label htmlFor="personalizable" className="text-sm font-medium cursor-pointer">Permitir personalização (nome/número)</label>
            </div>
          </div>

          {/* Images & Desc */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-neutral-400">Links das Imagens (Imgur)</label>
                <button 
                  type="button" 
                  onClick={handleAddImage}
                  className="text-xs text-gold font-bold hover:underline"
                >
                  + Adicionar Link
                </button>
              </div>
              <div className="space-y-3">
                {images.map((img, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 w-4 h-4" />
                      <input 
                        type="url"
                        value={img}
                        onChange={e => handleImageChange(i, e.target.value)}
                        placeholder="https://i.imgur.com/..."
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-gold"
                      />
                    </div>
                    {images.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveImage(i)}
                        className="p-2 text-neutral-500 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-neutral-500 flex items-center gap-1">
                <Info size={10} /> Dica: Clique com o botão direito na imagem no Imgur e selecione "Copiar endereço da imagem".
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Breve Descrição (Opcional)</label>
              <textarea 
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Detalhes sobre tecido, ano, edição, etc."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold resize-none"
              ></textarea>
            </div>
          </div>
        </div>

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
            disabled={loading}
            className="px-8 py-3 rounded-xl font-bold bg-gold text-black hover:bg-gold/90 transition-all shadow-lg shadow-gold/10 flex items-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <Check size={20} />}
            {productToEdit ? 'Salvar Alterações' : 'Adicionar Produto'}
          </button>
        </div>
      </form>
    </div>
  );
};
