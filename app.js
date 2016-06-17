var express		= require('express'),
	//swig		= require('swig'),
	app			= express(),
	server		= require('http').createServer(app),
	fs			= require("fs"),
	async	 	= require("async"),
	bodyParser	= require('body-parser');
	mail = '';
	
const root = __dirname+"/";
var nodemailer = require('nodemailer');
var TPLS = {};

var fname = function(x){return x.substring(x.lastIndexOf('/')+1,x.length);}
var hname = function(x){var t = x.substring(x.indexOf('/')+1,x.length);t = t.substring(t.length-5,0);return t.replace('/',"_");}
var fform = function(x){var name = x.substring(x.lastIndexOf('/')+1,x.length);return name.substring(name.lastIndexOf(".")+1,name.length);}

var walk = function(dir, done) { 
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk("public", function(err, file) {
	Object.keys(file).forEach(function(number){
		if (fform(fname(file[number]))=="html"){
			TPLS[hname(fname(file[number]))] = fs.readFileSync(root+file[number], 'utf8');
		}
	});
});
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://djsystem6@mail.ru:wBiKy2Deee@smtp.mail.ru');
transporter.transporter.options.port = 465;

function sendMail (phone,name,problem) {
	var mailOptions = {
	    from: '"Сервис Новый заказ" <djsystem6@mail.ru>', // sender address
	    to: 'systemxmedias@gmail.com', // list of receivers
	    subject: name+' '+ phone+'✔', // Subject line
	    text: name+'|'+ phone+'|'+problem+' 🐴', // plaintext body
	    html:  name+'|'+ phone+'|'+problem+' 🐴' // html body
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




var port =process.env.OPENSHIFT_NODEJS_PORT || 8080 ;
var ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";






app.get('/goodsend', function(req,res){
	res.send(login_form.replace('<!--XDX-->','<div  id="messages" onClick="hide(\'messages\')"class="message">Ваша Заявка прянята<br>Ожидайте звонка</div>'));
});

app.post('/sendact', function(req,res){
	console.log(req.body);
	sendMail(req.body['your-tel'],req.body['your-name'],req.body['your-time']);
	res.redirect('/');
});

// [ 'contacts',
//   'index',
//   'nastrojka-interneta',
//   'nastrojka-kompyuterov',
//   'onas',
//   'price',
//   'remont-kompyuterov',
//   'skoraya-kompyuternaya-pomoshh',
//   'uslugi',
//   'ustanovka-windows-7',
//   'vosstanovlenie-dannyx-na-domu' ]


//GET
app.get('/', function(req,res){res.send(TPLS['index']);});
app.get('/onas', function(req,res){res.send(TPLS['onas']);});
app.get('/uslugi', function(req,res){res.send(TPLS['uslugi']);});
app.get('/prajs', function(req,res){res.send(TPLS['price']);});
app.get('/kontakty', function(req,res){res.send(TPLS['contacts']);});

app.get('/remontondom', function(req,res){res.send(TPLS['remont-kompyuterov']);});
app.get('/vostanovl', function(req,res){res.send(TPLS['vosstanovlenie-dannyx-na-domu']);});
app.get('/setting', function(req,res){res.send(TPLS['nastrojka-kompyuterov']);});
app.get('/needhelp', function(req,res){res.send(TPLS['skoraya-kompyuternaya-pomoshh']);});
app.get('/install', function(req,res){res.send(TPLS['ustanovka-windows-7']);});
app.get('/settingprint', function(req,res){res.send(TPLS['nastrojka-interneta']);});

// app.get('*', function(req, res) {
//     res.redirect('http://google.com');
// });


server.listen(port, ip);

console.log("APP START:"+ip+':'+port);