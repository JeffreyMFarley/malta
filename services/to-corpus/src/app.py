import boto3
import json
import io
import logging
import os
import re
import sys
import traceback
from collections import Counter
from urllib.parse import unquote_plus

import spacy


BULLET = 0xB7
BYTE_CR = '\n'.encode('utf-8')
WHITESPACE = (' ', '\n', '\t', '\r')

regexNumberOutline = re.compile('^[0-9.]+ [A-Z]')


logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


# -----------------------------------------------------------------------------

def buildPunctuationReplace():
    table = {0xa0: ' ',    # non-breaking space
             0xa6: '|',
             0xb4: '\'',
             0xb6: '*',
             0xd7: 'x',

             0x2022: BULLET,   # bullet
             0x2023: BULLET,   # triangular bullet
             0x2024: '.',  # one dot leader
             0x2026: '',   # ellipses
             0x2027: '*',  # hyphenation point
             0x2028: ' ',  # Line separator
             0x2029: ' ',  # Paragraph separator
             0x202f: ' ',  # Narrow no-break space
             0x2032: "'",  # prime
             0x2033: '"',  # double prime
             0x2035: "'",  # reversed prime
             0x2036: '"',  # reversed double prime
             0x2039: '<',
             0x203a: '>',
             0x2043: BULLET,  # hyphen bullet
             0x2044: '/',
             0x204e: '*',
             0x2053: '~',
             0x205F: ' ',  # Medium Mathematical Space
             0x2060: ' ',  # Word-Joiner
             0x2219: BULLET,   # bullet operator
             0x25CB: BULLET,   # white circle
             0x25A1: BULLET,   # white square
             0x25CF: BULLET,   # black circle
             0x25E6: BULLET,   # white bullet
             0x2610: BULLET,   # ballot box
             0x2612: BULLET,   # ballot box with x
             0x3000: ' ',  # Ideographic Space
             }
    table.update({c: ' ' for c in range(0x2000, 0x200b)}) # Unicode spaces
    table.update({c: None for c in range(0x200b, 0x200e)}) # Zero-width spaces
    table.update({c: '-' for c in range(0x2010, 0x2015)}) # Unicode hyphens
    table.update({c: "'" for c in range(0x2018, 0x201b)}) # smart single quotes
    table.update({c: '"' for c in range(0x201c, 0x201f)}) # smart double quotes

    return table


# --------------------------------------------------------------------------------
# Helper Function


def safe_last(s):
    return '' if len(s) == 0 else s[-1]


def hexify(s):
    return ' '.join(['{:04X}'.format(ord(c)) for c in s])

def isLastCharWhitespace(s):
    x = safe_last(s)
    return x == '' or x in WHITESPACE


def build_sentences(doc, replacements):
    def startOfSentence(tok, buffer):
        bullet_point = tok.is_punct and tok.text == BULLET
        return bullet_point

    def endOfSentence(tok, buffer):
        outline = regexNumberOutline.match(buffer) is not None and tok.text.count('\n') > 0
        is_multi_newline = tok.is_space and tok.text.count('\n') > 1
        return is_multi_newline or outline

    def addToList(sentence, collection):
        x = sentence.strip()
        if len(x) > 0:
            collection.append(x)

    nonascii = Counter()
    sents = []
    for i, sent in enumerate(doc.sents):
        s = ''
        for tok in sent:
            nonascii.update([ord(c) for c in tok.text_with_ws if ord(c) > 127])

            if startOfSentence(tok, s):
                # logger.info(f'[{i} {len(sents)}] SOS "{s}"< - >"{tok.text}""{tok.whitespace_}"')
                addToList(s, sents)
                s = '' if tok.text in WHITESPACE else tok.text

            elif endOfSentence(tok, s):
                # logger.info(f'[{i} {len(sents)}] EOS "{s}"+"{hexify(tok.text)}"')
                s += tok.text if tok.is_punct else ''
                addToList(s, sents)
                s = ''

            elif tok.is_space:
                replace_space = '' if isLastCharWhitespace(s) else ' '
                # logger.info(f'[{i} {len(sents)}] SPA "{s}"+"{replace_space}" { ord(tok.text):04X}')
                s += replace_space

            else:
                s += tok.text_with_ws

        # logger.info(f'[{i} {len(sents)}] EOT "{s}"')
        addToList(s, sents)

    return sents, nonascii

# --------------------------------------------------------------------------------
# Main

nlp = spacy.load('en_core_web_sm')
replacements = buildPunctuationReplace()

def root_handler(event, context):
    dest_bucket = os.environ['TARGET_BUCKET']  # fail if gone

    record = event['Records'][0]

    # Extract the important information
    bucket = record['s3']['bucket']['name']
    key = unquote_plus(record['s3']['object']['key'])

    # Set up the return
    response = {
        'source': f'{bucket}/{key}',
        'result': f'normalized to {dest_bucket}/{key}'
    }

    try:
        # Get the bytes from the file
        s3 = boto3.client('s3')
        blob = s3.get_object(Bucket=bucket, Key=key)
        with io.BytesIO(blob['Body'].read()) as istream:
            logger.info(f'Parsing {bucket}/{key} in spaCy')
            doc = nlp(istream.getvalue().decode().translate(replacements))

        logger.info(f'Building sentences')
        sents, nonascii = build_sentences(doc, replacements)

        with io.BytesIO() as ostream:
            for i, s in enumerate(sents):
                # logger.info(f'[{i}]: "{s}"')
                ostream.write(s.encode('utf-8'))
                ostream.write(BYTE_CR)

            ostream.seek(0)
            s3.upload_fileobj(ostream, dest_bucket, key)

        logger.info('Non-ASCII Replacements Made')
        for k in sorted(nonascii):
            logger.info('0x{:04X}\t{}\t{}'.format(
                k, nonascii[k], replacements.get(k, 'miss.'))
            )

    except Exception as ex:
        for fncall in traceback.format_exception(*sys.exc_info()):
            logger.debug(fncall)
        s = f'{ex}'
        response['result'] = s
        logger.error(json.dumps(response))
        return response

    logger.info(json.dumps(response))
    return response
