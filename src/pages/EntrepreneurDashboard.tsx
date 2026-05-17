/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
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
  AlertCircle
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

const data = [
  { name: 'Jan', score: 45 },
  { name: 'Fev', score: 52 },
  { name: 'Mar', score: 48 },
  { name: 'Abr', score: 61 },
  { name: 'Mai', score: 75 },
  { name: 'Jun', score: 85 },
];

export const EntrepreneurDashboard = () => {
  const [projects] = useState([
    { id: 1, title: 'Kandengue Pay', status: 'APPROVED', score: 88, category: 'Fintech', date: '12 Out 2025' },
    { id: 2, title: 'AgroConnect Angola', status: 'ANALYZING', score: null, category: 'Agrotech', date: '15 Out 2025' },
    { id: 3, title: 'Solar Kwanza', status: 'NEEDS_ADJUSTMENTS', score: 45, category: 'Energy', date: '18 Out 2025' },
  ]);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Olá, Nelson 👋</h1>
          <p className="text-gray-500">Seja bem-vindo de volta ao seu painel NEXA.</p>
        </div>
        <Button className="gap-2">
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
            <div className="text-2xl font-bold">85.4</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Média de Score</div>
          </div>
        </Card>
        
        <Card className="flex items-center gap-5 p-6 border-l-4 border-l-nexa-amber">
          <div className="w-12 h-12 bg-amber-50 text-nexa-amber rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Investidores Interessados</div>
          </div>
        </Card>

        <Card className="flex items-center gap-5 p-6 border-l-4 border-l-nexa-dark">
          <div className="w-12 h-12 bg-slate-50 text-nexa-dark rounded-xl flex items-center justify-center">
            <Zap size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">3</div>
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
              <AreaChart data={data}>
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
            {[
              { type: 'interest', user: 'Bruno Santos', project: 'Kandengue Pay', time: 'Há 2 horas' },
              { type: 'status', message: 'Relatório IA Gerado', project: 'AgroConnect', time: 'Há 5 horas' },
              { type: 'mentor', message: 'Sessão marcada com Mentor', company: 'Y Combinator', time: 'Há 1 dia' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex-shrink-0 animate-pulse"></div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-nexa-dark">
                    {activity.type === 'interest' ? (
                      <><span className="font-bold">{activity.user}</span> demonstrou interesse em <span className="font-bold">{activity.project}</span></>
                    ) : activity.message}
                  </div>
                  <div className="text-xs text-gray-400 font-medium">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="w-full text-nexa-teal">Ver todas</Button>
        </Card>
      </div>

      {/* Projects Table */}
      <Card className="space-y-6 overflow-hidden">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-lg">Meus Projetos</h3>
          <Button variant="ghost" size="sm">Ver todos</Button>
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
              {projects.map((project) => (
                <tr key={project.id} className="group hover:bg-nexa-ghost/50 transition-all">
                  <td className="py-5 px-4">
                    <div className="font-bold text-nexa-dark">{project.title}</div>
                    <div className="text-xs text-gray-400">{project.date}</div>
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
                    {project.score ? (
                      <div className="flex items-center gap-2">
                        <div className="w-10 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                           <div className="h-full bg-nexa-teal" style={{ width: `${project.score}%` }}></div>
                        </div>
                        <span className="text-sm font-bold text-nexa-teal">{project.score}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Pendente</span>
                    )}
                  </td>
                  <td className="py-5 px-4">
                    <Button variant="ghost" size="sm" className="p-2">
                      <ChevronRight size={20} className="text-gray-400 group-hover:text-nexa-teal" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
