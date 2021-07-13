import io
import logging
import os
import sys
import time
from functools import lru_cache

import boto3
import numpy as np
import pandas as pd
import spacy
from flask import abort, Flask, jsonify, request
from sklearn.feature_extraction.text import TfidfVectorizer


BUCKET = os.environ['SOURCE_BUCKET']  # fail if gone


logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


app = Flask(__name__)
s3 = boto3.resource('s3')
nlp = spacy.load('en_core_web_sm', exclude=['ner', 'lemmatizer', 'textcat'])


#------------------------------------------------------------------------------
# Helper functions
#------------------------------------------------------------------------------


def filter_tokens(doc):
    for token in doc:
        if (
            not token.is_punct and
            not token.is_space
        ):
            yield token


def get_contents(bucket, key):
    object = s3.Object(bucket, key)
    contents = object.get()['Body'].read().decode('utf-8', errors='ignore')
    return contents.split('\n')

#------------------------------------------------------------------------------
# Caching functions
#------------------------------------------------------------------------------


# https://stackoverflow.com/a/55900800
def get_ttl_hash(seconds=600):
    """Return the same value within `seconds` time period"""
    return round(time.time() / seconds)


@lru_cache(maxsize=1)
def available_docs(bucket_name, ttl_hash):
    bucket = s3.Bucket(bucket_name)
    avail = {}

    for i, o in enumerate(bucket.objects.all()):
        object = s3.Object(o.bucket_name, o.key)
        hash = o.e_tag.replace('"', '')
        avail[hash] = o.key

    return avail


@lru_cache(maxsize=1)
def load_corpus(bucket_name, ttl_hash):
    corpus = []  # The text of the file goes here
    labels = []  # The name of the file goes here

    bucket = s3.Bucket(bucket_name)
    for o in bucket.objects.all():
        print(f'Reading {o.key}')
        sys.stdout.flush()
        contents = o.get()['Body'].read().decode('utf-8', errors='ignore')

        labels.append(o.key)
        corpus.append(contents)

    return corpus, labels

@lru_cache(maxsize=1)
def get_tfidf_vectors(bucket_name, ttl_hash):
    corpus, labels = load_corpus(bucket_name, ttl_hash)

    print(f'Parsing docs')
    sys.stdout.flush()
    docs = [
        ' '.join([t.norm_ for t in filter_tokens(doc)])
        for doc in nlp.pipe(corpus)
    ]

    # Prepare a TF-IDF vectorizer that reads sing words and two-word pairs
    print(f'Vectorizing')
    sys.stdout.flush()
    tfidf_vectorizer = TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True)
    tfidf_vectors = tfidf_vectorizer.fit_transform(docs)

    return tfidf_vectorizer, tfidf_vectors

#------------------------------------------------------------------------------
# Routes
#------------------------------------------------------------------------------


@app.after_request
def after_request_func(response):
    response.access_control_allow_headers = ['Content-Type']
    response.access_control_allow_origin = '*'
    response.access_control_allow_methods = ['OPTIONS','POST','GET']
    return response


@app.route("/")
def root():
    avail = available_docs(BUCKET, get_ttl_hash())
    return jsonify([
        {'file': v, 'url': request.base_url + k} for k, v in avail.items()
    ])


@app.route('/<string:id>')
def get(id):
    avail = available_docs(BUCKET, get_ttl_hash())
    if id not in avail:
        abort(404)

    contents = get_contents(BUCKET, avail[id])
    return jsonify(contents)


@app.route('/<string:id>/kwic')
def kwic(id):
    avail = available_docs(BUCKET, get_ttl_hash())
    if id not in avail:
        abort(404)

    print(f'Get TFIDF vectors')
    sys.stdout.flush()
    tfidf_vectorizer, tfidf_vectors = get_tfidf_vectors(BUCKET, get_ttl_hash())

    # Peek at the raw values
    df = pd.DataFrame(tfidf_vectors.T.todense(),
                      index=tfidf_vectorizer.get_feature_names())
    print(df)
    sys.stdout.flush()

    return jsonify(tfidf_vectorizer.get_feature_names())


#------------------------------------------------------------------------------
# Main
#------------------------------------------------------------------------------

# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    app.debug = True
    app.run('0.0.0.0')
