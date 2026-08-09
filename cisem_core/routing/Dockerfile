# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260809-MODEL-ROUTER
# governor_signature: GOV-YARIV-20260809-MODEL-ROUTER-V1
# version: V1.0
# reasoning: |
#   Dockerfile specification packaging the Node.js model routing proxy daemon service.
#   Parent principles: AxiomsAndPrinciples V1.26 >PR-11200, >PR-11300.

FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000

CMD ["node", "dist/index.js"]
