const bcrypt = require('bcrypt');
const NotAuthorizedError = require('../errors/index');

class UserService {
  async createUser(user) {
    const saltRounds = 10;

    user.password = await bcrypt.hash(user.password, saltRounds);

    await User.create(user);
  }

  async getAllUsers() {
    return await User.findAll({raw: true, attributes:
      {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
    });
  }

  async getUserById(id) {
    const user = await User.findByPk(id, {raw: true, attributes:
      {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
    });
    if (!user) {
      throw new QueryError(`Nao foi encontrado um usuario com o ID: ${id}`);
    }

    return user;
  }

  async updateUser(id, reqUserId, reqUserRole, body) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new QueryError(`Nao foi encontrado um usuario com o ID: ${id}`);
    }

    const isAdmin = reqUserRole === 'admin';
    const isUpdatedUser = reqUserId == id;

    if (isAdmin || isUpdatedUser) {
      if (!isAdmin && body.role) {
        throw new NotAuthorizedError(
          'Você não tem permissão para mudar seu papel de usuário');
      }
      await user.update(body);
    } else {
      throw new NotAuthorizedError(
        'Você não tem permissão para atualizar esse usuário');
    }
  }

  async deleteUser(id, reqUserId) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new QueryError(`Nao foi encontrado um usuario com o ID: ${id}`);
    }

    if (id == reqUserId) {
      throw new NotAuthorizedError('Você não tem permissão para se deletar!');
    }
    await user.destroy();
  }

  async getCurrentUser(id) {
    const user = await User.findByPk(id, {attributes:
      {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
    });
    if (!user) {
      throw new QueryError(`Nao foi encontrado um usuario com o ID: ${id}`);
    }
    return user;
  }
}
module.exports = new UserService;