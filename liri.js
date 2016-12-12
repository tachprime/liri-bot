/*jshint esversion: 6*/
/*jshint node:true*/
//immutible globals
const twitter = require('twitter');
const spotify = require('spotify');
const request = require('request');
const keys = require('./js/keys.js');
const fs = require('fs');
const logFile = require('./js/log.js');

var command = process.argv[2];

function main(command2) {
	switch (command) {
		case 'my-tweets':
			myTweets();
			break;

		case 'spotify-this-song':
			if(!command2)
			command2 = process.argv[3] || 'ace of base The sign';
			spotifyThis(command2);
			break;

		case 'movie-this':
			if(!command2)
			command2 = process.argv[3] || 'Mr. Nobody';
			movieThis(command2);
			break;

		case 'do-what-it-says':
			doThis();
			break;

		default:
			console.log("not a recognized command");
			break;
	}
}main();

/*-------- functions --------*/
function myTweets() {
	let client = new twitter(keys.twitterKeys);

	let params = {screen_name:'takimus', count:'20'};

	client.get('statuses/user_timeline', params, function(err, tweets, response) {

		if (err) return console.log(err);

		if (tweets.length !== 0) {
			outPut(tweets, 'tweets');
		} else {
			console.log("no recent tweets");
		}

	});
}

function movieThis(movie) {

	let query = `http://www.omdbapi.com/?t="${movie}"&y=&plot=short&tomatoes=true&r=json`;

	console.log("searching for film...\n");

	request(query, function (err, xhrResponse, film) {

	  if (!err && xhrResponse.statusCode == 200) {
		  film = JSON.parse(film);

		  if (typeof film.Title !== 'undefined') {
			  outPut(film, 'movie');
		  } else {
			  console.log("search returned no results\n");
		  }
	  } else {
		  console.log("error with movie request");
	  }

	});
}

function spotifyThis(track) {

	spotify.search({type: 'track', query: track}, function(err, data) {
		if (err) return console.log(err);

		if (data.tracks.items.length !== 0) {
			outPut(data.tracks.items[0], 'track');
		} else {
			console.log("track not found");
		}
	});
}

function doThis() {
	fs.readFile('./text/random.txt', 'utf8', (err, data) => {
		if (err) return err;

		let originalCMD = command;
		let input;

		data = data.trim();
		command = data.split(',')[0];
		input = data.split(',')[1];

		logFile.logFile(originalCMD + " random command: " + command + " " + input, "see next log");

		main(input);
	});
}

//Formats data to be displayed in console
function outPut(data, outputType) {

	if (outputType === 'tweets') {

		console.log("Your most recent tweets");

		let tweetLog = [];

		for (let i = 0; i < data.length; i++) {
			let tweet = (` tweet: ${data[i].text}\n`+
						 ` on: ${data[i].created_at}\n`);

			tweetLog[i] = tweet;

			console.log(tweet);
		}
			logFile.logFile(command, tweetLog);

	} else if (outputType === 'track') {

		let artist = '';

		for (let i = 0; i < data.artists.length; i++) {
			artist += data.artists[i].name + ', ';
		}

		let track = (`Spotify returned:\n`+
					 `---------------------\n`+
					 `Artist: ${artist}\n`+
					 `Song: ${data.name}\n`+
					 `Album: ${data.album.name}\n`+
					 `Preview link: ${data.preview_url}\n`);

		console.log(track);

		logFile.logFile(command, track);

	} else if (outputType === 'movie') {

		let movie = (`Title: ${data.Title}\n` +
	    			`Year: ${data.Year}\n`+
	    			`IMDB Rating: ${data.imdbRating}\n` +
	    			`Country: ${data.Country}\n` +
	    			`Language: ${data.Language}\n` +
	    			`Plot: ${data.Plot}\n` +
	    			`Actors: ${data.Actors}\n`+
	    			`Rotten Tomatoes Rating: ${data.tomatoUserMeter}\n` +
	    			`Rotten Tomatoes URL: ${data.tomatoURL}\n`);

		console.log(movie);

		logFile.logFile(command, movie);
	}
}
