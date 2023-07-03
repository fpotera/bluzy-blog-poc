FROM node:19-bullseye-slim AS blog-ui-builder

WORKDIR /home/node/app

COPY frontend/angular.json ./
COPY frontend/package.json ./
COPY frontend/tsconfig.json ./
COPY frontend/projects/blog/tsconfig.app.json ./projects/blog/
COPY frontend/projects/blog/tsconfig.spec.json ./projects/blog/
COPY frontend/projects/blog/src/favicon.ico ./projects/blog/src/
COPY frontend/projects/blog/src/index.html ./projects/blog/src/
COPY frontend/projects/blog/src/main.ts ./projects/blog/src/
COPY frontend/projects/blog/src/styles.sass ./projects/blog/src/
COPY frontend/projects/blog/src/app/ ./projects/blog/src/app/
COPY frontend/projects/blog/src/assets/* ./projects/blog/src/assets/

RUN npm install
RUN npm install -g @angular/cli
RUN ng build

FROM node:19-bullseye-slim AS blog-server-builder

USER node
WORKDIR /home/node/app

COPY backend/express/index.ts ./
COPY backend/express/tsconfig.json ./
COPY backend/express/sequelize/models/* ./sequelize/models/
COPY backend/express/sequelize/index.ts ./sequelize/
COPY backend/express/sequelize/extra-setup.ts ./sequelize/
COPY backend/express/express/routes/* ./express/routes/
COPY backend/express/express/app.ts ./express/
COPY backend/express/express/helpers.ts ./express/
COPY backend/express/package.json ./

RUN npm install
RUN npm run build

FROM node:19-bullseye-slim AS blog-server

USER node
WORKDIR /home/node/app

COPY --from=blog-ui-builder /home/node/app/dist/blog/* ./public/
COPY --from=blog-server-builder /home/node/app/dist/index.js ./
COPY --from=blog-server-builder /home/node/app/dist/sequelize/models/* ./sequelize/models/
COPY --from=blog-server-builder /home/node/app/dist/sequelize/index.js ./sequelize/
COPY --from=blog-server-builder /home/node/app/dist/sequelize/extra-setup.js ./sequelize/
COPY --from=blog-server-builder /home/node/app/dist/express/routes/* ./express/routes/
COPY --from=blog-server-builder /home/node/app/dist/express/app.js ./express/
COPY --from=blog-server-builder /home/node/app/dist/express/helpers.js ./express/
COPY backend/express/package.json ./
COPY backend/express/.env.development.docker ./.env
COPY backend/express/keycloak.docker.json ./keycloak.json

RUN npm install

CMD ["node", "index.js"]
