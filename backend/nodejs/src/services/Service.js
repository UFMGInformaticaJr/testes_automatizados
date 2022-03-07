const User = require('../models/User');

class Service {
  /**
   * Retorna um inteiro
   */
  ASobreB(a, b) {
    if (typeof a != 'number' || typeof b != 'number') throw new TypeError();
    return a / b;
  }

  /**
   * Retorna um float
   */
  raizQuadrada(numero) {
    if (typeof numero != 'number') throw new TypeError();
    if (numero < 0) throw new Error('Número menor que 0');
    return Math.sqrt(numero);
  }

  /**
   * Retorna lista de números inteiros
   */
  divisores(numero) {
    if (typeof numero != 'number') throw new TypeError();
    if (numero < 0) throw new Error('Número menor que 0');
    let divisores = [];
    let divisor = 1;
    while (divisor <= Math.ceil(numero / 2)) {
      if (numero % divisor == 0) {
        divisores.push(divisor);
      }
      divisor++;
    }
    divisores.push(numero);
    return divisores;
  }

  /**
   * Retornar lista de strings
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

  /**
   * Retorna booleano
   */
  async senhaFraca(userId) {
    const id = parseInt(userId);    
    if (isNaN(id) || id < 0) {
      throw new TypeError('Id inválido');
    }
    const user = await User.findByPk(id);

    if (!user) throw new Error('Usuário não encontrado');
    
    let senhaFraca = false;
    if (user.password.length < 8) {
      senhaFraca = true;
    } else {
      senhaFraca = false;
    }
    return senhaFraca;
  }

  /**
   * Retorna uma lista de objetos baseada em resultado de outra função
   */
  async usersComSenhaFraca() {
    const users = await User.findAll();
    let usuariosComSenhaFraca = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (this.senhaFraca(user.id)) {
        usuariosComSenhaFraca.push(user.id);
      }
    }
    return usuariosComSenhaFraca;
  }

  /**
   * Retorna uma lista de lista objetos
   */
  async idsComMesmoNome() {
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
  }

  /**
   * Chama outras funções mas não retorna nada
   */
  async noReturn() {
    const user = await User.findByPk(1);
    await user.delete();
  }

  async getNameById(id){
    const user = await User.findByPk(id);
    if( user.name[0]==='a' ||  user.name[0]==='e' ||  user.name[0]==='i' || user.name[0]==='o' || user.name[0] === 'u' ){
      return `O nome do usuário começa com vogal ("${user.name}").`;
    }
    return `O nome do usuário começa com consoante ("${user.name}").`;
  }

}

module.exports = new Service();

