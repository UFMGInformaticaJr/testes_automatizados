const {NotFoundError} = require('../errors');

describe('senhaFraca', () => {
    const User = require('../models/User');
    const SenhaService = require('./SenhaService');
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    describe('um id de um usuário é passado como parâmetro ==> retorna se a senha do usuário é fraca', () => {
        test.each([
            {
                user:{name: 'jorge', password: 'abcd'}, 
                valorEsperado: true
            },
            {
                user:{name: 'gabi', password: 'abcdefghashud'}, 
                valorEsperado: false
            },
            {
                user:{name: 'gabriel', password: 'abcdefghijk'}, 
                valorEsperado: false
            },
            {
                user:{name: 'bernardo', password: 'abc'}, 
                valorEsperado: true
            },
            {
                user:{name: 'vinicius',password: 'a'}, 
                valorEsperado: true
            },
        ])
        ('%j', ({user, valorEsperado}) => {
            jest.spyOn(User,'findByPk').mockReturnValue(user);
            return expect(SenhaService.senhaFraca(1)).resolves.toBe(valorEsperado);
        });
    });

    test('um usuário não é encontrado ==> lança exceção', async () => {
        const id = 1;
        
        jest.spyOn(User,'findByPk').mockReturnValue(undefined);

        return expect(async () => {
          await SenhaService.senhaFraca(id);
        }).rejects.toThrow(NotFoundError);
    });

    describe('o parâmetro não é um número ==> lança exceção', () => {
        test.each([
            {
                numero: "uma string"
            },
            {
                numero: true
            },
            {
                numero: {atributo: 1}
            },
            {
                numero: () => {}
            },
        ])('%j', ({numero}) => {
            return expect(async () => {
                await SenhaService.senhaFraca(numero);
            }).rejects.toThrow(TypeError);
        });
    });  
});