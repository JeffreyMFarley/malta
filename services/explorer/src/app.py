import io
import logging
import os
import sys
import time
from collections import OrderedDict
from functools import lru_cache
from logging.config import dictConfig

import boto3
import numpy as np
import pandas as pd
import spacy
from flask import abort, Flask, jsonify, request

dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(module)s %(levelname)s: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://sys.stdout',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

from nlp import bagsOfWords, filter_for_words
from ts_ss import TS_SS
from vectorize import get_dimension_vectors

#------------------------------------------------------------------------------
# Globals & Constants
#------------------------------------------------------------------------------

# fail if gone
SOURCE_BUCKET = os.environ['SOURCE_BUCKET']
CORPUS_BUCKET = os.environ['CORPUS_BUCKET']

app = Flask(__name__)
s3 = boto3.resource('s3')
nlp = spacy.load('en_core_web_sm')

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


# https://stackoverflow.com/a/55900800
def get_ttl_hash(seconds=600):
    """Return the same value within `seconds` time period"""
    return round(time.time() / seconds)


#------------------------------------------------------------------------------
# S3 Helper functions
#------------------------------------------------------------------------------


@lru_cache(maxsize=1)
def available_docs(s3_resource, bucket_name, ttl_hash):
    bucket = s3_resource.Bucket(bucket_name)
    avail = {}

    for i, o in enumerate(bucket.objects.all()):
        object = s3_resource.Object(o.bucket_name, o.key)
        hash = o.e_tag.replace('"', '')
        avail[hash] = o.key

    return avail


def get_contents(s3_resource, bucket, key):
    object = s3_resource.Object(bucket, key)
    contents = object.get()['Body'].read().decode('utf-8', errors='ignore')
    return contents.split('\n')


def get_spdoc(s3_resource, bucket, etag, pipeline):
    doc_file = etag + '.spdoc'

    try:
        object = s3_resource.Object(bucket, doc_file)
        with io.BytesIO(object.get()['Body'].read()) as istream:
            docBin = spacy.tokens.DocBin().from_bytes(istream.getvalue())
        docs = list(docBin.get_docs(pipeline.vocab))
    except Exception as ex:
        logger.error(f'{bucket}/{doc_file}: {ex}')
        return None

    return docs[0]

#------------------------------------------------------------------------------
# Flask methods & routes
#------------------------------------------------------------------------------


@app.after_request
def allow_cors(response):
    response.access_control_allow_headers = ['Content-Type']
    response.access_control_allow_origin = '*'
    response.access_control_allow_methods = ['OPTIONS','POST','GET']
    return response


@app.route("/")
def root():
    avail = available_docs(s3, SOURCE_BUCKET, get_ttl_hash())
    return jsonify([
        {'file': v, 'url': request.base_url + k} for k, v in avail.items()
    ])


@app.route('/<string:id>')
@app.route('/<string:id>/')
def get(id):
    avail = available_docs(s3, SOURCE_BUCKET, get_ttl_hash())
    if id not in avail:
        abort(404)

    contents = get_contents(s3, SOURCE_BUCKET, avail[id])
    return jsonify(contents)


@app.route('/<string:id>/kwic')
@app.route('/<string:id>/kwic/')
def kwic(id):
    avail = available_docs(s3, SOURCE_BUCKET, get_ttl_hash())
    if id not in avail:
        abort(404)

    logger.info(f'Loading spaCy parse of {avail[id]}')
    doc = get_spdoc(s3, CORPUS_BUCKET, id, nlp)

    logger.info('Loading known words')
    known = set(nlp.vocab.strings)

    logger.info('Bag the words in the document')
    bags = bagsOfWords(doc, known)

    # # for subset in ['nouns', 'verbs', 'unknown', 'propers']:
    # #     logger.info(f'{subset}\n{bags[subset]}')
    # #

    return jsonify(bags['nouns'].to_string().split('\n'))


@app.route('/<string:id>/dimensions')
@app.route('/<string:id>/dimensions/')
def dimensions(id):
    avail = available_docs(s3, SOURCE_BUCKET, get_ttl_hash())
    if id not in avail:
        abort(404)

    logger.info(f'Loading spaCy parse of {avail[id]}')
    doc = get_spdoc(s3, CORPUS_BUCKET, id, nlp)

    logger.info('Get dimension vectors')
    vectorizer, vectors, labels = get_dimension_vectors(get_ttl_hash())

    # Peek at the raw values into a dataframe


    # df = pd.DataFrame(vectors.T.todense(),
    #                   index=vectorizer.get_feature_names(),
    #                   columns=labels)

    # Convert the spaCy document to a vector
    docs = [
        ' '.join([t.lemma_ for t in filter_for_words(doc)])
    ]
    input_vector = vectorizer.transform(docs)[0].todense()

    # # Score similarity
    # similarity = TS_SS()
    # _scores = [
    #     similarity(input_vector, v.todense())
    #     for v in vectors
    # ]
    #
    # # Create a Pandas series from the scores
    # ts_ss_scores = pd.Series(_scores, index=labels, name='score')
    #
    # # Make a data frame
    # df = ts_ss_scores.to_frame() #.reset_index().rename(columns={'index': 'File'})
    # df.sort_values(by='score', ascending=False, inplace=True)

    df = pd.DataFrame(input_vector.T, index=vectorizer.get_feature_names(), columns=['score'])
    df = df[df['score'] > 0.00]
    df.sort_values(by='score', ascending=False, inplace=True)

    return jsonify(df.to_string().split('\n'))


#------------------------------------------------------------------------------
# Main
#------------------------------------------------------------------------------

# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    app.debug = True
    app.run('0.0.0.0')
