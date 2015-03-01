printjson(db.song.findOne());


var foo = db.song.aggregate([
    {
        $group: {
            _id: "$artist"
        }        
    }
], function (err, result) {
    if (err) print(err);
    //printjson(result);
})

printjson(foo);
