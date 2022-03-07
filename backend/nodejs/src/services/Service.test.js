describe('Testando ASobreB', () => {
    const service = require('./Service');

    describe('Quando 2 números inteiros são passados como parâmetro, retorna a divisão de um pelo outro', () => {
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

    describe('Quando 2 números são passados como parâmetro, e um deles ou ambos são float, retorna a divisão de um pelo outro', () => {
        test.concurrent.each`
           numerador                        | denominador                        | valorEsperado
            ${7.5224455678}                 |  ${2.7666}                         |    ${2.7190217479216368}
            ${7.5224455678}                 |  ${-2}                             |    ${-3.7612227839}
            ${Number. MAX_VALUE}            |  ${4.2}                            |    ${4.28022174967218e+307}
            ${8}                            |  ${Number. MAX_VALUE}              |    ${4.450147717014404e-308}
        `('.ASobreB($numerador, $denominador)', async ({numerador, denominador, valorEsperado}) => {
            expect(service.ASobreB(numerador, denominador)).toBeCloseTo(valorEsperado, 16);
        });
    });

    describe('Quando o numerador é um número maior que 0 mas o denominador é igual a 0, retorna Infinity', () => {
        test.concurrent.each`
           numerador                   
            ${6}                   
            ${2.1}                     
            ${Number. MAX_VALUE}       
            ${Number.MAX_SAFE_INTEGER}
        `('.ASobreB($numerador, 0)', async ({numerador}) => {
            expect(service.ASobreB(numerador, 0)).toEqual(Infinity);
        });
    });

    describe('Quando o numerador é um número menor que 0 mas o denominador é igual a 0, retorna Infinity negativo', () => {
        test.concurrent.each`
           numerador                   
            ${-6}                   
            ${-2.1}                     
            ${-Number. MAX_VALUE}       
            ${-Number.MAX_SAFE_INTEGER}
        `('.ASobreB($numerador, 0)', async ({numerador}) => {
            expect(service.ASobreB(numerador, 0)).toEqual(-Infinity);
        });
    });

    describe('Quando o numerador e o denominador são iguais a 0, retorna NaN', () => {
        test.concurrent('.ASobreB(0, 0)', async () => {
            expect(service.ASobreB(0, 0)).toEqual(NaN);
        });
    });

    describe('Quando algum dos parâmetros não é um número, lança exceção', () => {
        test.concurrent.each`
           numerador                        | denominador          
            ${"uma string"}                 |  ${2.7666}           
            ${true}                         |  ${-2}               
            ${{atributo: 1}}                |  ${4.2}              
            ${() => {}}                     |  ${Number. MAX_VALUE}
            ${2.7666}                       |  ${"uma string"} 
            ${-2}                           |  ${true}         
            ${4.2}                          |  ${{atributo: 1}}
            ${Number. MAX_VALUE}            |  ${() => {}}     
        `('.ASobreB($numerador, $denominador)', async ({numerador, denominador}) => {
            expect(() => {
                service.ASobreB(numerador, denominador);
            }).toThrow(TypeError);
        });
    });

});

describe('Testando raizQuadrada', () => {
    const service = require('./Service');

    describe('Quando um número é passado como parâmetro, retorna a raiz quadrada do número', () => {
        test.concurrent.each([
            [9, 3],
            [225, 15],
            [225.2, 15.006665185843255],
            [Number.MAX_SAFE_INTEGER, 94906265.62425154],
            [22, 4.69041575982343],
        ])('.raizQuadrada de %f', async (numero, valorEsperado) => {
            expect(service.raizQuadrada(numero)).toBe(valorEsperado);
        });
    });

});

describe('Testando vogais', () => {
    const service = require('./Service');

    describe('Quando uma string é passada por parâmetro, retorna, em minúsculo, as vogais dessa string', () => {
        test.concurrent.each`
        entrada                      |   valorEsperado
        ${"aabaaea"}                 |   ${['a','a','a','a','e','a']}
        ${"AAbaaEA"}                 |   ${['a','a','a','a','e','a']}
        ${"aa baa ea"}               |   ${['a','a','a','a','e','a']}
        `
        ('.vogais($entrada)', ({entrada, valorEsperado}) => {
            expect(service.vogais(entrada)).toEqual(valorEsperado);

        });

    });

    describe('Quando algum dos parâmetros não é uma string, lança exceção', () => {
        test.concurrent.each`
        entrada                         
        ${true}                                        
        ${{atributo: 1}}                              
        ${() => {}}                     
        ${2}                          
        `
        ('.vogais($entrada)', ({entrada}) => {
            expect(() => service.vogais(entrada)).toThrow(TypeError);
        });

    });
});	

describe('Testando senhaFraca', () => {
    test('Teste 1', () => {
        const User = require('../models/User');
        const service = require('./Service');
        
        jest.spyOn(User,'findByPk').mockReturnValue({
            name: 'jorge',
            password: 'abcd',
            classificacao_etaria: 'adolescente',
            age: 15,
        });
        
        expect(service.senhaFraca(1)).resolves.toEqual(true);
    });

    test('Teste 1', () => {
        const User = require('../models/User');
        const service = require('./Service');
        
        jest.spyOn(User,'findByPk').mockReturnValue({
            name: 'gabi',
            password: 'abcdefghi',
            classificacao_etaria: 'adolescente',
            age: 16,
        });
        
        expect(service.senhaFraca(2)).resolves.toEqual(false);
    });
    
    test('Teste 3', () => {
        const User = require('../models/User');
        const service = require('./Service');
        
        jest.spyOn(User,'findByPk').mockReturnValue({
            name: 'gabriel',
            password: 'abcdefghijk',
            classificacao_etaria: 'adolescente',
            age: 17,
        });
        
        expect(service.senhaFraca(2)).resolves.toEqual(false);
    });

    test('Teste 4', () => {
        const User = require('../models/User');
        const service = require('./Service');
        
        jest.spyOn(User,'findByPk').mockReturnValue({
            name: 'bernardo',
            password: 'abc',
            classificacao_etaria: 'adolescente',
            age: 17,
        });
        
        expect(service.senhaFraca(2)).resolves.toEqual(true);
    });

    test('Teste 4', () => {
        const User = require('../models/User');
        const service = require('./Service');
        
        jest.spyOn(User,'findByPk').mockReturnValue({
            name: 'vinicius',
            password: 'a',
            classificacao_etaria: 'adolescente',
            age: 14,
        });
        
        expect(service.senhaFraca(2)).resolves.toEqual(true);
    });
   
    // describe('Quando um id de um usuário é passado como parâmetro, retorna se a senha do usuário é fraca', () => {
    //     const User = require('../models/User');
    //     const service = require('./Service');
    //     test.concurrent.each([
    //         [jest.spyOn(User,'findByPk').mockReturnValue({
    //             name: 'jorge',
    //             password: 'abcd',
    //             classificacao_etaria: 'adolescente',
    //             age: 15}), true],
    //         [{
    //             name: 'gabi',
    //             password: 'abcdefghashud',
    //             classificacao_etaria: 'adolescente',
    //             age: 16,
    //         }, false],
    //         [{
    //             name: 'gabriel',
    //             password: 'abcdefghijk',
    //             classificacao_etaria: 'adolescente',
    //             age: 17,
    //         }, false],
    //         [{
    //             name: 'bernardo',
    //             password: 'abc',
    //             classificacao_etaria: 'adolescente',
    //             age: 17,
    //         }, true],
    //         [{
    //             name: 'vinicius',
    //             password: 'a',
    //             classificacao_etaria: 'adolescente',
    //             age: 14,
    //         }, true],
    //     ])
    //     ('.senhaFraca($user)', async ({user, valorEsperado}) => {
    //         expect(service.senhaFraca(1)).resolves.toBe(valorEsperado);
    //     });
    // });

});

