var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = "mongodb://127.0.0.1:27017"
var db_Name = '2048'
var client = MongoClient.connect(DB_CONN_STR,{ useNewUrlParser: true });

exports.uploadScore = (userData, callback)=>{

	MongoClient.connect(DB_CONN_STR,{ useNewUrlParser: true }, (err, client)=>{
        // console.log(err)
        console.log("資料庫連接成功！" + ' - ' + Date.now());
        var collection = client.db(db_Name).collection('Score');

        collection.insertOne(userData, (err, result)=>{
            if (err) {
                console.log('Error:' + err);
            }
            client.close();
            callback(err, result)
        } )
    })
}
exports.getScore = (callback)=>{

        MongoClient.connect(DB_CONN_STR,{ useNewUrlParser: true }, (err, client)=>{
        console.log("資料庫連接成功！" + ' - ' + Date.now());
        var collection = client.db(db_Name).collection('Score');

        collection.find({}).toArray((err, result)=>{
            if (err) {
                console.log('Error:' + err);
            }
	    // console.log(result)
            client.close();
            callback(err, result)
        } )
    })
}
