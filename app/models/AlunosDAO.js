function AlunosDAO(connection) {
    this._connection = connection 
}

AlunosDAO.prototype.getAlunos = function (callback) {
    // ⚠️ ATENÇÃO: Use .all() para SELECT que retornam múltiplos registros no SQLite3
    this._connection.all('SELECT * FROM Aluno', callback);
}

module.exports = function() {
    return AlunosDAO;
};
