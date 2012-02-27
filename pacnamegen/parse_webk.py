"""
Parse FEC PAC summary file to produce list of PAC names.  FEC files can be
found at:
  http://www.fec.gov/finance/disclosure/ftpsum.shtml
Under the 'PAC Summary' files, for example for 2011-2012:
  ftp://ftp.fec.gov/FEC/webk12.zip
And the description of column data for the file at:
  ftp://ftp.fec.gov/FEC/data_dictionaries/webk.txt

Created by Tony DiCola tony@tonydicola.com
February 20, 2012
"""
from datetime import date

INPUT_FILENAME = "webk12.dat"
PAC_NAME_OUTPUT = "pacnames.txt"

def number(num):
  """
  Parse a string from FEC webk*.dat column as an integer number.  Format is 10 
  characters, starting with + or - to indicate sign and followed by 9 digits.
  """
  value = int(num[1:])
  if num[0] == '+':
    return value
  elif num[0] == '-':
    return value * -1
  else:
    return value

if __name__ == '__main__':
  # Define columns and their size for FEC webk12 data.
  fmt = (('id', 9, str),
         ('name', 90, str),
         ('type', 1, str),
         ('desig', 1, str),
         ('ff', 1, str),
         ('total_receipts', 10, number),
         ('from_affiliate_trans', 10, number),
         ('individual_cont', 10, number),
         ('other_cont', 10, number),
         ('cand_cont', 10, number),
         ('cand_loans', 10, number),
         ('total_loans', 10, number),
         ('total_dis', 10, number),
         ('to_affiliate_trans', 10, number),
         ('individual_refunds', 10, number),
         ('other_refunds', 10, number),
         ('cand_loan_repayments', 10, number),
         ('load_repayments', 10, number),
         ('cash_year_start', 10, number),
         ('cash_close', 10, number),
         ('debts_owed', 10, number),
         ('nonfed_transfers', 10, number),
         ('other_cont_to', 10, number),
         ('ind_expenditures', 10, number),
         ('party_expenditures', 10, number),
         ('nonfed_expenditures', 10, number),
         ('thru-month', 2, int),
         ('thru-day', 2, int),
         ('thru-year', 4, int))

  # Read each line as a PAC and parse appropriate columns
  with open(INPUT_FILENAME, 'rt') as infile:
    pacs = []
    for line in infile:
      pac = {}
      i = 0
      for (name, length, parser) in fmt:
        pac[name] = parser(line[i:i+length])
        i += length
      if pac['thru-year'] > 0:
        pac['thru-date'] = date(pac['thru-year'], pac['thru-month'], pac['thru-day'])
      pacs.append(pac)

  print 'Loaded', len(pacs), 'pacs!'

  # Output PAC names
  pacnames = "\n".join(map(lambda x: x['name'].strip(), pacs))
  with open(PAC_NAME_OUTPUT, "wt") as outfile:
    outfile.write(pacnames)

  # Calculate some stats for PACs who've recently updated their financials.
  rpacs = filter(lambda x: x['thru-year'] == 2012, pacs)
  print 'Total receipts', sum(map(lambda x: x['total_receipts'], rpacs))
  print 'Total disbursements', sum(map(lambda x: x['total_dis'], rpacs))
  print 'Total cash close', sum(map(lambda x: x['cash_close'], rpacs))