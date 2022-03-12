describe('Testando senhaFraca', () => {
    describe('Quando um id de um usuário é passado como parâmetro, retorna se a senha do usuário é fraca', () => {
        const User = require('../models/User');
        const SenhaService = require('./SenhaService');
        beforeEach(() => {
            jest.restoreAllMocks();
            jest.clearAllMocks();
        });

        test.concurrent.each([
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
});