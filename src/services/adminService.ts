import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
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

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const cleanUndefined = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined);
  } else if (obj !== null && typeof obj === 'object' && !(obj instanceof Timestamp)) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = cleanUndefined(value);
      }
      return acc;
    }, {} as any);
  }
  return obj;
};

const normalizeName = (name: string = ""): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

export const adminService = {
  // Products
  async getProducts() {
    const path = 'produtos';
    try {
      const q = query(collection(db, path), orderBy('name'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => normalizeProduct(doc.id, doc.data()));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async checkDuplicateProduct(name: string, excludeId?: string) {
    const nomeNormalizado = normalizeName(name);
    console.log("Verificando produto duplicado:", nomeNormalizado);
    
    const products = await this.getProducts();
    if (!products) return false;

    const duplicate = products.find(p => 
      normalizeName(p.name) === nomeNormalizado && p.id !== excludeId
    );

    if (duplicate) {
      console.log("Produto duplicado encontrado:", duplicate);
      return true;
    }
    return false;
  },

  async addProduct(product: Omit<Product, 'id'>) {
    const isDuplicate = await this.checkDuplicateProduct(product.name);
    if (isDuplicate) {
      throw new Error("Já existe um produto cadastrado com esse nome.");
    }

    const path = 'produtos';
    try {
      const docRef = await addDoc(collection(db, path), cleanUndefined({
        ...product,
        nome: product.name,
        preco: Number(product.price),
        categoria: product.category,
        imagens: product.images || [],
        tamanhos: product.sizes || [],
        personalizacao: Boolean(product.personalizable),
        descricao: product.description || '',
        esgotado: Boolean(product.soldOut),
        ativo: product.active !== false,
        salesCount: 0,
        totalRevenue: 0,
        updatedAt: Timestamp.now(),
      }));
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async updateProduct(id: string, data: Partial<Product>) {
    if (data.name) {
      const isDuplicate = await this.checkDuplicateProduct(data.name, id);
      if (isDuplicate) {
        throw new Error("Já existe um produto cadastrado com esse nome.");
      }
    }

    const path = `produtos/${id}`;
    try {
      const docRef = doc(db, 'produtos', id);
      
      const updateData: any = { ...data };
      if (data.name !== undefined) updateData.nome = data.name;
      if (data.price !== undefined) updateData.preco = Number(data.price);
      if (data.category !== undefined) updateData.categoria = data.category;
      if (data.images !== undefined) updateData.imagens = data.images;
      if (data.sizes !== undefined) updateData.tamanhos = data.sizes;
      if (data.personalizable !== undefined) updateData.personalizacao = Boolean(data.personalizable);
      if (data.description !== undefined) updateData.descricao = data.description;
      if (data.soldOut !== undefined) updateData.esgotado = Boolean(data.soldOut);
      if (data.active !== undefined) updateData.ativo = data.active !== false;

      await updateDoc(docRef, cleanUndefined({
        ...updateData,
        updatedAt: Timestamp.now(),
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteProduct(id: string) {
    const path = `produtos/${id}`;
    try {
      await deleteDoc(doc(db, 'produtos', id));
      console.log(`Produto ${id} removido com sucesso`);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
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
          // Critério: manter o que tem mais imagens ou o mais recente (updatedAt)
          const currentScore = (p.images?.length || 0) + (p.updatedAt?.seconds || 0);
          const existingScore = (existing.images?.length || 0) + (existing.updatedAt?.seconds || 0);

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
      await Promise.all(toDelete.map(id => deleteDoc(doc(db, 'produtos', id))));
      console.log("Limpeza concluída com sucesso.");
      return toDelete.length;
    } catch (error) {
      console.error("Erro durante a limpeza de duplicados:", error);
    }
  },

  // Coupons
  async getCoupons() {
    const path = 'cupons';
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async addCoupon(code: string, responsible: string, discountPercent: number) {
    const path = 'cupons';
    try {
      await addDoc(collection(db, path), {
        code,
        responsible,
        discountPercent,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async deleteCoupon(id: string) {
    const path = `cupons/${id}`;
    try {
      await deleteDoc(doc(db, 'cupons', id));
      console.log(`Cupom ${id} removido com sucesso`);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async updateCoupon(id: string, discountPercent: number) {
    const path = `cupons/${id}`;
    try {
      await updateDoc(doc(db, 'cupons', id), { discountPercent });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  // Sales
  async recordSale(cart: CartItem[], couponCode?: string | null, discountAmount: number = 0) {
    const path = 'pedidos';
    try {
      const salePromises = cart.map(async (item) => {
        const productPrice = item.product?.price || 0;
        const productName = item.product?.name || 'Produto Indefinido';
        const itemTotal = (productPrice + (item.personalization?.additionalPrice || 0)) * item.quantity;
        
        const liquidProfit = (productPrice * 0.5) - (discountAmount / cart.length);

        const saleData = cleanUndefined({
          type: 'sale',
          date: Timestamp.now(),
          criadoEm: serverTimestamp(),
          productId: item.product?.id || 'unknown',
          productName,
          price: productPrice,
          qty: item.quantity,
          category: item.product?.category || 'Geral',
          couponCode: couponCode || null,
          discountAmount: discountAmount / cart.length,
          liquidProfit: liquidProfit * item.quantity,
          personalization: item.personalization
        });

        return addDoc(collection(db, path), saleData);
      });

      // Also update product salesCount
      const updatePromises = cart.map(async (item) => {
        if (!item.product.id || item.product.id === 'unknown') {
          console.warn('⚠️ Produto sem ID detectado no registro de venda:', item.product.name);
          return;
        }

        try {
          const productRef = doc(db, 'produtos', item.product.id);
          const productSnap = await getDoc(productRef);
          
          if (productSnap.exists()) {
            const currentData = productSnap.data();
            const currentSales = Number(currentData.salesCount || 0);
            const currentRevenue = Number(currentData.totalRevenue || 0);
            const itemRevenue = Number((item.product.price + (item.personalization?.additionalPrice || 0)) * item.quantity);
            
            console.log(`📊 Atualizando stats do produto: ${item.product.name}`, {
              fromSales: currentSales,
              toSales: currentSales + item.quantity,
              fromRevenue: currentRevenue,
              toRevenue: currentRevenue + itemRevenue
            });

            await updateDoc(productRef, {
              salesCount: currentSales + item.quantity,
              totalRevenue: currentRevenue + itemRevenue,
              updatedAt: Timestamp.now()
            });
          } else {
            console.error(`❌ Produto não encontrado no Firestore para atualizar stats: ${item.product.id} (${item.product.name})`);
            // Attempt to find by name as fallback
            const q = query(collection(db, 'produtos'), where('name', '==', item.product.name));
            const fallbackSnap = await getDocs(q);
            if (!fallbackSnap.empty) {
              const fallbackDoc = fallbackSnap.docs[0];
              const currentData = fallbackDoc.data();
              console.log(`🔍 Fallback: Encontrado produto pelo nome: ${fallbackDoc.id}`);
              await updateDoc(doc(db, 'produtos', fallbackDoc.id), {
                salesCount: (Number(currentData.salesCount || 0)) + item.quantity,
                totalRevenue: (Number(currentData.totalRevenue || 0)) + (item.product.price * item.quantity),
                updatedAt: Timestamp.now()
              });
            }
          }
        } catch (err) {
          console.error(`❌ Erro crítico ao atualizar stats do produto ${item.product.id}:`, err);
        }
      });

      await Promise.all([...salePromises, ...updatePromises]);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async getSales() {
    const pedidosPath = 'pedidos';
    const vendasPath = 'vendas';
    try {
      // Resolve both collections if they exist
      const [pedidosSnap, vendasSnap] = await Promise.allSettled([
        getDocs(query(collection(db, pedidosPath), orderBy('criadoEm', 'desc'))),
        getDocs(query(collection(db, vendasPath), orderBy('date', 'desc')))
      ]);

      const pedidosDocs = pedidosSnap.status === 'fulfilled' ? pedidosSnap.value.docs : [];
      const vendasDocs = vendasSnap.status === 'fulfilled' ? vendasSnap.value.docs : [];

      const pedidos = pedidosDocs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sales = vendasDocs.map(doc => ({ id: doc.id, ...doc.data() }));

      console.log(`📊 Stats: ${pedidos.length} pedidos, ${sales.length} vendas (itens)`);
      
      return [...pedidos, ...sales];
    } catch (error) {
      console.error("Erro ao buscar dados de vendas:", error);
      return [];
    }
  },

  async deleteSale(saleId: string) {
    try {
      // Try to delete from both potential collections
      await Promise.allSettled([
        deleteDoc(doc(db, 'pedidos', saleId)),
        deleteDoc(doc(db, 'vendas', saleId))
      ]);
      console.log(`Pedido ${saleId} removido com sucesso`);
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `pedidos/vendas/${saleId}`);
      return false;
    }
  },

  async deleteCustomerSales(identifier: string) {
    try {
      const pedidosPath = 'pedidos';
      const vendasPath = 'vendas';
      
      const collections = [pedidosPath, vendasPath];
      const deletePromises: Promise<any>[] = [];

      for (const path of collections) {
        // Try to find by email
        const qEmail = query(collection(db, path), where('cliente.email', '==', identifier));
        const snapEmail = await getDocs(qEmail);
        snapEmail.docs.forEach(d => {
          deletePromises.push(deleteDoc(doc(db, path, d.id)));
          console.log(`Registro ${d.id} do cliente ${identifier} removido com sucesso`);
        });

        // Try to find by whatsapp
        const qWhatsapp = query(collection(db, path), where('cliente.whatsapp', '==', identifier));
        const snapWhatsapp = await getDocs(qWhatsapp);
        snapWhatsapp.docs.forEach(d => {
          deletePromises.push(deleteDoc(doc(db, path, d.id)));
          console.log(`Registro ${d.id} do cliente ${identifier} removido com sucesso`);
        });
      }

      await Promise.allSettled(deletePromises);
      return true;
    } catch (error) {
      console.error("Erro ao excluir vendas do cliente:", error);
      return false;
    }
  },

  async createOrder(order: any) {
    const path = 'pedidos';
    try {
      const orderData = cleanUndefined({
        ...order,
        type: 'order',
        status: order.status || 'Aguardando pagamento',
        criadoEm: serverTimestamp()
      });
      const docRef = await addDoc(collection(db, path), orderData);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async seedProducts(products: Product[]) {
    const path = 'produtos';
    try {
      // 1. Get existing products to avoid duplicates
      const snapshot = await getDocs(collection(db, path));
      const existingNames = new Set(
        snapshot.docs.map(doc => (doc.data().nome || doc.data().name || '').toString().toLowerCase())
      );

      let imported = 0;
      let skipped = 0;

      // 2. Process products
      for (const product of products) {
        if (existingNames.has(product.name.toLowerCase())) {
          skipped++;
          continue;
        }

        const productData = {
          nome: product.name,
          preco: Number(product.price),
          categoria: product.category,
          imagens: product.images || [],
          tamanhos: product.sizes || [],
          personalizacao: Boolean(product.personalizable),
          descricao: product.description || 'Produto oficial da Torcida Prime.',
          ativo: true,
          estoque: 10,
          esgotado: Boolean(product.soldOut),
          criadoEm: serverTimestamp(),
          // Legacy fields
          name: product.name,
          price: Number(product.price),
          category: product.category,
          images: product.images || [],
          sizes: product.sizes || []
        };

        await addDoc(collection(db, path), productData);
        imported++;
      }

      console.log(`✅ Importação concluída! Importados: ${imported}, Pulados: ${skipped}`);
      return { imported, skipped };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
};
