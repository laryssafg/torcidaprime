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

  async addProduct(product: Omit<Product, 'id'>) {
    const path = 'produtos';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...product,
        salesCount: 0,
        totalRevenue: 0,
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async updateProduct(id: string, data: Partial<Product>) {
    const path = `produtos/${id}`;
    try {
      const docRef = doc(db, 'produtos', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteProduct(id: string) {
    const path = `produtos/${id}`;
    try {
      await deleteDoc(doc(db, 'produtos', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
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
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
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
        const discountShare = (itemTotal / (discountAmount + 0.1)) * discountAmount; 
        
        const liquidProfit = (productPrice * 0.5) - (discountAmount / cart.length);

        return addDoc(collection(db, path), {
          date: Timestamp.now(),
          productId: item.product?.id || 'unknown',
          productName,
          price: productPrice,
          qty: item.quantity,
          category: item.product?.category || 'Geral',
          couponCode: couponCode || null,
          discountAmount: discountAmount / cart.length,
          liquidProfit: liquidProfit * item.quantity
        });
      });

      // Also update product salesCount
      const updatePromises = cart.map(async (item) => {
        const productRef = doc(db, 'produtos', item.product.id);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const currentData = productSnap.data();
          await updateDoc(productRef, {
            salesCount: (currentData.salesCount || 0) + item.quantity,
            totalRevenue: (currentData.totalRevenue || 0) + (item.product.price * item.quantity)
          });
        }
      });

      await Promise.all([...salePromises, ...updatePromises]);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async getSales() {
    const path = 'pedidos';
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async createOrder(order: any) {
    const path = 'pedidos';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...order,
        status: 'novo',
        criadoEm: serverTimestamp()
      });
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
