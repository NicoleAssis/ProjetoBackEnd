// src/models/AlunoModel.js
const { DataTypes } = require('sequelize');
const validator = require('validator');
const sequelize = require('../database/sequelize');


const AlunoModel = sequelize.define('Aluno', {
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
        msg: 'Nome é obrigatório'
      }
    }
  },
  sobrenome: { 
    type: DataTypes.STRING, 
    allowNull: true, 
    defaultValue: '' 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: true, 
    defaultValue: '',
    validate: {
      isEmail: {
        msg: 'E-mail inválido'
      }
    }
  },
  curso_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true
  },
}, {
  timestamps: true,
  createdAt: 'criadoEm',
  updatedAt: false,
  modelName: 'Aluno',
  tableName: 'alunos'
});

// Classe principal Aluno
function Aluno(body) {
  this.body = body;
  this.errors = [];
  this.Aluno = null;
}


Aluno.prototype.register = async function() {
  try {
    console.log('=== REGISTER - Validando aluno para registro ===');
    this.valida();
    if(this.errors.length > 0) {
      console.log('Erros de validação encontrados:', this.errors);
      return;
    }
    
    console.log('Dados validados para criar aluno:', this.body);
    
    this.Aluno = await AlunoModel.create(this.body);
    console.log('Aluno criado com sucesso. ID:', this.Aluno.id);
    
  } catch (error) {
    console.log('Erro no register do AlunoModel:', error);
    if (error.name === 'SequelizeValidationError') {
      error.errors.forEach(err => {
        this.errors.push(err.message);
      });
    } else if (error.name === 'SequelizeForeignKeyConstraintError') {
      this.errors.push('Curso selecionado não existe');
    } else {
      this.errors.push('Erro ao salvar aluno no banco de dados');
    }
  }
};

Aluno.prototype.valida = function() {
  this.cleanUp();

  console.log('Validando dados do aluno:', this.body);

  // Validação obrigatória
  if(!this.body.nome || this.body.nome.trim() === '') {
    this.errors.push('Nome é um campo obrigatório.');
  }

  // Validação de email
  if(this.body.email && this.body.email.trim() !== '' && !validator.isEmail(this.body.email)) {
    this.errors.push('E-mail inválido');
  }

  // Validação de pelo menos um campo adicional
  const temEmail = this.body.email && this.body.email.trim() !== '';
  const temCurso = this.body.curso_id && this.body.curso_id !== '';
  const temSobrenome = this.body.sobrenome && this.body.sobrenome.trim() !== '';
  
  console.log('Campos adicionais - Email:', temEmail, 'Curso:', temCurso, 'Sobrenome:', temSobrenome);
  
  if(!temEmail && !temCurso && !temSobrenome) {
    this.errors.push('Pelo menos um dado adicional precisa ser enviado: e-mail, curso ou sobrenome.');
  }
  
  console.log('Validação concluída. Erros:', this.errors.length);
};

Aluno.prototype.cleanUp = function() {
  console.log('Limpando dados do aluno recebidos:', this.body);
  
  for(const key in this.body) {
    if(typeof this.body[key] !== 'string') {
      this.body[key] = this.body[key] !== undefined ? this.body[key].toString() : '';
    }
  }

  this.body = {
    nome: this.body.nome ? this.body.nome.trim() : '',
    sobrenome: this.body.sobrenome ? this.body.sobrenome.trim() : '',
    email: this.body.email ? this.body.email.trim() : '',
    curso_id: this.body.curso_id && this.body.curso_id !== '' ? parseInt(this.body.curso_id) : null,
  };
  
  console.log('Dados do aluno limpos:', this.body);
};

Aluno.prototype.edit = async function(id) {
  try {
    console.log('=== EDIT - Editando aluno ID:', id);
    
    this.valida();
    if(this.errors.length > 0) {
      console.log('Erros de validação na edição:', this.errors);
      return;
    }
    
    console.log('Dados para atualização:', this.body);
    
    const [numAffectedRows] = await AlunoModel.update(this.body, {
      where: { id: id }
    });
    
    console.log('Linhas afetadas na edição:', numAffectedRows);
    
    if (numAffectedRows === 0) {
      this.errors.push('Aluno não encontrado para edição');
      return;
    }
    
    this.Aluno = await AlunoModel.findByPk(id);
    console.log('Aluno atualizado:', this.Aluno ? this.Aluno.nome : 'Não encontrado');
    
  } catch (error) {
    console.log('Erro no edit do AlunoModel:', error);
    if (error.name === 'SequelizeValidationError') {
      error.errors.forEach(err => {
        this.errors.push(err.message);
      });
    } else if (error.name === 'SequelizeForeignKeyConstraintError') {
      this.errors.push('Curso selecionado não existe');
    } else {
      this.errors.push('Erro ao editar aluno');
    }
  }
};

