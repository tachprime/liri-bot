/*jshint esversion: 6*/
/*jshint node:true*/
//immutible globals
const twitter = require('twitter');
const spotify = require('spotify');
const request = require('request');
const keys = require('./js/keys.js');

var command = process.argv[2];

switch (command) {
	case 'my-tweets':
		myTweets();
		break;

	case 'spotify-this-song':
		spotifyThis();
		break;

	case 'movie-this':
		break;

	case 'do-what-it-says':
		break;

	default:
		console.log("not a recognized command");
		break;
}

/*-------- functions --------*/
function myTweets() {
	let client = new twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret
	});

	let params = {q:'@_PrincessCely', count:'5', result_type: 'recent'};

	client.get('search/tweets.json', params, function(err, tweets, response) {

		if (err) return console.log(err);

		if (tweets.statuses.length !== 0) {
			outPut(tweets.statuses, 'tweets');
		} else {
			console.log("no recent tweets");
		}

	});
}

function spotifyThis() {
	let track = process.argv[3] || 'ace of base The sign';

	spotify.search({type: 'track', query: track}, function(err, data) {
		if (err) return console.log(err);

		if (data.tracks.items.length !== 0) {
			outPut(data.tracks.items[0], 'track');
		} else {
			console.log("track not found");
		}
	});
}

function outPut(data, outputType) {

	if (outputType === 'tweets') {

		console.log("Your most recent tweets");

		for (let i = 0; i < data.length; i++) {
			let tweet = (` tweet: ${data[i].text}\n`+
						 ` on: ${data[i].created_at}\n`);

			console.log(tweet);
		}

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
	}
}
