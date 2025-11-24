// src/models/CursoModel.js
const { DataTypes } = require('sequelize');
const validator = require('validator');
const sequelize = require('../database/sequelize');

// Modelo Sequelize
const CursoModel = sequelize.define('Curso', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nome do curso é obrigatório'
      }
    }
  },
  codigo: { 
    type: DataTypes.STRING, 
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Código do curso é obrigatório'
      }
    }
  },
  descricao: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  duracao: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    validate: {
      isInt: {
        msg: 'Duração deve ser um número inteiro'
      }
    }
  },
  ativo: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, {
  timestamps: true,
  createdAt: 'criadoEm',
  updatedAt: 'atualizadoEm',
  modelName: 'Curso',
  tableName: 'cursos'
});


function Curso(body) {
  this.body = body;
  this.errors = [];
  this.curso = null;
}


Curso.prototype.register = async function() {
  try {
    console.log('Validando curso para registro...');
    this.valida();
    if(this.errors.length > 0) {
      console.log('Erros de validação encontrados:', this.errors);
      return;
    }
    
    console.log('Dados validados para criar curso:', this.body);
    
    this.curso = await CursoModel.create(this.body);
    console.log('Curso criado com sucesso. ID:', this.curso.id);
    
  } catch (error) {
    console.log('Erro no register do CursoModel:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      this.errors.push('Código do curso já existe');
    } else if (error.name === 'SequelizeValidationError') {
      error.errors.forEach(err => {
        this.errors.push(err.message);
      });
    } else {
      this.errors.push('Erro ao criar curso no banco de dados');
    }
  }
};

Curso.prototype.valida = function() {
  this.cleanUp();

  console.log('Validando dados:', this.body);

  if(!this.body.nome || this.body.nome.trim() === '') {
    this.errors.push('Nome do curso é obrigatório');
  }
  if(!this.body.codigo || this.body.codigo.trim() === '') {
    this.errors.push('Código do curso é obrigatório');
  }
  if(this.body.duracao && !validator.isInt(this.body.duracao.toString())) {
    this.errors.push('Duração deve ser um número válido');
  }
  
  console.log('Validação concluída. Erros:', this.errors.length);
};


Curso.prototype.cleanUp = function() {
  console.log('Limpando dados do curso recebidos:', this.body);
  
  
  console.log('Valor original de ativo:', this.body.ativo, 'Tipo:', typeof this.body.ativo);
  
  
  const cleanedBody = {
    nome: this.body.nome ? this.body.nome.trim() : '',
    codigo: this.body.codigo ? this.body.codigo.trim() : '',
    descricao: this.body.descricao ? this.body.descricao.trim() : '',
    duracao: this.body.duracao ? parseInt(this.body.duracao) || null : null,
  };

  // CORREÇÃO: Lógica para definir o campo ativo
  if (this.body.ativo !== undefined && this.body.ativo !== null) {
    if (typeof this.body.ativo === 'string') {
      cleanedBody.ativo = this.body.ativo === 'true' || this.body.ativo === 'on';
    } else if (typeof this.body.ativo === 'boolean') {
      cleanedBody.ativo = this.body.ativo;
    } else {
      cleanedBody.ativo = Boolean(this.body.ativo);
    }
  } else {
    // Se não foi enviado, assume true (ativo por padrão)
    cleanedBody.ativo = true;
  }

  console.log('Dados do curso limpos:', cleanedBody);
  console.log('Campo ativo definido como:', cleanedBody.ativo);
  this.body = cleanedBody;
};

Curso.prototype.edit = async function(id) {
  try {
    console.log('Editando curso ID:', id);
    
    this.valida();
    if(this.errors.length > 0) {
      console.log('Erros de validação na edição:', this.errors);
      return;
    }
    
    const [numAffectedRows] = await CursoModel.update(this.body, {
      where: { id: id }
    });
    
    console.log('Linhas afetadas na edição:', numAffectedRows);
    
    if (numAffectedRows === 0) {
      this.errors.push('Curso não encontrado para edição');
      return;
    }
    
    this.curso = await CursoModel.findByPk(id);
    console.log('Curso atualizado:', this.curso ? this.curso.nome : 'Não encontrado');
    
  } catch (error) {
    console.log('Erro no edit do CursoModel:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      this.errors.push('Código do curso já existe');
    } else if (error.name === 'SequelizeValidationError') {
      error.errors.forEach(err => {
        this.errors.push(err.message);
      });
    } else {
      this.errors.push('Erro ao editar curso');
    }
  }
};

// Métodos estáticos
Curso.buscaPorId = async function(id) {
  try {
    console.log('Buscando curso por ID:', id);
    if(typeof id !== 'number' && typeof id !== 'string') return null;
    
    const curso = await CursoModel.findByPk(id);
    console.log('Curso encontrado:', curso ? curso.nome : 'Nenhum');
    return curso;
  } catch (error) {
    console.log('Erro em buscaPorId:', error);
    return null;
  }
};

Curso.buscaCursos = async function() {
  try {
    console.log('Buscando todos os cursos...');
    
    const cursos = await CursoModel.findAll({
      order: [['criadoEm', 'DESC']]
    });
    
    console.log(`Encontrados ${cursos ? cursos.length : 0} cursos`);
    return cursos || [];
  } catch (error) {
    console.log('Erro em buscaCursos:', error);
    return [];
  }
};

Curso.buscaCursosAtivos = async function() {
  try {
    console.log('Buscando cursos ativos...');
    
    const cursos = await CursoModel.findAll({
      where: { ativo: true },
      order: [['nome', 'ASC']]
    });
    
    console.log(`Encontrados ${cursos ? cursos.length : 0} cursos ativos`);
    return cursos || [];
  } catch (error) {
    console.log('Erro em buscaCursosAtivos:', error);
    return [];
  }
};

Curso.delete = async function(id) {
  try {
    console.log('Deletando curso ID:', id);
    if(typeof id !== 'number' && typeof id !== 'string') return null;
    
    const curso = await CursoModel.findByPk(id);
    if (curso) {
      await curso.destroy();
      console.log('Curso deletado:', curso.nome);
    } else {
      console.log('Curso não encontrado para deletar');
    }
    return curso;
  } catch (error) {
    console.log('Erro em delete:', error);
    return null;
  }
};

module.exports = Curso;