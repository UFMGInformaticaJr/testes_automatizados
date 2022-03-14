const {NotFoundError} = require('../errors');

describe('Testando senhaFraca', () => {
    const User = require('../models/User');
    const SenhaService = require('./SenhaService');
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    describe('Quando um id de um usuário é passado como parâmetro, retorna se a senha do usuário é fraca', () => {
        test.each([
            [{
                name: 'jorge',
                password: 'abcd',
                classificacao_etaria: 'adolescente',
                age: 15,
            }, true],
            [{
                name: 'gabi',
                password: 'abcdefghashud',
                classificacao_etaria: 'adolescente',
                age: 16,
            }, false],
            [{
                name: 'gabriel',
                password: 'abcdefghijk',
                classificacao_etaria: 'adolescente',
                age: 17,
            }, false],
            [{
                name: 'bernardo',
                password: 'abc',
                classificacao_etaria: 'adolescente',
                age: 17,
            }, true],
            [{
                name: 'vinicius',
                password: 'a',
                classificacao_etaria: 'adolescente',
                age: 14,
            }, true],
        ])
        ('.senhaFraca(%p)', (user, valorEsperado) => {
            jest.spyOn(User,'findByPk').mockReturnValue(user);
            expect(SenhaService.senhaFraca(1)).resolves.toBe(valorEsperado);
        });
    });

    test('Quando um usuário não é encontrado, lança exceção', async () => {
        jest.spyOn(User,'findByPk').mockReturnValue(undefined);
    
        expect(async () => {
          const id = 1;
          await SenhaService.senhaFraca(id);
        }).rejects.toThrow(NotFoundError);
    });

    describe('Quando o parâmetro não é um número, lança exceção', () => {
        test.each([
            ["uma string"],
            [true],
            [{atributo: 1}],
            [() => {}],
        ])('.senhaFraca de %f', (numero) => {
            expect(async () => {
                await SenhaService.senhaFraca(numero);
            }).rejects.toThrow(TypeError);
        });
    });  
});