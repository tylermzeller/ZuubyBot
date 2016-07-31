var mysql = require('mysql');

var selectAllFromUserWhere = function(connection, condition, execute, callback) {
	connection.query('SELECT * FROM user WHERE ?', condition, function(err, result) {

		if (err) { // error inserting user
			console.error('Could not select user.');
			callback(err);
			return;
		}
		console.log(result);
		execute(result);
	});
};

var selectAllFromGameWhere = function(connection, condition, execute, callback) {

	var query = 
	'SELECT * FROM game' +
	' WHERE User_id=' + mysql.escape(condition.User_id) + 
	' AND Active=' + mysql.escape(condition.Active);

	connection.query(query, function(err, result) {

		if (err) { // error inserting user
			console.error('Could not select game.');
			callback(err);
			return;
		}
		console.log(result);
		execute(result);
	});
};

var selectFenFromGameWhere = function(connection, condition, execute, callback) {

	var query = 
	'SELECT Fen FROM game' +
	' WHERE User_id=' + mysql.escape(condition.User_id) + 
	' AND Active=' + mysql.escape(condition.Active);

	connection.query(query, function(err, result) {

		if (err) { // error inserting user
			console.error('Could not select FEN.');
			callback(err);
			return;
		}
		console.log(result);
		execute(result);
	});
};

module.exports = {
	selectAllFromUserWhere: selectAllFromUserWhere,
	selectFenFromGameWhere: selectFenFromGameWhere,
	selectAllFromGameWhere: selectAllFromGameWhere
};
