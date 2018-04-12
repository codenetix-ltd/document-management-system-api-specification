FROM alpine

WORKDIR /data

COPY ./schema .

VOLUME /schema

ENTRYPOINT cp -r /data/* /schema
