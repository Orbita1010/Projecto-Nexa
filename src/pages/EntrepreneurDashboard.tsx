/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Zap, 
  ChevronRight, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { dbService, Project } from '../lib/dbService';
import { cn } from '../lib/utils';

// Chart helper data
const chartData = [
  { name: 'Jan', score: 45 },
  { name: 'Fev', score: 52 },
  { name: 'Mar', score: 48 },
  { name: 'Abr', score: 61 },
  { name: 'Mai', score: 75 },
  { name: 'Jun', score: 85 },
];

export const EntrepreneurDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(dbService.getCurrentUser());
  const [projects, setProjects] = useState<Project[]>([]);
  const [investorCount, setInvestorCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Garantir sessão local de teste ativa se nenhuma existir
    let currentUser = dbService.getCurrentUser();
    if (!currentUser) {
      currentUser = {
        uid: "nelson",
        name: "Nelson Camisassa",
        email: "nelson@nexa.ao",
        role: "ENTREPRENEUR",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nelson",
        bio: "Empreendedor em Luanda focado em soluções de pagamento inovadoras e inclusão financeira.",
        createdAt: new Date().toISOString()
      };
      dbService.setCurrentUser(currentUser);
      setUser(currentUser);
    }

    const loadDashboardData = async () => {
      try {
        if (currentUser) {
          const userProjects = await dbService.getUserProjects(currentUser.uid);
          setProjects(userProjects);

          // Buscar quantidade de investidores interessados
          const matches = await dbService.getMatches();
          const userProjIds = userProjects.map(p => p.id);
          const interestedMatches = matches.filter(
            m => userProjIds.includes(m.projectId) && m.status === 'INTERESTED'
          );
          setInvestorCount(interestedMatches.length);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  // Cálculos dinâmicos de métricas
  const activeProjectsCount = projects.length;
  const projectsWithScore = projects.filter(p => p.investmentScore !== undefined && p.investmentScore !== null);
  const averageScore = projectsWithScore.length > 0
    ? (projectsWithScore.reduce((sum, p) => sum + (p.investmentScore || 0), 0) / projectsWithScore.length).toFixed(1)
    : "0.0";

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-nexa-teal" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Olá, {user ? getFirstName(user.name) : ' Nelson'} 👋</h1>
          <p className="text-gray-500">Seja bem-vindo de volta ao seu painel NEXA.</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/dashboard/submit')}>
          <Plus size={20} /> Novo Projeto
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-5 p-6 border-l-4 border-l-nexa-teal">
          <div className="w-12 h-12 bg-teal-50 text-nexa-teal rounded-xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{averageScore}</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Média de Score</div>
          </div>
        </Card>
        
        <Card className="flex items-center gap-5 p-6 border-l-4 border-l-nexa-amber">
          <div className="w-12 h-12 bg-amber-50 text-nexa-amber rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{investorCount}</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Investidores Interessados</div>
          </div>
        </Card>

        <Card className="flex items-center gap-5 p-6 border-l-4 border-l-nexa-dark">
          <div className="w-12 h-12 bg-slate-50 text-nexa-dark rounded-xl flex items-center justify-center">
            <Zap size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{activeProjectsCount}</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Projetos Ativos</div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart */}
        <Card className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Evolução do Business Score</h3>
            <select className="bg-gray-50 border-none rounded-lg text-sm px-3 py-1.5 focus:ring-0">
              <option>Últimos 6 meses</option>
              <option>Último ano</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="score" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="space-y-6">
          <h3 className="font-bold text-lg">Actividade Recente</h3>
          <div className="space-y-6">
            {projects.length > 0 ? (
              projects.slice(0, 3).map((project, i) => (
                <div key={project.id} className="flex gap-4">
                  <div className="w-10 h-10 bg-teal-50 text-nexa-teal rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm">
                    {project.title.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-nexa-dark">
                      Análise de IA concluída para <span className="font-bold">{project.title}</span> com score <span className="font-bold">{project.investmentScore}</span>.
                    </div>
                    <div className="text-xs text-gray-400 font-medium">
                      {project.createdAt ? new Date(project.createdAt).toLocaleDateString('pt-AO') : 'Recentemente'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm text-center py-10 italic">Nenhuma atividade recente.</div>
            )}
          </div>
          <Button variant="ghost" size="sm" className="w-full text-nexa-teal" onClick={() => navigate('/dashboard/projects')}>Ver todas</Button>
        </Card>
      </div>

      {/* Projects Table */}
      <Card className="space-y-6 overflow-hidden">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-lg">Meus Projetos</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/projects')}>Ver todos</Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Projeto</th>
                <th className="pb-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Categoria</th>
                <th className="pb-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="pb-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Score</th>
                <th className="pb-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <tr key={project.id} className="group hover:bg-nexa-ghost/50 transition-all">
                    <td className="py-5 px-4">
                      <div className="font-bold text-nexa-dark">{project.title}</div>
                      <div className="text-xs text-gray-400">
                        {project.createdAt ? new Date(project.createdAt).toLocaleDateString('pt-AO', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      </div>
                    </td>
                    <td className="py-5 px-4 text-sm font-medium text-gray-600">{project.category}</td>
                    <td className="py-5 px-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset",
                        project.status === 'APPROVED' ? "bg-green-50 text-green-700 ring-green-600/20" :
                        project.status === 'ANALYZING' ? "bg-amber-50 text-amber-700 ring-amber-600/20" :
                        "bg-slate-50 text-slate-700 ring-slate-600/20"
                      )}>
                        {project.status === 'APPROVED' ? <CheckCircle2 size={12} /> : 
                         project.status === 'ANALYZING' ? <Clock size={12} /> : 
                         <AlertCircle size={12} />}
                        {project.status}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      {project.investmentScore ? (
                        <div className="flex items-center gap-2">
                          <div className="w-10 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                             <div className="h-full bg-nexa-teal" style={{ width: `${project.investmentScore}%` }}></div>
                          </div>
                          <span className="text-sm font-bold text-nexa-teal">{project.investmentScore}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Pendente</span>
                      )}
                    </td>
                    <td className="py-5 px-4">
                      <Button variant="ghost" size="sm" className="p-2" onClick={() => navigate('/dashboard/projects')}>
                        <ChevronRight size={20} className="text-gray-400 group-hover:text-nexa-teal" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400 italic">
                    Nenhum projeto registado ainda. Comece por submeter a sua primeira ideia!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
