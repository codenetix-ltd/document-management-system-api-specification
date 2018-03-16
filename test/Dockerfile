FROM node:9.8
WORKDIR /raml/test

RUN npm install --save oas-raml-converter
RUN sed -i "1s/ --harmony//" node_modules/oas-raml-converter/lib/bin/converter.js #fix converter for run in docker
RUN npm install --no-optional -g dredd

COPY schema .

RUN ./node_modules/oas-raml-converter/lib/bin/converter.js --from raml --to oas20 api.raml > swagger.json

ENTRYPOINT dredd swagger.json $TESTING_URI
