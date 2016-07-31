var mysql = require('mysql');
var selectHelper = require('./select');

var insertIntoGame = function(connection, condition, execute, callback) {
	connection.query('INSERT INTO game SET ?', condition, function(err) {

		if (err) { // error inserting user
			console.error('Could not insert game.');
			callback(err);
			return;
		}

		execute();
		
	});
};

var insertIntoUser = function(connection, condition, execute, callback) {
	connection.query('INSERT INTO user SET ?', condition, function(err) {

		if (err) { // error inserting player
			console.error('Could not insert player.');
			callback(err);
			return;
		}

		execute();
		
	});
};

module.exports = {
	insertIntoGame: insertIntoGame,
	insertIntoUser: insertIntoUser
};

