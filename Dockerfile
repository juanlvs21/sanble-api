FROM node: as build-image

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./src

RUN yarn install
RUN npx tsc

########################

FROM node:20.14.0-alpine

WORKDIR /usr/src/app

COPY --from=build-image ./usr/src/app/build ./build

COPY package*.json ./
RUN yarn install --production

COPY . .

EXPOSE 8080

CMD [ "yarn", "start" ]