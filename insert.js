var mysql = require('mysql');
var options = require('./options');

var connection = mysql.createConnection({
	host: options.storageConfig.host,
	user: options.storageConfig.user,
	password: options.storageConfig.password,
	database: options.storageConfig.database
});

connection.connect();

var chessboard = {
	user: 'tyler',
	fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
};

var query = connection.query('INSERT INTO chessboards SET ?', chessboard, function(error, result){
	if (error){
		console.error(err)
		return;
	}
	console.log(query.sql);
	console.log(result);
});

connection.end();