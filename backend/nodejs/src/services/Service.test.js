const { NotFoundError } = require('../errors');

const service = require('./Service');
const userModel = require('../models/User');
const senhaService = require('./SenhaService');

describe('ASobreB', () => {
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
            expect(service.ASobreB(numerador, denominador)).toBe(retornoEsperado);
        });
    });

    describe('2 números são passados como parâmetro, e um deles ou ambos são float ==> retorna a divisão de um pelo outro', () => {
        test.each([
            { numerador: 7.5224455678,            denominador: 2.7666,                  retornoEsperado: 2.7190217479216368 },
            { numerador: 7.5224455678,            denominador: -2,                      retornoEsperado: -3.7612227839 },
            { numerador: Number. MAX_VALUE,       denominador: 4.2,                     retornoEsperado: 4.28022174967218e+307 },
            { numerador: 8,                       denominador: Number. MAX_VALUE,       retornoEsperado: 4.450147717014404e-308 }
        ])('%j', ({ numerador, denominador, retornoEsperado }) => {
            expect(service.ASobreB(numerador, denominador)).toBeCloseTo(retornoEsperado, 16);
        });
    });

    describe('o numerador é um número maior que 0 mas o denominador é igual a 0 ==> retorna Infinity', () => {
        test.each([
            { numerador: 6                      },
            { numerador: 2.1                    },
            { numerador: Number. MAX_VALUE      },
            { numerador: Number.MAX_SAFE_INTEGER }
        ])('%j', ({ numerador }) => {
            expect(service.ASobreB(numerador, 0)).toEqual(Infinity);
        });
    });

    describe('o numerador é um número menor que 0 mas o denominador é igual a 0 ==> retorna Infinity negativo', () => {
        test.each([
            { numerador: -6                      },
            { numerador: -2.1                    },
            { numerador: -Number. MAX_VALUE      },
            { numerador: -Number.MAX_SAFE_INTEGER }
        ])('%j', ({ numerador }) => {
            expect(service.ASobreB(numerador, 0)).toEqual(-Infinity);
        });
    });

    describe('o numerador e o denominador são iguais a 0 ==> retorna NaN', () => {
        test('%j', async () => {
            expect(service.ASobreB(0, 0)).toEqual(NaN);
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
                service.ASobreB(numerador, denominador);
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
            expect(service.raizQuadrada(numero)).toBe(retornoEsperado);
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
                service.raizQuadrada(numero);
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
                service.raizQuadrada(numero);
            }).toThrow(new Error('Número menor que 0'));
        });
    });
});

describe('vogais', () => {
    describe('uma string é passada por parâmetro ==> retorna, em minúsculo, as vogais dessa string', () => {
        test.each([
            { entrada: 'aabaaea',   retornoEsperado: ['a', 'a', 'a', 'a', 'e', 'a'] },
            { entrada: 'AAbaaEA',   retornoEsperado: ['a', 'a', 'a', 'a', 'e', 'a'] },
            { entrada: 'aa baa ea', retornoEsperado: ['a', 'a', 'a', 'a', 'e', 'a'] }
        ])('%j', ({ entrada, retornoEsperado }) => {
            expect(service.vogais(entrada)).toEqual(retornoEsperado);
        });
    });

    describe('algum dos parâmetros não é uma string ==> lança exceção', () => {
        test.each([
            { entrada: true            },
            { entrada: { atributo: 1 } },
            { entrada: () => {}        },
            { entrada: 2               }
        ])('%j', ({ entrada }) => {
            expect(() => service.vogais(entrada)).toThrow(TypeError);
        });
    });
});

describe ('idsComMesmoNome', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test(
        'o método é executado ==> busca todos os usuários',
        async () => {
            const userModelFindAllSpy = jest.spyOn(userModel,'findAll').mockImplementation(
                () => []
            );
            
            await service.idsComMesmoNome();

            expect(userModelFindAllSpy).toHaveBeenCalledTimes(1);
        }   
    );
    
    describe('a busca de usuários é feita ==> retorna uma lista de listas do id dos usuários com o mesmo nome', () => {
        test.each([
            {
                usuarios: [
                    { id: 1, name: 'jorge' },
                    { id: 2, name: 'gabi' }
                ],
                retornoEsperado:[
                    [1], [2]
                ]
            },
            {
                usuarios:[
                    { id: 1, name: 'manuel' },
                    { id: 2, name: 'jao' },
                    { id: 3, name: 'manuel' }
                ],
                retornoEsperado:[
                    [1,3], [1,3], [2]
                ]
            },
            {   
                usuarios:[
                    { id: 1, name: 'manuel' },
                    { id: 2, name: 'jao' },
                    { id: 3, name: 'manuel' },
                    { id: 4, name: 'jao' },
                    { id: 5, name: 'bandeira' }
                ],
                retornoEsperado:[
                    [1,3], [2, 4], [5], [2, 4], [1,3]
                ]
            },
            { 
                usuarios:[], 
                retornoEsperado:[] 
            }
        ])
        ('%j', ({ usuarios, retornoEsperado }) => {
            jest.spyOn(userModel,'findAll').mockReturnValue(usuarios);

            return expect(service.idsComMesmoNome()).resolves.toEqual(expect.arrayContaining(retornoEsperado));
        });
    });    
});

