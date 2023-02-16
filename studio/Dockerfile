FROM node:19.0-alpine

WORKDIR /app

RUN npm install prisma --save-dev

COPY ../prisma .


ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}


RUN npx prisma generate
RUN npx prisma db push

EXPOSE 5555

CMD [ "npx" , "prisma" , "studio" ]


