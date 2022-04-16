const User = require('../models/User');
const SenhaService = require('./SenhaService');
const {NotFoundError} = require('../errors');

class StringService {
  /**
   * Retornar lista de strings ** TESTADO
   */
  vogais(string) {
    if (typeof string != 'string') throw new TypeError();
    const stringMinuscula = string.toLocaleLowerCase();
    const vogais = ['a', 'e', 'i', 'o', 'u'];
    let listaVogais = [];
    for (let i = 0; i < stringMinuscula.length; i++) {
      const letra = stringMinuscula[i];
      if (vogais.includes(letra)) {
        listaVogais.push(letra);
      }
    }
    return listaVogais;
  }

}

module.exports = new StringService();

