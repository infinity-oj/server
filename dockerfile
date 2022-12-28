FROM node:16-alpine as builder-with-pnpm

ENV NODE_ENV build
RUN npm --registry https://registry.npm.taobao.org install -g pnpm

FROM builder-with-pnpm as builder

WORKDIR /home/node

# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml ./

RUN pnpm --registry https://registry.npm.taobao.org fetch

COPY --chown=node:node . .
RUN pnpm install -r --offline
RUN pnpm run build \
    && pnpm prune --production

# ---

FROM node:16-alpine

RUN echo "Asia/shanghai" > /etc/timezone

USER node
ENV PORT 3000
ENV NODE_ENV production
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

HEALTHCHECK --interval=5s --timeout=3s \
  CMD wget --spider -q http://127.0.0.1:3000 || exit 1
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
