var express		= require('express'),
	//swig		= require('swig'),
	app			= express(),
	server		= require('http').createServer(app),
	fs			= require("fs"),
	async	 	= require("async"),
	bodyParser	= require('body-parser');
	login_form	= '';
	mail = '';
const root = __dirname+"/";

// var sendgrid = require("sendgrid")('ssystemxmedias190','1q2w3e4r5t');
// var email = new sendgrid.Email();
// var models = require('./models');

app.use(express.static(root+'public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.engine('html', swig.renderFile);


fs.readFile(root+'public/index.html', 'utf8', function (err,data) {
	if (err) {
		return console.log('error read file tpl');
	}else{
		login_form = data;
	}
});

var port =process.env.OPENSHIFT_NODEJS_PORT || 8080 ;
var ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

var index = function(req,res){res.send(login_form);}


app.get('/', function(req,res){res.send(login_form);});


// app.get('*', function(req, res) {
//     res.redirect('http://google.com');
// });


server.listen(port, ip);

console.log("APP START:"+ip+':'+port);