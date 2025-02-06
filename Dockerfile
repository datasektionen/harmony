FROM node:21-alpine3.18 AS base

WORKDIR /app

FROM base AS src

COPY package.json package-lock.json ./

RUN npm ci

COPY src/ src/
COPY tsconfig.json ./

FROM src AS build

RUN npm run build

FROM base AS run

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY ./assets ./assets

CMD ["npm", "start"]
