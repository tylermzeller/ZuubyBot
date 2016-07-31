var mysql = require('mysql');

var updateGameSetFen = function(connection, condition, execute, callback) {
	var query = 
	'UPDATE game' +
	' SET Fen=' + mysql.escape(condition.Fen) +
	' WHERE User_id=' + mysql.escape(condition.User_id) + 
	' AND Active=' + mysql.escape(condition.Active);

	connection.query(query, function(err, result) {

		if (err) { // error updating game
			console.error('Could not select game.');
			callback(err);
			return;
		}
		console.log(result);

		execute();
	});
};

module.exports = {
	updateGameSetFen: updateGameSetFen
};