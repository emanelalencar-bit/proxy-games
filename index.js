const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const os = require('os');

const app = express();
app.use(bodyParser.json());

// Endpoint para retornar o IP da VPS
app.get('/ip', (req, res) => {
    const interfaces = os.networkInterfaces();
    let addresses = [];
    for (let iface in interfaces) {
        interfaces[iface].forEach(details => {
            if (details.family === 'IPv4') {
                addresses.push(details.address);
            }
        });
    }
    res.json({ ip: addresses.join(', ') });
});

// Endpoint para callback da PlayFivers
app.post('/webhook', (req, res) => {
    const data = req.body;
    console.log('Webhook recebido:', data);

    // Aqui você pode atualizar saldo, registrar transações etc.
    res.json({
        status: true,
        balance: data.user_balance || 0
    });
});

// Endpoint para lançar jogos na PlayFivers
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
            headers: { 'Content-Type': 'application/json' }
        });

        res.json(response.data); // Retorna para seu site
    } catch (error) {
        console.error('Erro ao lançar jogo:', error.response?.data || error.message);
        res.status(500).json({ status: false, msg: 'Erro ao lançar jogo' });
    }
});

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy rodando na porta ${PORT}`);
});
