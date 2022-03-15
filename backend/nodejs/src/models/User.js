class User {
  id = 1;
  name = '';
  password = '';
  classificacao_etaria = 'crianca';
  age = 1;
  instance = false;

  constructor(id, name, password, classificacao_etaria, age) {
    this.id = id | 1;
    this.name = name;
    this.password = password;
    if(classificacao_etaria === 'adulto' || classificacao_etaria === 'adolescente' || classificacao_etaria === 'crianca'){
      this.classificacao_etaria = classificacao_etaria;
    }
    this.age = age;
    this.instance = id && name && password ? true : false;
  }

  async criaNovaInstancia(userObj){
    return new User(userObj.id, userObj.name, userObj.password);
  }

  async create() {
    if (this.instance) 
      return this;
    throw new Error('Esse método deve ser chamado a partir de uma instância.')
  }

  async findAll(conditions) {
    if (this.instance)
      throw new Error('Você não pode fazer isso a partir de uma instância');

    return [new User(1, 'jorge', 'abcd', 'adolescente', 15), new User(2, 'maria', '1234', 'adulto', 30)];
  }

  async findByPk(id, conditions) {
    if (this.instance)
      throw new Error('Você não pode fazer isso a partir de uma instância');

    return new User(id, 'jorge', 'abcd', 'adolescente', 15);
  }

  async update(body) {
    if(!this.instance)  
      throw new Error('Esse método deve ser chamada a partir de uma instância.')
    this.name = body.name | this.name;
    this.password = body.password | this.password;
    if(this.classificacao_etaria === 'adulto' || this.classificacao_etaria === 'adolescente' || this.classificacao_etaria === 'crianca'){
      this.classificacao_etaria = body.classificacao_etaria | this.classificacao_etaria;
    }
    this.age = body.age | this.age;
    return this;
  }

  async delete(id) {
    // Apenas separando os casos pra possíveis futuros incrementos
    if(this.instance) return;
    return;
  }
}

module.exports = new User();
