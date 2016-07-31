var tmi = require('tmi.js');
var options = require('./options');
var queries = require('./db/queries');

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
		client.action(channel, 'Hello ' + (user['display-name'] === null ? user['username'] : user['display-name']) + '!');
	} else if (message === '!game') { // TODO: check if a user is already playing a game
		handleGameCommand(channel, user, message);
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
					client.action(channel, '@' + player.Display_name + ' it appears you have an active game already.');
				} else {
					queries.addGame(player.id, function(err) {
						if (err){
							console.error(err);
							return;
						}
						// game has been created
						client.action(channel, '@' + player.Display_name + ' you are playing white. When ready, type !move (your move).');
					});
				}
			});
		} else {
			queries.addPlayer(user['username'], user['display-name'], function(err) {
				if (err){
					console.error(err);
					return;
				}

				console.log('Holy shit the player was added!');

				queries.getPlayer(user['username'], function(err, player) {
					queries.addGame(player.id, function(err) {
						if (err){
							console.error(err);
							return;
						}
						// game has been created
						client.action(channel, '@' + player.Display_name + ' you are playing white. When ready, type !move (your move).');
					});
				});
			});
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
