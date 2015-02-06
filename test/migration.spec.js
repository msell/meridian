var sut = require('../scrapeSongbook.js');
var should = require('chai').should();
var expect = require('chai').expect;
var sinon = require('sinon');

describe('scraping the data', function(){
    it('should fetch songbook data', function(done){
        var results = sut();
        results.artists.should.have.length(3);
        results.everything.should.have.length(17);
        results.songs.should.have.length(14);
        done();        
    });
})

describe('migrating the songbook',function(){
    it('should add all the artists', function(done){
        var spy = sinon.spy(sut.addArtist);
        sut.importSongbook();
        spy.callCount.should.equal(3);
        done();
    })
    
    it('should add all the songs');
})