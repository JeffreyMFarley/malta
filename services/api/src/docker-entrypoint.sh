#!/bin/sh

set -e

python manage.py migrate
python manage.py loaddata initial_tags
python manage.py runserver "0:$PORT0"
