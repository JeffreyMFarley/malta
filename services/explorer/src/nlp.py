import logging

import pandas as pd


logger = logging.getLogger(__name__)


def filter_for_words(doc):
    for token in doc:
        if (
            not token.is_stop and
            not token.is_punct and
            not token.is_digit and
            not token.is_space
        ):
            yield token


def bagsOfWords(doc, known):
    # Load the SpaCy doc as a data frame (1 token per row)
    attrs = [
        [T.text, T.lemma_, T.pos_, 1]
        for T in filter_for_words(doc)
    ]
    df = pd.DataFrame(attrs, columns=['word', 'lemma', 'pos', 'count'])

    # Identify the words not in the known vocabulary
    df['known'] = df['lemma'].apply(lambda x: x in known)

    # Partiion the datasets
    df_known = df[df['known'] == True]
    df_unknown = df[df['known'] == False]

    # Create a pivot of lemma x part of speech
    reduced = df_known.groupby(['pos', 'lemma'])['count'].count().unstack(0)

    # Proper nouns may or may not be in the corpus
    propers = df.groupby(['pos', 'word'])['count'].count().unstack(0)

    # Make the panel
    bags = {
        'all_lemmas': df_known.groupby('lemma')['count'].count(),
        'propers': propers.loc[propers['PROPN'].notna(), 'PROPN'],
        'nouns': reduced.loc[reduced['NOUN'].notna(), 'NOUN'],
        'verbs': reduced.loc[reduced['VERB'].notna(), 'VERB'],
        'unknown': df_unknown.groupby('word')['count'].count()
    }

    # Fix the data sets
    #    1. Make sure the column is 'count' and not 'NOUN' or 'VERB'
    #    2. Change from a Series to a DataFrame
    #    3. Instead of "lemma' as the index/label, replace it with a ranged index
    for k, v in bags.items():
        bags[k] = v.rename('count').to_frame().reset_index()

    # Remove the proper nouns from unknown
    dups = bags['unknown'].merge(
        bags['propers'],
        on='word',
        how='left',
        indicator=True,
        suffixes=(None, '_y')
    )

    bags['unknown'] = dups[dups['_merge'] == 'left_only'].drop(
        columns=['_merge', 'count_y']
    )

    return bags
