const app = require("./config/express-config");

const port = process.env.port;

app.listen(port, console.log(`API listening on port ${port}`));

app.get('/', function (req, res) {
    res.send('Servidor rodando!')
});

