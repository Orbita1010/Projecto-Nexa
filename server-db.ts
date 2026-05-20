import fs from 'fs';
import path from 'path';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'ENTREPRENEUR' | 'INVESTOR' | 'SPECIALIST' | 'ADMIN';
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  entrepreneurId: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  targetAudience: string;
  competitiveAdvantage?: string;
  revenueModel: string;
  stage?: string;
  fundingNeeded: string;
  location: string;
  status: 'DRAFT' | 'SUBMITTED' | 'ANALYZING' | 'NEEDS_ADJUSTMENTS' | 'APPROVED' | 'MATCHED' | 'FUNDED';
  investmentScore?: number;
  aiAnalysis?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: string;
  projectId: string;
  investorId: string;
  status: 'PENDING' | 'INTERESTED' | 'REJECTED' | 'MEETING_SCHEDULED';
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  projectId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  attachments?: string[];
}

export interface DatabaseSchema {
  users: User[];
  projects: Project[];
  matches: Match[];
  conversations: Conversation[];
  messages: Message[];
}

const DB_FILE = path.join(process.cwd(), 'db.json');

// Helper to load or initialize DB
function getDB(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      users: [
        {
          uid: "nelson",
          name: "Nelson Camisassa",
          email: "nelson@nexa.ao",
          role: "ENTREPRENEUR",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nelson",
          bio: "Empreendedor em Luanda focado em soluções de pagamento inovadoras e microcrédito.",
          createdAt: new Date("2025-09-01T10:00:00Z").toISOString()
        },
        {
          uid: "bruno",
          name: "Bruno Santos",
          email: "bruno@nexa.ao",
          role: "INVESTOR",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bruno",
          bio: "Business Angel focado em Fintechs e impacto social em mercados emergentes africanos.",
          createdAt: new Date("2025-09-10T12:00:00Z").toISOString()
        }
      ],
      projects: [
        {
          id: "kpay",
          entrepreneurId: "nelson",
          title: "Kandengue Pay",
          category: "Fintech",
          problem: "A maioria dos comerciantes informais em Luanda não tem acesso a contas bancárias tradicionais nem terminais de pagamento para aceitar cartões.",
          solution: "Uma carteira digital baseada em USSD e código QR que permite transações rápidas e de baixo custo sem necessidade de internet, facilitando pagamentos nos mercados informais.",
          targetAudience: "Comerciantes informais, taxistas e clientes do mercado retalhista em Luanda.",
          revenueModel: "Taxa de 1% sobre transações comerciais, gratuita para transferências pessoais.",
          fundingNeeded: "250.000 USD",
          location: "Luanda, Angola",
          status: "APPROVED",
          investmentScore: 92,
          aiAnalysis: {
            investmentScore: 92,
            viability: "Alta",
            marketPotential: "O mercado informal em Luanda representa mais de 70% da economia ativa. A digitalização desse setor oferece um volume transacional massivo.",
            risks: [
              "Regulamentação do BNA (Banco Nacional de Angola) para carteiras móveis e licenciamento.",
              "Adoção tecnológica inicial por parte de comerciantes com baixo nível de literacia digital."
            ],
            recommendations: [
              "Fazer parceria com uma instituição de microfinanças ou banco comercial licenciado para custódia dos fundos.",
              "Implementar campanhas de educação financeira nos maiores mercados de Luanda (Roque Santeiro/Kikolo)."
            ],
            summary: "Kandengue Pay ataca um dos maiores gargalos da economia angolana de forma simples e pragmática, usando canais USSD que contornam a falta de internet estável."
          },
          createdAt: new Date("2025-10-12T14:30:00Z").toISOString(),
          updatedAt: new Date("2025-10-12T14:30:00Z").toISOString()
        },
        {
          id: "agro",
          entrepreneurId: "nelson",
          title: "AgroConnect Angola",
          category: "Agrotech",
          problem: "Pequenos agricultores do Huambo perdem até 40% das suas colheitas devido à falta de logística e acesso direto aos compradores em Luanda, vendendo a intermediários por preços injustos.",
          solution: "Um marketplace digital de agronegócios que conecta produtores diretamente a redes de supermercados e restaurantes em Luanda, com sistema integrado de recolha e transporte refrigerado partilhado.",
          targetAudience: "Pequenos produtores agrícolas do Huambo e cooperativas.",
          revenueModel: "Comissão de 8% sobre as vendas realizadas e taxa de serviço logístico.",
          fundingNeeded: "50.000 USD",
          location: "Huambo, Angola",
          status: "ANALYZING",
          investmentScore: 85,
          aiAnalysis: {
            investmentScore: 85,
            viability: "Média-Alta",
            marketPotential: "Angola importa a maioria dos seus alimentos frescos devido a falhas logísticas internas. O escoamento Huambo-Luanda é o canal agrícola mais importante do país.",
            risks: [
              "Custos operacionais elevados de manutenção de frota logística e estradas.",
              "Variações sazonais de produção e falta de armazenamento a frio."
            ],
            recommendations: [
              "Iniciar o piloto com frotas de transporte parceiras em vez de comprar camiões próprios.",
              "Focar em produtos de alto valor agregado no início (morango, batata, hortícolas)."
            ],
            summary: "A AgroConnect aborda uma dor real de segurança alimentar e eficiência logística em Angola. O potencial de mercado é gigante se a logística for bem executada."
          },
          createdAt: new Date("2025-10-15T09:00:00Z").toISOString(),
          updatedAt: new Date("2025-10-15T09:00:00Z").toISOString()
        }
      ],
      matches: [
        {
          id: "match1",
          projectId: "kpay",
          investorId: "bruno",
          status: "INTERESTED",
          createdAt: new Date("2025-10-16T11:20:00Z").toISOString()
        }
      ],
      conversations: [
        {
          id: "conv_bruno_nelson",
          participantIds: ["bruno", "nelson"],
          projectId: "kpay",
          createdAt: new Date("2025-10-16T11:25:00Z").toISOString()
        }
      ],
      messages: [
        {
          id: "msg1",
          conversationId: "conv_bruno_nelson",
          senderId: "bruno",
          text: "Olá Nelson! Fiquei muito impressionado com a análise da IA sobre o Kandengue Pay. O modelo de transações via USSD e código QR é de facto o que o mercado informal precisa. Vocês já têm alguma licença do Banco Nacional de Angola?",
          createdAt: new Date("2025-10-16T11:26:00Z").toISOString()
        },
        {
          id: "msg2",
          conversationId: "conv_bruno_nelson",
          senderId: "nelson",
          text: "Olá Bruno! Obrigado pelo feedback. Sim, já iniciamos a parceria com um banco comercial local que atuará como custodiante, o que nos permite operar sob a licença deles provisoriamente enquanto tramitamos a nossa própria licença de Sociedade de Prestação de Serviços de Pagamento (SPSP) no BNA. Gostaríamos muito de apresentar o nosso pitch deck técnico.",
          createdAt: new Date("2025-10-16T11:45:00Z").toISOString()
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
  
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error("Erro ao ler o ficheiro db.json, reinicializando...", error);
    // return an empty schema if parse fails
    return { users: [], projects: [], matches: [], conversations: [], messages: [] };
  }
}

function saveDB(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error("Erro ao salvar dados no db.json:", error);
  }
}

