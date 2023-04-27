FROM node:19-bullseye-slim AS server

USER node
WORKDIR /home/node/app

COPY dist/index.js ./
COPY dist/sequelize/models/* ./sequelize/models/
COPY dist/sequelize/index.js ./sequelize/
COPY dist/sequelize/extra-setup.js ./sequelize/
COPY dist/express/routes/* ./express/routes/
COPY dist/express/app.js ./express/
COPY dist/express/helpers.js ./express/
COPY package.json ./
COPY .env-docker ./.env

RUN npm install

CMD ["node", "index.js"]
