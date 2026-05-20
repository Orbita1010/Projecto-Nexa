import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { db } from "./server-db";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(express.json());

// API Routes - Authentication
app.post("/api/auth/register", (req, res) => {
  try {
    const { uid, name, email, role, avatar, bio } = req.body;
    if (!uid || !name || !email || !role) {
      return res.status(400).json({ error: "Campos obrigatórios em falta" });
    }
    const user = db.createUser({ uid, name, email, role, avatar, bio });
    res.status(201).json(user);
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Erro ao registar utilizador" });
  }
});

app.post("/api/auth/login", (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email obrigatório" });
    }
    const user = db.getUser(email);
    if (!user) {
      return res.status(404).json({ error: "Utilizador não encontrado. Por favor, registe-se primeiro." });
    }
    res.json(user);
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Erro ao iniciar sessão" });
  }
});

// API Routes - Users
app.get("/api/users/:uid", (req, res) => {
  try {
    const user = db.getUser(req.params.uid);
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter utilizador" });
  }
});

app.put("/api/users/:uid", (req, res) => {
  try {
    const user = db.updateUser(req.params.uid, req.body);
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar utilizador" });
  }
});

// API Routes - Projects
app.get("/api/projects", (req, res) => {
  try {
    res.json(db.getProjects());
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter projetos" });
  }
});

app.get("/api/projects/user/:uid", (req, res) => {
  try {
    const userProjects = db.getProjects().filter(p => p.entrepreneurId === req.params.uid);
    res.json(userProjects);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter projetos do utilizador" });
  }
});

app.get("/api/projects/:id", (req, res) => {
  try {
    const project = db.getProject(req.params.id);
    if (!project) return res.status(404).json({ error: "Projeto não encontrado" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter projeto" });
  }
});

app.post("/api/projects", (req, res) => {
  try {
    const { entrepreneurId, title, category, problem, solution, targetAudience, competitiveAdvantage, revenueModel, stage, fundingNeeded, location, status, investmentScore, aiAnalysis } = req.body;
    if (!entrepreneurId || !title || !status) {
      return res.status(400).json({ error: "Campos obrigatórios em falta" });
    }
    const newProject = db.createProject({
      entrepreneurId, title, category, problem, solution, targetAudience, competitiveAdvantage, revenueModel, stage, fundingNeeded, location, status, investmentScore, aiAnalysis
    });
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({ error: "Erro ao criar projeto" });
  }
});

app.put("/api/projects/:id", (req, res) => {
  try {
    const project = db.updateProject(req.params.id, req.body);
    if (!project) return res.status(404).json({ error: "Projeto não encontrado" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar projeto" });
  }
});

// API Routes - Matches
app.get("/api/matches", (req, res) => {
  try {
    res.json(db.getMatches());
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter matches" });
  }
});

app.post("/api/matches", (req, res) => {
  try {
    const { projectId, investorId, status } = req.body;
    if (!projectId || !investorId || !status) {
      return res.status(400).json({ error: "Campos obrigatórios em falta" });
    }
    const match = db.createMatch({ projectId, investorId, status });
    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar match" });
  }
});

app.put("/api/matches/:id", (req, res) => {
  try {
    const match = db.updateMatch(req.params.id, req.body);
    if (!match) return res.status(404).json({ error: "Match não encontrado" });
    res.json(match);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar match" });
  }
});

// API Routes - Chat & Conversations
app.get("/api/conversations/:uid", (req, res) => {
  try {
    res.json(db.getConversations(req.params.uid));
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter conversas" });
  }
});

app.get("/api/conversations/:id/messages", (req, res) => {
  try {
    res.json(db.getMessages(req.params.id));
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter mensagens" });
  }
});

app.post("/api/conversations/:id/messages", (req, res) => {
  try {
    const { senderId, text } = req.body;
    if (!senderId || !text) {
      return res.status(400).json({ error: "Campos em falta" });
    }
    const msg = db.createMessage({
      conversationId: req.params.id,
      senderId,
      text
    });
    res.status(201).json(msg);
  } catch (error) {
    res.status(500).json({ error: "Erro ao enviar mensagem" });
  }
});

// API Routes
app.post("/api/ai/validate-project", async (req, res) => {
  try {
    const { project } = req.body;
    
    if (!project) {
      return res.status(400).json({ error: "Dados do projecto em falta" });
    }

    const model = "gemini-3-flash-preview";
    const prompt = `
      Analise a seguinte ideia de negócio para o mercado angolano:
      Título: ${project.title}
      Problema: ${project.problem}
      Solução: ${project.solution}
      Público-alvo: ${project.targetAudience}
      Modelo de Receita: ${project.revenueModel}
      Valor necessário: ${project.fundingNeeded} Kz (ou USD)
      
      Forneça uma análise técnica detalhada no formato JSON:
      {
        "investmentScore": 0-100,
        "viability": "Baixa/Média/Alta",
        "marketPotential": "Descrição do potencial de mercado em Angola",
        "risks": ["Risco 1", "Risco 2"],
        "recommendations": ["O que melhorar 1", "O que melhorar 2"],
        "summary": "Resumo do potencial de investimento"
      }
    `;

    const result = await genAI.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      }
    });

    const analysis = JSON.parse(result.text || "{}");
    res.json(analysis);
  } catch (error) {
    console.error("AI Validation Error:", error);
    res.status(500).json({ error: "Falha na análise da IA" });
  }
});

// Vite middleware for development
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
