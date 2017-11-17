var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var port = process.env.PORT || 7000;

app.use(bodyParser.urlencoded({extended: true}));

var pg = require('pg');

var config = {
  database: 'side_projects', // name of your database
  host: 'localhost', // where is your database?
  port: 5432, // port for the database
  max: 10, // how many connections at one time?
  idleTimeoutMillis: 30000 // 30 second time out
};

var pool = new pg.Pool(config);

// Sending responses DB data to client from server
app.get('/responses', function(req, res){
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.sendStatus(500);
    } else {
      var queryText = 'SELECT * FROM "responses";';
      db.query(queryText, function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          console.log(queryText);
          res.send({responses: result.rows});
        }
      }); // end query
    } // end if
  }); // end pool
}); // end of GET

// Add new response data to the DB
app.post('/responses', function(req, res){
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.sendStatus(500);
    } else {
      var response = req.body;
      // console.log(response);
      var id = response.response_id;
      var text = response.response_text;
      var queryText = 'INSERT INTO "responses" ' +
          '("response_id", "response_text") ' +
          'VALUES ($1, $2);';
      db.query(queryText,[id, text], function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          console.log(queryText);
          res.send({responses: result.rows});
        }
      }); // end query
    } // end if
  }); // end pool
}); // end of POST

// Remove response from DB
app.delete('/responses/:id', function(req, res){
  pool.connect(function(errorConnectingToDatabase, db, done){
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database.');
      res.sendStatus(500);
    } else {
      var id = req.params.id;
      var queryText = 'DELETE FROM "responses" WHERE "id"=$1;';
      db.query(queryText,[id], function(errorMakingQuery, result){
        done();
        if(errorMakingQuery) {
          console.log('Attempted to query with', queryText);
          console.log('Error making query');
          res.sendStatus(500);
        } else {
          console.log(queryText);
          res.send({responses: result.rows});
        }
      }); // end query
    } // end if
  }); // end pool
}); // end of DELETE


// Serve back static files by default
app.get('/*', function(req, res){
  var file = req.params[0] || 'views/index.html';
  res.sendFile(path.join(__dirname, '/public', file));
});

// Start listenting for requests at given PORT
app.listen(port, function(){
  console.log('All ears on port: ', port);
});
