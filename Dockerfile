FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM steebchen/nginx-spa:stable

COPY --from=builder /app/dist/ /app

EXPOSE 80

CMD ["nginx"]
