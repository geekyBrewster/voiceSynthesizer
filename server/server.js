var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var port = process.env.PORT || 7000;

app.use(bodyParser.urlencoded({extended: true}));

// Serve back static files by default
app.get('/*', function(req, res){
  var file = req.params[0] || 'views/index.html';
  res.sendFile(path.join(__dirname, '/public', file));
});

// Start listenting for requests at given PORT
app.listen(port, function(){
  console.log('All ears on port: ', port);
});
