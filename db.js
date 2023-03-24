const { MongoClient}  = require("mongodb")

let dbConnection

//bookstore_admin
//dNox8Acxbl9fOdKE

module.exports = {
    connectToDb: (cb) => {
        // MongoClient.connect('mongodb://0.0.0.0:27017/bookstore')
        MongoClient.connect('mongodb+srv://cwaliimran:dNox8Acxbl9fOdKE@cluster0.o6j4bm8.mongodb.net/test')
        .then((client) => {
            dbConnection = client.db()
            return cb()
        }).catch(err => {
            console.log(err)
            return cb(err)
        })
    },
    getDb: () => dbConnection
}