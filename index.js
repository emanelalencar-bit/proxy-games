const express = require("express");
const axios = require("axios");

const app = express();

// Página inicial
app.get("/", (req, res) => {
  res.send("Proxy funcionando!");
});

// Rota para descobrir o IP da VPS
app.get("/ip", async (req, res) => {
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    res.send(`IP da VPS: ${response.data.ip}`);
  } catch (error) {
    res.send("Erro ao pegar IP");
  }
});

// iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
