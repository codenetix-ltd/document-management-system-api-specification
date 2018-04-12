FROM alpine

WORKDIR /data

COPY . .

VOLUME /schema

ENTRYPOINT cp -r /data/* /schema
