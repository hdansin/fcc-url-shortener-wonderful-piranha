'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

// Make URL Model
var Schema = mongoose.Schema;
var urlSchema = new Schema({
  original_url: String,
  short_url: Number
});
var URL = mongoose.model("URL", urlSchema);

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI, {
  useNewUrlParser : true,
  useUnifiedTopology : true 
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

// parse application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});
  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// URL poster
app
  .route("/api/shorturl/:url?") 
  .get(function(req, res) {
    res.json({ url : req.params.url})
  })
  .post(urlencodedParser, function(req, res) {
    // check if valid url
    var myURL =  new URL(req.body.url);
    

    res.json(myURL);
  })

app.listen(port, function () {
  console.log('Node.js listening ...');
});