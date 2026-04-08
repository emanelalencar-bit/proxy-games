const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ============================
// CONFIGURAÇÕES DA PLAYFIVERS
// ============================
const AGENT_CODE = "foliabet";
const TOKEN = "483f316e-4db8-4eda-81e7-e6b2ac7822a5";
const SECRET = "f221b232-94f7-45d4-bcbe-65eb1580b725";

// URL da API da PlayFivers
const PROVIDER_API = "https://api.playfivers.com/";

// ============================
// ROTAS
// ============================

// Rota inicial para testar se o proxy tá rodando
app.get("/", (req, res) => {
  res.send("Proxy funcionando!");
});

// Rota para pegar o IP da VPS
app.get("/ip", async (req, res) => {
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    res.send(`IP da VPS: ${response.data.ip}`);
  } catch (err) {
    res.send("Erro ao pegar IP da VPS");
  }
});

// Rota para puxar os jogos da PlayFivers
app.get("/proxy", async (req, res) => {
  try {
    const response = await axios.get(PROVIDER_API, {
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
        "Agent-Code": AGENT_CODE,
        "Secret": SECRET,
        "User-Agent": "Mozilla/5.0"
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error("Erro no proxy:", err.message);
    res.status(500).send("Erro ao buscar dados da PlayFivers");
  }
});

// Rota de callback que a PlayFivers vai chamar
app.post("/callback", (req, res) => {
  console.log("Callback recebido:", req.body);
  res.sendStatus(200);
});

// ============================
// INICIAR SERVIDOR
// ============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
