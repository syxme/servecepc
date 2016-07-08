const root = __dirname+"/";
var list = {};

function translit(text){
	var space = '-'; 
	text = text.toLowerCase();
	var transl = {
		'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 
		'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
		'о': 'o', 'п': 'p', 'р': 'r','с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h',
		'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh','ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
		' ': space, '_': space, '`': space, '~': space, '!': space, '@': space,
		'#': space, '$': space, '%': space, '^': space, '&': space, '*': space, 
		'(': space, ')': space,'-': space, '\=': space, '+': space, '[': space, 
		']': space, '\\': space, '|': space, '/': space,'.': space, ',': space,
		'{': space, '}': space, '\'': space, '"': space, ';': space, ':': space,
		'?': space, '<': space, '>': space, '№':space
	}

	var result = '';
	var curent_sim = '';
	for(i=0; i < text.length; i++) {
		if(transl[text[i]] != undefined) {
			if(curent_sim != transl[text[i]] || curent_sim != space){
				result += transl[text[i]];
				curent_sim = transl[text[i]];
			}                                                                            
		}
		else {
			result += text[i];
			curent_sim = text[i];
		}
	}

	return result;               

}
function newClient(req,res,next){
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log(req.path);
	models.List.newIp(ip,req.get('Referer'),req.path,function(err,e){
		next()	
	})
}

module.exports = function(app){

	function processFile(inputFile,cb) {
		var fs = require('fs'),
		readline = require('readline'),
		instream = fs.createReadStream(inputFile),
		outstream = new (require('stream'))(),
		rl = readline.createInterface(instream, outstream);
		rl.on('line', function (line) {
			list[translit(line)] = line;
		});

		rl.on('close', function (line) {
			cb(list);
		});
	}
	processFile(root+'list.x',function(err,e){

		var id = '';
		for (var i = Object.keys(list).length - 1; i >= 0; i--) {
			app.get('/'+Object.keys(list)[i], [newClient,function(req,res){
				id = req.route.path.substr(1);
				res.render('random',{title:list[id],keywords:list[id],description:list[id]});

			}]);
		}

	});


}