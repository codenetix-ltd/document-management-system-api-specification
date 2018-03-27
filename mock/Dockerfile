FROM node:9.8

WORKDIR /raml/mock

COPY schema .
COPY mock .

RUN npm install

COPY schema .
COPY mock .

RUN cat api.raml | sed 's/examplesJson: !include examples/examplesJson: !include mock_examples/g' > api_mock.raml
EXPOSE 80

ENTRYPOINT node .