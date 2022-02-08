const User = require('../models/User');
const bcrypt = require('bcrypt');
const NotAuthorizedError = require('../errors/index');

class UserService {
  async createUser(user) {
    const saltRounds = 10;

    user.password = await bcrypt.hash(user.password, saltRounds);

    User.create(user);
  }

  getAllUsers() {
    return User.findAll({raw: true, attributes:
      {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
    });
  }

  getUserById(id) {
    const user = User.findByPk(id, {raw: true, attributes:
      {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
    });
    if (!user) {
      throw new NotAuthorizedError(`Nao foi encontrado um usuario com o ID: ${id}`);
    }

    return user;
  }

  updateUser(id, reqUserId, reqUserRole, body) {
    const user = User.findByPk(id);

    if (!user) {
      throw new NotAuthorizedError(`Nao foi encontrado um usuario com o ID: ${id}`);
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

  deleteUser(id, reqUserId) {
    const user = User.findByPk(id);

    if (!user) {
      throw new NotAuthorizedError(`Nao foi encontrado um usuario com o ID: ${id}`);
    }

    if (id == reqUserId) {
      throw new NotAuthorizedError('Você não tem permissão para se deletar!');
    }
    user.destroy();
  }

  getCurrentUser(id) {
    const user = User.findByPk(id, {attributes:
      {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
    });
    if (!user) {
      throw new NotAuthorizedError(`Nao foi encontrado um usuario com o ID: ${id}`);
    }
    return user;
  }
}
module.exports = new UserService;