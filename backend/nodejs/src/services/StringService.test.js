const { NotFoundError } = require('../errors');

const stringService = require('./StringService');
const userModel = require('../models/User');
const senhaService = require('./SenhaService');

describe('vogais', () => {
    describe('uma string é passada por parâmetro ==> retorna, em minúsculo, as vogais dessa string', () => {
        test.each([
            { entrada: 'aabaaea',   retornoEsperado: ['a', 'a', 'a', 'a', 'e', 'a'] },
            { entrada: 'AAbaaEA',   retornoEsperado: ['a', 'a', 'a', 'a', 'e', 'a'] },
            { entrada: 'aa baa ea', retornoEsperado: ['a', 'a', 'a', 'a', 'e', 'a'] }
        ])('%j', ({ entrada, retornoEsperado }) => {
            expect(stringService.vogais(entrada)).toEqual(retornoEsperado);
        });
    });

    describe('algum dos parâmetros não é uma string ==> lança exceção', () => {
        test.each([
            { entrada: true            },
            { entrada: { atributo: 1 } },
            { entrada: () => {}        },
            { entrada: 2               }
        ])('%j', ({ entrada }) => {
            expect(() => stringService.vogais(entrada)).toThrow(TypeError);
        });
    });
});