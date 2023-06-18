#!/bin/bash

docker rm medical-records-cache && docker-compose up -d

npx prisma generate
npx prisma migrate dev
npm run dev:old

npm run pm2 logs medical-records-server 
