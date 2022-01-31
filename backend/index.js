const app = require("./config/express-config");

app.get('/', function (req, res) {
    res.send('Servidor rodando!')
});

