import boto3
import json
import io
import logging
import os
import sys
import traceback
import zipfile
from os.path import splitext
from urllib.parse import unquote_plus
from xml.etree.ElementTree import XML

import pdfplumber


BYTE_CR = '\n'.encode('utf-8')

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


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

    document = zipfile.ZipFile(istream)
    xml_content = document.read('word/document.xml')
    document.close()
    tree = XML(xml_content)

    with io.BytesIO() as ostream:
        for paragraph in tree.iter(PARA):
            texts = [node.text
                     for node in paragraph.iter(TEXT)
                     if node.text]
            if texts:
                ostream.write(''.join(texts).encode('utf-8'))
                ostream.write(BYTE_CR)

        ostream.seek(0)
        client.upload_fileobj(ostream, dest_bucket, key)

    return f'docx converted to {dest_bucket}/{key}'


# --------------------------------------------------------------------------------
# PDF

def handle_pdf(client, istream, dest_bucket, key):
    previousPageHeader = ['', '', '', '', '']

    with pdfplumber.open(istream) as pdf:
        with io.BytesIO() as ostream:
            for i, page in enumerate(pdf.pages):
                content = page.extract_text()
                lines = content.split('\n')

                # - Logic for removing identical headers
                pageHeader = lines[0:4]
                same = set()

                for j, l in enumerate(pageHeader):
                    if l == previousPageHeader[j]:
                        same.add(j)

                content = '\n'.join([
                    l
                    for j, l in enumerate(lines)
                    if j not in same
                ])

                if same:
                    ll = '\n'.join([lines[j] for j in list(same)])
                    logger.info(f'Page {i}: Removed Header\n"{ll}"')

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
