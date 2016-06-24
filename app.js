var express		= require('express'),
	app			= express(),
	server		= require('http').createServer(app),
	nodemailer	= require('nodemailer'),
	hbs			= require('express-handlebars'),
	port		= process.env.OPENSHIFT_NODEJS_PORT || 8080 ,
	ip			= process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1",
	bodyParser	= require('body-parser');


var litic = require('./litic');
const root = __dirname+"/";
const aci = 'current-menu-item';

var transporter = nodemailer.createTransport('smtps://djsystem6@mail.ru:wBiKy2Deee@smtp.mail.ru');
transporter.transporter.options.port = 465;

function sendMail (phone,name,problem) {
	var mailOptions = {
	    from: '"Сервис Новый заказ" <djsystem6@mail.ru>', 
	    to: 'systemxmedias@gmail.com', 
	    subject: name+' '+ phone+'✔', 
	    text: name+'|'+ phone+'|'+problem+' 🐴', 
	    html:  name+'|'+ phone+'|'+problem+' 🐴' 
	};

	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			return console.log(error);
		}
		console.log('Message sent: ' + info.response);
	});
}

app.engine('hbs', hbs({defaultLayout:'main.hbs'}));
app.set('view engine', 'hbs');
app.use(express.static(root+'public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




app.post('/sendact', function(req,res){
	console.log(req.body);
	if (req.body['your-name']==undefined&&req.body['your-time']==undefined){
		req.body['your-name'] = 'Заказ из быстой карты';
		req.body['your-time'] = '--';
	}
	sendMail(req.body['your-tel'],req.body['your-name'],req.body['your-time']);
	res.redirect('/');
});

app.post('/secondlive', function(req,res){
	models.List.new(req.ip,req.body.sec,function(err,e){
		res.send('1');	
	})
	
});
app.post('/clearstat', function(req,res){
	models.List.RM(function(err,e){
		res.send('ok');	
	})
	
});

app.post('/timezone', function(req,res){
	models.Setting.editOption(1,req.body.zone,function(err,e){
		res.send('ok');	
	})
});

app.get('/openstatic88', function(req,res){
	models.List.list(function(err,e){
		res.render('litic',{list:e,admin:1});
	});
});


app.post('/notcall', function(req,res){
	sendMail('Отказ','((','((');
	res.send(':(');
});

function newClient(req,res,next){
	models.List.newIp(req.ip,req.get('Referer'),function(err,e){
		next()	
	})
}

// GET
app.get('/', [newClient,function(req,res){res.render('index',{index:aci,slider:true});}]);
app.get('/onas', [newClient,function(req,res){res.render('onas',{onas:aci});}]);
app.get('/uslugi', [newClient,function(req,res){res.render('uslugi',{uslugi:aci});}]);
app.get('/prajs', [newClient,function(req,res){res.render('price',{price:aci});}]);
app.get('/kontakty', [newClient,function(req,res){res.render('contacts',{contacts:aci});}]);

app.get('/remontondom', [newClient,function(req,res){res.render('remont-kompyuterov',{rk:aci});}]);
app.get('/vostanovl', [newClient,function(req,res){res.render('vosstanovlenie-dannyx-na-domu',{vd:aci});}]);
app.get('/setting', [newClient,function(req,res){res.render('nastrojka-kompyuterov',{nk:aci});}]);
app.get('/needhelp', [newClient,function(req,res){res.render('skoraya-kompyuternaya-pomoshh',{help:aci});}]);
app.get('/install', [newClient,function(req,res){res.render('ustanovka-windows-7',{ust:aci});}]);
app.get('/settingprint', [newClient,function(req,res){res.render('nastrojka-interneta',{nast:aci});}]);


server.listen(port, ip);

console.log("APP START:"+ip+':'+port);