const router = require('express').Router();

const Service = require('../services/Service');

router.get('/calculaRaizQuadrada/:numero', function (req, res) {
  const numero = req.params.numero;
  try {
    Service.calculaRaizQuadrada(numero);
    res.end();
  } catch (error) {
    console.log(error + ': Valor Inválido');
    res.end();
  }
});

router.get('/retornaDivisores/:numero', function (req, res) {
  const numero = req.params.numero;
  try {
    Service.retornaDivisores(numero);
    res.end();
  } catch (error) {
    console.log(error + ': Valor Inválido');
    res.end();
  }
});

router.get('/retornaVogais/:string', function (req, res) {
  const string = req.params.string;
  try {
    Service.retornaVagas(string);
    res.end();
  } catch (error) {
    console.log(error + ': Valor Inválido');
    res.end();
  }
});

router.get('/senhaFraca/:id', function (req, res) {
  try {
    const userId = req.params.id;
    Service.senhaFraca(userId);
    res.end();
  } catch (error) {
    console.log(error);
    res.end();
  }
});

router.get('/getAllUsers/', function (req, res) {
  try {
    Service.getAllUsers();
    res.end();
  } catch (error) {
    console.log(error);
    res.end();
  }
});

router.get('/retornaUsuariosComSenhaFraca/', function (req, res) {
  try {
    Service.retornaUsuariosComSenhaFraca();
    res.end();
  } catch (error) {
    console.log(error);
    res.end();
  }
});

module.exports = router;
