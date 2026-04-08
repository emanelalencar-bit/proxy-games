const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Seus dados do agente
const TOKEN = "483f316e-4db8-4eda-81e7-e6b2ac7822a5";
const SECRET = "f221b232-94f7-45d4-bcbe-65eb1580b725";
const AGENT_CODE = "foliabet";

// =====================
// Rota para pegar IP da VPS
// =====================
app.get("/ip", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  res.json({ ip });
});

// =====================
// Rota para listar jogos
// =====================
app.get("/proxy", async (req, res) => {
  try {
    const response = await axios.get("https://api.playfivers.com/api/v2/games", {
      headers: {
        "Content-Type": "application/json",
        "agentToken": TOKEN,
        "secretKey": SECRET
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error("Erro no proxy:", err.response?.data || err.message);
    res.status(500).send("Erro ao buscar dados da PlayFivers");
  }
});

// =====================
// Rota para iniciar jogo
// =====================
app.post("/launch", async (req, res) => {
  const { user_code, game_code, provider, user_balance, user_rtp } = req.body;

  if (!user_code || !game_code || !provider || !user_balance) {
    return res.status(400).send("Campos obrigatórios faltando");
  }

  try {
    const response = await axios.post(
      "https://api.playfivers.com/api/v2/game_launch",
      {
        agentToken: TOKEN,
        secretKey: SECRET,
        user_code,
        game_code,
        provider,
        game_original: true,
        user_balance,
        user_rtp: user_rtp || 70,
        lang: "pt"
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Erro ao iniciar o jogo:", err.response?.data || err.message);
    res.status(500).send("Erro ao iniciar o jogo");
  }
});

// =====================
// Iniciar servidor
// =====================
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
