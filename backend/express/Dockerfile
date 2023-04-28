FROM node:19-bullseye-slim AS blog-server-builder

USER node
WORKDIR /home/node/app

COPY index.ts ./
COPY tsconfig.json ./
COPY sequelize/models/* ./sequelize/models/
COPY sequelize/index.js ./sequelize/
COPY sequelize/extra-setup.js ./sequelize/
COPY express/routes/* ./express/routes/
COPY express/app.js ./express/
COPY express/helpers.js ./express/
COPY package.json ./

RUN npm install
RUN npm run build

FROM node:19-bullseye-slim AS blog-server

USER node
WORKDIR /home/node/app

COPY --from=blog-server-builder /home/node/app/dist/index.js ./
COPY --from=blog-server-builder /home/node/app/dist/sequelize/models/* ./sequelize/models/
COPY --from=blog-server-builder /home/node/app/dist/sequelize/index.js ./sequelize/
COPY --from=blog-server-builder /home/node/app/dist/sequelize/extra-setup.js ./sequelize/
COPY --from=blog-server-builder /home/node/app/dist/express/routes/* ./express/routes/
COPY --from=blog-server-builder /home/node/app/dist/express/app.js ./express/
COPY --from=blog-server-builder /home/node/app/dist/express/helpers.js ./express/
COPY package.json ./
COPY .env-docker ./.env

RUN npm install

CMD ["node", "index.js"]
