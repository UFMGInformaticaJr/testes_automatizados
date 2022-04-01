const {NotFoundError, NotAuthorizedError} = require('../errors');

describe('ASobreB', () => {
    const service = require('./Service');

    describe('2 números inteiros são passados como parâmetro ==> retorna a divisão de um pelo outro', () => {
        test.each([
            {numerador: 6,                       denominador: 3,                       valorEsperado: 2},
            {numerador: 4,                       denominador: 2,                       valorEsperado: 2},
            {numerador: -12,                     denominador: 3,                       valorEsperado: -4},
            {numerador: -12,                     denominador: -3,                      valorEsperado: 4},
            {numerador: 10,                      denominador: 3,                       valorEsperado: 3.3333333333333335},
            {numerador: Number.MAX_SAFE_INTEGER, denominador: 5,                       valorEsperado: 1801439850948198.2},
            {numerador: 1,                       denominador: Number.MAX_SAFE_INTEGER, valorEsperado: 1.1102230246251568e-16}
        ])
        ('%j', ({numerador, denominador, valorEsperado}) => {
            expect(service.ASobreB(numerador, denominador)).toBe(valorEsperado);
        });
    });

    describe('2 números são passados como parâmetro, e um deles ou ambos são float ==> retorna a divisão de um pelo outro', () => {
        test.each([
            {numerador: 7.5224455678,            denominador: 2.7666,                  valorEsperado: 2.7190217479216368},
            {numerador: 7.5224455678,            denominador: -2,                      valorEsperado: -3.7612227839},
            {numerador: Number. MAX_VALUE,       denominador: 4.2,                     valorEsperado: 4.28022174967218e+307},
            {numerador: 8,                       denominador: Number. MAX_VALUE,       valorEsperado: 4.450147717014404e-308}
        ])('%j', ({numerador, denominador, valorEsperado}) => {
            expect(service.ASobreB(numerador, denominador)).toBeCloseTo(valorEsperado, 16);
        });
    });

    describe('o numerador é um número maior que 0 mas o denominador é igual a 0 ==> retorna Infinity', () => {
        test.each([
            {numerador: 6                      },
            {numerador: 2.1                    },
            {numerador: Number. MAX_VALUE      },
            {numerador: Number.MAX_SAFE_INTEGER}
        ])('%j', ({numerador}) => {
            expect(service.ASobreB(numerador, 0)).toEqual(Infinity);
        });
    });

    describe('o numerador é um número menor que 0 mas o denominador é igual a 0 ==> retorna Infinity negativo', () => {
        test.each([
            {numerador: -6                      },
            {numerador: -2.1                    },
            {numerador: -Number. MAX_VALUE      },
            {numerador: -Number.MAX_SAFE_INTEGER}
        ])('%j', ({numerador}) => {
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
            {numerador: "uma string"     , denominador: 2.7666},           
            {numerador: true             , denominador: -2               },               
            {numerador: {atributo: 1}    , denominador: 4.2              },              
            {numerador: () => {}         , denominador: Number. MAX_VALUE},
            {numerador: 2.7666           , denominador: "uma string"     }, 
            {numerador: -2               , denominador: true             },         
            {numerador: 4.2              , denominador: {atributo: 1}    },
            {numerador: Number. MAX_VALUE, denominador: () => {}         }     
        ])('%j', ({numerador, denominador}) => {
            expect(() => {
                service.ASobreB(numerador, denominador);
            }).toThrow(TypeError);
        });
    });
});

describe('raizQuadrada', () => {
    const service = require('./Service');

    describe('um número é passado como parâmetro ==> retorna a raiz quadrada do número', () => {
        test.each([
            {numero: 9                      , valorEsperado: 3                 },
            {numero: 225                    , valorEsperado: 15                },
            {numero: 225.2                  , valorEsperado: 15.006665185843255},
            {numero: Number.MAX_SAFE_INTEGER, valorEsperado: 94906265.62425154 },
            {numero: 22                     , valorEsperado: 4.69041575982343  }
        ])('%j', ({numero, valorEsperado}) => {
            expect(service.raizQuadrada(numero)).toBe(valorEsperado);
        });
    });

    describe('o parâmetro não é um número ==> lança exceção', () => {
        test.each([
            {numero: "uma string" },
            {numero: true         },
            {numero: {atributo: 1}},
            {numero: () => {}     },
        ])('%j', ({numero}) => {
            expect(() => {
                service.raizQuadrada(numero);
            }).toThrow(TypeError);
        });
    });

    describe('o parâmetro é um número negativo ==> lança exceção', () => {
        test.each([
            {numero: -1                      },
            {numero: -15.67                  },
            {numero: -Number.MAX_SAFE_INTEGER},
            {numero: -Number.MAX_VALUE       }
        ])('%j', ({numero}) => {
            expect(() => {
                service.raizQuadrada(numero);
            }).toThrow(Error);
        });
    });
});

