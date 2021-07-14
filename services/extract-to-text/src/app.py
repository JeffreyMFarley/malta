import boto3
import json
import io
import logging
import os
import re
import sys
import traceback
import zipfile
from os.path import splitext
from urllib.parse import unquote_plus
from xml.etree.ElementTree import XML

import pdfplumber

BULLET = 0xB7
BYTE_CR = '\n'.encode('utf-8')

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

regexNoSpaceOutline = re.compile('([0-9.]+)([A-Za-z]+)')

# --------------------------------------------------------------------------------
# Helpers


def buildReplaceTable():
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
             0x2028: '\n',  # Line separator
             0x2029: '\n',  # Paragraph separator
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
# Copy


def handle_copy(client, istream, dest_bucket, key):
    client.upload_fileobj(istream, dest_bucket, key)
    return f'copied to {dest_bucket}/{key}'


# --------------------------------------------------------------------------------
# Docx

def handle_docx(client, istream, dest_bucket, key):
    """
    Take the path of a docx file as argument, return the text in unicode.
    (Inspired by python-docx <https://github.com/mikemaccana/python-docx>)
    """
    WORD_NAMESPACE = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
    PARA = WORD_NAMESPACE + 'p'
    TEXT = WORD_NAMESPACE + 't'

    replacements = buildReplaceTable()

    document = zipfile.ZipFile(istream)
    xml_content = document.read('word/document.xml')
    document.close()
    tree = XML(xml_content)

    with io.BytesIO() as ostream:
        for i, paragraph in enumerate(tree.iter(PARA)):
            texts = [node.text.translate(replacements)
                     for node in paragraph.iter()
                     if node.text]
            if texts:
                s = ''.join(texts)
                m = regexNoSpaceOutline.match(s)
                if m:
                    g = m.groups()
                    bad = f'{g[0]}{g[1]}'
                    good = f'{g[0]} {g[1]}'
                    s = s.replace(bad, good)

                ostream.write(s.encode('utf-8'))
                ostream.write(BYTE_CR)

        ostream.seek(0)
        client.upload_fileobj(ostream, dest_bucket, key)

    return f'docx converted to {dest_bucket}/{key}'


# --------------------------------------------------------------------------------
# PDF

def handle_pdf(client, istream, dest_bucket, key):
    previousPageHeader = ['', '', '', '', '']
    replacements = buildReplaceTable()

    with pdfplumber.open(istream) as pdf:
        with io.BytesIO() as ostream:
            for i, page in enumerate(pdf.pages):
                content = page.extract_text().translate(replacements)
                lines = content.split('\n')

                # - Logic for removing identical headers
                pageHeader = lines[0:4]
                thisPage = f'Page {i + 1}'
                same = set()

                for j, l in enumerate(pageHeader):
                    if l == previousPageHeader[j]:
                        same.add(j)
                    elif thisPage in l or thisPage.lower() in l:
                        same.add(j)

                # Check last line
                if thisPage in lines[-1] or thisPage.lower() in lines[-1]:
                    same.add(len(lines) - 1)

                content = '\n'.join([
                    l.strip()
                    for j, l in enumerate(lines)
                    if j not in same
                ])

                if same:
                    ll = '\n'.join([lines[j] for j in list(same)])
                    logger.info(f'Page {i}: Removed Header(s)\n{ll}')

                previousPageHeader = pageHeader
                # /Logic

                # content = replace_characters(table, content, True)
                ostream.write(content.encode('utf-8'))
                ostream.write(BYTE_CR)

            ostream.seek(0)
            client.upload_fileobj(ostream, dest_bucket, key)

    return f'PDF converted to {dest_bucket}/{key}'


# --------------------------------------------------------------------------------
# Main

HANDLERS = {
    '.docx': handle_docx,
    '.pdf': handle_pdf,
    '.txt': handle_copy,
}

def root_handler(event, context):
    dest_bucket = os.environ['TARGET_BUCKET']  # fail if gone

    record = event['Records'][0]

    # Extract the important information
    bucket = record['s3']['bucket']['name']
    key = unquote_plus(record['s3']['object']['key'])
    (root, ext) = splitext(key)
    ext = ext.lower()

    # Set up the return
    response = {
        'source': f'{bucket}/{key}',
        'result': ''
    }

    # Early exit, unknown extension
    if ext not in HANDLERS:
        s = f"Unrecognized extension '{ext}'. No action taken."
        response['result'] = s
        logger.warn(json.dumps(response))
        return response

    try:
        # Get the bytes from the new file
        s3 = boto3.client('s3')
        blob = s3.get_object(Bucket=bucket, Key=key)
        with io.BytesIO(blob['Body'].read()) as stream:
            # Convert the file
            response['result'] = HANDLERS[ext](
                s3, stream, dest_bucket, root + '.txt'
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
