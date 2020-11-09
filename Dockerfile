FROM python:3.9-alpine

LABEL Author mcuve

ENV PYTHONUNBUFFERED 1

COPY requirements.txt requirements.txt 

RUN apk add --update --no-cache postgresql-client 

RUN apk add --update --no-cache --virtual .tmp \
    gcc libc-dev linux-headers postgresql-dev musl-dev zlib zlib-dev

RUN pip install -r ./requirements.txt

RUN apk del .tmp


WORKDIR /app

COPY app .


RUN adduser -D admin

USER admin

