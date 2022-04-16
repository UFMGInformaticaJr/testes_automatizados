class OperacoesAritmeticasService {
    /**
   * Retorna um float ** TESTADO
   */
  divisao(a, b) {
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
}

module.exports = new OperacoesAritmeticasService();
