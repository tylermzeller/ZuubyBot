var mysql = require('mysql');
var options = require('./options');

var connection = mysql.createConnection({
	host: options.storageConfig.host,
	user: options.storageConfig.user,
	password: options.storageConfig.password,
	database: options.storageConfig.database
});

connection.connect();

connection.query('SELECT * FROM chessboards', function(error, result){
	if (error){
		console.error(error);
		return;
	}

	console.log(result);
});

connection.end();