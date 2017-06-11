var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient

var url = 'mongodb://localhost:27017/datatable'

app.use(express.static('public'))

app.use(bodyParser.json())

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get('/api/exercises', function(req, res, next) {
  let response = []

  MongoClient.connect(url, function(err, db) {

    if (db) {
      var cursor = db.collection('exercises').find();
      cursor.each(function(err, doc) {
        if (doc !== null) {
          db.close();
          response.push(doc);
        } else {
          db.close();
          res.json(response);
        }
      })
    }
  })
})

app.post('/api/exercises', function(req, res) {
  MongoClient.connect(url, function (err, db) {
    db.collection('exercises').insertOne({
      name: req.body.name,
      reps: req.body.reps,
      weight: req.body.weight,
      date: req.body.date,
      lbs: req.body.lbs,
    })
      .then(function (response) {
        db.close();
        res.json({
          _id: response.insertedId
        });
      });
  });
})

app.delete('/api/exercises/:id', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    db.collection('exercises').deleteOne({
      _id: mongodb.ObjectID(req.params.id)
    });

    db.close();
  })
})

app.get('*', function(req, res) {
  res.redirect('/')
})

app.listen(3000, function() {
  console.log('App running on port 3000')
})
