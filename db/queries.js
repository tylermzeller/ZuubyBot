var mysql = require('mysql');
var storageConfig = require('../options').storageConfig;
var selectHelper = require('./select');
var insertHelper = require('./insert');

var pool  = mysql.createPool({
    connectionLimit : storageConfig.pool_limit,
    host : storageConfig.host,
    user : storageConfig.user,
    password : storageConfig.password,
    database : storageConfig.database
});

var addPlayer = function(username, display_name, callback) {

	var newPlayer = {
		User_name: username,
		Display_name: display_name
	}

    getConnection(function(connection){
    	insertHelper.insertIntoUser(connection, newPlayer, function() { // BEGIN INSERT
			connection.release(); // Done with connnection
			// Do not player connection below here, it has been returned to the pool
			callback();
		}, callback);
    }, callback);
}; // END addPlayer()

var getPlayer = function(username, callback) {

	var player = {
		User_name: username
	}

	getConnection(function(connection) {
		selectHelper.selectAllFromUserWhere(connection, player, function(result) {
			connection.release(); // Done with connnection
			// Do not user connection below here, it has been returned to the pool
			if (result.length === 1){
				callback(null, result[0]);
			} else if (result.length === 0){
				callback();
			} else if (result.length > 1){
				callback('Too many entries in database.');
			}
		}, callback);
	}, callback);
}; // END getPlayer()

var addGame = function(playerID, callback) {
	var id = {
		User_id: playerID
	};

	getConnection(function(connection) {
		insertHelper.insertIntoGame(connection, id, function() {
			connection.release(); // Done with connnection
			// Do not use connection below here, it has been returned to the pool
			callback();
		}, callback);
	}, callback);
}; // END addGame()

var getGame = function(playerID, callback) {

	var game = {
		User_id: playerID,
		Active: 1	
	};

	getConnection(function(connection) {
		selectHelper.selectAllFromGameWhere(connection, game, function(result){
			connection.release(); // Done with connnection
			// Do not use connection below here, it has been returned to the pool
			if (result.length === 1){
				callback(null, result[0]);
			} else if (result.length === 0){
				callback();
			} else if (result.length > 1){
				callback('Too many entries in database.');
			}
		}, callback);
	}, callback);
}; // END getGame()

function getConnection(execute, callback) {
	pool.getConnection(function(err, connection) {
        if (err) {
        	console.error('Could not get connection.');
            callback(err);
            return;
        }
		// connected
		execute(connection);
    });
}

module.exports = {
  addPlayer: addPlayer,
  getPlayer: getPlayer,
  addGame: addGame,
  getGame: getGame
};

