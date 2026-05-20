/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Send, 
  FileText, 
  Users, 
  MessageCircle, 
  Calendar, 
  Settings, 
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { dbService, User } from '../lib/dbService';

interface SidebarItemProps {
  icon: any;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-nexa-teal text-white shadow-lg shadow-nexa-teal/20" 
        : "text-gray-500 hover:bg-gray-100 hover:text-nexa-dark"
    )}
  >
    <Icon size={20} className={cn(active ? "text-white" : "group-hover:text-nexa-teal")} />
    <span className="font-medium">{label}</span>
  </Link>
);

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(dbService.getCurrentUser());

  useEffect(() => {
    // Escuta mudanças de sessão para atualizar a UI
    const currentUser = dbService.getCurrentUser();
    setUser(currentUser);
  }, [location.pathname]);

  const handleLogout = () => {
    dbService.logout();
    navigate('/login');
  };

  const isInvestor = user?.role === 'INVESTOR';

  const menuItems = isInvestor 
    ? [
        { icon: LayoutDashboard, label: "Explorar Startups", href: "/investors" },
        { icon: MessageCircle, label: "Mensagens", href: "/dashboard/messages" },
      ]
    : [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: Briefcase, label: "Meus Projetos", href: "/dashboard/projects" },
        { icon: Send, label: "Submeter Ideia", href: "/dashboard/submit" },
        { icon: FileText, label: "Plano de Negócio", href: "/dashboard/business-plan" },
        { icon: Users, label: "Mentoria", href: "/dashboard/mentorship" },
        { icon: MessageCircle, label: "Mensagens", href: "/dashboard/messages" },
        { icon: Calendar, label: "Calendário", href: "/dashboard/calendar" },
      ];

  return (
    <div className="flex min-h-screen bg-nexa-ghost">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-nexa-dark rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="font-display font-bold text-2xl tracking-tighter text-nexa-dark">NEXA</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-bold text-gray-400 px-4 py-2 uppercase tracking-widest">
            {isInvestor ? "Investidor" : "Geral"}
          </div>
          {(isInvestor ? menuItems : menuItems.slice(0, 3)).map((item) => (
            <SidebarItem 
              key={item.href} 
              {...item} 
              active={location.pathname === item.href} 
            />
          ))}
          
          {!isInvestor && (
            <>
              <div className="text-xs font-bold text-gray-400 px-4 py-2 mt-6 uppercase tracking-widest">Ferramentas</div>
              {menuItems.slice(3).map((item) => (
                <SidebarItem 
                  key={item.href} 
                  {...item} 
                  active={location.pathname === item.href} 
                />
              ))}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-50 space-y-2">
          <SidebarItem icon={Settings} label="Configurações" href="/dashboard/settings" active={location.pathname === "/dashboard/settings"} />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Terminar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="relative w-96 font-medium">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar projetos, mentores..." 
              className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-nexa-teal/20 transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-all">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-nexa-dark">{user?.name || "Nelson Camisassa"}</div>
                <div className="text-xs font-medium text-nexa-teal">
                  {isInvestor ? "Investidor Anjo" : "Empreendedor Pro"}
                </div>
              </div>
              <div className="w-10 h-10 bg-nexa-amber rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-bold text-xs">
                <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=nelson"} alt="User Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};