describe('usersComSenhaFraca', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test(
        'o método é executado ==> busca todos os usuários no banco de dados',
        async () => {
            const userModelFindAllSpy = jest.spyOn(userModel,'findAll').mockImplementation(
                () => []
            );
            
            await service.usersComSenhaFraca();

            expect(userModelFindAllSpy).toHaveBeenCalledTimes(1);
        }   
    );

    describe('usuários são buscados do banco de dados ==> verifica senha fraca de todos os usuários', () => {
        test.each([                                   
            {
 
                usuarios:
                [
                    {   id: 347 },
                    {   id: 484 }
                ]
            },
            {
                usuarios:
                [
                    { id: 98 }
                ]
            },
            {
                usuarios:
                []
            }                                     
                                                   
        ])(
            '%j',
            async ({ usuarios }) => {
                jest.spyOn(userModel,'findAll').mockReturnValue(usuarios);
                const senhaServiceSenhaFracaSpy = jest.spyOn(senhaService,'senhaFraca').mockImplementation(
                    () => true
                );

                await service.usersComSenhaFraca();

                expect(senhaServiceSenhaFracaSpy).toHaveBeenCalledTimes(usuarios.length);
            }
        );
    });

    describe('usuários buscados do banco de dados vem com a senha fraca ==> retorna lista com estes usuários', () => {
        test.each([                                   
            {
                usuariosComSenhaFraca:[
                    {   id: 1, password: "1234" },
                    {   id: 2, password: "abcd" }
                ]
            },
            {
                usuariosComSenhaFraca:[
                    {   id: 1, password: "1a2b" }
                ]
            },
            {
                usuariosComSenhaFraca:[]
            }                                   
        ])(
            '%j',
            async ({ usuariosComSenhaFraca }) => {
                jest.spyOn(userModel,'findAll').mockReturnValue(usuariosComSenhaFraca);
                jest.spyOn(senhaService,'senhaFraca').mockImplementation(
                    () => true
                );

                const retorno = await service.usersComSenhaFraca();

                expect(retorno).toEqual(expect.arrayContaining(usuariosComSenhaFraca));
                expect(retorno.length).toBe(usuariosComSenhaFraca.length);
            }
        );
    });

    describe('os usuários do banco de dados são buscados ==> retorna uma lista com os usuários de senha fraca', () => {
        test.each([                                   
            {
                usuarios:[
                    {   id: 1, password: "1234" },
                    {   id: 2, password: "1a3b" },
                    {   id: 3, password: "abcd" }
                ],
                usuariosEsperados:[
                    {   id: 1, password: "1234" },
                    {   id: 2, password: "1a3b" },
                    {   id: 3, password: "abcd" }
                ]
            },
            {
                usuarios:[
                    {   id: 1, password: "123456789" },
                    {   id: 2, password: "abcdefghi" },
                    {   id: 3, password: "a2c4e6g8i" }
                ],
                usuariosEsperados:[]
            },
            {
                usuarios:[
                    {   id: 1, password: "123456789" },
                    {   id: 2, password: "1234" },
                    {   id: 3, password: "abcdefghi" },
                    {   id: 4, password: "1a3b" },
                    {   id: 5, password: "a2c4e6g8i" },
                    {   id: 6, password: "abcd" }
                ],
                usuariosEsperados:[
                    {   id: 2, password: "1234" },
                    {   id: 4, password: "1a3b" },
                    {   id: 6, password: "abcd" }
                ]
            },
            {
                usuarios:[],
                usuariosEsperados:[] 
            }                                   
        ])(
            '%j',
            async ({ usuarios,usuariosEsperados }) => {
                jest.spyOn(userModel,'findAll').mockReturnValue(usuarios);
                jest.spyOn(senhaService,'senhaFraca').mockReturnValue(() => usuarios.password.length < 8);
                
                const retorno = await service.usersComSenhaFraca();

                expect(retorno).toEqual(expect.arrayContaining(usuariosEsperados));
            }
        );
    });
});

