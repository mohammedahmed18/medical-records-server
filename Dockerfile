FROM node:19.0-alpine

WORKDIR /app

COPY package.json ./

RUN npm i -g pnpm

RUN pnpm i

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}


RUN npx prisma generate
RUN npx prisma db push
# RUN npx prisma studio


RUN pnpm run build

EXPOSE 4000

CMD ["pnpm", "run", "start:prod"]