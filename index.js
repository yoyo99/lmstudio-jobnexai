import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { LMStudioClient } from "@lmstudio/sdk";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 2345;
const client = new LMStudioClient();

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/v1/models", async (req, res) => {
  try {
    const models = await client.listLocalModels();
    res.json({
      data: models.map(m => ({
        id: m.id,
        object: "model"
      }))
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to list models" });
  }
});

app.post("/v1/chat/completions", async (req, res) => {
  try {
    const { model, messages, temperature = 0.7 } = req.body;

    const chat = await client.chat({
      model,
      messages,
      temperature
    });

    const reply = await chat.complete();

    res.json({
      id: "chatcmpl-" + Date.now(),
      object: "chat.completion",
      model,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: reply.message.content
          },
          finish_reason: "stop"
        }
      ]
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to generate completion" });
  }
});

app.post("/v1/embeddings", async (req, res) => {
  try {
    const { model, input } = req.body;

    const embedding = await client.embedding({
      model,
      input
    });

    res.json({
      object: "list",
      data: [
        {
          object: "embedding",
          embedding: embedding.embedding
        }
      ]
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to generate embedding" });
  }
});

app.listen(PORT, () => {
  console.log(`LM Studio proxy listening on port ${PORT}`);
});
