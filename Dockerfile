FROM node:16-alpine as builder

COPY index.ts package.json yarn.lock tsconfig.json webpack.config.js ./

RUN yarn install
RUN npx webpack

FROM node:16-alpine

ENV NODE_ENV "production"

COPY package.json yarn.lock ./
RUN yarn install --production

COPY --from=builder index.js .

CMD [ "node", "index.js" ]