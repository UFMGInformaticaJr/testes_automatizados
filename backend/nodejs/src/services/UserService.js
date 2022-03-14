// const bcrypt = require('bcrypt');
const {NotFoundError, NotAuthorizedError} = require('../errors');
const User = require('../models/User');

class UserService {
  async createUser(userObj) {
    const saltRounds = 10;

    // Possivelmente abstrair também o bcrypt
    const password = await bcrypt.hash(user.password, saltRounds);
    
    const user = new User(userObj.id, userObj.name, password);
    await user.create();
  }

  async getAllUsers() {
    return await User.findAll({
      raw: true,
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
    });
  }

  async getUserById(id) {
    const user = await User.findByPk(id, {
      raw: true,
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
    });
    if (!user) {
      throw new NotFoundError(
        `Nao foi encontrado um usuario com o ID: ${id}`
      );
    }

    return user;
  }

  async updateUser(id, reqUserId, reqUserRole, body) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new NotFoundError(
        `Nao foi encontrado um usuario com o ID: ${id}`
      );
    }

    const isAdmin = reqUserRole === 'admin';
    const isUpdatedUser = reqUserId == id;

    if (isAdmin || isUpdatedUser) {
      if (!isAdmin && body.role) {
        throw new NotAuthorizedError(
          'Você não tem permissão para mudar seu papel de usuário'
        );
      }
      await user.update(body);
    } else {
      throw new NotAuthorizedError(
        'Você não tem permissão para atualizar esse usuário'
      );
    }
  }

  async deleteUser(id, reqUserId) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new NotFoundError(
        `Nao foi encontrado um usuario com o ID: ${id}`
      );
    }

    if (id == reqUserId) {
      throw new NotAuthorizedError('Você não tem permissão para se deletar!');
    }
    await User.delete(id);
  }

  async getCurrentUser(id) {
    const user = await User.findByPk(id, {
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
    });
    if (!user) {
      throw new NotFoundError(
        `Nao foi encontrado um usuario com o ID: ${id}`
      );
    }
    return user;
  }
}
module.exports = new UserService();
