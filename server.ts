import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

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
