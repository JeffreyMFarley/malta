#!/bin/sh

set -e

python manage.py migrate
python manage.py runserver "0:$PORT0"
