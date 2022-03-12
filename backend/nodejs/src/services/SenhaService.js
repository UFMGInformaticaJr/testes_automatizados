const User = require('../models/User');

class SenhaService {
    /**
   * Retorna booleano
   */
  async senhaFraca(userId) {
    const id = parseInt(userId);    
    if (isNaN(id) || id < 0) {
      throw new TypeError('Id inválido');
    }
    const user = await User.findByPk(id);

    if (!user) throw new Error('Usuário não encontrado');
    
    let senhaFraca = false;
    if (user.password.length < 8) {
      senhaFraca = true;
    } else {
      senhaFraca = false;
    }
    return senhaFraca;
  }
}

module.exports = new SenhaService();
