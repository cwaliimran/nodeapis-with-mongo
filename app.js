const express = require('express')
const { ObjectId } = require('mongodb')
const {connectToDb, getDb} = require('./db')

//init app and middlewares
const app = express()
app.use(express.json()); // parse body of raw json from requests
app.use(express.urlencoded({extended: true})); 

let db

 //db connection

connectToDb((err) => {
    if(!err){
        app.listen(3000, () => {
            console.log('listening in 3000')
        })
    
        db = getDb()
    }
})



//routes

app.get('/books', (req, res)=>{
    //pagination
    const pageNo = req.query.p || 0 //default value
    const perPage = 2
   let books =[]
    db.collection('books')
    .find() //cursor toArray forEach - returns 20 by default
    .skip(pageNo * perPage)
    .limit(perPage)
    .forEach(book => books.push(book))
    .then((result) => {
       res.json({status : 200, data : books})
    }).catch((err) => {
        res.json({status: 204, message: err})
    });

  // res.json({message: "welcome to the API"})
})

// app.get('/books', (req, res)=>{
//    let books =[]
//     db.collection('books')
//     .find() //cursor toArray forEach - returns 20 by default
//     .forEach(book => books.push(book))
//     .then((result) => {
//        res.json({status : 200, data : books})
//     }).catch((err) => {
//         res.json({status: 204, message: err})
//     });

//   // res.json({message: "welcome to the API"})
// })

app.get('/books/:id', (req, res) =>{
    if(ObjectId.isValid(req.params.id)){

        db.collection('books')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc =>{
            res.json({status:200, data: doc})
        }).catch(err=>{
            res.json({status : 204, message: "Couldn't fetch document"})
        })
    }else{
        res.json({status : 204, message: "Invalid id format"})
        
    }
})


app.post('/books', (req, res) =>{
    //get data from body
    const book = req.body
      db.collection('books')
        .insertOne(book)
        .then(doc =>{
            res.json({status:200, data: doc})
        }).catch(err=>{
            res.json({status : 204, message: "Couldn't add book"})
        })
})


app.patch('/books/:id', (req, res) =>{
    //get data from body
    const book = req.body
    if(ObjectId.isValid(req.params.id)){

        db.collection('books')
        .updateOne({_id: new ObjectId(req.params.id)}, {$set:book})
        .then(doc =>{
            res.json({status:200, message: "Updated successfully", data: doc})
        }).catch(err=>{
            res.json({status : 204, message: "Couldn't fetch document," + err})
        })
    }else{
        res.json({status : 204, message: "Invalid id format"})
        
    }
})


app.delete('/books', (req, res) =>{
    //get data from body
    const id = req.query.id
    if(ObjectId.isValid(id)){

        db.collection('books')
        .deleteOne({_id: new ObjectId(id)})
        .then(doc =>{
            res.json({status:200, message: "Deleted successfully", data: doc})
        }).catch(err=>{
            res.json({status : 204, message: "Couldn't delete document," + err})
        })
    }else{
        res.json({status : 204, message: "Invalid id format"})
        
    }
})

