FROM node:lts-alpine3.19

RUN yarn set version stable
RUN yarn -v

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn build