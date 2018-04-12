FROM alpine

WORKDIR /data

COPY . .

RUN mkdir /schema

VOLUME /schema

ENTRYPOINT cp -r /data/* /schema
