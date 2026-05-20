/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Rocket, Send, Loader2, CheckCircle2, AlertCircle, TrendingUp, ShieldAlert, Target } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../lib/dbService';

export const SubmitProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Fintech',
    problem: '',
    solution: '',
    targetAudience: '',
    revenueModel: '',
    fundingNeeded: '',
    location: 'Luanda'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Submit to API for AI Analysis
      const response = await fetch('/api/ai/validate-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: formData })
      });
      
      if (!response.ok) {
        throw new Error("Erro ao validar ideia com IA");
      }
      
      const data = await response.json();
      setAnalysis(data);
      
      // 2. Salvar na base de dados
      const currentUser = dbService.getCurrentUser();
      const entrepreneurId = currentUser?.uid || "nelson";
      
      await dbService.createProject({
        entrepreneurId,
        title: formData.title,
        category: formData.category,
        problem: formData.problem,
        solution: formData.solution,
        targetAudience: formData.targetAudience,
        revenueModel: formData.revenueModel,
        fundingNeeded: formData.fundingNeeded,
        location: formData.location,
        status: "APPROVED",
        investmentScore: data.investmentScore || 75,
        aiAnalysis: data
      });

      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Erro ao processar submissão.");
    } finally {
      setLoading(false);
    }
  };

  if (success && analysis) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-4xl font-display font-bold">Ideia Submetida com Sucesso!</h1>
          <p className="text-gray-500">A nossa IA terminou a análise preliminar do seu negócio.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-nexa-dark text-white p-8 space-y-4 col-span-1 text-center">
            <div className="text-sm font-bold opacity-60 uppercase tracking-widest">Investment Score</div>
            <div className="text-7xl font-bold text-nexa-teal">{analysis.investmentScore}</div>
            <div className="text-xl font-medium">{analysis.viability} Potencial</div>
          </Card>

          <Card className="md:col-span-2 p-8 space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
               <Rocket className="text-nexa-teal" /> Resumo Estratégico
            </h3>
            <p className="text-gray-600 leading-relaxed italic border-l-2 border-nexa-teal pl-6">
              "{analysis.summary}"
            </p>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <Card className="p-8 space-y-4">
             <h4 className="font-bold text-lg flex items-center gap-2">
               <TrendingUp className="text-nexa-teal" /> Potencial de Mercado
             </h4>
             <p className="text-gray-600">{analysis.marketPotential}</p>
           </Card>

           <Card className="p-8 space-y-4">
             <h4 className="font-bold text-lg flex items-center gap-2">
               <ShieldAlert className="text-nexa-amber" /> Riscos Identificados
             </h4>
             <ul className="space-y-2">
               {analysis.risks.map((risk: string, i: number) => (
                 <li key={i} className="flex gap-2 text-sm text-gray-600">
                   <AlertCircle size={16} className="text-nexa-amber mt-0.5 flex-shrink-0" />
                   {risk}
                 </li>
               ))}
             </ul>
           </Card>
        </div>

        <Card className="p-8 space-y-6 bg-blue-50/50 border-blue-100">
          <h4 className="font-bold text-lg flex items-center gap-2 text-blue-800">
            <Target className="text-blue-600" /> Próximos Passos & Recomendações
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {analysis.recommendations.map((rec: string, i: number) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-blue-50 text-sm font-medium">
                {rec}
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-center gap-4">
           <Button size="lg" variant="outline" onClick={() => setSuccess(false)}>Submeter Outra Ideia</Button>
           <Button size="lg" onClick={() => navigate('/dashboard')}>Ir para Meus Projetos</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold">Submeter Nova Ideia</h1>
        <p className="text-gray-500">Preencha os detalhes do seu negócio para análise da IA NEXA.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Nome do Negócio</label>
              <input 
                required
                type="text" 
                className="w-full bg-nexa-ghost border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-nexa-teal" 
                placeholder="Ex: Kandengue Pay"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Categoria</label>
              <select 
                className="w-full bg-nexa-ghost border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-nexa-teal"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option>Fintech</option>
                <option>Agrotech</option>
                <option>Energy</option>
                <option>Logistics</option>
                <option>Education</option>
                <option>Health</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Problema que resolve</label>
            <textarea 
              required
              rows={3}
              className="w-full bg-nexa-ghost border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-nexa-teal" 
              placeholder="Descreva a dor do mercado que está a atacar..."
              value={formData.problem}
              onChange={(e) => setFormData({...formData, problem: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Sua Solução</label>
            <textarea 
              required
              rows={3}
              className="w-full bg-nexa-ghost border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-nexa-teal" 
              placeholder="Como o seu produto resolve o problema acima?"
              value={formData.solution}
              onChange={(e) => setFormData({...formData, solution: e.target.value})}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Público-Alvo</label>
              <input 
                required
                type="text" 
                className="w-full bg-nexa-ghost border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-nexa-teal" 
                placeholder="Ex: Jovens de 18-25 anos"
                value={formData.targetAudience}
                onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Capital Necessário (Kz / USD)</label>
              <input 
                required
                type="text" 
                className="w-full bg-nexa-ghost border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-nexa-teal" 
                placeholder="Ex: 5.000.000 Kz"
                value={formData.fundingNeeded}
                onChange={(e) => setFormData({...formData, fundingNeeded: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Modelo de Receita</label>
            <textarea 
              required
              rows={2}
              className="w-full bg-nexa-ghost border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-nexa-teal" 
              placeholder="Como o negócio fará dinheiro? Assinatura, taxa por transação, etc."
              value={formData.revenueModel}
              onChange={(e) => setFormData({...formData, revenueModel: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full h-14 text-lg gap-2" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Analisando Ideia...
                </>
              ) : (
                <>
                  <Send size={20} /> Validar e Submeter
                </>
              )}
            </Button>
          </div>
          
          <div className="text-center text-xs text-gray-400 font-medium">
             Ao submeter, a nossa IA irá gerar um score de investimento baseado no mercado angolano.
          </div>
        </form>
      </Card>
    </div>
  );
};
