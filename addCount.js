//printjson(db.song.findOne());


var cursor = db.song.aggregate([
    {
        $group: {
            _id: "$artist", count:{"$sum":1}
        }        
    }
]);


//while (cursor.hasNext()) {
//   print(tojson(cursor.next()));
//}
//printjson(foo);

//for(var propertyName in cursor){
//    print(propertyName);
//}

for(var propertyName in cursor.result[0]){
    print(propertyName);
}

print("this many artists: " + cursor.result.length);

//print(cursor.result[2].count);

//printjson(cursor.result[2]);

// TODO:
// LOOP through groups, update artist where cursor.result[i]._id  .count.

//for(var i=0;i<cursor.result.length;i++){
//    print(cursor[i].count)
//}

for(var i=0;i<cursor.result.length;i++){
    db.artist.findAndModify({
        query:{_id: cursor.result[i]._id},
        update:{$set: {songCount: cursor.result[i].count}}        
    });
}