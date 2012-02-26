// test_pacnamegen.js by Tony DiCola
// 2-25-2012
//
// Unit tests for trigram-based random text generation algorithm.

var assert = require('chai').assert,
	pacnamegen = require('../pacnamegen.js');

suite('pacnamegen.js', function () {
	var trigrams = { "foo bar": ["baz"],
					 "bar baz": ["shaz"],
					 "blah blah": ["blah", "meh"],
					 "test test2": ["one", "two", "three"],
					 "test2 test3": ["foo", "bar", "baz", "shaz"] };

	test('random_int returns value between min and max inclusive', function () {
		var min = 5,
			max = 10,
			i = pacnamegen.random_int(min, max);
		assert.ok(i <= max);
		assert.ok(i >= min);
	});

	test('gen_start_keys returns keys with more endings than threshold', function () {
		var startkeys = pacnamegen.gen_start_keys(trigrams, 2);
		assert.equal(startkeys.length, 2);
		assert.deepEqual(["test test2", "test2 test3"], startkeys)
	});

	test('gen_start_keys returns all keys when threshold is 0', function () {
		var	startkeys = pacnamegen.gen_start_keys(trigrams, 0);
		assert.deepEqual(["foo bar", "bar baz", "blah blah", "test test2", "test2 test3"],
						  startkeys);
	});

	test('gen_start_keys returns no keys when threshold is too high', function () {
		var	startkeys = pacnamegen.gen_start_keys(trigrams, 5);
		assert.deepEqual([], startkeys);
	});

	test('gen_random_text generates at least minWords when possible', function () {
		var startkeys = ["foo bar"],
			text = pacnamegen.gen_random_text(trigrams, startkeys, 4, 5);
		assert.equal(text, "foo bar baz shaz");
	});

	test('gen_random_text generates at most maxWords', function () {
		var startkeys = ["foo bar"],
			text = pacnamegen.gen_random_text(trigrams, startkeys, 3, 3);
		assert.equal(text, "foo bar baz");
	});
});