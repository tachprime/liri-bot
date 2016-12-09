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
		break;
	case 'movie-this':
		break;
	case 'do-what-it-says':
		break;
	default:
		console.log("not a recognized command");
		break;
}

function myTweets() {
	var client = new twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret
	});

	var params = {q:'@takimus',count:'20',result_type: 'recent'};
	client.get('search/tweets.json', params, function(err, tweets, response) {
		if (err) console.log(err);

		console.log(tweets);

	});
}
