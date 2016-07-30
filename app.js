var tmi = require('tmi.js');
var options = require('./options')

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

	} else if (message === '!resign') { //TODO: check if a user is actually playing

	} else if (message === '!draw') { // TODO: check if user is playing, check if score is close to 0.0 or losing

	} else if (message === '!score') { // TODO check if user is playing

	} else if (message === '!bestmove') { // TODO: check if user is playing

	}
});

// client.on('connected', function(address, port){
// 	client.action();
// });