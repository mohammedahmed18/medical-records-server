# FROM node:19.0-alpine As production
FROM ubuntu:20.04

WORKDIR /app


# Update APT packages - Base Layer
RUN apt-get update \
    && apt-get upgrade --yes \
    && DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends --yes wget curl



ARG DEBIAN_FRONTEND=noninteractive


# install postgres & nodejs
RUN apt-get install -y gnupg2 lsb-release \
    && sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list' \ 
    && wget --no-check-certificate --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
    && curl -sL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y nodejs \
    && apt update \
    && apt-get install -y --no-install-recommends postgresql-15 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


# Clean up cache file - Service tech@appsmith.comlayer
RUN rm -rf \
    /root/.cache \
    /root/.npm \
    /root/.pip \
    /usr/local/share/doc \
    /usr/share/doc \
    /usr/share/man \
    /var/lib/apt/lists/* \
    /tmp/*


# Define volumes - Service Layer
VOLUME [ "/stacks" ]


COPY .env.example .env

COPY package*.json ./


ENV NODE_VERSION=14.20.1
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"


RUN npm install --legacy-peer-deps \
    && npm i -g pnpm



ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Configure PostgreSQL
RUN echo "host all all 0.0.0.0/0 trust" >> /etc/postgresql/15/main/pg_hba.conf \
    && echo "listen_addresses='*'" >> /etc/postgresql/15/main/postgresql.conf

RUN service postgresql start \
    && su - postgres -c "psql -c \"CREATE USER admin PASSWORD '${DB_PASSWORD}';\"" \
    && su - postgres -c "psql -c 'ALTER USER admin CREATEDB;'" \
    && su - postgres -c "psql -c 'ALTER USER admin WITH SUPERUSER;'"

# install redis server
RUN apt-get update \ 
    && apt-get install -y redis-server && apt-get clean && rm -rf /var/lib/apt/lists/*


COPY . .

RUN npx prisma generate && npx prisma db push

RUN npm run build
RUN echo 'vm.overcommit_memory = 1' >> /etc/sysctl.conf

EXPOSE 3000

CMD service redis-server start && npm start
