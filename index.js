var express = require('express');
var xhb = require('express-handlebars');
// var favicon = require('serve-favicon');
var app = express();
var handlebars = xhb.create( {defaultLayout: 'main'} );
var mysql = require('mysql');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


var db = function (callback) {
	connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'sakila' // sky
	});
	connection.connect();
	connection.query('SELECT name FROM category', function (err, rows, fields) {
		if (err) { throw err; }
		
		callback(rows);
	});
	
	connection.end();
};

app.use( express.static('public') );
// app.use( favicon(__dirname + '/public/images/favicon.ico') );

app.get('/', function (req, res) {
	
	db(function (rows) {
		res.render('home');
	});
});

app.get('/product', function (req, res) {
	
	
	db(function (rows) {
		res.render('product', {
			layout: 'product.layout.handlebars',
			categories: rows
			
		});
	});
});

app.listen(1250);