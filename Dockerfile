FROM node:19.0-alpine As development

WORKDIR /app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:19.0-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV DATABASE_URL="mongodb+srv://admin:QurAaTCeqm6d5XQh@cluster0.xbnoc3e.mongodb.net/test?retryWrites=true&w=majority"
ENV JWT_SECRET="rj312po@@4jp231j5u3190u520913u4-291u4i21rwqrwqDD@@@!$fsfn2121"

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /app/dist ./dist

RUN npx prisma generate

EXPOSE 4000
CMD ["node", "dist/main"]