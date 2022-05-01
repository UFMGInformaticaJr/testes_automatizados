const router = require('express').Router();

const operacoesAritmeticasService = require('../services/OperacoesAritmeticasService');
const stringService = require('../services/StringService');
const senhaService = require('../services/SenhaService');

router.get('/raizQuadrada/:numero', function (req, res) {
  const numero = req.params.numero;
  try {
    operacoesAritmeticasService.raizQuadrada(numero);
    res.end();
  } catch (error) {
    console.log(error + ': Valor Inválido');
    res.end();
  }
});

router.get('/divisores/:numero', function (req, res) {
  const numero = req.params.numero;
  try {
    operacoesAritmeticasService.divisores(numero);
    res.end();
  } catch (error) {
    console.log(error + ': Valor Inválido');
    res.end();
  }
});

router.get('/vogais/:string', function (req, res) {
  const string = req.params.string;
  try {
    stringService.vogais(string);
    res.end();
  } catch (error) {
    console.log(error + ': Valor Inválido');
    res.end();
  }
});

router.get('/senhaFraca/:id', function (req, res) {
  try {
    const userId = req.params.id;
    senhaService.senhaFraca(userId);
    res.end();
  } catch (error) {
    console.log(error);
    res.end();
  }
});

module.exports = router;
