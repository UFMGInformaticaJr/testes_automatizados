const {NotFoundError, NotAuthorizedError} = require('../errors');

describe('Testando getUserById', () => {
  const User = require('../models/User');
  const userService = require('./UserService');

  beforeEach(() => {
      jest.restoreAllMocks();
      jest.clearAllMocks();
  });

  describe('Quando um id de um usuário é passado como parâmetro, retorna os dados do usuario', () => {
    test.each([
        [ 
          {
            name: 'jorge',
            password: 'abcd',
            classificacao_etaria: 'adolescente',
            age: 15
          }, 
          { 
            name: 'jorge',
            classificacao_etaria: 'adolescente',
            age: 15,
          }
        ],
        [ 
          {
            name: 'gabi',
            password: 'abcdefghashud',
            classificacao_etaria: 'adolescente',
            age: 16,
          }, 
          {
            name: 'gabi',
            classificacao_etaria: 'adolescente',
            age: 16,
          }
        ],
        [ 
          {
            name: 'gabriel',
            password: 'abcdefghijk',
            classificacao_etaria: 'adolescente',
            age: 17,
          },
          {
            name: 'gabriel',
            classificacao_etaria: 'adolescente',
            age: 17,
          } 
        ],
        [ 
          {
            name: 'bernardo',
            password: 'abc',
            classificacao_etaria: 'adolescente',
            age: 17,
          }, 
          {
            name: 'bernardo',
            classificacao_etaria: 'adolescente',
            age: 17,
          }
        ],
        [
          {
            name: 'vinicius',
            password: 'a',
            classificacao_etaria: 'adolescente',
            age: 14,
          }, 
          {
            name: 'vinicius',
            classificacao_etaria: 'adolescente',
            age: 14,
          }
        ],
      ])
    ('.getUserById(%p)', (user, valorEsperado) => {
        // jest.mock
        jest.spyOn(User,'findByPk').mockImplementation( () => {
          delete user["password"];  
          return user;
          }
        );
        expect(userService.getUserById(1)).resolves.toStrictEqual(valorEsperado);
    });
  });
  
  test('Quando um usuário não é encontrado, lança exceção', async () => {
    jest.spyOn(User,'findByPk').mockReturnValue(undefined);

    expect(async () => {
      const id = 1;
      await userService.getUserById(id);
    }).rejects.toThrow(NotFoundError);
  });
});

describe('Testando getCurrentUser', () => {
  const User = require('../models/User');
  const userService = require('./UserService');

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test('Quando o método recebe um id, busca usuário por esse id', async () => {
    var spyGetCurrentUser = jest.spyOn(User,'findByPk');
    var idUsuario = 1347;

    await userService.getCurrentUser(idUsuario);

    expect(spyGetCurrentUser.mock.calls[0][0]).toBe(idUsuario);
  });

  test('Quando um usuário é encontrado, retorna ele', async () => {
      var idUsuario = 367;
      var usuario = {
        id: idUsuario,
        name: "nicolas"
      };

      jest.spyOn(User,'findByPk').mockReturnValue(usuario);

      var retorno = await userService.getCurrentUser(idUsuario);
      
      expect(retorno).toStrictEqual(usuario);
    }
  );

  test('Quando um usuário não é encontrado, lança exceção', async () => {
    jest.spyOn(User,'findByPk').mockReturnValue(undefined);

    expect(async () => {
      var id = 3425;
      await userService.getCurrentUser(id);
    }).rejects.toThrow(NotFoundError);
  });
});

describe('Testando createUser', () => {
  const User = require('../models/User');
  const userService = require('./UserService');
  const bcrypt = require('bcrypt');

  test('Quando os dados de usuário são passados como entrada, criptografa a senha', async () => {
    var spyHash = jest.spyOn(bcrypt, 'hash');

    var dadosUsuario = {
      id:20,
      name: "aureliano",
      password: "624hff8"
    }

    await userService.createUser(dadosUsuario);

    var saltRounds = 10;
    expect(spyHash.mock.calls[0]).toEqual(expect.arrayContaining([dadosUsuario.password, saltRounds]));
  });

  test('Quando a senha é criptografada, atualiza senha do usuário a ser criado', async () => {
    var senhaCriptografada = "senha criptografada";
    jest.spyOn(bcrypt, 'hash').mockReturnValue(senhaCriptografada);

    var spyCriaNovaInstancia = jest.spyOn(User, 'criaNovaInstancia');

    var dadosUsuario = {
      id:20,
      name: "aureliano",
      password: "624hff8"
    }

    await userService.createUser(dadosUsuario);

    dadosUsuario.password = senhaCriptografada;
    expect(spyCriaNovaInstancia.mock.calls[0][0]).toEqual(dadosUsuario);
  });

  test('Quando os dados de usuário são passados como entrada, cria este usuário no banco de dados', async () => {
    var dadosUsuario = {
      id:20,
      name: "aureliano",
      password: "624hff8"
    };
    
    var novoUsuario = {
      ...dadosUsuario,
      create: () => {}
    };

    jest.spyOn(User, 'criaNovaInstancia').mockReturnValue(novoUsuario);
    var spyCreate = jest.spyOn(novoUsuario, 'create');

    await userService.createUser(dadosUsuario);

    expect(spyCreate).toHaveBeenCalledTimes(1);
  });
});
describe('Testando getAllUsers', () => {
  const User = require('../models/User');
  const UserService = require('./UserService');

  test('Quando o método é executado, busca todos os usuários',
    async () => {
      var userFindAll = jest.spyOn(User,'findAll');
      
      await UserService.getAllUsers();

      expect(userFindAll).toHaveBeenCalledTimes(1);
    }
  );

  test('Quando o método é executado, retorna todos os usuários',
    async () => {
      const usuario = {
        name: 'jorge',
        password: 'abcd',
        classificacao_etaria: 'adolescente',
        age: 15,
      };
      jest.spyOn(User,'findAll').mockReturnValue(usuario);
      
      expect(UserService.getAllUsers()).resolves.toStrictEqual(usuario);
    }
  );
});

describe('Testando deleteUser', () => {
  const UserModel = require('../models/User');

  const UserService = require('./UserService');
  test('Quando o método recebe o id de um usuário, deleta esse usuário', async () => {
    const user = {
      id: 3,
      name: 'jorge',
      password: 'abcd',
      classificacao_etaria: 'adolescente',
      age: 15,
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

  test('Quando um usuário não é encontrado, lança exceção', async () => {
    jest.spyOn(UserModel,'findByPk').mockReturnValue(undefined);

    expect(async () => {
      const id = 1;
      await UserService.deleteUser(id);
    }).rejects.toThrow(NotFoundError);
  });

  test('Quando o ID passado é igual ao ID do usuário requisitando, lança exceção', async () => {
    jest.spyOn(UserModel,'findByPk').mockReturnValue({
      name: 'jorge',
      password: 'abcd',
      classificacao_etaria: 'adolescente',
      age: 15,
    });

    expect(async () => {
      const id = 1;
      const reqUserId = 1;
      await UserService.deleteUser(id, reqUserId);
    }).rejects.toThrow(NotAuthorizedError);
  });

});
