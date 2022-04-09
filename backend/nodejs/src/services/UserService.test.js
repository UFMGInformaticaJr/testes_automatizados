const {NotFoundError, NotAuthorizedError} = require('../errors');
const userModel = require('../models/User');
const userService = require('./UserService');

describe('getUserById', () => {
  beforeEach(() => {
      jest.restoreAllMocks();
      jest.clearAllMocks();
  });

  test(
    'o método recebe o id de um usuário ==> busca o usuário com o id informado',
    async () => {
        const idUsuario = 1;

        var userFindByPkSpy = jest.spyOn(userModel,'findByPk').mockImplementation(
          () => {
            return {id: idUsuario}
          }
        );

        await userService.getUserById(idUsuario);

        expect(userFindByPkSpy).toHaveBeenCalledTimes(1);
        expect(userFindByPkSpy.mock.calls[0][0]).toBe(idUsuario);
    }
);

  describe('o id de um usuário é passado como parâmetro ==> retorna os dados não sensíveis do usuario', () => {
    test.each([
        { 
          usuario:{name: 'jorge',password: 'abcd'}, 
          retornoEsperado:{name: 'jorge'}
        },
        { 
          usuario:{name: 'gabi', password: 'abcdefghashud'}, 
          retornoEsperado:{name: 'gabi'}
        },
        { 
          usuario:{name: 'gabriel',password: 'abcdefghijk'},
          retornoEsperado:{name: 'gabriel'} 
        },
        { 
          usuario:{name: 'bernardo',password: 'abc'}, 
          retornoEsperado:{name: 'bernardo'}
        },
        {
          usuario:{name: 'vinicius',password: 'a'}, 
          retornoEsperado:{name: 'vinicius'}
        },
      ])
    ('%j', ({usuario, retornoEsperado}) => {
    
        jest.spyOn(userModel,'findByPk').mockImplementation( () => {
          delete usuario["password"];  
          return usuario;
          }
        );
        return expect(userService.getUserById(1)).resolves.toStrictEqual(retornoEsperado);
    });
  });
  
  test('o usuário não é encontrado ==> lança exceção', async () => {
    const id = 1;
    
    jest.spyOn(userModel,'findByPk').mockReturnValue(undefined);

    return expect(async () => {
      await userService.getUserById(id);
    }).rejects.toThrow(new NotFoundError(`Nao foi encontrado um usuario com o ID: ${id}`));
  });
});