// MÉTODOS ESTÁTICOS
Aluno.buscaPorId = async function(id) {
  try {
    console.log('=== BUSCA POR ID - Buscando aluno ID:', id);
    if(typeof id !== 'number' && typeof id !== 'string') {
      console.log('ID inválido');
      return null;
    }
    
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
      console.log('ID não é um número válido');
      return null;
    }
    
    const aluno = await AlunoModel.findByPk(idNumber);
    console.log('Aluno encontrado:', aluno ? aluno.nome : 'Nenhum');
    return aluno;
  } catch (error) {
    console.log('Erro em buscaPorId:', error);
    return null;
  }
};

Aluno.buscaAlunos = async function() {
  try {
    console.log('=== BUSCA ALUNOS - Buscando todos os alunos ===');
    
    const alunos = await AlunoModel.findAll({
      order: [['criadoEm', 'DESC']] 
    });
    
    console.log(`Encontrados ${alunos ? alunos.length : 0} alunos`);
    
    
    if (alunos && alunos.length > 0) {
      console.log('Buscando informações dos cursos...');
      try {
        const Curso = require('./CursoModel');
        const cursos = await Curso.buscaCursos();
        
        if (cursos && cursos.length > 0) {
          const cursosMap = {};
          cursos.forEach(curso => {
            cursosMap[curso.id] = curso;
          });
          
          // Adiciona informações do curso a cada aluno
          alunos.forEach(aluno => {
            if (aluno.curso_id && cursosMap[aluno.curso_id]) {
              aluno.dataValues.curso = cursosMap[aluno.curso_id];
              console.log(`Aluno ${aluno.nome} tem curso: ${cursosMap[aluno.curso_id].nome}`);
            }
          });
        }
      } catch (cursoError) {
        console.log('Erro ao buscar cursos para alunos:', cursoError.message);
      }
    }
    
    return alunos || [];
  } catch (error) {
    console.log('Erro em buscaAlunos:', error);
    return [];
  }
};

Aluno.delete = async function(id) {
  try {
    console.log('=== DELETE - Deletando aluno ID:', id);
    if(typeof id !== 'number' && typeof id !== 'string') {
      console.log('ID inválido');
      return null;
    }
    
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
      console.log('ID não é um número válido');
      return null;
    }
    
    const aluno = await AlunoModel.findByPk(idNumber);
    if (aluno) {
      await aluno.destroy();
      console.log('Aluno deletado:', aluno.nome);
    } else {
      console.log('Aluno não encontrado para deletar');
    }
    return aluno;
  } catch (error) {
    console.log('Erro em delete:', error);
    return null;
  }
};

Aluno.buscaCursosParaDropdown = async function() {
  try {
    console.log('=== BUSCA CURSOS DROPDOWN - Buscando cursos para dropdown ===');
    
    let cursos = [];
    
    // Método direto usando o modelo Curso
    try {
      const Curso = require('./CursoModel');
      console.log('CursoModel carregado, buscando cursos ativos...');
      cursos = await Curso.buscaCursosAtivos();
      
      if (!cursos || cursos.length === 0) {
        console.log('Nenhum curso ativo encontrado, buscando todos os cursos...');
        cursos = await Curso.buscaCursos();
      }
    } catch (error) {
      console.log('Erro ao buscar cursos via CursoModel:', error.message);
      
      // Fallback: tentar buscar diretamente do Sequelize
      try {
        if (sequelize.models.Curso) {
          console.log('Tentando buscar cursos via sequelize.models.Curso...');
          cursos = await sequelize.models.Curso.findAll({
            where: { ativo: true },
            order: [['nome', 'ASC']]
          });
        }
      } catch (fallbackError) {
        console.log('Fallback também falhou:', fallbackError.message);
      }
    }
    
    console.log(`Cursos encontrados para dropdown: ${cursos ? cursos.length : 0}`);
    
    if (cursos && cursos.length > 0) {
      cursos.forEach(curso => {
        console.log(` - ${curso.nome} (${curso.codigo}) - ID: ${curso.id}`);
      });
    } else {
      console.log('Nenhum curso encontrado para o dropdown');
    }
    
    return cursos || [];
  } catch (error) {
    console.log('Erro completo em buscaCursosParaDropdown:', error);
    return [];
  }
};



module.exports = Aluno;