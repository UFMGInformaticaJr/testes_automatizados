const operacoesAritmeticasService = require("./OperacoesAritmeticasService");

describe('divisao', () => {
    describe('2 números inteiros são passados como parâmetro ==> retorna a divisão de um pelo outro', () => {
        test.each([
            { numerador: 6,                       denominador: 3,                       retornoEsperado: 2 },
            { numerador: 4,                       denominador: 2,                       retornoEsperado: 2 },
            { numerador: -12,                     denominador: 3,                       retornoEsperado: -4 },
            { numerador: -12,                     denominador: -3,                      retornoEsperado: 4 },
            { numerador: 10,                      denominador: 3,                       retornoEsperado: 3.3333333333333335 },
            { numerador: Number.MAX_SAFE_INTEGER, denominador: 5,                       retornoEsperado: 1801439850948198.2 },
            { numerador: 1,                       denominador: Number.MAX_SAFE_INTEGER, retornoEsperado: 1.1102230246251568e-16 }
        ])
        ('%j', ({ numerador, denominador, retornoEsperado }) => {
            expect(operacoesAritmeticasService.divisao(numerador, denominador)).toBe(retornoEsperado);
        });
    });

    describe('2 números são passados como parâmetro, e um deles ou ambos são float ==> retorna a divisão de um pelo outro', () => {
        test.each([
            { numerador: 7.5224455678,            denominador: 2.7666,                  retornoEsperado: 2.7190217479216368 },
            { numerador: 7.5224455678,            denominador: -2,                      retornoEsperado: -3.7612227839 },
            { numerador: Number. MAX_VALUE,       denominador: 4.2,                     retornoEsperado: 4.28022174967218e+307 },
            { numerador: 8,                       denominador: Number. MAX_VALUE,       retornoEsperado: 4.450147717014404e-308 }
        ])('%j', ({ numerador, denominador, retornoEsperado }) => {
            expect(operacoesAritmeticasService.divisao(numerador, denominador)).toBeCloseTo(retornoEsperado, 16);
        });
    });

    describe('o numerador é um número maior que 0 mas o denominador é igual a 0 ==> retorna Infinity', () => {
        test.each([
            { numerador: 6                      },
            { numerador: 2.1                    },
            { numerador: Number. MAX_VALUE      },
            { numerador: Number.MAX_SAFE_INTEGER }
        ])('%j', ({ numerador }) => {
            expect(operacoesAritmeticasService.divisao(numerador, 0)).toEqual(Infinity);
        });
    });

    describe('o numerador é um número menor que 0 mas o denominador é igual a 0 ==> retorna Infinity negativo', () => {
        test.each([
            { numerador: -6                      },
            { numerador: -2.1                    },
            { numerador: -Number. MAX_VALUE      },
            { numerador: -Number.MAX_SAFE_INTEGER }
        ])('%j', ({ numerador }) => {
            expect(operacoesAritmeticasService.divisao(numerador, 0)).toEqual(-Infinity);
        });
    });

    describe('o numerador e o denominador são iguais a 0 ==> retorna NaN', () => {
        test('%j', async () => {
            expect(operacoesAritmeticasService.divisao(0, 0)).toEqual(NaN);
        });
    });

    describe('algum dos parâmetros não é um número ==> lança exceção', () => {
        test.each([        
            { numerador: "uma string"     , denominador: 2.7666 },           
            { numerador: true             , denominador: -2               },               
            { numerador: { atributo: 1 }    , denominador: 4.2              },              
            { numerador: () => {}         , denominador: Number. MAX_VALUE },
            { numerador: 2.7666           , denominador: "uma string"     }, 
            { numerador: -2               , denominador: true             },         
            { numerador: 4.2              , denominador: { atributo: 1 }    },
            { numerador: Number. MAX_VALUE, denominador: () => {}         }     
        ])('%j', ({ numerador, denominador }) => {
            expect(() => {
                operacoesAritmeticasService.divisao(numerador, denominador);
            }).toThrow(TypeError);
        });
    });
});

describe('raizQuadrada', () => {
    describe('um número é passado como parâmetro ==> retorna a raiz quadrada do número', () => {
        test.each([
            { numero: 9                      , retornoEsperado: 3                 },
            { numero: 225                    , retornoEsperado: 15                },
            { numero: 225.2                  , retornoEsperado: 15.006665185843255 },
            { numero: Number.MAX_SAFE_INTEGER, retornoEsperado: 94906265.62425154 },
            { numero: 22                     , retornoEsperado: 4.69041575982343  }
        ])('%j', ({ numero, retornoEsperado }) => {
            expect(operacoesAritmeticasService.raizQuadrada(numero)).toBe(retornoEsperado);
        });
    });

    describe('o parâmetro não é um número ==> lança exceção', () => {
        test.each([
            { numero: "uma string" },
            { numero: true         },
            { numero: { atributo: 1 } },
            { numero: () => {}     },
        ])('%j', ({ numero }) => {
            expect(() => {
                operacoesAritmeticasService.raizQuadrada(numero);
            }).toThrow(TypeError);
        });
    });

    describe('o parâmetro é um número negativo ==> lança exceção', () => {
        test.each([
            { numero: -1                      },
            { numero: -15.67                  },
            { numero: -Number.MAX_SAFE_INTEGER },
            { numero: -Number.MAX_VALUE       }
        ])('%j', ({ numero }) => {
            expect(() => {
                operacoesAritmeticasService.raizQuadrada(numero);
            }).toThrow(new Error('Número menor que 0'));
        });
    });
});

describe('divisores', () => {
    describe('o parâmetro é um número inteiro ==> retorna lista de divisores', () => {
        test.each([
            {numero: 140, listaDivisores: [1, 2, 4, 5, 7, 10, 14, 20, 28, 35, 70, 140]},
            {numero: 300, listaDivisores: [1, 2, 3, 4, 5, 6, 10, 100, 12, 15, 150, 20, 
                                            25, 30, 300, 50, 60, 75]}
        ])(
            '%j',
            ({numero, listaDivisores}) => {
                expect(operacoesAritmeticasService.divisores(numero).sort()).toEqual(listaDivisores.sort());
            }
        );
    });

    describe('o parâmetro é um número decimal ==> retorna lista apenas com o numero decimal', () => {
        test.each([
            {numero: 47.7644, listaDivisores: [47.7644]},
            {numero: 277.8762, listaDivisores: [277.8762]}
        ])(
            '%j',
            ({numero, listaDivisores}) => {
                expect(operacoesAritmeticasService.divisores(numero).sort()).toEqual(listaDivisores.sort());
            }
        );
    });

    describe('o parâmetro é um número negativo ==> lança exceção', () => {
        test.each([
            {numero: -47.7644},
            {numero: -140}
        ])(
            '%j',
            ({numero}) => {
                expect(() => {
                    operacoesAritmeticasService.divisores(numero);
                }).toThrow(new Error('Número menor que 0'));
            }
        );
    });

    describe('o parâmetro não é um número ==> lança exceção', () => {
        test.each([
            {numero: () => {}},
            {numero: 'uma string'},
            {numero: {}}
        ])(
            '%j',
            ({numero}) => {
                expect(() => {
                    operacoesAritmeticasService.divisores(numero);
                }).toThrow(new TypeError());
            }
        );
    });
});