describe('updateUser', () => {

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test('o usuário não é encontrado ==> lança exceção', async () => {
    const id = 1,
    reqUserId = 2,
    reqUserRole = 'admin', 
    body = {
      name: 'julio'
    }
    
    jest.spyOn(userModel,'findByPk').mockReturnValue(undefined);

    return expect(async () => {
      await userService.updateUser(id, reqUserId, reqUserRole, body);
    }).rejects.toThrow(new NotFoundError(`Nao foi encontrado um usuario com o ID: ${id}`));
  });

  test('o usuário não é admin porém quer mudar seu próprio role ==> lança exceção', async () => {
    const id = 1, 
    reqUserId = 1,
    reqUserRole = 'user', 
    body = {
      role: 'admin'
    }

    jest.spyOn(userModel,'findByPk').mockImplementation(
      () => {return {
        id: reqUserId,
        role: reqUserRole
      }}
    );

    return expect(async () => {
      await userService.updateUser(id, reqUserId, reqUserRole, body);
    }).rejects.toThrow(new NotAuthorizedError('Você não tem permissão para mudar seu papel de usuário'));
  });

  test('o usuário não é admin porém quer atualizar outro usuário ==> lança exceção', async () => {
    const id = 1,
    reqUserId = 2,
    reqUserRole = 'user', 
    body = { 
      role: 'admin'
    }

    jest.spyOn(userModel,'findByPk').mockImplementation(
      () => {return {
        id: reqUserId,
        role: reqUserRole
      }}
    );

    return expect(async () => {
      await userService.updateUser(id, reqUserId, reqUserRole, body);
    }).rejects.toThrow(new NotAuthorizedError('Você não tem permissão para atualizar esse usuário'));
  });

  test('o usuário é admin ==> altera outro usuario', async () => {
    var usuario = {
      id: 3,
      name: 'jorge',
      role: 'user',
      update: async (body) => {usuario.name = body.name}
    };

    const id = usuario.id,
    reqUserId = 10,
    reqUserRole = 'admin', 
    body = {name: 'gabriel'}

    var nomeEsperado = 'gabriel'
    var userEsperado = {
      ...usuario
    };
    userEsperado.name = nomeEsperado;

    jest.spyOn(userModel,'findByPk').mockReturnValue(usuario);
    
    await userService.updateUser(id, reqUserId, reqUserRole, body);

    expect(usuario).toEqual(userEsperado);
  });

  test('o usuário é user ==> altera a si mesmo', async () => {
    var usuario = {
      id: 3,
      name: 'jorge',
      role: 'user',
      update: async (body) => {usuario.name = body.name}
    };

    const id = usuario.id,
    reqUserId = 3,
    reqUserRole = 'user', 
    body = {name: 'gabriel'}

    var nomeEsperado = 'gabriel'
    var usuarioEsperado = {
      ...usuario
    };
    usuarioEsperado.name = nomeEsperado;

    jest.spyOn(userModel,'findByPk').mockReturnValue(usuario);
    
    await userService.updateUser(id, reqUserId, reqUserRole, body);

    expect(usuario).toEqual(usuarioEsperado);
  });

  test('o usuário é admin ==> pode alterar a si mesmo', async () => {
    var usuario = {
      id: 3,
      name: 'jorge',
      role: 'admin',
      update: async (body) => {usuario.name = body.name}
    };
    const id = usuario.id,
    reqUserId = 3,
    reqUserRole = 'admin', 
    body = {name: 'gabriel'}

    var nomeEsperado = 'gabriel'
    var userEsperado = {
      ...usuario
    };
    userEsperado.name = nomeEsperado;

    jest.spyOn(userModel,'findByPk').mockReturnValue(usuario);
    
    await userService.updateUser(id, reqUserId, reqUserRole, body);

    expect(usuario).toEqual(userEsperado);
  });
});

describe('getCurrentUser', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test(
    'o método recebe o id de um usuário ==> busca o usuário com o id informado',
    async () => {
        const idUsuario = 1;

        var userFindByPkSpy = jest.spyOn(userModel,'findByPk').mockImplementation(
          () => {
            return {
              id: idUsuario
            }
          }
        );

        await userService.getCurrentUser(idUsuario);

        expect(userFindByPkSpy.mock.calls[0][0]).toBe(idUsuario);
        expect(userFindByPkSpy).toHaveBeenCalledTimes(1);
    }
);

  test('o usuário é encontrado ==> retorna ele', async () => {
      var idUsuario = 367;
      var usuario = {
        id: idUsuario,
        password: "1234"
      };
      var usuarioEsperado = {
        id: idUsuario
      };

      jest.spyOn(userModel,'findByPk').mockImplementation(() => {
        delete usuario["password"];  
        return usuario
        }
    );

      var retorno = await userService.getCurrentUser(idUsuario);
      
      expect(retorno).toStrictEqual(usuarioEsperado);
    }
  );

  test('o usuário não é encontrado ==> lança exceção', async () => {
    var id = 3425;
    
    jest.spyOn(userModel,'findByPk').mockReturnValue(undefined);

    return expect(async () => {
      await userService.getCurrentUser(id);
    }).rejects.toThrow(new NotFoundError(`Nao foi encontrado um usuario com o ID: ${id}`));
  });
});

