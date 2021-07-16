import io
import logging
import os
from functools import lru_cache

from sklearn.feature_extraction.text import TfidfVectorizer

DIM_DIR = os.path.join(os.path.dirname(__file__), 'dimensions')
logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def get_dimension_vectors(ttl_hash):
    corpus = []  # The text of the file goes here
    labels = []  # The name of the file goes here

    for currentDir, _, files in os.walk(DIM_DIR):
        # Get the absolute path of the currentDir parameter
        currentDir = os.path.abspath(currentDir)

        # Traverse through all files
        for fileName in files:
            fullPath = os.path.join(currentDir, fileName)
            with io.open(fullPath, 'r', encoding='utf-8', errors='ignore') as f:
                contents = f.read()

            corpus.append(contents)
            labels.append(fileName)

    # Prepare a TF-IDF vectorizer that reads sing words and two-word pairs
    logger.info('Vectorizing')
    tfidf_vectorizer = TfidfVectorizer(ngram_range=(1, 2), lowercase=False)
    tfidf_vectors = tfidf_vectorizer.fit_transform(corpus)

    return tfidf_vectorizer, tfidf_vectors, labels


@lru_cache(maxsize=1)
def get_corpus_vectors(s3_resource, source_bucket, corpus_bucket, ttl_hash):
    corpus = []  # The text of the file goes here
    labels = []  # The name of the file goes here

    bucket = s3_resource.Bucket(source_bucket)
    for o in bucket.objects.all():
        logger.info(f'Reading {o.key}')
        doc = get_spdoc(corpus_bucket, o.e_tag.replace('"', ''))
        if doc is None:
            continue

        labels.append(o.key)
        corpus.append(' '.join([t.lemma_ for t in filter_for_words(doc)]))

    # Prepare a TF-IDF vectorizer that reads sing words
    logger.info('Vectorizing')
    tfidf_vectorizer = TfidfVectorizer(sublinear_tf=True)
    tfidf_vectors = tfidf_vectorizer.fit_transform(corpus)

    return tfidf_vectorizer, tfidf_vectors, labels
