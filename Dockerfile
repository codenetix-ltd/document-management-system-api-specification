FROM alpine

WORKDIR /data

COPY . .

RUN mkdir /schema

VOLUME /schema

ENTRYPOINT rm -rf /schema/* && cp -r /data/* /schema
