function AlunosDAO(connection) {
    this._connection = connection

}
AlunosDAO.prototype.getAlunos = function (callback) {
    this._connection.query('SELECT * FROM Aluno ', callback);
}

module.exports = function() {
    return AlunosDAO;
};