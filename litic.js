var mongoose	= require("mongoose");
var Schema		= mongoose.Schema;


//mongoose.connect("mongodb://admin:1vX8ziXJVJtj@"+process.env.OPENSHIFT_MONGODB_DB_HOST+":"+process.env.OPENSHIFT_MONGODB_DB_PORT+"/x");
mongoose.connect("mongodb://localhost:27017/dbins");
var timeZone = 0;
list = new Schema({
	ip:String,
	second:String,
	time:String,
	referer:String
});
setting = new Schema({
	setting:String,
	options:String
});

setting.statics.editOption = function(id,options,cb){
	this.update({setting:id},{options:options},{upsert:true}, function(err) {
		timeZone = options;
		cb(err,null);		
	});
}

setting.statics.zone = function(cb){
	this.findOne({setting:'1'},function(err,e){
		if (e){
			cb(err,e.options);
		}
	});
}
list.statics.list = function(cb){
	this.find({}, function(err, list) {
		cb(err,list);		
	});
}

list.statics.RM = function(cb){
	this.remove({}, function(err, list) {
		cb(err,list);		
	});
}
list.statics.new = function(ip,sec,cb){
	this.update({ip:ip},{second:sec},{upsert:true}, function(err, list) {
		cb(err,list);		
	});
}

list.statics.newIp = function(ip,referer,cb){
	var date = new Date(new Date().getTime()-(timeZone*(60*60*1000)));
	date = new Date(date).getHours()+':'+new Date(date).getMinutes()+':'+new Date(date).getSeconds();

	this.findOne({ip:ip},function(err,resp){
		if (resp){
			cb(null,false);	
		}else{
			models.List.update({ip:ip},{referer:referer,time:date},{upsert:true}, function(err, list) {
				cb(null,false);	
			});
		}
	});	
}

models = {
	List:mongoose.model("List", list),
	Setting:mongoose.model("Setting", setting)
};
models.Setting.zone(function(err,e){
	if (e){
		timeZone = e;
	}
});
module.exports = models;