
require('dotenv').config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);


// // Takes in all of the command line arguments
var inputString = process.argv;

// // Parses the command line argument to capture the "operand" (add, subtract, multiply, etc) and the numbers
var action = inputString[2];
var search = inputString[3];


UserInputs(action, search);
function UserInputs(action, search) {
    switch (action) {
        case "concert-this":
            var artist = search;
            if (!artist || !artist.trim()) {
                return console.log("You must provide an artist to search.")
            }
            artistThis(artist.trim().toLowerCase());
            break;

        case "spotify-this-song":
            var song = search;
            if (!song || !song.trim()) {
                return console.log("You must provide an artist to search.")
            } else
                songThis(song);
            break;


        case "movie-this":
            var movie = search;
            if (!movie || !movie.trim()) {
               
                    movie = "Mr. Nobody";
                    console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947");
                    console.log("It's on Netflix!")
                 
            }
            movieThis(movie.trim().toLowerCase());
            break;
        case "do-what-it-says":
            doIt();
            break;
        default:
            console.log("Not a valid choice.");
            break;
    }
}

function movieThis(movie) {
    axios.get("http://www.omdbapi.com/?t=" + movie + "=&plot=short&apikey=trilogy").then(
        function (response) {
            // Then we print out the imdbRating ```
            //    * Title of the movie.

            // console.log(response)
            console.log("Title: " + response.data.Title);
            //    * Year the movie came out.
            console.log("Year: " + response.data.Year);
            //    * IMDB Rating of the movie.
            console.log("IMDB Rating: " + response.data.imdbRating);
            //    * Rotten Tomatoes Rating of the movie.
            console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value);
            //    * Country where the movie was produced.
            console.log("Country: " + response.data.imdbRating);
            //    * Language of the movie.
            //    * Plot of the movie.
            //    * Actors in the movie.
            //  ```
            console.log("The movie's rating is: " + response.data.imdbRating);

        }
    );
}

function artistThis(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(response => {
            //         Name of the venue

            console.log("Venue: " + response.data[0].venue.name);

            //  * Venue location
            console.log("City: " + response.data[0].venue.city);
            //  * Date of the Event (use moment to format this as "MM/DD/YYYY")
            console.log("Date: " + moment(response.data[0].datetime).format('L'));
            // var date = new Date(response.data[0].datetime);

            // var concertDate = (date.getMonth + 1) + "/" + date.getDate() + "/";
            // console.log("Date: " + concertDate);
        })
        .catch(error => {
            console.log('Error fetching and parsing data', error);
        });
}

function songThis(song) {
    spotify
        .search({ type: 'track', query: song, limit: 1 })
        .then(function (response) {
            console.log("artist: " + response.tracks.items[0].artists[0].name);
            console.log("album: " + response.tracks.items[0].album.name);
            console.log("song title: " + response.tracks.items[0].name);
            console.log("preview: " + response.tracks.items[0].preview_url);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function doIt() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var dataArr = data.split(',');
        UserInputs(dataArr[0], dataArr[1]);
    });
}
// console.log("artist: " + response.tracks.items[0].artists[0].name);
// console.log("album: " + response.tracks.items[0].album.name);
// console.log("song title: " + response.tracks.items[0].name);
// console.log("preview: " + response.tracks.items[0].preview_url);
// // WHEN FILE IS DONE LOADING:
// runCommand(action, inputString[3], inputString[4]);