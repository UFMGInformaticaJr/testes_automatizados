const router = require('express').Router();

router.get('/calculaRaizQuadrada/:numero', function (req, res) {
    const numero = req.params.numero;
    const numeroFloat = parseFloat(numero);
    try {
        if (numeroFloat > 0 && typeof(numeroFloat) == "number") {
            const raizQuadrada = Math.sqrt(numeroFloat);
            console.log(raizQuadrada);
            res.end();
        }
        else {
            throw new TypeError;
        }
    } catch (error) {
        console.log(error + ": Valor Inválido");
        res.end();
    };
});

router.get('/retornaDivisores/:numero', function (req, res) {
    const numero = req.params.numero;
    const numeroInt = parseInt(numero);
    try {
        if (numeroInt > 0 && typeof(numeroInt) == "number") {
            let lista = [];
            let divisor = 1;
            while (divisor <= Math.ceil(numeroInt/2)) {
                if (numeroInt % divisor == 0) {
                    lista.push(divisor);
                }
                divisor++;
            }
            lista.push(numeroInt);
            console.log(lista);
            res.end();
        }
        else {
            throw new TypeError;
        }
    } catch (error) {
        console.log(error + ": Valor Inválido");
        res.end();
    };
});

router.get('/retornaVogais/:string', function (req, res) {
    const string = req.params.string;
    try {
        if (typeof(string) == "string") {
            const stringMinuscula = string.toLocaleLowerCase();
            const vogais = ['a', 'e', 'i', 'o', 'u'];
            let listaVogais = [];
            for (let i = 0; i < stringMinuscula.length; i++) {
                const letra = stringMinuscula[i];
                if (vogais.includes(letra)) {
                    listaVogais.push(letra);
                }
            }
            console.log(listaVogais);
            res.end();
        }
        else {
            throw new TypeError;
        }
    } catch (error) {
        console.log(error + ": Valor Inválido");
        res.end();
    };
});

module.exports = router;