describe ('updateClassificacaoEtariaById', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test(
        'o método é executado ==> busca o usuário com o id informado',
        async () => {
            const idUsuario = 1;

            const userModelFindByPkSpy = jest.spyOn(userModel,'findByPk').mockReturnValue({
                id: idUsuario,
                age: 12,
                update: () => {}
            });

            await service.updateClassificacaoEtariaById(idUsuario);

            expect(userModelFindByPkSpy).toHaveBeenCalledTimes(1);
            expect(userModelFindByPkSpy.mock.calls[0][0]).toBe(idUsuario);
        }
    );

    test('um usuário não é encontrado ==> lança exceção', async () => {
        const id = 3425;

        jest.spyOn(userModel,'findByPk').mockReturnValue(undefined);

        return expect(async () => {
            await service.updateClassificacaoEtariaById(id);
        }).rejects.toThrow(new NotFoundError(`Nao foi encontrado um usuario com o ID: ${id}`));
    });

    describe('a busca retorna um usuário com a classificação etária errada ==> retorna esse usuário com a classificação atualizada corretamente', () => {
        test.each([     
            {   
                user: { id: 1, classificacao_etaria: 'adolescente', age: 5 },
                classificacao_etaria_esperada: 'crianca',
            },
            {   
                user: { id: 2, classificacao_etaria: 'adulto', age: 16 },
                classificacao_etaria_esperada: 'adolescente'
            },
            {   
                user: { id: 3, classificacao_etaria: 'crianca', age: 30 },
                classificacao_etaria_esperada: 'adulto'
            },                              
                              
        ])
        (
            '%j',
            async ({ user,classificacao_etaria_esperada }) => {
                user.update = async (body) => {
                    user.classificacao_etaria = body.classificacao_etaria;
                };
                const userEsperado = {
                    ...user
                };
                userEsperado.classificacao_etaria = classificacao_etaria_esperada;

                jest.spyOn(userModel,'findByPk').mockReturnValue(user);

                const retorno = await service.updateClassificacaoEtariaById(user.id);
                
                expect(retorno).toEqual(userEsperado);
            }
        );
    });

}); 

describe('noReturn', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });
    test(
        'o método recebe o id de um usuário ==> busca o usuário com o id informado',
        async () => {
            const idUsuario = 1;

            const userModelFindByPkSpy = jest.spyOn(userModel,'findByPk').mockImplementation(
                () => {return { delete: () => {} }}
            );

            await service.noReturn(idUsuario);

            expect(userModelFindByPkSpy).toHaveBeenCalledTimes(1);
            expect(userModelFindByPkSpy.mock.calls[0][0]).toBe(idUsuario);
        }
    );

    test('o método encontra um usuário ==> deleta esse usuário', async () => {
        const user = {
            id: 3,
            name: 'jorge',
            password: 'abcd',
            classificacao_etaria: 'adolescente',
            age: 15,
            delete: () => {}
        };

        jest.spyOn(userModel,'findByPk').mockImplementation(() => {
            return user;
        });
        const userDeleteSpy = jest.spyOn(user,'delete').mockImplementation(
            () => {}
        );
          
        await service.noReturn(user.id);
    
        expect(userDeleteSpy).toHaveBeenCalledTimes(1);
    });
});

describe('getNameById', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    describe('um id de um usuário é passado como parâmetro ==> retorna strings diferentes dependendo da primeira letra da string', () => {
        test.each([
            {
                usuario:{ id: 1,name: 'joao' }, 
                retornoEsperado:"O nome do usuário começa com consoante (joao)"
            },
            {
                usuario:{ id: 2,name: 'gabi' }, 
                retornoEsperado:"O nome do usuário começa com consoante (gabi)"
            },
            {
                usuario:{ id: 3,name: 'gabriel' }, 
                retornoEsperado:"O nome do usuário começa com consoante (gabriel)"
            },
            {
                usuario:{ id: 4,name: 'iuri' }, 
                retornoEsperado:"O nome do usuário começa com vogal (iuri)"
            },
            {
                usuario:{ id: 5,name: 'amanda' }, 
                retornoEsperado:"O nome do usuário começa com vogal (amanda)"
            },
        ])
        ('%j', ({ usuario, retornoEsperado }) => {
            jest.spyOn(userModel,'findByPk').mockReturnValue(usuario);

            return expect(service.getNameById(usuario.id)).resolves.toEqual(retornoEsperado);
        });
    });

    describe('um id é passado como parâmetro ==> busca o usuário com este id', () => {
        test.each([
            {
                usuario:{ id: 2644,name: "picollo" }
            },
            {
                usuario:{ id: 1,name: "babidi" }
            },
            {
                usuario:{ id: 658896,name: "bulma" }
            }
        ])
        ('%j', async ({ usuario }) => {
            const userModelFindByPkSpy = jest.spyOn(userModel,'findByPk').mockReturnValue(usuario);

            await service.getNameById(usuario.id);
            
            expect(userModelFindByPkSpy.mock.calls[0][0]).toBe(usuario.id);
            expect(userModelFindByPkSpy).toHaveBeenCalledTimes(1);
        });
    });
  
});