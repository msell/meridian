var cheerio = require('cheerio');
var events = require('events');
var fs = require('fs');
var _ = require('lodash');
var request = require('superagent');
var a = 0;
var s = 0;
var transformed = null;

var host = 'http://arcade-karaoke.herokuapp.com/';
var artistUrl = host + 'artist/create';
var songUrl = host + 'song/create';
var cursor = 0;
var $ = null;
var async = require('async');
//something is either wrong w/ full-songbook or...works on regular songbook
$ = cheerio.load(fs.readFileSync('./songbook.html'), {
    normalizeWhitespace: false
});

var everything = $('#tableBook tr td').get();

var artists = $('b').get();
var songs = $('i').get();
var songbook = [];

for (var i = 0; i <= everything.length; i++) {
    var entry = $(everything).eq(i).text().trim();

    if (entry === $(artists).eq(a).text().trim()) {
        if (transformed != null) {
            var artist = {
                'name': transformed.artist,
                'songs': transformed.songs
            };

            console.log(i);
            songbook.push(artist);
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
    }
}

var addArtist = function (artist, cb) {
    //console.log('adding ' + artist.name);    
    request.post(artistUrl)
        .send({
            'name': artist.name
        })
        .set('Accept', 'application/json')
        .end()
        .on('response', function (res) {
            //add songs here
            var artistId = JSON.parse(res.text).id;
            console.log('added artist ' + artist.name + ' id=' + artistId);
            async.series(artist.songs.map(function (song) {
                return function (cb) {
                    addSong(artistId, song, cb);
                }
            }))
        });
}

var addSong = function (artistId, name, cb) {
    //console.log('adding %s', name);    
    request.post(songUrl)
        .send({
            'name': name,
            'artist': artistId
        })
        .end()
        .on('response', function (res) {
            console.log('song: ' + JSON.parse(res.text).name);
            cb(null);
        })
}

async.series(songbook.map(function(artist){
    return function(cb){
        addArtist(artist, cb);
    }
}))

