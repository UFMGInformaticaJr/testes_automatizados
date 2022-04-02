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
        const userId = 1;

        var spyUserEncontrado = jest.spyOn(User,'findByPk');

        await userService.getUserById(userId);

        expect(spyUserEncontrado).toHaveBeenCalledTimes(1);
    }
);

  describe('Quando um id de um usuário é passado como parâmetro ==> retorna os dados não sensíveis do usuario', () => {
    test.each([
        { 
          user:{name: 'jorge',password: 'abcd'}, 
          valorEsperado:{name: 'jorge'}
        },
        { 
          user:{name: 'gabi', password: 'abcdefghashud'}, 
          valorEsperado:{name: 'gabi'}
        },
        { 
          user:{name: 'gabriel',password: 'abcdefghijk'},
          valorEsperado:{name: 'gabriel'} 
        },
        { 
          user:{name: 'bernardo',password: 'abc'}, 
          valorEsperado:{name: 'bernardo'}
        },
        {
          user:{name: 'vinicius',password: 'a'}, 
          valorEsperado:{name: 'vinicius'}
        },
      ])
    ('%j', ({user, valorEsperado}) => {
    
        jest.spyOn(User,'findByPk').mockImplementation( () => {
          delete user["password"];  
          return user;
          }
        );
        return expect(userService.getUserById(1)).resolves.toStrictEqual(valorEsperado);
    });
  });
  
  test('Quando um usuário não é encontrado ==> lança exceção', async () => {
    jest.spyOn(User,'findByPk').mockReturnValue(undefined);

    expect(async () => {
      const id = 1;
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
    var user = {
      id: 3,
      name: 'jorge',
      role: 'user',
      update: async (body) => {user.name = body.name}
    };

    const id = user.id,
    reqUserId = 3,
    reqUserRole = 'user', 
    body = {name: 'gabriel'}

    jest.spyOn(User,'findByPk').mockReturnValue(user);
    
    await userService.updateUser(id, reqUserId, reqUserRole, body);

    var nomeEsperado = 'gabriel'
    var userEsperado = {
      ...user
    };
    userEsperado.name = nomeEsperado;

    expect(user).toEqual(userEsperado);
  });

  test('Quando um usuário é admin ==> pode alterar a si mesmo', async () => {
    var user = {
      id: 3,
      name: 'jorge',
      role: 'admin',
      update: async (body) => {user.name = body.name}
    };
    const id = user.id,
    reqUserId = 3,
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
        const userId = 1;

        var spyUserEncontrado = jest.spyOn(User,'findByPk');

        await userService.getCurrentUser(userId);

        expect(spyUserEncontrado).toHaveBeenCalledTimes(1);
    }
);

  test('Quando o método recebe um id ==> busca usuário por esse id', async () => {
    var idUsuario = 1347;

    var spyGetCurrentUser = jest.spyOn(User,'findByPk');

    await userService.getCurrentUser(idUsuario);

    expect(spyGetCurrentUser.mock.calls[0][0]).toBe(idUsuario);
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

    const spyHash = jest.spyOn(bcrypt, 'hash');

    await userService.createUser(dadosUsuario);

    const primeiraChamadaBcrypt = spyHash.mock.calls[0];
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

    const spyCriaNovaInstancia = jest.spyOn(User, 'criaNovaInstancia');

    jest.spyOn(bcrypt, 'hash').mockReturnValue(senhaCriptografada);

    await userService.createUser(dadosUsuario);

    const dadosUsuarioDaChamada = spyCriaNovaInstancia.mock.calls[0][0];
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
    const spyCreate = jest.spyOn(novoUsuario, 'create');

    await userService.createUser(dadosUsuario);

    expect(spyCreate).toHaveBeenCalledTimes(1);
  });
});

describe('getAllUsers', () => {
  const User = require('../models/User');
  const UserService = require('./UserService');

  test('o método é executado ==> busca todos os usuários',
    async () => {
      var userFindAll = jest.spyOn(User,'findAll');
      
      await UserService.getAllUsers();

      expect(userFindAll).toHaveBeenCalledTimes(1);
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
    const user = {
      id: 3,
      delete: () => {}
    };
    const usuarioDeletandoUser = {
      id: 2
    };

    jest.spyOn(UserModel,'findByPk').mockImplementation(() => {
      return user;
    });
    var spyDelete = jest.spyOn(user, 'delete');
      
    await UserService.deleteUser(user.id, usuarioDeletandoUser.id);

    expect(spyDelete).toHaveBeenCalledTimes(1);
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
