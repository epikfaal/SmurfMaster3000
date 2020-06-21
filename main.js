const Discord = require('discord.js');
const client = new Discord.Client();
var textchannel;
var Dat
var currentgame = null;
 

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear() + ((this.getHours() < 10)?"0":"") + " " + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}
 
client.on('ready', () => {
	 client.channels.fetch('723976201013690441').then( channel =>
	   textchannel = channel);
	console.log(`Logged in as ${client.user.tag}!`);
});
 
client.on('message', msg => {
  if (msg.content === '!smurf singles' && (msg.channel instanceof Discord.DMChannel)) {
	  if(currentgame === null){
		dm = msg.channel;
		dm.send('Respond with lobby code (8 characters)');
		filter = m => m.content.length == 8;
		dm.awaitMessages(filter, { max: 1, time: 60000, errors: ['time']})
		.then(dmmsg => addPlayerToList(dmmsg))
		.catch(collected => console.log(collected));
	  } else {
		currentgame.user.createDM().then( dm => response = informPlayerSmurfIsFound(dm, msg)).catch(dm => informPlayerErrorContactingOriginalPlayer(msg));
	  }
  }
   if (msg.content === '!dm' && !(msg.channel instanceof Discord.DMChannel)) {
	   
	   console.log(client.channels);
	   client.channels.fetch('724357636912316526').then( channel =>
	   channel.send('test')).catch( e => console.log('Couldnt find channel: ' + e));
   }
});

function addPlayerToList(dmmsg){
	
	for (message of dmmsg){
		message = message[1];
		if(currentgame !== null){
		currentgame.user.createDM().then( dm => informPlayerSmurfIsFound(dm, message, 'Another smurf has already started a smurf session, code: ')).catch(dm => informPlayerErrorContactingOriginalPlayer(message));
		return;
	}
		if(!message.author.bot){
			currentgame = {code: message.content, user: message.author};
			textchannel.send('A smurf is now looking for a 1 on 1 friendly!');
			var date = new Date();
			console.log(date.timeNow() + ` Player ${message.author.tag} has started a search`);
			message.reply("added");
			setTimeout(function(){checkIfGameTimedOut({code: message.content, user: message.author})}, 300000);
		}
	}
}

function informPlayerSmurfIsFound(dmchannel, msg, prefix = 'code: '){
	dmchannel.send('Smurf Found, he has been sent the code');
	msg.reply(prefix + currentgame.code);
	textchannel.send('Smurfs are matched');
	var date = new Date();
	console.log(date.timeNow() + ` Player ${msg.author.tag} has joined the game of ${currentgame.user.tag}`);
	currentgame = null
}

function informPlayerErrorContactingOriginalPlayer(msg){
	msg.reply('Failed to contact original smurf, you can try to connect to ' + currentgame.code + " otherwise type !smurf to start looking for a new game");
	var date = new Date();
	console.log(date.timeNow() + ` Player ${msg.author.tag} has joined the game of ${currentgame.user.tag}`);
	currentgame = null;
	textchannel.send('Smurfs are matched');
}

function checkIfGameTimedOut(game){
	if(game.code == currentgame.code && game.user == currentgame.user){
		currentgame = null;
		game.user.createDM().then( dm => dm.send('Match search timed out'));
		textchannel.send('match search timed out');
	}
}

client.login(product.env.BOT_TOKEN);