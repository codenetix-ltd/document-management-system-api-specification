FROM alpine

WORKDIR /data

COPY . .

RUN chmod +x entrypoint.sh

RUN mkdir /schema

VOLUME /schema

ENTRYPOINT ['./entrypoint.sh']
