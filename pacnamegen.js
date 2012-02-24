// pacnamegen.js by Tony DiCola
// 2-23-2012
//
// Generate a random string of text based on the trigrams of political action committee names.

"use strict";

var trigrams, startKeys;

// Return a random int between min and max, inclusive.
function randomInt(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

// Generate a list of starting keys with at least threshold number of ending words.
function genStartKeys(trigrams, threshold) {
	var startKeys = [],
		k;
	// Loop through all keys of the trigram dataset.
	for (k in trigrams) {
		if (trigrams.hasOwnProperty(k) && trigrams[k].length > threshold) {
			startKeys.push(k);
		}
	}
	return startKeys;
}

// Generate a random string of text from tri-grams.  Try to create a string of text between minWords
// and maxWords length, however the result might be smaller.
function genRandomText(trigrams, minWords, maxWords) {
	var max = randomInt(minWords, maxWords),
		key = startKeys[randomInt(0, startKeys.length - 1)],
		n = 2,
		text = key,
		words,
		w;

	// Loop while building the text until enough words are found or a trigram can't be found.
	while ((n < max) && trigrams.hasOwnProperty(key)) {
		words = trigrams[key];
		w = words[randomInt(0, words.length - 1)];
		text = text + ' ' + w;
		n += 1;
		key = String(key).split(' ', 2)[1];
		key = key + ' ' + w;
	}

	return text;
}

function facebookShareDialog(app_id, link, name, caption, description, redirect_uri) {
	var	url = 'https://www.facebook.com/dialog/feed?app_id=' + app_id +
			  '&link=' + link +
			  '&name=' + name +
			  '&caption=' + caption +
			  '&description=' + description;// +
			  //'&redirect_uri=' + redirect_uri;
	window.open(url,
				'Share to Facebook',
				'height=450, width=1000, menubar=0, location=0, status=0, directories=0, toolbar=0, resizable=1');
}

// Load the tri-gram dataset and generate a random PAC name.
$.getJSON('pac_trigrams.json', function (data) {
	trigrams = data;
	startKeys = genStartKeys(trigrams, 2);

	$('#pacnamegen').text(genRandomText(trigrams, 5, 8));
	$('#pacnamegen-button').click(function () {
		$('#pacnamegen').text(genRandomText(trigrams, 5, 8));
	});

	FB.init({appId: '261223303952102', status: true, cookie: true, xfbml: true});
	$('#sharetofacebook-button').click(function () {
		//facebookShareDialog('261223303952102',
		//			'http://tdicola.github.com/',
		//			'Random PAC Generator',
		//			'I just generated:',
		//			$('#pacnamegen').text(),
		//			'http://tdicola.github.com/');
		FB.login(function (response) {}, {scope: 'publish_stream'});
		//FB.login(function (response) {
			//FB.ui({
			//	method: 'feed',
			//	link: 'http://tdicola.github.com/',
			//	picture: 'http://fbrell.com/f8.jpg',
			//	name: 'Random PAC Generator',
			//	caption: 'I just generated:',
			//	description: $('#pacnamegen').text(),
			//	redirect_uri: 'http://tdicola.github.com/'
			//}, function (response) {});
		//}, { perms: 'publish_stream'});


		// What about using self.close() here? http://www.javascript-coder.com/window-popup/javascript-window-close.phtml
	});
});