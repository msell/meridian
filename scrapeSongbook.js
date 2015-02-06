var cheerio = require('cheerio');
var fs = require('fs');
var _ = require('lodash');
var request = require('superagent');
var RSVP = require('rsvp');
var a = 0;
var s = 0;
var transformed = null;

var host = 'http://localhost:1337/';
var artistUrl = host + 'artist/create';
var songUrl = host + 'song/create';
var cursor = 0;
var $ = null;


$ = cheerio.load(fs.readFileSync('./songbook.html'), {
    normalizeWhitespace: false
});

var everything = $('#tableBook tr td').get();

var artists = $('b').get();
var songs = $('i').get();

for (var i = 0; i <= everything.length; i++) {
    var entry = $(everything).eq(i).text().trim();

    if (entry === $(artists).eq(a).text().trim()) {
        if (transformed != null) {
            var artist = {
                'name': transformed.artist,
                'songs': transformed.songs
            };

            //console.log(artist);          
            addArtist(artist);
        }

        transformed = {
            'artist': entry,
            'songs': []
        };
        a++;
    } else if (entry === $(songs).eq(s).text().trim()) {
        transformed.songs.push(entry);
        s++;
    } else {
        console.log('exception no match: ' + entry);
        exceptionFile.write(entry + '\n');
    }
}


function addArtist(artist) {
    console.log('adding %s', artist.name);
    request.post(artistUrl)
        .send({
            'name': artist.name
        })
        .end(function (res) {
            //console.log(res);
            var artistId = JSON.parse(res.text).id;
            console.log(artistId);
            artist.songs.forEach(function(song){
                addSong(artistId, song);
            });
            
        })
}

function addSong(artistId, name) {
    console.log('adding %s', name);
    request.post(songUrl)
        .send({
            'name': name,
            'artist': artistId
        })
        .end(function (res) {
            return res;
        })
}