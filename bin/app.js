var express = require('express');
var app = express();
var path = require('path');
var html = require('html');

app.use(express.static(path.join(__dirname, '/../public')));

app.engine('.html', require('ejs').__express);
//app.set('views', path.join(__dirname + "/../public"));
app.set('view engine', 'html');

app.get('/', function (req, res) {
  //res.send('Hello World');
  //res.sendFile(path.join(__dirname, '../public/index.html'));
  //res.render('index');
});

app.listen(process.env.PORT || 3000, function() {
  console.log("DON'T PANIC")
});
