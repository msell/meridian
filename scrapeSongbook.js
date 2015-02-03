var cheerio = require('cheerio');
var fs = require('fs');
var _ = require('lodash');
var request = require('superagent-as-promised');
var RSVP = require('rsvp');

var a = 0;
var s = 0;
var transformed = null;

var host = 'http://localhost:1337/';
var artistUrl = host + 'artist/create';
var songUrl = host + 'song/create';
var cursor = 0;
var $ = null;

function scrapeData() {
    $ = cheerio.load(fs.readFileSync('./songbook.html'), {
        normalizeWhitespace: false
    });

    var everything = $('#tableBook tr td').get();

    var artists = $('b').get();
    var songs = $('i').get();

    return {
        'artists': artists,
        'songs': songs,
        'everything': everything
    }
}

exports.scrapeData = scrapeData;

function addArtist(name) {
    console.log('adding %s', name);
    request.post(artistUrl)
        .send({
            'name': name
        })
        .end(function (res) {
              return JSON.parse(res.text).id;            
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
exports.addArtist = addArtist;
exports.addSong = addSong;

exports.importSongbook = function () {
    var data = scrapeData();

    for (var i = 0; i < data.everything.length - 1; i++) {

        var entry = $(data.everything).eq(i).text().trim();

        if (entry === $(data.artists).eq(a).text().trim()) {
            if (transformed != null) {
                var artist = {
                    'name': transformed.artist,
                    'songs': transformed.songs
                };

                console.log(artist);
                addArtist(artist.name);
                //            request.post(artistUrl)
                //                .send({
                //                    'name': artist.name
                //                })
                //                .then(function (response) {
                //                    artist.id = JSON.parse(response.text).id;
                //                    console.log('added artist ' + artist.id);
                //                    addSongs(artist.id, artist.songs);
                //                })


            }

            transformed = {
                'artist': entry,
                'songs': []
            };
            a++;
        } else if (entry === $(data.songs).eq(s).text().trim()) {
            transformed.songs.push(entry);
            s++;
        } else {
            console.log('exception no match: ' + entry);
            exceptionFile.write(entry + '\n');
        }
    }
}






//
//
//function addSongs(artistId, songs) {
//    return new RSVP.Promise(function (resolve, reject) {
//        console.log(songs);
//        for (var n = 0; n < songs.length - 1; n++) {
//            request.post(songUrl)
//                .send({
//                    'name': songs[n],
//                    'artist': artistId
//                })
//                .end(function (res) {
//                    console.log('added song: ' + songs[n]);
//                    resolve();
//                })
//        }
//    })
//}
//
//exceptionFile.end();