"""
Generate PAC name trigram JSON structure from parse_webk output.  Input is a
file containing PAC names (produced by running parse_webk), one per line.
Output is a JSON serialized dictionary with each key being a pair of words
(separated by a space) and each value being an array of following words in the 
associated trigram.

Created by Tony DiCola tony@tonydicola.com
February 20, 2012
"""
import json, random
from itertools import imap

INPUT_FILENAME = 'pacnames.txt'
OUTPUT_FILENAME = 'pac_trigrams.json'

def process_line(line, trigrams):
    """Split input line into words and record all the trigrams."""
    words = line.split()
    if len(words) > 2:
        w1, w2 = words[0:2]
        for w3 in words[2:]:
            trigrams.setdefault((w1, w2), []).append(w3)
            w1, w2 = w2, w3

def random_string(maxwords):
    """Generate a string of text from trigrams with at most max words."""
    # Pick a nice starting trigram (has more than a couple possible last words)
    key, value = random.choice(filter(lambda (k,v): len(v) > 2, trigrams.items()))
    text = " ".join(key)
    # Iterate through picking random endings for given trigram until no more 
    # trigrams are found or the max word limit is reached.
    i = 2
    while i < maxwords and key in trigrams:
        w3 = random.choice(trigrams[key])
        text = " ".join([text, w3])
        key = (key[1], w3)
        i += 1
    return text

if __name__ == '__main__':
    # Read trigrams from PAC names
    trigrams = {}
    with open(INPUT_FILENAME, 'rt') as infile:
        for line in infile:
            process_line(line, trigrams)

    # Output trigram data to JSON file
    with open(OUTPUT_FILENAME, 'wt') as outfile:
        # First convert tuple keys to strings (JSON can't handle tuple keys)
        t = dict(imap(lambda (k,v): (" ".join(k), v), trigrams.iteritems()))
        json.dump(t, outfile)

    # Generate some random strings
    for i in range(20):
        print random_string(random.randint(3,9))