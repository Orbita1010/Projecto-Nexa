/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Shield, Rocket, Users, Briefcase, Globe, BarChart3, MessageSquare } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-nexa-dark rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-xl">N</span>
        </div>
        <span className="font-display font-bold text-2xl tracking-tighter text-nexa-dark">NEXA</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8">
        <Link to="/#solucao" className="text-gray-600 hover:text-nexa-teal transition-colors font-medium">Solução</Link>
        <Link to="/#como-funciona" className="text-gray-600 hover:text-nexa-teal transition-colors font-medium">Como Funciona</Link>
        <Link to="/investors" className="text-gray-600 hover:text-nexa-teal transition-colors font-medium">Investidores</Link>
        <a href="#" className="text-gray-600 hover:text-nexa-teal transition-colors font-medium">Equipa</a>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/login">
          <Button variant="ghost" size="sm">Entrar</Button>
        </Link>
        <Link to="/login">
          <Button size="sm">Começar Agora</Button>
        </Link>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="pt-32 pb-20 px-6">
    <div className="max-w-7xl mx-auto text-center space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-nexa-teal/10 text-nexa-teal rounded-full text-sm font-semibold mb-4 mx-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexa-teal opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-nexa-teal"></span>
          </span>
          Angola's Leading Venture Platform
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-bold text-nexa-dark tracking-tight leading-[1.1]">
          Transformamos ideias em <br />
          <span className="text-nexa-teal underline decoration-nexa-amber decoration-4 underline-offset-8">negócios financiáveis.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          A plataforma que conecta empreendedores angolanos a investimento real e estruturado através de IA e curadoria técnica.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10"
      >
        <Link to="/login" className="w-full sm:w-auto">
          <Button size="lg" className="w-full h-16 text-lg group">
            Submeter minha ideia <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Link to="/investors" className="w-full sm:w-auto">
          <Button variant="secondary" size="lg" className="w-full h-16 text-lg">
            Sou Investidor
          </Button>
        </Link>
      </motion.div>

      <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
        <div className="flex items-center justify-center h-12 font-bold text-2xl text-nexa-dark">ANGOLA TECH</div>
        <div className="flex items-center justify-center h-12 font-bold text-2xl text-nexa-night">FINTECH HUB</div>
        <div className="flex items-center justify-center h-12 font-bold text-2xl text-nexa-dark">VENTURE LAB</div>
        <div className="flex items-center justify-center h-12 font-bold text-2xl text-nexa-night">LUANDA INVEST</div>
      </div>
    </div>
  </section>
);

