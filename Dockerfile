FROM node:19.0-alpine As development

WORKDIR /app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:19.0-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV DATABASE_URL="postgres://admin:rin9NCQVsKrFg3rQB9uFTzi1RIknxQUS@dpg-ceu72t6n6mpglqbuuoog-a/medical_records"
ENV JWT_SECRET="rj312po@@4jp231j5u3190u520913u4-291u4i21rwqrwqDD@@@!$fsfn2121"

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /app/dist ./dist

RUN npx prisma generate
RUN npx prisma db push

EXPOSE 4000
CMD ["node", "dist/main"]