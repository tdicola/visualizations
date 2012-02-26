// pacnamegen.js by Tony DiCola
// 2-23-2012
//
// Generate a random string of text based on the trigrams of political action
// committee names.

// Referenced global variables
var $, FB, document, exports;

// Return a random int between min and max, inclusive.
function random_int(min, max) {
	"use strict";
	return min + Math.floor(Math.random() * (max - min + 1));
}

// Generate a list of starting keys with at least threshold number of ending
// words.
function gen_start_keys(trigrams, threshold) {
	"use strict";
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

// Generate a random string of text from trigrams.  Try to create a string of
// text between minWords and maxWords length, however the result might be
// smaller.
function gen_random_text(trigrams, startKeys, minWords, maxWords) {
	"use strict";
	var max = random_int(minWords, maxWords),
		key = startKeys[random_int(0, startKeys.length - 1)],
		n = 2,
		text = key,
		words,
		w;

	// Loop while building the text until enough words are found or a trigram
	// can't be found.
	while ((n < max) && trigrams.hasOwnProperty(key)) {
		words = trigrams[key];
		w = words[random_int(0, words.length - 1)];
		text = text + ' ' + w;
		n += 1;
		// Build the new key from the 2nd and 3rd words of the trigram
		key = String(key).split(' ', 2)[1];
		key = key + ' ' + w;
	}

	return text;
}

// Check if running in browser
if ($ !== undefined) {
	// Build experience when DOM is ready
	$(document).ready(function () {
		"use strict";

		// Load the trigram dataset and generate a random PAC name.
		$.getJSON('pac_trigrams.json', function (data) {
			var trigrams = data,
				startKeys = gen_start_keys(trigrams, 2);

			$('#generate')
				.click(function () {
					$('#name').text(gen_random_text(trigrams, startKeys, 5, 8));
				})
				.removeAttr('disabled')
				.click();

			$('#share')
				.click(function () {
					FB.login(function (response) {
						FB.ui({
							method: 'feed',
							link: 'http://tdicola.github.com/visualizations/pacnamegen.html',
							picture: 'http://tdicola.github.com/visualizations/pac_names_mix_small.png',
							name: 'Political Action Committee Name Generator',
							caption: 'I just generated:',
							description: $('#name').text(),
							redirect_uri: 'http://tdicola.github.com/visualizations/pacnamegen.html'
						}, function (response) {});
					}, { scope: 'publish_stream'});
				})
				.removeAttr('disabled');
		});
	});
} else {
	// Export functions for module
	exports.gen_start_keys = gen_start_keys;
	exports.gen_random_text = gen_random_text;
	exports.random_int = random_int;
}