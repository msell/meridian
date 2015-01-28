var cheerio = require('cheerio');
var fs = require('fs');
var _ = require('lodash');
var mongoose = require('mongoose');

var artistSchema = mongoose.Schema({
    name: String,
    songs: []
});

var Artist = mongoose.model('Artist', artistSchema);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/songbook');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
});

console.log('migrating song data');
var $ = cheerio.load(fs.readFileSync('./songbook.html'), {
    normalizeWhitespace: false
});

var exceptionFile = fs.createWriteStream('exception.txt');

var everything = $('#tableBook tr td').get();

var artists = $('b').get();
var songs = $('i').get();

var expectedTotal = artists.length + songs.length;
console.log('total rows: ' + everything.length + ' should equal ' + expectedTotal);

var a = 0;
var s = 0;
var transformed = null;

for (var i = 0; i < everything.length; i++) {

    var entry = $(everything).eq(i).text().trim();

    if (entry === $(artists).eq(a).text().trim()) {
        if (transformed != null) {            
            var artist = new Artist({'name': transformed.artist, 'songs': transformed.songs});
            artist.save(function(err, artist){
                
            });
            
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

exceptionFile.end();