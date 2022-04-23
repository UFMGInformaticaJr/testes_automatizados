const {NotFoundError} = require('../errors');
const userModel = require('../models/User');
const senhaService = require('./SenhaService');

jest.mock("../models/User");

describe('senhaFraca', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('um id de um usuário é passado como parâmetro ==> retorna se a senha do usuário é fraca', () => {
        test.each([
            {
                usuario:{name: 'jorge', password: 'abcd'}, 
                retornoEsperado: true
            },
            {
                usuario:{name: 'gabi', password: 'abcdefghashud'}, 
                retornoEsperado: false
            },
            {
                usuario:{name: 'gabriel', password: 'abcdefghijk'}, 
                retornoEsperado: false
            },
            {
                usuario:{name: 'bernardo', password: 'abc'}, 
                retornoEsperado: true
            },
            {
                usuario:{name: 'vinicius',password: 'a'}, 
                retornoEsperado: true
            },
        ])
        ('%j', ({usuario, retornoEsperado}) => {
            userModel.findByPk.mockReturnValue(usuario);

            return expect(senhaService.senhaFraca(1)).resolves.toBe(retornoEsperado);
        });
    });

    test('um usuário não é encontrado ==> lança exceção', async () => {
        const id = 1;

        return expect(async () => {
          await senhaService.senhaFraca(id);
        }).rejects.toThrow(new NotFoundError('Usuário não encontrado'));
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
                await senhaService.senhaFraca(numero);
            }).rejects.toThrow(new TypeError('Id inválido'));
        });
    });  
});