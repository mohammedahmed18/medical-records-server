FROM node:19.0-alpine As development

WORKDIR /app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:19.0-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}


WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /app/dist ./dist

RUN npx prisma generate
RUN npx prisma db push

EXPOSE 4000
CMD ["node", "dist/main"]