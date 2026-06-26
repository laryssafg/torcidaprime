import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Product, Category } from '../../types';
import { PRODUCTS } from '../../constants';
import { 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  ExternalLink,
  DollarSign,
  ShoppingBag,
  MoreVertical,
  Filter,
  UploadCloud,
  Edit2,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { getProductMedia, safeLower } from '../../utils';
import { AddProductForm } from './AddProductForm';

export const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('todos');
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await adminService.getProducts();
    setProducts(data || []);
    setLoading(false);
  };

  const handleCleanup = async () => {
    if (confirm('Deseja remover todos os produtos duplicados (mesmo nome)? Esta ação é permanente.')) {
      setCleaning(true);
      try {
        const removedCount = await adminService.cleanupDuplicateProducts();
        alert(removedCount ? `${removedCount} produtos duplicados foram removidos.` : 'Nenhum produto duplicado encontrado.');
        fetchProducts();
      } catch (error) {
        console.error('Erro na limpeza:', error);
        alert('Erro ao limpar duplicados.');
      } finally {
        setCleaning(false);
      }
    }
  };

  const handleImport = async () => {
    if (confirm(`Deseja importar ${PRODUCTS.length} produtos do catálogo fixo? Produtos com o mesmo nome serão ignorados.`)) {
      setImporting(true);
      try {
        const result = await adminService.seedProducts(PRODUCTS);
        alert(`Sucesso! Importados: ${result?.imported}, Pulados: ${result?.skipped}`);
        fetchProducts();
      } catch (error) {
        console.error('Erro na importação:', error);
        alert('Erro ao importar produtos. Verifique o console.');
      } finally {
        setImporting(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await adminService.deleteProduct(id);
      fetchProducts();
    }
  };

  const handleExportExcel = () => {
    if (products.length === 0) {
      alert('Não há produtos para exportar.');
      return;
    }

    const headers = [
      'ID',
      'Nome',
      'Preço (R$)',
      'Categoria',
      'Tamanhos',
      'Personalizável',
      'Descrição',
      'Status (Esgotado)',
      'Total de Vendas',
      'Faturamento Total (R$)',
      'Foto Principal',
      'Fotos Extras'
    ];

    const rows = products.map(p => {
      const tamanhos = Array.isArray(p.sizes) ? p.sizes.join(', ') : (Array.isArray(p.tamanhos) ? p.tamanhos.join(', ') : '');
      
      // Obter array de imagens
      const imgsArray = Array.isArray(p.images) ? p.images : (Array.isArray(p.imagens) ? p.imagens : []);
      const fotoPrincipal = imgsArray[0] || '';
      const fotosExtras = imgsArray.slice(1).join(', ');

      return [
        p.id || '',
        p.name || '',
        p.price || 0,
        p.category || '',
        tamanhos,
        p.personalizable ? 'Sim' : 'Não',
        p.description || '',
        p.soldOut ? 'Esgotado' : 'Ativo',
        p.salesCount || 0,
        p.totalRevenue || 0,
        fotoPrincipal,
        fotosExtras
      ];
    });

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(val => {
        const cleanVal = String(val).replace(/"/g, '""');
        return `"${cleanVal}"`;
      }).join(';'))
    ].join('\r\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `produtos_torcida_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleSoldOut = async (id: string, current: boolean) => {
    await adminService.updateProduct(id, { soldOut: !current });
    fetchProducts();
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = safeLower(p.name).includes(safeLower(searchTerm));
    const matchesCategory = filterCategory === 'todos' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="flex items-center justify-center p-20"><div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {editingProduct ? (
          <motion.div
            key="edit-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Editar Produto: {editingProduct.name}</h3>
              <button 
                onClick={() => setEditingProduct(null)}
                className="text-sm font-bold text-neutral-500 hover:text-white"
              >
                Voltar para Lista
              </button>
            </div>
            <AddProductForm 
              productToEdit={editingProduct} 
              onSuccess={() => {
                setEditingProduct(null);
                fetchProducts();
              }} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="product-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden"
          >
            <div className="p-6 border-b border-neutral-800 bg-neutral-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
            <input 
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-gold"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCleanup}
              disabled={cleaning}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              <Trash2 size={18} className={cleaning ? 'animate-pulse' : ''} />
              <span className="text-sm font-bold">{cleaning ? 'Limpando...' : 'Limpar Duplicados'}</span>
            </button>
            <button
              onClick={handleImport}
              disabled={importing}
              className="flex items-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              <UploadCloud size={18} className={importing ? 'animate-bounce' : ''} />
              <span className="text-sm font-bold">{importing ? 'Importando...' : 'Importar Produtos'}</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 px-4 py-2 rounded-xl transition-colors"
              title="Exportar Produtos para Excel"
            >
              <Download size={18} />
              <span className="text-sm font-bold">Exportar Excel</span>
            </button>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 rounded-xl py-2 pl-9 pr-8 text-sm focus:outline-none focus:border-gold appearance-none"
              >
                <option value="todos">Todas Categorias</option>
                {Object.values(Category).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="text-sm text-neutral-400 font-medium">
              {filteredProducts.length} itens
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 text-neutral-500 text-xs uppercase tracking-widest font-bold">
              <th className="px-6 py-4">Produto</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Preço</th>
              <th className="px-6 py-4">Vendas</th>
              <th className="px-6 py-4">Faturamento</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.tr 
                  layout
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-neutral-800/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black border border-neutral-800 rounded-lg overflow-hidden shrink-0">
                        <img src={getProductMedia(product)[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-white line-clamp-1">{product.name}</p>
                        <p className="text-neutral-500 text-xs">ID: {product.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-neutral-800 rounded-full text-xs font-medium text-neutral-400">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">
                    R$ {product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <ShoppingBag size={14} className="text-gold" />
                       <span className="font-medium">{product.salesCount || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <DollarSign size={14} className="text-green-500" />
                       <span className="font-bold text-green-500">R$ {(product.totalRevenue || 0).toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.soldOut ? (
                      <span className="flex items-center gap-1.5 text-red-500 text-xs font-bold uppercase whitespace-nowrap">
                        <EyeOff size={14} /> Esgotado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-green-500 text-xs font-bold uppercase whitespace-nowrap">
                        <Eye size={14} /> Ativo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setEditingProduct(product)}
                        title="Editar"
                        className="p-2 text-neutral-500 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleToggleSoldOut(product.id, product.soldOut)}
                        title={product.soldOut ? "Ativar" : "Esgotar"}
                        className={`p-2 rounded-lg transition-colors ${
                          product.soldOut ? 'text-green-500 hover:bg-green-500/10' : 'text-red-500 hover:bg-red-500/10'
                        }`}
                      >
                        {product.soldOut ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        title="Excluir"
                        className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        
        {filteredProducts.length === 0 && (
          <div className="p-20 text-center text-neutral-500">
            Nenhum produto encontrado.
          </div>
        )}
      </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>
  );
};
