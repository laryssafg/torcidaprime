import { supabase } from '../lib/supabase';
import { Influencer } from '../types';
import CryptoJS from 'crypto-js';

async function hashPassword(password: string): Promise<string> {
  return CryptoJS.SHA256(password).toString();
}

export const influencerService = {
  async getInfluencers(): Promise<Influencer[]> {
    try {
      const { data, error } = await supabase
        .from('influenciadores')
        .select('*');
      if (error) throw error;
      return (data || []) as Influencer[];
    } catch (error) {
      console.error("Erro ao buscar influenciadores:", error);
      return [];
    }
  },

  async addInfluencer(influencer: Omit<Influencer, 'id' | 'criadoEm' | 'senhaHash'>, plainPassword: string): Promise<string | undefined> {
    try {
      const senhaHash = await hashPassword(plainPassword);
      const dados = {
        ...influencer,
        senhaHash,
        criadoEm: new Date().toISOString()
      };
      
      console.log("Salvando influenciador:", dados);
      
      const { data, error } = await supabase
        .from('influenciadores')
        .insert(dados)
        .select('id')
        .single();
      
      if (error) throw error;
      console.log("Influenciador salvo com sucesso:", data.id);
      return data.id;
    } catch (error) {
      console.error("Erro ao adicionar influenciador:", error);
    }
  },

  async updateInfluencer(id: string, updates: Partial<Influencer>, newPlainPassword?: string): Promise<void> {
    try {
      const dataToUpdate: any = { ...updates };
      
      if (newPlainPassword) {
        dataToUpdate.senhaHash = await hashPassword(newPlainPassword);
      }
      
      const { error } = await supabase
        .from('influenciadores')
        .update(dataToUpdate)
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error("Erro ao atualizar influenciador:", error);
    }
  },

  async deleteInfluencer(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('influenciadores')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      console.log(`Influenciador ${id} removido com sucesso`);
    } catch (error) {
      console.error("Erro ao excluir influenciador:", error);
    }
  },

  async authenticate(email: string, plainPassword: string): Promise<Influencer | null> {
    try {
      console.log("Tentando login:", email);
      const senhaHash = await hashPassword(plainPassword);
      
      const { data, error } = await supabase
        .from('influenciadores')
        .select('*')
        .eq('email', email);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const user = data[0] as Influencer;
        
        if (senhaHash !== user.senhaHash) {
          throw new Error("Senha incorreta");
        }
        
        if (user.status !== 'ativo') {
          throw new Error("Conta desativada.");
        }
        
        return user;
      } else {
        throw new Error('Usuário não encontrado.');
      }
    } catch (error: any) {
      console.error("Erro na autenticação do influenciador:", error);
      throw error;
    }
  },

  async getSalesByCoupon(cupom: string): Promise<any[]> {
    try {
      console.log("Cupom influencer:", cupom);
      
      const { data, error } = await supabase
        .from('pedidos')
        .select('*');
      if (error) throw error;
      
      const allOrders = data || [];
      const normalizedInfluencerCoupon = String(cupom || '').trim().toUpperCase();
      
      const getCouponCode = (pedido: any) => {
        if (!pedido?.cupom) return "";
        if (typeof pedido.cupom === "string") return pedido.cupom.trim().toUpperCase();
        if (typeof pedido.cupom === "object" && pedido.cupom.code) {
          return String(pedido.cupom.code).trim().toUpperCase();
        }
        return "";
      };

      const pedidosFiltrados = allOrders.filter(pedido => {
        const normalizedOrderCoupon = getCouponCode(pedido);
        return normalizedOrderCoupon === normalizedInfluencerCoupon;
      });
      
      console.log("Pedidos encontrados para influencer:", pedidosFiltrados);
      return pedidosFiltrados;
    } catch (error) {
      console.error("Erro ao buscar vendas do cupom:", error);
      return [];
    }
  }
};
