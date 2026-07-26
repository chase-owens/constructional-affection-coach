FROM node:22

WORKDIR /app

COPY package.json package-lock.json ./

COPY constructional-affection-coach/package.json ./constructional-affection-coach/package.json
COPY lambdas/package.json ./lambdas/package.json
COPY infra/package.json ./infra/package.json

RUN npm ci

COPY . .

CMD ["npm", "run", "check"]