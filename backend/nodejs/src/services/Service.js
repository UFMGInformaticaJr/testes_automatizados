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
}

module.exports = new Service();
