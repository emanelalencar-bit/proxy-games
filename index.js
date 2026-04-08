const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Endpoint para callback da PlayFivers
app.post('/webhook', (req, res) => {
    const data = req.body;
    console.log('Webhook recebido:', data);

    // Aqui você pode atualizar saldo, registrar transações etc.
    // Exemplo simples de retorno para PlayFivers
    res.json({
        status: true,
        balance: data.user_balance || 0
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy rodando na porta ${PORT}`);
});
