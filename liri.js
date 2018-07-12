require("dotenv").config();
// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
var request = require("request");
var Spotify = require("node-spotify-api")
var Twitter = require("twitter")
var keys = require("./keys.js");
var fs = require("fs");

/* var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter); */

var command = process.argv[2];
var movieName = process.argv[3] || "Mr. Nobody";
var songRequest = process.argv[3] || "Ace Of Base - The Sign";

var spotifyIt = function (searchString) {

    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    spotify.search({ type: 'track', query: searchString, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song: " + data.tracks.items[0].name);
        console.log("Link: " + data.tracks.items[0].href);
        console.log("Album: " + data.tracks.items[0].album.name);
    });

}


if (command === "movie-this") {
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (error, response, body) {
        // If the request is successful
        // ...
        if (!error && response.statusCode === 200) {
            //console.log(JSON.parse(body))
            console.log(JSON.parse(body).Title + " was released in " + JSON.parse(body).Year);
            console.log("IMDB users rate it a " + JSON.parse(body).imdbRating + " out of 10");
            //console.log(JSON.parse(body));
            console.log("However " + JSON.parse(body).Ratings[1].Value + " of the critics on Rotten Tomatoes rated it fresh.");
            //console.log(JSON.parse(body).Title + " was released in " + JSON.parse(body).Year);
            console.log("Production Country(ies): " + JSON.parse(body).Country);
            console.log("The languages spoken in the film include " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Starring: " + JSON.parse(body).Actors);

        }
    });

}
else if (command === "spotify-this-song") {
    spotifyIt(songRequest)
}
else if (command === "my-tweets") {
    var client = new Twitter({
        consumer_key: keys.twitter.consumer_key,
        consumer_secret: keys.twitter.consumer_secret,
        access_token_key: keys.twitter.access_token_key,
        access_token_secret: keys.twitter.access_token_secret
    });

    var params = { screen_name: 'realDonaldTrump', count: 10 };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < 9; i++) {
                console.log(tweets[i].text);
            }
        }
    });

}
else if (command === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");


        spotifyIt(dataArr[1])

    });
}




