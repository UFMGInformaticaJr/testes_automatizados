const { findByPk, findAll } = require("../models/User");

class Service {
  calculaRaizQuadrada = (numero) => {
    const numeroFloat = parseFloat(numero);
    if (numeroFloat > 0 && typeof numeroFloat == 'number') {
      const raizQuadrada = Math.sqrt(numeroFloat);
      console.log(raizQuadrada);
    } else {
      throw new TypeError();
    }
  };

  retornaDivisores = (numero) => {
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
      console.log(lista);
    } else {
      throw new TypeError();
    }
  };

  retornaVogais = (string) => {
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
      console.log(listaVogais);
    } else {
      throw new TypeError();
    }
  };

  senhaFraca = (userId) => {
    const user = findByPk(userId);
    let senhaFraca = false;
    if (user && typeof(user.password) == 'string') {
      if (user.password.length < 8) {
        senhaFraca = true;
      }
      else {
        senhaFraca = false;
      }
      console.log(senhaFraca);
      return senhaFraca;
    }
    else{
      throw new TypeError();
    }
  };

  retornaUsuariosComSenhaFraca = () => {
    const users = findAll();
    let usuariosComSenhaFraca = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (this.senhaFraca(user.id)) {
        usuariosComSenhaFraca.push(user.id);
      }
    }
    console.log(usuariosComSenhaFraca);
    return usuariosComSenhaFraca;
  }

}

module.exports = new Service();
