FROM python:3

WORKDIR /usr/src/app

COPY setup.py ./
COPY README.md ./
COPY docker-entrypoint.sh ./
RUN pip install -e '.[testing]'

COPY ./src ./
ENTRYPOINT ["./docker-entrypoint.sh"]
