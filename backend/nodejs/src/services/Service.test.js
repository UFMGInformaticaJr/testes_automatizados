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

describe('Testando senhaFraca', () => {
    const service = require('./Service');

    describe('Quando um id de um usuário é passado como parâmetro, retorna se a senha do usuário é fraca', () => {
        test.concurrent.each`
        ENTRADA                         SAÍDA ESPERADA
        ${"aabaaea"}                 |   ${['a','a','a','a','e','a']}
        ${"AAbaaEA"}                 |   ${['a','a','a','a','e','a']}
        ${"aa baa ea"}               |   ${['a','a','a','a','e','a']}
        `
        ('.vogais($string)', async ({string}) => {
            expect(() => {
                service.vogais(string);
            }).toThrow(TypeError);
        });
    });
    
    // describe('Quando um id de um usuário é passado como parâmetro, retorna se a senha do usuário é fraca', () => {
    //     test.concurrent.each`
    //         titulo
    //         ${"uma string"}  
    //         ${"a"}            
    //         ${"&"}            
    //         ${"("}            
    //         ${"("}            
    //         ${" "}            
    //     ` ('.senhaFraca de %d', async ({user}) => {
    //         expect(service.senhaFraca(user)).toThrow(TypeError);
    //     });
    // });

    describe('Quando algum dos parâmetros não é uma string, lança exceção', () => {
        test.concurrent.each`
        ENTRADA                         
        ${true}                                        
        ${{atributo: 1}}                              
        ${() => {}}                     
        ${2}                          
        `
        ('.vogais($string)', async ({string}) => {
            expect(() => {
                service.vogais(string);
            }).toThrow(TypeError);
        });

    });
});

