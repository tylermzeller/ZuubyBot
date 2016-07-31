var tmi = require('tmi.js');
var options = require('./options');
var queries = require('./db/queries');
var gameHelper = require('./chess/game');

var options = {
	options: {
		debug: true
	},
	connection: {
		cluster: 'aws',
		reconnect: true
	},
	identity: {
		username: options.twitchConfig.user,
		password: options.twitchConfig.pass
	},
	channels: options.twitchConfig.channels
};

var client = new tmi.client(options);
client.connect();

client.on('chat', function(channel, user, message, self) {
	if (message.match(/zuubybot/i) || message.match(/zuuby/i)) {
		client.whisper(channel, 'Hello ' + (user['display-name'] === null ? user['username'] : user['display-name']) + '!');
	} else if (message === '!game') { // TODO: check if a user is already playing a game
		handleGameCommand(channel, user, message);
	} else if (message.indexOf('!move') === 0) {
		handleMoveCommand(channel, user, message);
	} else if (message === '!resign') { //TODO: check if a user is actually playing
	} else if (message === '!draw') { // TODO: check if user is playing, check if score is close to 0.0 or losing
	} else if (message === '!score') { // TODO check if user is playing
	} else if (message === '!bestmove') { // TODO: check if user is playing
	} else if (message == '!previousmove') {
	} else if (message === '!exists') { // for debugging purposes
		handleExistsCommand(channel, user, message);
	}
});

// client.on('connected', function(address, port){
// 	client.action();
// });

function handleGameCommand(channel, user, message) {
	queries.getPlayer(user['username'], function(err, player) {
		if (err){
			console.error(err);
			return;
		}

		if (player) { // user already in DB
			queries.getGame(player.id, function(err, game){
				if (err){
					console.error(err);
					return;
				}

				if (game){
					client.whisper(player.User_name,'It appears you have an active game already.');
				} else {
					queries.addGame(player.id, function(err) {
						if (err){
							console.error(err);
							return;
						}
						// game has been created
						client.whisper(player.User_name, 'You are playing white. When ready, type !move (your move).');
					});
				}
			});
		} else {
			queries.addPlayer(user['username'], user['display-name'], function(err) {
				if (err){
					console.error(err);
					return;
				}

				queries.getPlayer(user['username'], function(err, player) {
					queries.addGame(player.id, function(err) {
						if (err){
							console.error(err);
							return;
						}
						// game has been created
						client.whipser(player.User_name,'You are playing white. When ready, type !move (your move).');
					});
				});
			});
		}
	});
}

function handleMoveCommand(channel, user, message) {
	
	queries.getPlayer(user['username'], function(err, player) {
		if (err){
			console.error(err);
			return;
		}

		if (player) { // there is a player
			queries.getGame(player.id, function(err, game){
				if (err){
					console.error(err);
					return;
				}

				if (game) { // there is an active game
					
					var strings = message.split(' ');
					if (strings.length !== 2) {
						client.whisper(player.User_name, 'Your move format is incorrect.');
						return;
					}
					var move = strings[1];
					gameHelper.playMove(game.Fen, move, function(err, newFen, zuubyMove, chessboard){
						if (err){
							console.error(err);
							client.whipser(player.User_name, err);
							return;
						}

						// TODO: update fen in db

						client.whisper(player.User_name, 'I played the move ' + zuubyMove);
					});

				} else {
					client.whisper(player.User_name, 'You aren\'t playing a game right now. If you want, type !game to start a new game!');
				}
			});
		} else {
			client.whipser(user['username'], 'You aren\'t playing a game right now. If you want, type !game to start a new game!');
		}
	});		
}

function handleExistsCommand(channel, user, message) {
	queries.getPlayer(user['username'], function(err, player) {
		if (err){
			console.error(err);
			return;
		}

		if (player) {
			client.action(channel, 'Player Exists.');
		} else {
			client.action(channel, 'Player does not exist.');
		}
	});
}
