FROM python:3

WORKDIR /usr/src/app

COPY setup.py ./
COPY README.md ./
RUN pip install -e '.[testing]'

COPY ./src ./
ENTRYPOINT ["./docker-entrypoint.sh"]
