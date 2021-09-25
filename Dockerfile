FROM node:16-alpine as builder

RUN apk update && apk upgrade && \
    apk add --no-cache \
    ca-certificates wget curl

COPY index.ts package.json yarn.lock tsconfig.json webpack.config.js ./
RUN wget https://kenkoooo.com/atcoder/atcoder-api/v3/user/ac_rank?user=cl17 --header="accept-encoding:gzip" -O data.gz && \
    gunzip data.gz -c > data.json

RUN yarn install
RUN npx webpack

FROM node:16-alpine

ENV NODE_ENV "production"

COPY package.json yarn.lock ./
RUN yarn install --production

COPY --from=builder index.js .

CMD [ "node", "index.js" ]