import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const port = 3000;

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const dist = path.join(process.cwd(), "dist");
    app.use(express.static(dist));
    app.get("*", (_request, response) => response.sendFile(path.join(dist, "index.html")));
  }
  app.listen(port, "0.0.0.0", () => console.log(`Melodia web app: http://localhost:${port}`));
}

start();
