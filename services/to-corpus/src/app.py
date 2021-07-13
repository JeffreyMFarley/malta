import boto3
import json
import io
import logging
import os
import sys
import traceback
from os.path import splitext
from urllib.parse import unquote_plus

import spacy


logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


# --------------------------------------------------------------------------------
# Main

nlp = spacy.load('en_core_web_sm')


def root_handler(event, context):
    dest_bucket = os.environ['TARGET_BUCKET']  # fail if gone

    record = event['Records'][0]

    # Extract the important information
    bucket = record['s3']['bucket']['name']
    key = unquote_plus(record['s3']['object']['key'])
    etag = record['s3']['object']['eTag']
    (root, ext) = splitext(key)

    # Set up the return
    doc_file = etag + '.spdoc'
    vocab_file = etag + '.vocab'
    response = {
        'source': f'{bucket}/{key}',
        'document': f'{dest_bucket}/{doc_file}',
        'vocabulary': f'{dest_bucket}/{vocab_file}',
    }

    try:
        # Get the bytes from the file
        s3 = boto3.client('s3')
        blob = s3.get_object(Bucket=bucket, Key=key)
        with io.BytesIO(blob['Body'].read()) as istream:
            logger.info(f'Parsing {bucket}/{key} in spaCy')
            doc = nlp(istream.getvalue().decode())

        with io.BytesIO() as ostream:
            logger.info(f"Writing document to {response['document']}")
            ostream.write(doc.to_bytes())
            ostream.seek(0)
            s3.upload_fileobj(ostream, dest_bucket, doc_file)

        with io.BytesIO() as ostream:
            logger.info(f"Writing vocabulary to {response['vocabulary']}")
            ostream.write(doc.vocab.to_bytes())
            ostream.seek(0)
            s3.upload_fileobj(ostream, dest_bucket, vocab_file)

    except Exception as ex:
        for fncall in traceback.format_exception(*sys.exc_info()):
            logger.debug(fncall)
        s = f'{ex}'
        response['result'] = s
        logger.error(json.dumps(response))
        return response

    logger.info(json.dumps(response))
    return response
