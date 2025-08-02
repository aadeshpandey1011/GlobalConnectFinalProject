const mongoose = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/globle-connect', (err, client) => {
  if (err) throw err

  const db = client.db('animals')

  db.collection('mammals').find().toArray((err, result) => {
    if (err) throw err

    console.log(result)
  })
})