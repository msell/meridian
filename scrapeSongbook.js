var cheerio = require('cheerio');
var fs = require('fs');
var _ = require('lodash');

console.log('migrating song data');
var $ = cheerio.load(fs.readFileSync('./ViewBook.aspx.htm'), {
    normalizeWhitespace: false
});

var songBookFile = fs.createWriteStream('songBook.json');
var exceptionFile = fs.createWriteStream('exception.txt');
songBookFile.write('[\n');
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
            songBookFile.write(JSON.stringify(transformed, null, 2));  
            songBookFile.write('\n');
            if(a !== artists.length -1) songBookFile.write(',');  
            
            first = false;
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
songBookFile.write('\n]');
songBookFile.end();
exceptionFile.end();