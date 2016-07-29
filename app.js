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
	if (message.match(/zuubybot/i) || message.match(/zuuby/i)){
		client.action(channel, 'Hello ' + user['display-name'] === null ? user['username'] : user['display-name']);
	}
});

// client.on('connected', function(address, port){
// 	client.action();
// });