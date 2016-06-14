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
var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://djsystem6@mail.ru:XX@smtp.mail.ru');
transporter.transporter.options.port = 465;
function sendMail (phone,name,problem) {
	var mailOptions = {
	    from: '"Сервис Новый заказ" <djsystem6@mail.ru>', // sender address
	    to: 'systemxmedias@gmail.com', // list of receivers
	    subject: name+' '+ phone+'✔', // Subject line
	    text: name+' '+ phone+' '+problem+' 🐴', // plaintext body
	    html:  name+' '+ phone+' '+problem+' 🐴' // html body
	};

	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
}


app.use(express.static(root+'public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



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