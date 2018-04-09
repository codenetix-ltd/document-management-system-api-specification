FROM node:9.8

WORKDIR /raml/mock

COPY schema .
COPY mock .

RUN npm install

COPY schema .
COPY mock .

EXPOSE 80

ENTRYPOINT node .