describe('Testando ASobreB', () => {
    const service = require('./Service');

    describe('Quando 2 números são passados como parâmetro, retorna a divisão de um pelo outro', () => {
        test.concurrent.each`
           numerador                        | denominador                        | valorEsperado
            ${6}                            |  ${3}                              |    ${2}
            ${4}                            |  ${2}                              |    ${2}
            ${-12}                          |  ${3}                              |    ${-4}
            ${-12}                          |  ${-3}                             |    ${4}
            ${10}                           |  ${3}                              |    ${3.3333333333333335}
            ${Number.MAX_SAFE_INTEGER}      |  ${5}                              |    ${1801439850948198.2}
            ${1}                            |  ${Number.MAX_SAFE_INTEGER}        |    ${1.1102230246251568e-16}
        `('.ASobreB($numerador, $denominador)', async ({numerador, denominador, valorEsperado}) => {
            expect(service.ASobreB(numerador, denominador)).toBe(valorEsperado);
        });
    });

});