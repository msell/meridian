var mongoose = require('mongoose');
var chalk = require('chalk');
var dbName = 'arcade-dev';
var RSVP = require('rsvp');

module.exports = {
    connect: function () {

        return new RSVP.Promise(function (resolve, reject) {
            var mongoOptions = {
                db: {
                    safe: true
                },
                server: {
                    auto_reconnect: true,
                    socketOptions: {
                        connectTimeoutMS: 5000,
                        keepAlive: 1,
                        socketTimeoutMS: 3600000
                    }
                }
            };

            mongoose.connect('mongodb://localhost/' + dbName, mongoOptions);
            var db = mongoose.connection;
            db.on('error', function (err) {
                console.error.bind(console, 'connection error...');
                reject();
            });
            db.once('open', function callback() {
                console.log('database connection opened');
                resolve();
            });

            db.once('close', function callback() {
                console.log('database connection closed');
            });
        })
    },

    drop: function () {

        mongoose.connection.db.dropDatabase(function () {
            console.log(chalk.red(dbName + ' dropped!'));
        })
    }
}