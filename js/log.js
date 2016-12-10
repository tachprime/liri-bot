const fs = require('fs');

exports.logFile = function logFile(command, log) {

	let date = new Date();
	let tempLog = (`\nLog entry on: ${date}\nCommand: ${command}\nResults:\n${log}`);

	fs.appendFile('text/log.txt', tempLog, function(err){
		if(err) return console.log(err);
	} );
}
