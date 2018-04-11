FROM node:9.8
WORKDIR /generator
COPY ./generator .

RUN npm i

RUN chmod +x entrypoint.sh && chmod +x start.sh

RUN mkdir /workschema /out

VOLUME /out
ENTRYPOINT ["./entrypoint.sh"]
CMD ["./start.sh"]