var cheerio = require('cheerio');
var events = require('events');
var fs = require('fs');
var _ = require('lodash');
var request = require('superagent');
var RSVP = require('rsvp');
var a = 0;
var s = 0;
var transformed = null;
var EventEmitter = require('events').EventEmitter;

var host = 'http://arcade-karaoke.herokuapp.com/';
var artistUrl = host + 'artist/create';
var songUrl = host + 'song/create';
var cursor = 0;
var $ = null;
var emitter = new EventEmitter();
emitter.on('artistFound', function (data) {
        addArtist(data);
    })
    //something is either wrong w/ full-songbook or...works on regular songbook
$ = cheerio.load(fs.readFileSync('./full-songbook.html'), {
    normalizeWhitespace: false
});

var everything = $('#tableBook tr td').get();

var artists = $('b').get();
var songs = $('i').get();
var promises = [];

for (var i = 0; i <= everything.length; i++) {
    var entry = $(everything).eq(i).text().trim();

    if (entry === $(artists).eq(a).text().trim()) {
        if (transformed != null) {
            var artist = {
                'name': transformed.artist,
                'songs': transformed.songs
            };

            //console.log(artist);            
            //addArtist(artist);    
            //emitter.emit('artistFound', artist);
            promises.push(addArtist(artist));
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

RSVP.all(promises).then(function(){
    console.log('all done yo');
})

function addArtist(artist) {
    //console.log('adding ' + artist.name);

    return new RSVP.Promise(function(resolve,reject){
        var songPromises = [];
        request.post(artistUrl)
        .send({
            'name': artist.name
        })
        .set('Accept', 'application/json')
        .end(function (res) {            
            var artistId = JSON.parse(res.text).id;
            console.log(artistId);
            artist.songs.forEach(function (song) {
                songPromises.push(addSong(artistId, song));
            })
        })
        .on('response', function (res) {
            console.log('artist: ' + JSON.parse(res.text).name);
            RSVP.all(songPromises).then(function () {
                console.log('all songs added for ' + artist.name)
            });
            resolve();
        });    
    });
}

function addSong(artistId, name) {
    //console.log('adding %s', name);
    return new RSVP.Promise(function (resolve, reject) {
        request.post(songUrl)
            .send({
                'name': name,
                'artist': artistId
            })
            .end()
            .on('response', function (res) {
                //console.log('song: ' + JSON.parse(res.text).name);
                resolve();
            })
    });
}