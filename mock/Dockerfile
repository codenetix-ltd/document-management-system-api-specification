FROM node:9.8
RUN npm install -g osprey-mock-service

WORKDIR /raml/mock

COPY schema .
COPY mock/start.sh .


RUN cat api.raml | sed 's/examplesJson: !include examples/examplesJson: !include mock_examples/g' > api_mock.raml
RUN chmod +x start.sh
EXPOSE 80

ENTRYPOINT ./start.sh