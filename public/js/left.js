function setCookie(name, value, options) {
	options = options || {};
	var expires = options.expires;
	if (typeof expires == "number" && expires) {
		var d = new Date();
		d.setTime(d.getTime() + expires * 1000);
		expires = options.expires = d;
	}
	if (expires && expires.toUTCString) {
		options.expires = expires.toUTCString();
	}
	value = encodeURIComponent(value);
	var updatedCookie = name + "=" + value;
	for (var propName in options) {
		updatedCookie += "; " + propName;
		var propValue = options[propName];
		if (propValue !== true) {
			updatedCookie += "=" + propValue;
		}
	}
	document.cookie = updatedCookie;
}
function deleteCookie(name) {
	setCookie(name, "", {
		expires: -1
	})
}
function getCookie(name) {
	var matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

$( document ).ready(function() {
	//$('#phone').mask('+7 (999) 999-99-99');
	//$('#phonee').mask('+7 (999) 999-99-99');

	if (getCookie('boxc')==undefined){
		setTimeout('showBlock()',10000);
	}

	$('.block-box').click(function(){
		hideBlock();
	})
	$('.clearstat').click(function(){
		$.post('/clearstat');
		window.location = '/openstatic88';
	})
	$('.timezone').click(function(){
		$.post('/timezone',{zone:$('.zone').val()});
		window.location = '/openstatic88';
	})
	
});

function showBlock() {
	setCookie('boxc','1',{expires:300})
	$('.block-box').css('display','block');
	$('.papirus-box').css('display','block');
	$('.call-box').css('display','block');
}

function hideBlock() {
	$.post('/notcall');
	$('.papirus-box').css('display','none');
	$('.block-box').css('display','none');
	$('.call-box').css('display','none');
}

function secondLive(sec){
	var times = new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds();

	$.post('/secondlive',{sec:sec,time:times});
	sec=sec+2;
	setTimeout(function(){secondLive(sec)},2000);
}
if (window.location.pathname!='/openstatic88'){
	setTimeout(function(){secondLive(2)},2000);
}