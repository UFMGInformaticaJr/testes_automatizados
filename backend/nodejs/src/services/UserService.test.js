const {NotFoundError, NotAuthorizedError} = require('../errors');
const { password } = require('../models/User');

describe('getUserById', () => {
  const User = require('../models/User');
  const userService = require('./UserService');

  beforeEach(() => {
      jest.restoreAllMocks();
      jest.clearAllMocks();
  });

  test(
    'Quando o método recebe o id de um usuário ==> busca o usuário com o id informado',
    async () => {
        const idUsuario = 1;

        var userFindByPkSpy = jest.spyOn(User,'findByPk');

        await userService.getUserById(idUsuario);

        expect(userFindByPkSpy).toHaveBeenCalledTimes(1);
    }
);

  describe('Quando um id de um usuário é passado como parâmetro ==> retorna os dados não sensíveis do usuario', () => {
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
    
        jest.spyOn(User,'findByPk').mockImplementation( () => {
          delete usuario["password"];  
          return usuario;
          }
        );
        return expect(userService.getUserById(1)).resolves.toStrictEqual(retornoEsperado);
    });
  });
  
  test('Quando um usuário não é encontrado ==> lança exceção', async () => {
    const id = 1;
    
    jest.spyOn(User,'findByPk').mockReturnValue(undefined);

    return expect(async () => {
      await userService.getUserById(id);
    }).rejects.toThrow(NotFoundError);
  });
});

describe('updateUser', () => {
  const User = require('../models/User');
  const userService = require('./UserService');

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test('Quando um usuário não é encontrado ==> lança exceção', async () => {
    const id = 1,
    reqUserId = 2,
    reqUserRole = 'admin', 
    body = {
      name: 'julio'
    }
    
    jest.spyOn(User,'findByPk').mockReturnValue(undefined);

    return expect(async () => {
      await userService.updateUser(id, reqUserId, reqUserRole, body);
    }).rejects.toThrow(NotFoundError);
  });

  test('Quando um usuário não é admin porém quer mudar seu próprio role ==> lança exceção', async () => {
    const id = 1, 
    reqUserId = 1,
    reqUserRole = 'user', 
    body = {
      role: 'admin'
    }

    jest.spyOn(User,'findByPk');

    return expect(async () => {
      await userService.updateUser(id, reqUserId, reqUserRole, body);
    }).rejects.toThrow(NotAuthorizedError);
  });

  test('Quando um usuário não é admin porém quer atualizar outro usuário ==> lança exceção', async () => {
    const id = 1,
    reqUserId = 2,
    reqUserRole = 'user', 
    body = { 
      role: 'admin'
    }

    jest.spyOn(User,'findByPk');

    return expect(async () => {
      await userService.updateUser(id, reqUserId, reqUserRole, body);
    }).rejects.toThrow(NotAuthorizedError);
  });

  test('Quando um usuário é admin ==> pode alterar outro usuario', async () => {
    var user = {
      id: 3,
      name: 'jorge',
      role: 'user',
      update: async (body) => {user.name = body.name}
    };

    const id = user.id,
    reqUserId = 10,
    reqUserRole = 'admin', 
    body = {name: 'gabriel'}

    var nomeEsperado = 'gabriel'
    var userEsperado = {
      ...user
    };
    userEsperado.name = nomeEsperado;

    jest.spyOn(User,'findByPk').mockReturnValue(user);
    
    await userService.updateUser(id, reqUserId, reqUserRole, body);

    expect(user).toEqual(userEsperado);
  });

  test('Quando um usuário é user ==> pode alterar a si mesmo', async () => {
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

    jest.spyOn(User,'findByPk').mockReturnValue(usuario);
    
    await userService.updateUser(id, reqUserId, reqUserRole, body);

    expect(usuario).toEqual(usuarioEsperado);
  });

  test('Quando um usuário é admin ==> pode alterar a si mesmo', async () => {
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

    jest.spyOn(User,'findByPk').mockReturnValue(usuario);
    
    await userService.updateUser(id, reqUserId, reqUserRole, body);

    expect(usuario).toEqual(userEsperado);
  });
});

