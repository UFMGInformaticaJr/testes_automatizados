const bcrypt = require('bcrypt');
const {NotFoundError, NotAuthorizedError} = require('../errors');
const User = require('../models/User');
const SenhaService = require('./SenhaService')

class UserService {
  async createUser(userObj) {
    const saltRounds = 10;

    var dadosNovoUsuario = {...userObj}
    dadosNovoUsuario.password = await bcrypt.hash(userObj.password, saltRounds);

    const user = await User.criaNovaInstancia(dadosNovoUsuario);
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

  async reqUserDeleteUser(id, reqUserId) {
    const user = await User.findByPk(id);

    if (!user) {
      throw new NotFoundError(
        `Nao foi encontrado um usuario com o ID: ${id}`
      );
    }

    if (id == reqUserId) {
      throw new NotAuthorizedError('Você não tem permissão para se deletar!');
    }
    await user.delete();
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

  /**
   * Retorna uma lista de objetos baseada em resultado de outra função
   */
   async usersComSenhaFraca() {
    const users = await User.findAll();
    let usuariosComSenhaFraca = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (await SenhaService.senhaFraca(user.id)) {
        usuariosComSenhaFraca.push(user);
      }
    }
    return usuariosComSenhaFraca;
  }

  /**
   * Chama outras funções mas não retorna nada
   */
   async deleteBy(id) {
    const user = await User.findByPk(id);
    await user.delete();
  }

  /**
   * Retorna uma lista de lista objetos
   */
   async idsComMesmoNome() {
    const users = await User.findAll();
    let nomes = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      let ids = [];
      for (let j = 0; j < users.length; j++) {
        const user2 = users[j];
        if (user.name === user2.name) {
          ids.push(user2.id);
        }
      }
      nomes[i] = ids;
    }
    return nomes;
  }

  /**
    * Retorna uma string com uma lógica interna sobre o que essa string pode ser
    */
  async getNameById(id){
    const user = await User.findByPk(id);
    if( user.name[0]==='a' || user.name[0]==='e' || user.name[0]==='i' || user.name[0]==='o' || user.name[0] === 'u' ){
      return "O nome do usuário começa com vogal (" + user.name + ")";
    }
    return "O nome do usuário começa com consoante (" + user.name + ")";
  }

  /**
    * Retorna um objeto com valores preenchidos internamente
    */
  async updateClassificacaoEtariaById(id){
    const user = await User.findByPk(id);
    let nova_classificacao_etaria;

    if (!user) {
      throw new NotFoundError(
        `Nao foi encontrado um usuario com o ID: ${id}`
      );
    }

    if(user.age>=0 && user.age<=12 ){
      nova_classificacao_etaria = "crianca";
    } else if(user.age>12 && user.age<18){
      nova_classificacao_etaria = "adolescente";
    } else if(user.age>=18){
      nova_classificacao_etaria = "adulto";
    }

    let new_user = {name: this.name, 
      password: this.password, 
      classificacao_etaria: nova_classificacao_etaria,
      age: this.age}

    await user.update(new_user);

    return user;
  }

}


module.exports = new UserService();