describe('createUser', () => {
  const bcrypt = require('bcrypt');

  test('os dados de usuário são passados como entrada ==> criptografa a senha', async () => { 
    const dadosUsuario = {
      id:20,
      name: "aureliano",
      password: "624hff8"
    }
    const saltRounds = 10;

    const bcryptHashSpy = jest.spyOn(bcrypt, 'hash').mockImplementation(
      () => {return "a hashed return"}
    );

    await userService.createUser(dadosUsuario);

    const primeiraChamadaBcrypt = bcryptHashSpy.mock.calls[0];
    expect(primeiraChamadaBcrypt).toEqual(expect.arrayContaining([dadosUsuario.password, saltRounds]));
  });

  test('a senha é criptografada ==> atualiza senha do usuário a ser criado', async () => {
    const senhaCriptografada = "senha criptografada";
    const dadosUsuario = {
      id:20,
      name: "aureliano",
      password: "624hff8"
    }
    dadosUsuario.password = senhaCriptografada;

    const userCriaNovaInstanciaSpy = jest.spyOn(userModel, 'criaNovaInstancia').mockImplementation(
      () => {return {create: () => {}}}
    );

    jest.spyOn(bcrypt, 'hash').mockReturnValue(senhaCriptografada);

    await userService.createUser(dadosUsuario);

    const dadosUsuarioDaChamada = userCriaNovaInstanciaSpy.mock.calls[0][0];
    expect(dadosUsuarioDaChamada).toEqual(dadosUsuario);
  });

  test('os dados de usuário são passados como entrada ==> cria este usuário no banco de dados', async () => {
    const dadosUsuario = {
      id:20,
      name: "aureliano",
      password: "624hff8"
    };
    const novoUsuario = {
      ...dadosUsuario,
      create: () => {}
    };

    jest.spyOn(userModel, 'criaNovaInstancia').mockReturnValue(novoUsuario);
    const novoUsuarioCreateSpy = jest.spyOn(novoUsuario, 'create').mockImplementation(
      () => {}
    );

    await userService.createUser(dadosUsuario);

    expect(novoUsuarioCreateSpy).toHaveBeenCalledTimes(1);
  });
});

describe('getAllUsers', () => {
  test('o método é executado ==> busca todos os usuários',
    async () => {
      var userFindAllSpy = jest.spyOn(userModel,'findAll').mockImplementation(
        () => {return []}
      );
      
      await userService.getAllUsers();

      expect(userFindAllSpy).toHaveBeenCalledTimes(1);
    }
  );

  test('o método é executado ==> retorna todos os usuários',
    async () => {
      const usuarios = [{
        name: 'jorge'
        },{
        name: 'ben'
        },{
        name: 'javi'
        }  
      ];

      jest.spyOn(userModel,'findAll').mockReturnValue(usuarios);

      return expect(userService.getAllUsers()).resolves.toEqual(expect.arrayContaining(usuarios));
    }
  );
});

describe('deleteUser', () => {
  test('o método recebe o id de um usuário ==> deleta esse usuário', async () => {
    const usuario = {
      id: 3,
      delete: () => {}
    };
    const usuarioDeletandoUser = {
      id: 2
    };

    jest.spyOn(userModel,'findByPk').mockImplementation(() => {
      return usuario;
    });
    var usuarioDeleteSpy = jest.spyOn(usuario, 'delete').mockImplementation(
      () => {}
    );
      
    await userService.deleteUser(usuario.id, usuarioDeletandoUser.id);

    expect(usuarioDeleteSpy).toHaveBeenCalledTimes(1);
  });

  test('um usuário não é encontrado ==> lança exceção', async () => {
    const id = 1;

    jest.spyOn(userModel,'findByPk').mockReturnValue(undefined);

    return expect(async () => {
      await userService.deleteUser(id);
    }).rejects.toThrow(new NotFoundError(`Nao foi encontrado um usuario com o ID: ${id}`));
  });

  test('o ID passado é igual ao ID do usuário requisitando ==> lança exceção', async () => {
    const id = 1;
    const reqUserId = 1;

    jest.spyOn(userModel,'findByPk').mockReturnValue({
      id: id
    });

    return expect(async () => {
      await userService.deleteUser(id, reqUserId);
    }).rejects.toThrow(new NotAuthorizedError('Você não tem permissão para se deletar!'));
  });

});