describe('vogais', () => {
    const service = require('./Service');

    describe('uma string é passada por parâmetro ==> retorna, em minúsculo, as vogais dessa string', () => {
        test.each([
            {entrada: "aabaaea"      , valorEsperado: ['a','a','a','a','e','a']},
            {entrada: "AAbaaEA"      , valorEsperado: ['a','a','a','a','e','a']},
            {entrada: "aa baa ea"    , valorEsperado: ['a','a','a','a','e','a']}
        ])('%j', ({entrada, valorEsperado}) => {
            expect(service.vogais(entrada)).toEqual(valorEsperado);
        });
    });

    describe('algum dos parâmetros não é uma string ==> lança exceção', () => {
        test.each([                        
        {entrada: true         },                                        
        {entrada: {atributo: 1}},                              
        {entrada: () => {}     },                     
        {entrada: 2            }                          
        ])('%j', ({entrada}) => {
            expect(() => service.vogais(entrada)).toThrow(TypeError);
        });
    });
});

describe ('idsComMesmoNome', () => {
    const User = require('../models/User');
    const service = require('./Service');
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test(
        'o método é executado ==> busca todos os usuários',
        async () => {
            var userFindAll = jest.spyOn(User,'findAll');
            
            await service.idsComMesmoNome();

            expect(userFindAll).toHaveBeenCalledTimes(1);
        }   
    );
    
    describe('a busca de usuários é feita ==> retorna uma lista de listas do id dos usuários com o mesmo nome', () => {
        test.each([
            {
                users: [
                {id: 1, name: 'jorge'},
                {id: 2, name: 'gabi'}
                ],
                valorEsperado:[
                    [1], [2]
                ]
            },
            {
                users:[
                    {id: 1, name: 'manuel'},
                    {id: 2, name: 'jao'},
                    {id: 3, name: 'manuel'}
                ],
                valorEsperado:[
                    [1,3], [1,3], [2]
                ]
            },
            {   
                users:[
                    {id: 1, name: 'manuel'},
                    {id: 2, name: 'jao'},
                    {id: 3, name: 'manuel'},
                    {id: 4, name: 'jao'},
                    {id: 5, name: 'bandeira'}
                ],
                valorEsperado:[
                    [1,3], [2, 4], [5], [2, 4], [1,3]
                ]
            },
            { 
                users:[], 
                valorEsperado:[] 
            }
        ])
        ('%j', ({users, valorEsperado}) => {
            jest.spyOn(User,'findAll').mockReturnValue(users);

            return expect(service.idsComMesmoNome()).resolves.toEqual(expect.arrayContaining(valorEsperado));
        });
    });    
});

