import { supabase } from '../lib/supabase';
import { Product, Category, CartItem } from '../types';
import { normalizeProduct } from '../utils';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

const normalizeName = (name: string = ""): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

export const adminService = {
  // Products
  async getProducts() {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('name');
      if (error) throw error;
      return (data || []).map(item => normalizeProduct(item.id, item));
    } catch (error) {
      console.error("Erro getProducts:", error);
      throw error;
    }
  },

  async checkDuplicateProduct(name: string, excludeId?: string) {
    const nomeNormalizado = normalizeName(name);
    const products = await this.getProducts();
    if (!products) return false;

    const duplicate = products.find(p => 
      normalizeName(p.name) === nomeNormalizado && p.id !== excludeId
    );

    return !!duplicate;
  },

  async addProduct(product: Omit<Product, 'id'>) {
    const isDuplicate = await this.checkDuplicateProduct(product.name);
    if (isDuplicate) {
      throw new Error("Já existe um produto cadastrado com esse nome.");
    }

    try {
      const { data, error } = await supabase
        .from('produtos')
        .insert({
          name: product.name,
          price: product.price,
          category: product.category,
          personalizable: product.personalizable,
          images: product.images,
          sizes: product.sizes,
          description: product.description,
          soldOut: product.soldOut || false,
          active: product.active !== false,
          salesCount: 0,
          totalRevenue: 0,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        })
        .select('id')
        .single();
      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error("Erro addProduct:", error);
      throw error;
    }
  },

  async updateProduct(id: string, data: Partial<Product>) {
    if (data.name) {
      const isDuplicate = await this.checkDuplicateProduct(data.name, id);
      if (isDuplicate) {
        throw new Error("Já existe um produto cadastrado com esse nome.");
      }
    }

    try {
      const updatePayload: any = {
        updatedAt: new Date().toISOString()
      };
      if (data.name !== undefined) updatePayload.name = data.name;
      if (data.price !== undefined) updatePayload.price = data.price;
      if (data.category !== undefined) updatePayload.category = data.category;
      if (data.personalizable !== undefined) updatePayload.personalizable = data.personalizable;
      if (data.images !== undefined) updatePayload.images = data.images;
      if (data.sizes !== undefined) updatePayload.sizes = data.sizes;
      if (data.description !== undefined) updatePayload.description = data.description;
      if (data.soldOut !== undefined) updatePayload.soldOut = data.soldOut;
      if (data.active !== undefined) updatePayload.active = data.active;
      if (data.salesCount !== undefined) updatePayload.salesCount = data.salesCount;
      if (data.totalRevenue !== undefined) updatePayload.totalRevenue = data.totalRevenue;

      const { error } = await supabase
        .from('produtos')
        .update(updatePayload)
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error("Erro updateProduct:", error);
      throw error;
    }
  },

  async deleteProduct(id: string) {
    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);
      if (error) throw error;
      console.log(`Produto ${id} removido com sucesso`);
    } catch (error) {
      console.error("Erro deleteProduct:", error);
      throw error;
    }
  },

  async cleanupDuplicateProducts() {
    console.log("Iniciando limpeza de produtos duplicados...");
    try {
      const products = await this.getProducts();
      if (!products) return;

      const seen = new Map<string, any>();
      const toDelete: string[] = [];

      products.forEach(p => {
        const normalized = normalizeName(p.name);
        if (seen.has(normalized)) {
          const existing = seen.get(normalized);
          const currentScore = (p.images?.length || 0) + (p.updatedAt ? new Date(p.updatedAt).getTime() : 0);
          const existingScore = (existing.images?.length || 0) + (existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0);

          if (currentScore > existingScore) {
            console.log("Produto duplicado removido:", existing.id, existing.name);
            toDelete.push(existing.id);
            seen.set(normalized, p);
          } else {
            console.log("Produto duplicado removido:", p.id, p.name);
            toDelete.push(p.id);
          }
        } else {
          seen.set(normalized, p);
        }
      });

      if (toDelete.length === 0) {
        console.log("Nenhum produto duplicado encontrado para remoção.");
        return;
      }

      console.log(`${toDelete.length} duplicados encontrados. Removendo...`);
      await Promise.all(toDelete.map(id => supabase.from('produtos').delete().eq('id', id)));
      console.log("Limpeza concluída com sucesso.");
      return toDelete.length;
    } catch (error) {
      console.error("Erro durante a limpeza de duplicados:", error);
    }
  },

  // Coupons
  async getCoupons() {
    try {
      const { data, error } = await supabase
        .from('cupons')
        .select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro getCoupons:", error);
      throw error;
    }
  },

  async addCoupon(code: string, responsible: string, discountPercent: number) {
    try {
      const { error } = await supabase
        .from('cupons')
        .insert({
          code,
          responsible,
          discountPercent,
          createdAt: new Date().toISOString(),
        });
      if (error) throw error;
    } catch (error) {
      console.error("Erro addCoupon:", error);
      throw error;
    }
  },

  async deleteCoupon(id: string) {
    try {
      const { error } = await supabase
        .from('cupons')
        .delete()
        .eq('id', id);
      if (error) throw error;
      console.log(`Cupom ${id} removido com sucesso`);
    } catch (error) {
      console.error("Erro deleteCoupon:", error);
      throw error;
    }
  },

  async updateCoupon(id: string, discountPercent: number) {
    try {
      const { error } = await supabase
        .from('cupons')
        .update({ discountPercent })
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error("Erro updateCoupon:", error);
      throw error;
    }
  },

  // Sales
  async recordSale(cart: CartItem[], couponCode?: string | null, discountAmount: number = 0) {
    try {
      const salePromises = cart.map(async (item) => {
        const productPrice = item.product?.price || 0;
        const productName = item.product?.name || 'Produto Indefinido';
        const liquidProfit = (productPrice * 0.5) - (discountAmount / cart.length);

        const saleData = {
          type: 'sale',
          date: new Date().toISOString(),
          criadoEm: new Date().toISOString(),
          productId: item.product?.id || 'unknown',
          productName,
          price: productPrice,
          qty: item.quantity,
          category: item.product?.category || 'Geral',
          couponCode: couponCode || null,
          discountAmount: discountAmount / cart.length,
          liquidProfit: liquidProfit * item.quantity,
          personalization: item.personalization,
          cliente: {}, 
          endereco: {},
          itens: [],
          total: 0
        };

        const { error } = await supabase.from('pedidos').insert(saleData);
        if (error) throw error;
      });

      const updatePromises = cart.map(async (item) => {
        if (!item.product.id || item.product.id === 'unknown') {
          console.warn('⚠️ Produto sem ID detectado no registro de venda:', item.product.name);
          return;
        }

        try {
          const { data: productSnap, error: fetchErr } = await supabase
            .from('produtos')
            .select('*')
            .eq('id', item.product.id)
            .single();

          if (productSnap) {
            const currentSales = Number(productSnap.salesCount || 0);
            const currentRevenue = Number(productSnap.totalRevenue || 0);
            const itemRevenue = Number((item.product.price + (item.personalization?.additionalPrice || 0)) * item.quantity);

            await supabase
              .from('produtos')
              .update({
                salesCount: currentSales + item.quantity,
                totalRevenue: currentRevenue + itemRevenue,
                updatedAt: new Date().toISOString()
              })
              .eq('id', item.product.id);
          } else {
            console.error(`❌ Produto não encontrado no Supabase para stats: ${item.product.id}`);
          }
        } catch (err) {
          console.error(`❌ Erro ao atualizar stats do produto ${item.product.id}:`, err);
        }
      });

      await Promise.all([...salePromises, ...updatePromises]);
    } catch (error) {
      console.error("Erro recordSale:", error);
      throw error;
    }
  },

  async getSales() {
    try {
      const { data: pedidos, error: pedidosErr } = await supabase
        .from('pedidos')
        .select('*')
        .order('criadoEm', { ascending: false });

      if (pedidosErr) throw pedidosErr;

      console.log(`📊 Stats: ${pedidos?.length || 0} pedidos`);
      return pedidos || [];
    } catch (error) {
      console.error("Erro ao buscar dados de vendas:", error);
      return [];
    }
  },

  async deleteSale(saleId: string) {
    try {
      const { error } = await supabase
        .from('pedidos')
        .delete()
        .eq('id', saleId);
      if (error) throw error;
      console.log(`Pedido ${saleId} removido com sucesso`);
      return true;
    } catch (error) {
      console.error("Erro deleteSale:", error);
      return false;
    }
  },

  async deleteCustomerSales(identifier: string) {
    try {
      const { data: orders, error } = await supabase
        .from('pedidos')
        .select('id, cliente');
      if (error) throw error;

      const deleteIds: string[] = [];
      orders.forEach((o: any) => {
        if (o.cliente && (o.cliente.email === identifier || o.cliente.whatsapp === identifier)) {
          deleteIds.push(o.id);
        }
      });

      if (deleteIds.length > 0) {
        const { error: delErr } = await supabase
          .from('pedidos')
          .delete()
          .in('id', deleteIds);
        if (delErr) throw delErr;
        console.log(`Pedidos deletados para cliente ${identifier}:`, deleteIds);
      }
      return true;
    } catch (error) {
      console.error("Erro ao excluir vendas do cliente:", error);
      return false;
    }
  },

  async createOrder(order: any) {
    try {
      const orderData = {
        ...order,
        type: 'order',
        status: order.status || 'Aguardando pagamento',
        criadoEm: new Date().toISOString()
      };
      const { data, error } = await supabase
        .from('pedidos')
        .insert(orderData)
        .select('id')
        .single();
      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error("Erro createOrder:", error);
      throw error;
    }
  },

  async seedProducts(products: Product[]) {
    try {
      const { data: existingSnap, error: fetchErr } = await supabase
        .from('produtos')
        .select('name');
      if (fetchErr) throw fetchErr;

      const existingNames = new Set((existingSnap || []).map(p => p.name.toLowerCase()));
      let imported = 0;
      let skipped = 0;

      for (const product of products) {
        if (existingNames.has(product.name.toLowerCase())) {
          skipped++;
          continue;
        }

        const productData = {
          name: product.name,
          price: Number(product.price),
          category: product.category,
          images: product.images || [],
          sizes: product.sizes || [],
          personalizable: Boolean(product.personalizable),
          description: product.description || 'Produto oficial da Torcida Prime.',
          active: true,
          stock: 10,
          soldOut: Boolean(product.soldOut),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const { error: insErr } = await supabase.from('produtos').insert(productData);
        if (insErr) throw insErr;
        imported++;
      }

      console.log(`✅ Importação concluída! Importados: ${imported}, Pulados: ${skipped}`);
      return { imported, skipped };
    } catch (error) {
      console.error("Erro seedProducts:", error);
      throw error;
    }
  }
};
