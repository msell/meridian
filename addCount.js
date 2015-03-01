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

for(var propertyName in cursor){
    print(propertyName);
}

for(var propertyName in cursor.result[0]){
    print(propertyName);
}

print(cursor.result.length);
//for(var i=0;i<cursor.result.length;i++){
//    print(cursor[i].count)
//}

//for(var i=0;i<)