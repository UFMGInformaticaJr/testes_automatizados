const {NotFoundError} = require('../errors');

describe('Testando getUserById', () => {
  describe('Quando um id de um usuário é passado como parâmetro, retorna os dados do usuario', () => {
      const User = require('../models/User');
      const userService = require('./UserService');

      beforeEach(() => {
          jest.restoreAllMocks();
          jest.clearAllMocks();
      });

      test.concurrent.each([
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