describe('getCurrentUser', () => {
  const User = require('../models/User');
  const userService = require('./UserService');

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test(
    'Quando o método recebe o id de um usuário ==> busca o usuário com o id informado',
    async () => {
        const idUsuario = 1;

        var userFindByPkSpy = jest.spyOn(User,'findByPk');

        await userService.getCurrentUser(idUsuario);

        expect(userFindByPkSpy).toHaveBeenCalledTimes(1);
    }
);

  test('Quando o método recebe um id ==> busca usuário por esse id', async () => {
    var idUsuario = 1347;

    var userFindByPkSpy = jest.spyOn(User,'findByPk');

    await userService.getCurrentUser(idUsuario);

    expect(userFindByPkSpy.mock.calls[0][0]).toBe(idUsuario);
  });

  test('Quando um usuário é encontrado ==> retorna ele', async () => {
      var idUsuario = 367;
      var usuario = {
        id: idUsuario,
        password: "1234"
      };
      var usuarioEsperado = {
        id: idUsuario
      };

      jest.spyOn(User,'findByPk').mockImplementation(() => {
        delete usuario["password"];  
        return usuario
        }
    );

      var retorno = await userService.getCurrentUser(idUsuario);
      
      expect(retorno).toStrictEqual(usuarioEsperado);
    }
  );

  test('Quando um usuário não é encontrado ==> lança exceção', async () => {
    var id = 3425;
    
    jest.spyOn(User,'findByPk').mockReturnValue(undefined);

    return expect(async () => {
      await userService.getCurrentUser(id);
    }).rejects.toThrow(NotFoundError);
  });
});

describe('createUser', () => {
  const User = require('../models/User');
  const userService = require('./UserService');
  const bcrypt = require('bcrypt');

  test('Quando os dados de usuário são passados como entrada ==> criptografa a senha', async () => { 
    const dadosUsuario = {
      id:20,
      name: "aureliano",
      password: "624hff8"
    }
    const saltRounds = 10;

    const bcryptHashSpy = jest.spyOn(bcrypt, 'hash');

    await userService.createUser(dadosUsuario);

    const primeiraChamadaBcrypt = bcryptHashSpy.mock.calls[0];
    expect(primeiraChamadaBcrypt).toEqual(expect.arrayContaining([dadosUsuario.password, saltRounds]));
  });

  test('Quando a senha é criptografada ==> atualiza senha do usuário a ser criado', async () => {
    const senhaCriptografada = "senha criptografada";
    const dadosUsuario = {
      id:20,
      name: "aureliano",
      password: "624hff8"
    }
    dadosUsuario.password = senhaCriptografada;

    const userCriaNovaInstanciaSpy = jest.spyOn(User, 'criaNovaInstancia');

    jest.spyOn(bcrypt, 'hash').mockReturnValue(senhaCriptografada);

    await userService.createUser(dadosUsuario);

    const dadosUsuarioDaChamada = userCriaNovaInstanciaSpy.mock.calls[0][0];
    expect(dadosUsuarioDaChamada).toEqual(dadosUsuario);
  });

  test('Quando os dados de usuário são passados como entrada ==> cria este usuário no banco de dados', async () => {
    const dadosUsuario = {
      id:20,
      name: "aureliano",
      password: "624hff8"
    };
    const novoUsuario = {
      ...dadosUsuario,
      create: () => {}
    };

    jest.spyOn(User, 'criaNovaInstancia').mockReturnValue(novoUsuario);
    const novoUsuarioCreateSpy = jest.spyOn(novoUsuario, 'create');

    await userService.createUser(dadosUsuario);

    expect(novoUsuarioCreateSpy).toHaveBeenCalledTimes(1);
  });
});

describe('getAllUsers', () => {
  const User = require('../models/User');
  const UserService = require('./UserService');

  test('o método é executado ==> busca todos os usuários',
    async () => {
      var userFindAllSpy = jest.spyOn(User,'findAll');
      
      await UserService.getAllUsers();

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

      jest.spyOn(User,'findAll').mockReturnValue(usuarios);
      
      return expect(UserService.getAllUsers()).resolves.toEqual(expect.arrayContaining(usuarios));
    }
  );
});

describe('deleteUser', () => {
  const UserModel = require('../models/User');

  const UserService = require('./UserService');
  test('o método recebe o id de um usuário ==> deleta esse usuário', async () => {
    const usuario = {
      id: 3,
      delete: () => {}
    };
    const usuarioDeletandoUser = {
      id: 2
    };

    jest.spyOn(UserModel,'findByPk').mockImplementation(() => {
      return usuario;
    });
    var usuarioDeleteSpy = jest.spyOn(usuario, 'delete');
      
    await UserService.deleteUser(usuario.id, usuarioDeletandoUser.id);

    expect(usuarioDeleteSpy).toHaveBeenCalledTimes(1);
  });

  test('um usuário não é encontrado ==> lança exceção', async () => {
    const id = 1;

    jest.spyOn(UserModel,'findByPk').mockReturnValue(undefined);

    return expect(async () => {
      await UserService.deleteUser(id);
    }).rejects.toThrow(NotFoundError);
  });

  test('o ID passado é igual ao ID do usuário requisitando ==> lança exceção', async () => {
    const id = 1;
    const reqUserId = 1;

    jest.spyOn(UserModel,'findByPk').mockReturnValue({
      id: id
    });

    return expect(async () => {
      await UserService.deleteUser(id, reqUserId);
    }).rejects.toThrow(NotAuthorizedError);
  });

});
