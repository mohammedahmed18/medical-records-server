#!/bin/bash


docker-compose up -d 

npx prisma generate
npx prisma migrate dev