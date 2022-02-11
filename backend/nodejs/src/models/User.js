class User {
  id = 1;
  name = '';
  password = '';
  instance = false;

  constructor(id, name, password) {
    this.id = id | 1;
    this.name = name;
    this.password = password;
    this.instance = id && name && password ? true : false;
  }

  async create() {
    if (this.instance) 
      return this;
    throw new Error('Esse método deve ser chamada a partir de uma instância.')
  }

  async findAll(conditions) {
    if (this.instance)
      throw new Error('Você não pode fazer isso a partir de uma instância');

    return [new User(1, 'jorge', 'abcd'), new User(2, 'maria', '1234')];
  }

  async findByPk(id, conditions) {
    if (this.instance)
      throw new Error('Você não pode fazer isso a partir de uma instância');

    return new User(id, 'jorge', 'abcd');
  }

  async update(body) {
    if(!this.instance)  
      throw new Error('Esse método deve ser chamada a partir de uma instância.')
    this.name = body.name | this.name;
    this.password = body.password | this.password;
    return this;
  }

  async delete(id) {
    // Apenas separando os casos pra possíveis futuros incrementos
    if(this.instance) return;
    return;
  }
}

module.exports = new User();
