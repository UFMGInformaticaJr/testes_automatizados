const User = require('../models/User');

class Service {
  /**
   * Retorna um float 
   */
  calculaRaizQuadrada (numero) {
    const numeroFloat = parseFloat(numero);
    if (numeroFloat > 0 && typeof numeroFloat == 'number') {
      const raizQuadrada = Math.sqrt(numeroFloat);
    } else {
      throw new TypeError();
    }
  };

  /**
   * Retorna lista de números inteiros 
   */
  retornaDivisores (numero) {
    const numeroInt = parseInt(numero);
    if (numeroInt > 0 && typeof numeroInt == 'number') {
      let lista = [];
      let divisor = 1;
      while (divisor <= Math.ceil(numeroInt / 2)) {
        if (numeroInt % divisor == 0) {
          lista.push(divisor);
        }
        divisor++;
      }
      lista.push(numeroInt);
    } else {
      throw new TypeError();
    }
  };

  /**
   * Retornar lista de strings
   */
   retornaVogais (string) {
    if (typeof string == 'string') {
      const stringMinuscula = string.toLocaleLowerCase();
      const vogais = ['a', 'e', 'i', 'o', 'u'];
      let listaVogais = [];
      for (let i = 0; i < stringMinuscula.length; i++) {
        const letra = stringMinuscula[i];
        if (vogais.includes(letra)) {
          listaVogais.push(letra);
        }
      }
    } else {
      throw new TypeError();
    }
  };

  /**
   * Retorna booleano
   */
  async senhaFraca (userId) {
    const user = await User.findByPk(userId);
    let senhaFraca = false;
    if (user && typeof user.password == 'string') {
      if (user.password.length < 8) {
        senhaFraca = true;
      } else {
        senhaFraca = false;
      }
      return senhaFraca;
    } else {
      throw new TypeError();
    }
  };

  /**
   * Retorna uma lista de objetos baseada em resultado de outra função
   */
  async retornaUsuariosComSenhaFraca () {
    const users = await User.findAll();
    let usuariosComSenhaFraca = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (this.senhaFraca(user.id)) {
        usuariosComSenhaFraca.push(user.id);
      }
    }
    return usuariosComSenhaFraca;
  };

  /**
   * Retorna uma lista de lista objetos 
   */ 
   async retornaIdsComMesmoNome () {
    const users = await User.findAll();
    let nomes = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      let ids = [];
      for (let j = 0; j < users.length; j++) {
        const user2 = users[j];
        if (user.name === user2.name) {
          ids.push(user2.id);
        }
      }
      nomes[i] = ids; 
    }
    return nomes;
  };

  /** 
   * Chama outras funções mas não retorna nada
   */ 
  async noReturn () {
    const user = await User.findByPk(1);
    await user.delete();
  };
}

module.exports = new Service();