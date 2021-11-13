FROM node:lts
LABEL org.opencontainers.image.source="https://github.com/Crypthobin/crypthobin-ui-backend"

COPY . /app
WORKDIR /app

RUN yarn
RUN yarn build

CMD yarn start
