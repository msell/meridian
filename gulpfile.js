var gulp = require('gulp');
var chalk = require('chalk');
var fs = require('fs');
var _ = require('lodash');
var mongoose = require('./mongoose.js');


gulp.task('default', function () {
    console.log('take a big ole gulp');
})

gulp.task('dropDatabase', function () {
    console.log(chalk.red('Dropping Database like a bad habit...'));

    mongoose.connect().then(mongoose.drop);
    
});