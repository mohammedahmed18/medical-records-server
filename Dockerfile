FROM node:19.0-alpine As development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}


RUN npx prisma generate
RUN npx prisma db push
# RUN npx prisma studio


RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:prod"]