import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Project Management API
  app.get("/api/projects/:clientId", (req, res) => {
    // In a real app, this would fetch from Firestore via Firebase Admin SDK
    // For now, we'll return a placeholder to show the endpoint is working
    res.json({ 
      message: "Project data endpoint",
      clientId: req.params.clientId,
      hint: "Use Firebase Client SDK for real-time updates, or Admin SDK here for server-side logic."
    });
  });

  // AI Assistant Proxy (Optional, if you want to move AI logic to server)
  app.post("/api/ai/chat", (req, res) => {
    const { message, context } = req.body;
    res.json({ 
      reply: `This is a server-side response placeholder for: "${message}"`,
      context_received: context
    });
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
