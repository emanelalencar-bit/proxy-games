app.get("/ip", async (req, res) => {
  const axios = require("axios");
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    res.send(response.data.ip);
  } catch (err) {
    res.send("Erro ao pegar IP");
  }
});
