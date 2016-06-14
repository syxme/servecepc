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

 var sendgrid = require("sendgrid")('ssystemxmedias190','1q2w3e4r5t');
 var email = new sendgrid.Email();
// var models = require('./models');

app.use(express.static(root+'public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.engine('html', swig.renderFile);


function sendMail (phone,name,problem) {
	email.smtpapi.header.to = [];
	email.addTo('systemxmedias@gmail.com');
	email.setFrom("remontcompov@gaga.ru");
	email.setSubject(name+' '+ phone);
	email.setHtml(name+' '+ phone+' '+problem);
	email.setFromName("Сайт сервиса");  
	sendgrid.send(email,function(err,json){
		console.log(json.message+' send to:'+to);
		return json;
	});
}

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
app.get('/goodsend', function(req,res){
	res.send(login_form.replace('<!--XDX-->','<div  id="messages" onClick="hide(\'messages\')"class="message">Ваша Заявка прянята<br>Ожидайте звонка</div>'));
});

app.post('/', function(req,res){
	console.log(req.body);
	sendMail(req.body.phone,req.body.author,req.body.text);
	res.redirect('/goodsend');
});


// app.get('*', function(req, res) {
//     res.redirect('http://google.com');
// });


server.listen(port, ip);

console.log("APP START:"+ip+':'+port);