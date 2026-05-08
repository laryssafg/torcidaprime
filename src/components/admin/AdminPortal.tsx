import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ShoppingBag, 
  Ticket, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  ClipboardList,
  Users
} from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { ProductManagement } from './ProductManagement';
import { AddProductForm } from './AddProductForm';
import { CouponManagement } from './CouponManagement';
import { SalesManagement } from './SalesManagement';
import { CustomerManagement } from './CustomerManagement';
import { InfluencerManagement } from './InfluencerManagement';
import { ErrorBoundary } from './ErrorBoundary';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'dashboard' | 'sales' | 'customers' | 'new-product' | 'products' | 'coupons' | 'influencers' | 'settings';

export const AdminPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => signOut(auth);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Vendas', icon: ClipboardList },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'new-product', label: 'Novo Produto', icon: PlusCircle },
    { id: 'products', label: 'Produtos', icon: ShoppingBag },
    { id: 'coupons', label: 'Cupons', icon: Ticket },
    { id: 'influencers', label: 'Influenciadores', icon: Users },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ] as const;

  console.log("Aba ativa:", activeTab);

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } fixed left-0 top-0 bottom-0 bg-neutral-950 border-r border-neutral-900 transition-all duration-300 z-50`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            {isSidebarOpen && (
              <span className="font-bold text-lg text-gold flex items-center gap-2">
                <div className="w-8 h-8 bg-gold rounded flex items-center justify-center text-black font-black">T</div>
                Torcida Admin
              </span>
            )}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 hover:bg-neutral-900 rounded text-neutral-400"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="flex-1 mt-6 px-3 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-gold text-black font-semibold' 
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <item.icon size={22} />
                {isSidebarOpen && <span>{item.label}</span>}
                {isSidebarOpen && activeTab === item.id && <ChevronRight size={16} className="ml-auto" />}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-neutral-900">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={22} />
              {isSidebarOpen && <span>Sair do Portal</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`${isSidebarOpen ? 'ml-64' : 'ml-20'} flex-1 min-h-screen transition-all duration-300 p-8`}>
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
            <p className="text-neutral-500 text-sm mt-1">
              Bem-vindo ao sistema de gerenciamento Torcida Prime
            </p>
          </div>
          <div className="bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
              <Settings size={14} className="text-neutral-400" />
            </div>
            <span className="text-sm font-medium">{auth.currentUser?.email}</span>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ErrorBoundary key={activeTab}>
                {activeTab === 'dashboard' && (
                  <>
                    {console.log("Renderizando Dashboard")}
                    <AdminDashboard />
                  </>
                )}
                {activeTab === 'sales' && (
                  <>
                    {console.log("Renderizando Vendas")}
                    <SalesManagement />
                  </>
                )}
                {activeTab === 'customers' && (
                  <>
                    {console.log("Renderizando Clientes")}
                    <CustomerManagement />
                  </>
                )}
                {activeTab === 'products' && (
                  <>
                    {console.log("Renderizando Produtos")}
                    <ProductManagement />
                  </>
                )}
                {activeTab === 'new-product' && (
                  <>
                    {console.log("Renderizando Novo Produto")}
                    <AddProductForm onSuccess={() => setActiveTab('products')} />
                  </>
                )}
                {activeTab === 'coupons' && (
                  <>
                    {console.log("Renderizando Cupons")}
                    <CouponManagement />
                  </>
                )}
                {activeTab === 'influencers' && (
                  <>
                    {console.log("Renderizando Influenciadores")}
                    <InfluencerManagement />
                  </>
                )}
                {activeTab === 'settings' && (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
                    <h3 className="text-xl font-bold mb-4">Configurações Gerais</h3>
                    <p className="text-neutral-400">Configurações da loja em desenvolvimento.</p>
                  </div>
                )}
              </ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
