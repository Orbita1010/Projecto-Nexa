/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Navbar } from '../components/LandingPage'; // Using Navbar from landing for simplicity here
import { 
  Search, 
  Filter, 
  MapPin, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Bookmark
} from 'lucide-react';
import { cn } from '../lib/utils';

export const InvestorPortal = () => {
  const [filter, setFilter] = useState('All');
  
  const startups = [
    {
      id: 1,
      name: 'Kandengue Pay',
      tagline: 'Soluções de pagamento móvel para mercados informais em Luanda.',
      logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=kpay',
      score: 92,
      stage: 'Seed',
      sector: 'Fintech',
      location: 'Luanda, Angola',
      ask: '$250k',
      founder: 'Nelson Camisassa',
      matchScore: 98
    },
    {
      id: 2,
      name: 'AgroConnect',
      tagline: 'Marketplace que liga produtores do Huambo a compradores em Luanda.',
      logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=agro',
      score: 85,
      stage: 'Pre-Seed',
      sector: 'Agrotech',
      location: 'Huambo, Angola',
      ask: '$50k',
      founder: 'Maria José',
      matchScore: 75
    },
    {
      id: 3,
      name: 'EduLink AO',
      tagline: 'Plataforma de e-learning focada no currículo nacional angolano.',
      logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=edulink',
      score: 78,
      stage: 'Series A',
      sector: 'Edtech',
      location: 'Benguela, Angola',
      ask: '$1.2M',
      founder: 'Paulo Afonso',
      matchScore: 62
    }
  ];

  return (
    <div className="min-h-screen bg-nexa-ghost pb-20">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
         <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-nexa-dark rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-base">N</span>
                </div>
                <span className="font-display font-bold text-xl tracking-tighter">NEXA <span className="text-nexa-teal">INVEST</span></span>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <a href="#" className="font-bold text-nexa-teal">Explorar</a>
                <a href="#" className="font-medium text-gray-500 hover:text-nexa-dark transition-colors">Portfólio</a>
                <a href="#" className="font-medium text-gray-500 hover:text-nexa-dark transition-colors">Matches</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full border-2 border-white shadow-sm"></div>
            </div>
         </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold">Investir em Angola</h1>
            <p className="text-gray-500">Descubra as startups mais quentes validadas pela NEXA.</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Pesquisar por setor, nome..." 
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
                  O nosso algoritmo de matching usa 124 pontos de dados para ligar o seu perfil de risco aos melhores fundadores.
                </p>
              </div>
              <Button className="w-full bg-nexa-teal hover:bg-teal-600 border-none h-12">Ativar Smart Inv</Button>
           </Card>
        </div>

        {/* Startup Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-sm font-bold text-gray-400 uppercase tracking-widest">
            {['All', 'Fintech', 'Agrotech', 'Energy', 'Edtech'].map((s) => (
              <button 
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "hover:text-nexa-dark transition-colors pb-2 px-1 border-b-2",
                  filter === s ? "text-nexa-teal border-nexa-teal" : "border-transparent"
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {startups.map((startup) => (
              <Card key={startup.id} className="p-0 overflow-hidden hover:border-nexa-teal/30 group">
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 rounded-2xl bg-nexa-ghost p-3 ring-1 ring-gray-100 shadow-sm">
                      <img src={startup.logo} alt={startup.name} className="w-full h-full" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Deal Active</span>
                       <div className="flex items-center gap-1 text-nexa-teal font-bold text-sm">
                          <TrendingUp size={14} /> {startup.matchScore}% Match
                       </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold group-hover:text-nexa-teal transition-colors">{startup.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {startup.tagline}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase">{startup.sector}</span>
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase">{startup.stage}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Funding Ask</div>
                      <div className="font-bold text-nexa-dark">{startup.ask}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Location</div>
                      <div className="font-bold flex items-center gap-1 text-xs">
                        <MapPin size={12} /> {startup.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5">
                      <div className={cn(
                        "p-1.5 rounded-lg flex items-center gap-1 font-bold text-xs",
                        startup.score >= 80 ? "bg-teal-50 text-nexa-teal" : "bg-amber-50 text-nexa-amber"
                      )}>
                        <ShieldCheck size={14} /> Score: {startup.score}
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="p-2 text-gray-400 hover:text-nexa-dark transition-colors"><Bookmark size={20} /></button>
                       <button className="p-2 text-gray-400 hover:text-nexa-teal transition-colors"><MessageSquare size={20} /></button>
                    </div>
                  </div>
                </div>
                <Button variant="secondary" className="w-full rounded-none h-14 font-bold gap-2">
                  Ver Detalhes do Deal <ChevronRight size={18} />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