describe('usersComSenhaFraca', () => {
    const service = require('./Service');
    const User = require('../models/User');
    const SenhaService = require('./SenhaService');
    
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test(
        'o método é executado ==> busca todos os usuários no banco de dados',
        async () => {
            var userFindAll = jest.spyOn(User,'findAll');
            
            await service.usersComSenhaFraca();

            expect(userFindAll).toHaveBeenCalledTimes(1);
        }   
    );

    describe('usuários são buscados do banco de dados ==> verifica senha fraca de todos os usuários', () => {
        test.each([                                   
            {
 
                usuarios:
                [
                    {   id: 347},
                    {   id: 484}
                ]
            },
            {
                usuarios:
                [
                    { id: 98}
                ]
            },
            {
                usuarios:
                []
            }                                     
                                                   
        ])(
            '%j',
            async ({usuarios}) => {
                jest.spyOn(User,'findAll').mockReturnValue(usuarios);

                var spySenhaFraca = jest.spyOn(SenhaService,'senhaFraca');

                await service.usersComSenhaFraca();

                expect(spySenhaFraca).toHaveBeenCalledTimes(usuarios.length);
            }
        );
    });

    describe('usuários buscados do banco de dados vem com a senha fraca ==> retorna lista com estes usuários', () => {
        test.each([                                   
            {
                usuariosComSenhaFraca:[
                    {   id: 1, password: "1234" },
                    {   id: 2, password: "abcd"}
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
            async ({usuariosComSenhaFraca}) => {
                jest.spyOn(User,'findAll').mockReturnValue(usuariosComSenhaFraca);

                var spySenhaFraca = jest.spyOn(SenhaService,'senhaFraca');
                for (let i = 0; i < usuariosComSenhaFraca.length; i++){
                    spySenhaFraca.mockReturnValue(true);
                }

                var retorno = await service.usersComSenhaFraca();

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
                    {   id: 3, password: "abcd"}
                ],
                usuariosEsperados:[
                    {   id: 1, password: "1234" },
                    {   id: 2, password: "1a3b" },
                    {   id: 3, password: "abcd"}
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
                    {   id: 6, password: "abcd"}
                ],
                usuariosEsperados:[
                    {   id: 2, password: "1234" },
                    {   id: 4, password: "1a3b" },
                    {   id: 6, password: "abcd"}
                ]
            },
            {
                usuarios:[],
                usuariosEsperados:[] 
            }                                   
        ])(
            '%j',
            async ({usuarios,usuariosEsperados}) => {
                jest.spyOn(User,'findAll').mockReturnValue(usuarios);

                var spySenhaFraca = jest.spyOn(SenhaService,'senhaFraca');
                spySenhaFraca.mockReturnValue(() => usuarios.password.length < 8)
                
                var retorno = await service.usersComSenhaFraca();

                expect(retorno).toEqual(expect.arrayContaining(usuariosEsperados));
            }
        );
    });
});

describe ('updateClassificacaoEtariaById', () => {
    const User = require('../models/User');
    const service = require('./Service');

    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test(
        'o método é executado ==> busca o usuário com o id informado',
        async () => {
            const userId = 1;

            var spyUserEncontrado = jest.spyOn(User,'findByPk').mockReturnValue({
                id: userId,
                age: 12,
                update: () => {}
            });

            await service.updateClassificacaoEtariaById(userId);

            expect(spyUserEncontrado).toHaveBeenCalledTimes(1);
        }
    );

    test('um usuário não é encontrado ==> lança exceção', async () => {
        jest.spyOn(User,'findByPk').mockReturnValue(undefined);
    
        return expect(async () => {
          var id = 3425;
          await service.updateClassificacaoEtariaById(id);
        }).rejects.toThrow(NotFoundError);
      });

    describe('a busca retorna um usuário com a classificação etária errada ==> retorna esse usuário com a classificação atualizada corretamente', () => {
        test.each([     
            {   
                user: {id: 1, classificacao_etaria: 'adolescente', age: 5},
                classificacao_etaria_esperada: 'crianca',
            },
            {   
                user: {id: 2, classificacao_etaria: 'adulto', age: 16},
                classificacao_etaria_esperada: 'adolescente'
            },
            {   
                user: {id: 3, classificacao_etaria: 'crianca', age: 30},
                classificacao_etaria_esperada: 'adulto'
            },                              
                              
        ])
        (
            '%j',
            async ({user,classificacao_etaria_esperada}) => {
                user.update = async (body) => {
                    user.classificacao_etaria = body.classificacao_etaria;
                };

                jest.spyOn(User,'findByPk').mockReturnValue(user);

                var retorno = await service.updateClassificacaoEtariaById(user.id);

                var userEsperado = {
                    ...user
                };
                userEsperado.classificacao_etaria = classificacao_etaria_esperada;
                
                expect(retorno).toEqual(userEsperado);
            }
        );
    });

}); 

describe('noReturn', () => {
    const User = require('../models/User');
    const Service = require('./Service');
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });
    test(
        'o método recebe o id de um usuário ==> busca o usuário com o id informado',
        async () => {
            const userId = 1;

            var spyUserEncontrado = jest.spyOn(User,'findByPk');

            await Service.noReturn(userId);

            expect(spyUserEncontrado).toHaveBeenCalledTimes(1);
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
        
        jest.spyOn(User,'findByPk').mockImplementation(() => {
          return user;
        });

        var spyUserSendoDeletado = jest.spyOn(user,'delete');
          
        await Service.noReturn(user.id);
    
        expect(spyUserSendoDeletado).toHaveBeenCalledTimes(1);
      });
});

describe('getNameById', () => {
    const User = require('../models/User');
    const Service = require('./Service');
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    describe('um id de um usuário é passado como parâmetro ==> retorna strings diferentes dependendo da primeira letra da string', () => {
        test.each([
            {
                user:{
                    id: 1,
                    name: 'joao'
                }, 
                valorEsperado:"O nome do usuário começa com consoante (joao)"
            },
            {
                user:{
                    id: 2,
                    name: 'gabi'
                }, 
                valorEsperado:"O nome do usuário começa com consoante (gabi)"
            },
            {
                user:{
                    id: 3,
                    name: 'gabriel'
                }, 
                valorEsperado:"O nome do usuário começa com consoante (gabriel)"
            },
            {
                user:{
                    id: 4,
                    name: 'iuri'
                }, 
                valorEsperado:"O nome do usuário começa com vogal (iuri)"
            },
            {
                user:{
                    id: 5,
                    name: 'amanda'
                }, 
                valorEsperado:"O nome do usuário começa com vogal (amanda)"
            },
        ])
        ('%j', ({user, valorEsperado}) => {
            jest.spyOn(User,'findByPk').mockReturnValue(user);


            expect(Service.getNameById(user.id)).resolves.toEqual(valorEsperado);
        });
    });

    describe('um id é passado como parâmetro ==> busca o usuário com este id', () => {
        test.each([
            {
                user:{
                    id: 2644,
                    name: "picollo"
                }
            },
            {
                user:{
                    id: 1,
                    name: "babidi"
                }
            },
            {
                user:{
                    id: 658896,
                    name: "bulma"
                }
            }
        ])
        ('%j', async ({user}) => {
            var spyFindByPk = jest.spyOn(User,'findByPk').mockReturnValue(user);

            await Service.getNameById(user.id);
            
            expect(spyFindByPk.mock.calls[0][0]).toBe(user.id);
            expect(spyFindByPk).toHaveBeenCalledTimes(1);
        });
    });
  
});