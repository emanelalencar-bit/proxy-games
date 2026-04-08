const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const os = require('os');

const app = express();
app.use(bodyParser.json());

// ----------------------
// Endpoint /ip
// ----------------------
app.get('/ip', (req, res) => {
  const networkInterfaces = os.networkInterfaces();
  const ips = [];

  Object.values(networkInterfaces).forEach(ifaces => {
    ifaces.forEach(iface => {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    });
  });

  res.json({ ip: ips.join(', ') });
});

// ----------------------
// Endpoint /webhook
// ----------------------
app.post('/webhook', (req, res) => {
  const data = req.body;
  console.log('Webhook recebido:', data);

  // Exemplo de retorno para PlayFivers
  res.json({
    status: true,
    balance: data.user_balance || 0
  });
});

// ----------------------
// Endpoint /launch
// ----------------------
app.post('/launch', async (req, res) => {
  const { agentToken, secretKey, user_code, game_code, provider, game_original, user_balance, user_rtp, lang } = req.body;

  try {
    const response = await axios.post('https://api.playfivers.com/api/v2/game_launch', {
      agentToken,
      secretKey,
      user_code,
      game_code,
      provider,
      game_original,
      user_balance,
      user_rtp,
      lang
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar dados da PlayFivers:', error.response ? error.response.data : error.message);
    res.status(500).json({ status: false, msg: 'Erro ao buscar dados da PlayFivers' });
  }
});

// ----------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy rodando na porta ${PORT}`);
});
