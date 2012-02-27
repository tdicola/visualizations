"""
Unit tests for parse_webk and gen_pac_trigrams functions.

Created by Tony DiCola tony@tonydicola.com
February 20, 2012
"""
import parse_webk, gen_pac_trigrams

def test_number():
	assert parse_webk.number('+000000000') == 0
	assert parse_webk.number('-000000000') == 0
	assert parse_webk.number('-123456789') == -123456789
	assert parse_webk.number('+001230045') == 1230045

def test_process_line_reads_trigrams():
	line = 'This is a test line.'
	trigrams = {}
	expected = {('This', 'is'): ['a'],
				('is', 'a'): ['test'],
				('a', 'test'): ['line.']}
	gen_pac_trigrams.process_line(line, trigrams)
	assert trigrams == expected

def test_process_line_ignores_blank_line():
	line = ''
	trigrams = {}
	expected = {}
	gen_pac_trigrams.process_line(line, trigrams)
	assert trigrams == expected

def test_process_line_ignores_less_than_three_words():
	line = 'One two'
	trigrams = {}
	expected = {}
	gen_pac_trigrams.process_line(line, trigrams)
	assert trigrams == expected

def test_process_line_handles_three_words():
	line = 'One two three'
	trigrams = {}
	expected = {('One', 'two'): ['three']}
	gen_pac_trigrams.process_line(line, trigrams)
	assert trigrams == expected

def test_process_ignores_whitespace():
	line = '\t\n  One  \t\n  two three\n\t\t\n  '
	trigrams = {}
	expected = {('One', 'two'): ['three']}
	gen_pac_trigrams.process_line(line, trigrams)
	assert trigrams == expected