const Stats = () => (
  <section className="bg-nexa-dark py-24 px-6 rounded-[3rem] mx-6 -mt-10 overflow-hidden relative">
    <div className="absolute top-0 right-0 w-96 h-96 bg-nexa-teal/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        <div className="space-y-2">
          <div className="text-4xl md:text-5xl font-bold text-white">+2.5M</div>
          <div className="text-nexa-teal font-medium">Capital Angariado (USD)</div>
        </div>
        <div className="space-y-2">
          <div className="text-4xl md:text-5xl font-bold text-white">150+</div>
          <div className="text-nexa-teal font-medium">Startups Validadas</div>
        </div>
        <div className="space-y-2">
          <div className="text-4xl md:text-5xl font-bold text-white">45+</div>
          <div className="text-nexa-teal font-medium">Investidores Ativos</div>
        </div>
        <div className="space-y-2">
          <div className="text-4xl md:text-5xl font-bold text-white">92%</div>
          <div className="text-nexa-teal font-medium">Taxa de Sucesso</div>
        </div>
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section id="como-funciona" className="py-24 px-6 bg-white">
    <div className="max-w-7xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-display font-bold">O Caminho do Sucesso</h2>
        <p className="text-gray-600 max-w-xl mx-auto">Um processo rigoroso de curadoria para garantir que apenas os melhores negócios cheguem aos investidores.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Rocket, title: "Submissão & Triagem", desc: "A nossa IA analisa a sua ideia e dá um score inicial de viabilidade." },
          { icon: Shield, title: "Estruturação Técnica", desc: "Especialistas NEXA ajudam a criar o seu plano de negócio e estrutura financeira." },
          { icon: Users, title: "Pitch para Investidores", desc: "Conectamos você aos business angels e fundos ideais para o seu setor." }
        ].map((step, i) => (
          <Card key={i} className="relative group overflow-hidden border-none bg-nexa-ghost p-10 hover:bg-white hover:ring-1 hover:ring-nexa-teal/20">
            <div className="absolute top-0 right-0 p-4 opacity-5 font-bold text-8xl transition-all group-hover:scale-125">0{i + 1}</div>
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:bg-nexa-teal group-hover:rotate-6 transition-all duration-300">
              <step.icon className="text-nexa-teal group-hover:text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed">{step.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const Benefits = () => (
  <section className="py-24 px-6 bg-nexa-ghost">
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
      <div className="space-y-8">
        <h2 className="text-4xl font-display font-bold leading-snug">
          Porquê escolher a NEXA?
        </h2>
        <div className="space-y-6">
          {[
            { title: "Dashboard Inteligente", desc: "Controle total sobre a evolução do seu projeto e feedback em tempo real." },
            { title: "Investment Score IA", desc: "Saiba exatamente quão atraente é o seu negócio para o mercado." },
            { title: "Mentoria Especializada", desc: "Acesso direto a executivos e fundadores que já escalaram negócios em Angola." }
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="text-nexa-teal" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-lg">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="h-14">Conhecer todos os benefícios</Button>
      </div>

      <div className="relative">
        <div className="absolute -inset-4 bg-nexa-teal/5 rounded-[3rem] blur-2xl"></div>
        <img 
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200" 
          alt="Entrepreneurship in Angola" 
          className="relative rounded-[2.5rem] shadow-2xl z-10"
        />
        <Card className="absolute -bottom-10 -left-10 z-20 p-6 w-64 space-y-4 hidden lg:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <Globe size={20} />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Status</div>
              <div className="font-bold">Em Expansão</div>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
               initial={{ width: 0 }}
               whileInView={{ width: "75%" }}
               className="h-full bg-nexa-teal"
            />
          </div>
          <div className="text-sm text-gray-600 text-center font-medium">Auditado pela KPMG</div>
        </Card>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-white border-t border-gray-100 pt-20 pb-10 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
        <div className="col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-nexa-dark rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base">N</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tighter">NEXA</span>
          </div>
          <p className="text-gray-500 max-w-sm">
            Elevando o ecossistema de startups em Angola através de tecnologia, estruturação e investimento real.
          </p>
          <div className="flex gap-4">
             <div className="w-10 h-10 bg-gray-100 rounded-full hover:bg-nexa-teal transition-all cursor-pointer"></div>
             <div className="w-10 h-10 bg-gray-100 rounded-full hover:bg-nexa-teal transition-all cursor-pointer"></div>
             <div className="w-10 h-10 bg-gray-100 rounded-full hover:bg-nexa-teal transition-all cursor-pointer"></div>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6">Plataforma</h4>
          <ul className="space-y-4 text-gray-500">
            <li><a href="#" className="hover:text-nexa-teal transition-colors">Startups</a></li>
            <li><a href="#" className="hover:text-nexa-teal transition-colors">Investidores</a></li>
            <li><a href="#" className="hover:text-nexa-teal transition-colors">Preços</a></li>
            <li><a href="#" className="hover:text-nexa-teal transition-colors">Mentoria</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Empresa</h4>
          <ul className="space-y-4 text-gray-500">
            <li><a href="#" className="hover:text-nexa-teal transition-colors">Sobre Nós</a></li>
            <li><a href="#" className="hover:text-nexa-teal transition-colors">Cidades</a></li>
            <li><a href="#" className="hover:text-nexa-teal transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-nexa-teal transition-colors">Carreiras</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Legal</h4>
          <ul className="space-y-4 text-gray-500">
            <li><a href="#" className="hover:text-nexa-teal transition-colors">Privacidade</a></li>
            <li><a href="#" className="hover:text-nexa-teal transition-colors">Termos</a></li>
            <li><a href="#" className="hover:text-nexa-teal transition-colors">Segurança</a></li>
          </ul>
        </div>
      </div>
      
      <div className="pt-8 border-t border-gray-50 text-center text-gray-400 text-sm">
        © 2026 NEXA. Todos os direitos reservados. Orgulhosamente de Luanda 🇦🇴
      </div>
    </div>
  </footer>
);

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <Benefits />
      <Footer />
    </div>
  );
};
