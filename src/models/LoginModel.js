// Login.js (Adaptado para Sequelize)
const { DataTypes } = require('sequelize');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const sequelize = require('../database/sequelize'); // Ajuste o caminho

// 1. Definição do Modelo (Schema) usando Sequelize
const LoginModel = sequelize.define('Login', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
}, {
  timestamps: false,
  modelName: 'Login',
  tableName: 'logins'
});

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null; // Agora armazenará a instância Sequelize
  }
  
  // MÉTODOS DE INSTÂNCIA
  // ===========================================

  async login() {
    this.valida();
    if(this.errors.length > 0) return;
    
    // Mongoose: findOne
    this.user = await LoginModel.findOne({ where: { email: this.body.email } });

    if(!this.user) {
      this.errors.push('Usuário não existe.');
      return;
    }

    // Acessa o password através da instância do Sequelize (this.user.password)
    if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida');
      this.user = null;
      return;
    }
  }

  async register() {
    this.valida();
    if(this.errors.length > 0) return;

    await this.userExists();

    if(this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    // Mongoose: create
    this.user = await LoginModel.create(this.body);
  }

  async userExists() {
    // Mongoose: findOne
    this.user = await LoginModel.findOne({ where: { email: this.body.email } });
    if(this.user) this.errors.push('Usuário já existe.');
  }

  // Métodos valida e cleanUp permanecem iguais, pois manipulam apenas this.body
  // ... (valida e cleanUp aqui) ...
  valida() {
    this.cleanUp();

    // Validação
    if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');

    if(this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
    }
  }

  cleanUp() {
    for(const key in this.body) {
      if(typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password
    };
  }
}

module.exports = Login;