import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Influencer } from '../types';

import CryptoJS from 'crypto-js';

// Não precisamos mais da Promise, mas manteremos o async para não quebrar outras chamadas
async function hashPassword(password: string): Promise<string> {
  return CryptoJS.SHA256(password).toString();
}

export const influencerService = {
  async getInfluencers(): Promise<Influencer[]> {
    try {
      const snapshot = await getDocs(collection(db, 'influenciadores'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Influencer));
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
        criadoEm: serverTimestamp()
      };
      
      console.log("Salvando influenciador:", dados);
      
      const docRef = await addDoc(collection(db, 'influenciadores'), dados);
      
      console.log("Influenciador salvo com sucesso:", docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error("Erro ao adicionar influenciador:", error);
    }
  },

  async updateInfluencer(id: string, updates: Partial<Influencer>, newPlainPassword?: string): Promise<void> {
    try {
      const docRef = doc(db, 'influenciadores', id);
      const dataToUpdate: any = { ...updates };
      
      if (newPlainPassword) {
        dataToUpdate.senhaHash = await hashPassword(newPlainPassword);
      }
      
      await updateDoc(docRef, dataToUpdate);
    } catch (error) {
      console.error("Erro ao atualizar influenciador:", error);
    }
  },

  async deleteInfluencer(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'influenciadores', id));
      console.log(`Influenciador ${id} removido com sucesso`);
    } catch (error) {
      console.error("Erro ao excluir influenciador:", error);
    }
  },

  async authenticate(email: string, plainPassword: string): Promise<Influencer | null> {
    try {
      console.log("Tentando login:", email);
      const senhaHash = await hashPassword(plainPassword);
      
      const q = query(
        collection(db, 'influenciadores'), 
        where('email', '==', email)
      );
      
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        // Encontrou usuário pelo e-mail, agora verificamos senha e status
        const docSnap = snapshot.docs[0];
        const data = docSnap.data() as Influencer;
        
        console.log("Senha digitada:", plainPassword);
        console.log("Hash gerado no login:", senhaHash);
        console.log("Hash salvo no Firestore:", data.senhaHash);
        console.log("Os hashes são iguais?", senhaHash === data.senhaHash);
        
        if (senhaHash !== data.senhaHash) {
          throw new Error("Senha incorreta");
        }
        
        if (data.status !== 'ativo') {
          throw new Error("Conta desativada.");
        }
        
        return { id: docSnap.id, ...data };
      } else {
        throw new Error('Usuário não encontrado.');
      }
    } catch (error: any) {
      console.error("Erro na autenticação do influenciador:", error);
      throw error; // Lança o erro para o componente capturar e exibir na tela
    }
  },

  async getSalesByCoupon(cupom: string): Promise<any[]> {
    try {
      console.log("Cupom influencer:", cupom);
      
      const snapshot = await getDocs(collection(db, 'pedidos'));
      const allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      
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
