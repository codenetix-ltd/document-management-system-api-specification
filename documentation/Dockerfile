FROM node:9.8
RUN npm install -g raml2html

WORKDIR /raml/doc

COPY schema .
COPY documentation/server.js .

RUN raml2html api.raml > api_doc.html
EXPOSE 80

ENTRYPOINT node server.js