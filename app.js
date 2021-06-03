require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
  
// Our routes go here:

  app.get("/", (req, res) => {
    res.render("index");
  });
  
  app.get('/artist-search', function (req, res) {
    spotifyApi.searchArtists(req.query.artist)
      .then(data => {
        let sendData = {
          search: req.query.artist,
          items: data.body.artists.items
        }
        res.render("artist-search", sendData)
      })
  });
  
  app.get('/albums/:artistID', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistID)
      .then(data => {
        let sendData = {
          items: data.body.items
        }
        res.render("albums", sendData);
      })
  });
  
  app.get('/tracks/:albumID/:albumName', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.albumID)
      .then(data => {
        let sendData = {
          album:req.params.albumName,
          items: data.body.items
        }
        console.log(sendData.items[0].artists);
        res.render("tracks", sendData);
      })
  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