export const db = {
  // USERS
  getUser(uid: string): User | undefined {
    const data = getDB();
    return data.users.find(u => u.uid === uid || u.email === uid);
  },

  createUser(user: Omit<User, 'createdAt'>): User {
    const data = getDB();
    const newUser: User = {
      ...user,
      createdAt: new Date().toISOString()
    };
    // Evitar duplicados
    data.users = data.users.filter(u => u.uid !== user.uid && u.email !== user.email);
    data.users.push(newUser);
    saveDB(data);
    return newUser;
  },

  updateUser(uid: string, updates: Partial<User>): User | undefined {
    const data = getDB();
    const index = data.users.findIndex(u => u.uid === uid);
    if (index === -1) return undefined;
    
    data.users[index] = {
      ...data.users[index],
      ...updates
    };
    saveDB(data);
    return data.users[index];
  },

  // PROJECTS
  getProjects(): Project[] {
    const data = getDB();
    return data.projects;
  },

  getProject(id: string): Project | undefined {
    const data = getDB();
    return data.projects.find(p => p.id === id);
  },

  createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const data = getDB();
    const newProject: Project = {
      ...project,
      id: 'proj_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.projects.push(newProject);
    saveDB(data);
    return newProject;
  },

  updateProject(id: string, updates: Partial<Project>): Project | undefined {
    const data = getDB();
    const index = data.projects.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    data.projects[index] = {
      ...data.projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveDB(data);
    return data.projects[index];
  },

  // MATCHES
  getMatches(): Match[] {
    const data = getDB();
    return data.matches;
  },

  createMatch(match: Omit<Match, 'id' | 'createdAt'>): Match {
    const data = getDB();
    // Evitar duplicados
    const existing = data.matches.find(m => m.projectId === match.projectId && m.investorId === match.investorId);
    if (existing) return existing;

    const newMatch: Match = {
      ...match,
      id: 'match_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    data.matches.push(newMatch);
    
    // Automaticamente criar uma conversa associada quando houver interesse/match
    const proj = data.projects.find(p => p.id === match.projectId);
    if (proj) {
      this.getOrCreateConversation(match.investorId, proj.entrepreneurId, match.projectId);
    }

    saveDB(data);
    return newMatch;
  },

  updateMatch(id: string, updates: Partial<Match>): Match | undefined {
    const data = getDB();
    const index = data.matches.findIndex(m => m.id === id);
    if (index === -1) return undefined;

    data.matches[index] = {
      ...data.matches[index],
      ...updates
    };
    saveDB(data);
    return data.matches[index];
  },

  // CONVERSATIONS & MESSAGES
  getConversations(uid: string) {
    const data = getDB();
    const userConvs = data.conversations.filter(c => c.participantIds.includes(uid));
    
    return userConvs.map(conv => {
      const otherId = conv.participantIds.find(id => id !== uid) || "";
      const otherUser = data.users.find(u => u.uid === otherId);
      const convMessages = data.messages.filter(m => m.conversationId === conv.id)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      const lastMessage = convMessages[convMessages.length - 1];
      const project = data.projects.find(p => p.id === conv.projectId);

      return {
        ...conv,
        otherUser,
        lastMessage,
        projectTitle: project?.title || "Projeto"
      };
    });
  },

  getOrCreateConversation(investorId: string, entrepreneurId: string, projectId: string): Conversation {
    const data = getDB();
    let conv = data.conversations.find(c => 
      c.projectId === projectId && 
      c.participantIds.includes(investorId) && 
      c.participantIds.includes(entrepreneurId)
    );

    if (!conv) {
      conv = {
        id: `conv_${investorId}_${entrepreneurId}_${projectId.substring(0, 5)}`,
        participantIds: [investorId, entrepreneurId],
        projectId,
        createdAt: new Date().toISOString()
      };
      data.conversations.push(conv);
      saveDB(data);
    }
    return conv;
  },

  getMessages(conversationId: string): Message[] {
    const data = getDB();
    return data.messages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  createMessage(msg: Omit<Message, 'id' | 'createdAt'>): Message {
    const data = getDB();
    const newMessage: Message = {
      ...msg,
      id: 'msg_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    data.messages.push(newMessage);
    saveDB(data);
    return newMessage;
  }
};
