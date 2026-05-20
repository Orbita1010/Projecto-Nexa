/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Search, 
  Filter, 
  MapPin, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  ChevronRight,
  MessageSquare,
  Bookmark,
  Loader2,
  CheckCircle,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';
import { dbService, Project, Match } from '../lib/dbService';
import { useNavigate } from 'react-router-dom';

export const InvestorPortal = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [user, setUser] = useState(dbService.getCurrentUser());
  const [projects, setProjects] = useState<Project[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Garantir sessão local de teste ativa como Investidor se nenhuma existir
    let currentUser = dbService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'INVESTOR') {
      currentUser = {
        uid: "bruno",
        name: "Bruno Santos",
        email: "bruno@nexa.ao",
        role: "INVESTOR",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bruno",
        bio: "Business Angel focado em Fintechs e impacto social em mercados emergentes africanos.",
        createdAt: new Date().toISOString()
      };
      dbService.setCurrentUser(currentUser);
      setUser(currentUser);
    }

    const loadInvestorData = async () => {
      try {
        const allProjects = await dbService.getProjects();
        // Apenas mostrar projetos aprovados ou em análise no portal do investidor
        const visibleProjects = allProjects.filter(p => p.status === 'APPROVED' || p.status === 'ANALYZING');
        setProjects(visibleProjects);

        const allMatches = await dbService.getMatches();
        const investorMatches = allMatches.filter(m => m.investorId === currentUser?.uid);
        setMatches(investorMatches);
      } catch (error) {
        console.error("Erro ao carregar dados do portal do investidor:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInvestorData();
  }, []);

  const handleLogout = () => {
    dbService.logout();
    navigate('/login');
  };

  const handleInterest = async (projectId: string) => {
    if (!user) return;
    try {
      await dbService.createMatch(projectId, user.uid);
      // Atualizar matches localmente
      const allMatches = await dbService.getMatches();
      setMatches(allMatches.filter(m => m.investorId === user.uid));
      // Opcionalmente redirecionar para mensagens após demonstrar interesse
      navigate('/dashboard/messages');
    } catch (error) {
      console.error("Erro ao demonstrar interesse:", error);
      alert("Erro ao registar interesse.");
    }
  };

  const getMatchForProject = (projectId: string) => {
    return matches.find(m => m.projectId === projectId);
  };

  // Filtragem e Pesquisa
  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'All' || project.category.toLowerCase() === filter.toLowerCase();
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nexa-ghost">
        <Loader2 className="animate-spin text-nexa-teal" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nexa-ghost pb-20">
      {/* Navbar do Investidor */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
         <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-8 h-8 bg-nexa-dark rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-base">N</span>
                </div>
                <span className="font-display font-bold text-xl tracking-tighter">NEXA <span className="text-nexa-teal">INVEST</span></span>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <button onClick={() => navigate('/investors')} className="font-bold text-nexa-teal text-sm">Explorar Startups</button>
                <button onClick={() => navigate('/dashboard/messages')} className="font-medium text-gray-500 hover:text-nexa-dark transition-colors text-sm">Mensagens de Chat</button>
                <button onClick={() => navigate('/dashboard')} className="font-medium text-gray-500 hover:text-nexa-dark transition-colors text-sm">Área Geral</button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-nexa-dark">{user?.name}</div>
                <div className="text-xs font-medium text-nexa-amber">Business Angel</div>
              </div>
              <div className="w-10 h-10 bg-nexa-amber rounded-full border-2 border-white shadow-sm overflow-hidden">
                <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=bruno"} alt="User Avatar" />
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors"
                title="Terminar Sessão"
              >
                <LogOut size={20} />
              </button>
            </div>
         </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold">Investir em Angola</h1>
            <p className="text-gray-500">Descubra as startups mais quentes validadas pela inteligência artificial da NEXA.</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Pesquisar por setor, nome..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 w-64 focus:ring-2 focus:ring-nexa-teal/20 transition-all text-sm"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter size={18} /> Filtros
            </Button>
          </div>
        </div>

        {/* Featured Section */}
        <div className="grid lg:grid-cols-3 gap-8">
           <Card className="lg:col-span-2 p-0 overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=1200" 
                  alt="Feature" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nexa-dark to-transparent opacity-80"></div>
                <div className="absolute bottom-6 left-6 text-white space-y-2">
                  <div className="bg-nexa-amber text-white text-[10px] font-bold uppercase tracking-widest py-1 px-2 rounded w-fit">Destaque do Mês</div>
                  <h2 className="text-3xl font-display font-bold">A Revolução do Crédito em Luanda</h2>
                  <p className="opacity-80 max-w-lg">Saiba como a NEXA está a impulsionar o microcrédito através de parcerias com startups locais.</p>
                </div>
              </div>
           </Card>

           <Card className="bg-nexa-night text-white p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-nexa-teal/20 text-nexa-teal rounded-xl flex items-center justify-center">
                   <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold">Investimento de Alta Precisão</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  O nosso algoritmo de matching usa os dados das análises de IA para cruzar o seu perfil com as soluções mais promissoras.
                </p>
              </div>
              <Button onClick={() => navigate('/dashboard/messages')} className="w-full bg-nexa-teal hover:bg-teal-600 border-none h-12">Abrir Conversas</Button>
           </Card>
        </div>

        {/* Startup Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
            {['All', 'Fintech', 'Agrotech', 'Energy', 'Education', 'Health'].map((s) => (
              <button 
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "hover:text-nexa-dark transition-colors pb-2 px-1 border-b-2 font-bold",
                  filter === s ? "text-nexa-teal border-nexa-teal" : "border-transparent"
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((startup) => {
                const match = getMatchForProject(startup.id);
                const hasMatched = !!match;

                return (
                  <Card key={startup.id} className="p-0 overflow-hidden hover:border-nexa-teal/30 group flex flex-col justify-between">
                    <div className="p-6 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="w-16 h-16 rounded-2xl bg-nexa-ghost p-3 ring-1 ring-gray-100 shadow-sm flex items-center justify-center">
                          <img 
                            src={`https://api.dicebear.com/7.x/shapes/svg?seed=${startup.id}`} 
                            alt={startup.title} 
                            className="w-full h-full" 
                          />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           <span className={cn(
                             "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                             startup.status === 'APPROVED' ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                           )}>
                             {startup.status === 'APPROVED' ? 'Aprovado' : 'Em Análise'}
                           </span>
                           {startup.investmentScore && (
                             <div className="flex items-center gap-1 text-nexa-teal font-bold text-sm">
                                <TrendingUp size={14} /> {startup.investmentScore + 2}% Match
                             </div>
                           )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-bold group-hover:text-nexa-teal transition-colors">{startup.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                          {startup.problem}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase">{startup.category}</span>
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase">Seed</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                        <div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">Financiamento</div>
                          <div className="font-bold text-nexa-dark">{startup.fundingNeeded}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">Localização</div>
                          <div className="font-bold flex items-center gap-1 text-xs">
                            <MapPin size={12} /> {startup.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1.5">
                          {startup.investmentScore && (
                            <div className={cn(
                              "p-1.5 rounded-lg flex items-center gap-1 font-bold text-xs",
                              startup.investmentScore >= 80 ? "bg-teal-50 text-nexa-teal" : "bg-amber-50 text-nexa-amber"
                            )}>
                              <ShieldCheck size={14} /> IA Score: {startup.investmentScore}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                           <button className="p-2 text-gray-400 hover:text-nexa-dark transition-colors"><Bookmark size={20} /></button>
                           {hasMatched && (
                             <button 
                               onClick={() => navigate('/dashboard/messages')} 
                               className="p-2 text-nexa-teal hover:text-teal-700 transition-colors"
                               title="Abrir Chat"
                             >
                               <MessageSquare size={20} />
                             </button>
                           )}
                        </div>
                      </div>
                    </div>
                    
                    {hasMatched ? (
                      <Button 
                        variant="secondary" 
                        className="w-full rounded-none h-14 font-bold gap-2 bg-green-50 text-green-700 hover:bg-green-100 border-none"
                        onClick={() => navigate('/dashboard/messages')}
                      >
                        <CheckCircle size={18} /> Já Demonstrado Interesse (Conversar)
                      </Button>
                    ) : (
                      <Button 
                        className="w-full rounded-none h-14 font-bold gap-2"
                        onClick={() => handleInterest(startup.id)}
                      >
                        Demonstrar Interesse <ChevronRight size={18} />
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center text-gray-400 italic">
              Nenhuma startup encontrada para este filtro ou pesquisa.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
