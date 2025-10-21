var mysql = require('mysql');

var connMySQL = function(){
 
    return connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '148533',
        database: 'GestaoCurso'
    });
}

module.exports = function(){
  
    return connMySQL;
}