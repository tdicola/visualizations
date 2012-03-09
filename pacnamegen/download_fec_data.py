import urllib2, logging
from ConfigParser import SafeConfigParser
from decimal import Decimal
from pandas import *


LOG_FILENAME='download_fec_data.log'
CONFIG_FILENAME='download_fec_data.ini'


def download_csv(url):
    """Download CSV file from url and return the data."""
    logging.info('Downloading %s', url)
    response = urllib2.urlopen(url)
    if response.info().gettype() != 'text/x-csv':
        raise ValueError('Expected text/x-csv but got %s' % \
            response.info().gettype())
    data = response.read()
    return data

def save_file(data, filename):
    """Overwrite filename with the specified data."""
    logging.info('Saving %d bytes to %s.', len(data), filename)
    with open(filename, 'wb') as output:
        output.write(data)


if __name__ == '__main__':
    logging.basicConfig(
        filename=LOG_FILENAME, 
        format='%(asctime)s:%(levelname)s:%(message)s', 
        level=logging.DEBUG)
    logging.info('Starting download_fec_data.')
    parser = SafeConfigParser()
    parser.read(CONFIG_FILENAME)
    for sn in parser.sections():
        logging.info('Processing %s.', sn)
        try:
            data = download_csv(parser.get(sn, 'url'))
            save_file(data, parser.get(sn, 'filename'))
        except Exception as ex:
            logging.error("Couldn't process %s: %s", sn, ex)
