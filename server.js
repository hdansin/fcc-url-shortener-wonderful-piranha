'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var url = require('url');
var app = express();

// Make URL Model
var Schema = mongoose.Schema;
var urlSchema = new Schema({
  original_url: String,
  short_url: Number
});
var urlObject = mongoose.model("URL", urlSchema);

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
    if (parseInt(req.params.url)) {
      urlObject.findOne({short_url : parseInt(req.params.url)}, function(err, destination) {
        if (err) return console.error(err);
        return res.redirect("https://" + destination.original_url);
      })
    }
  })
  .post(urlencodedParser, function(req, res) {
    // check if valid url
    var myURL = url.parse(req.body.url);
    if (!myURL.host) {
      // return error
      res.json({ "error": "Invalid URL" })
    } 
    else if (req.params.url === "new") {
      // save the new url
      var numURLs = urlObject.estimatedDocumentCount();
      var newURL = new urlObject({ original_url : myURL.host, short_url:  });
      newURL.save(function(err, newURL) {
        if (err) return console.error(err);
      });
      res.json(numURLs)
    }
  })

app.listen(port, function () {
  console.log('Node.js listening ...');
});