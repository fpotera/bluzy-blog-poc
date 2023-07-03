/*  Copyright 2023 Florin Potera

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import express, { Express, Request, Response, NextFunction } from 'express';
import session, { MemoryStore } from 'express-session';
import { json, urlencoded } from 'body-parser';
import { join } from 'path';
import { existsSync } from 'fs';

import Keycloak from 'keycloak-connect';

import { UsersCRUDOps } from './routes/users';
import { CRUD } from './routes/crud';

const memoryStore = new MemoryStore();

const routes: {[index:string]: CRUD} = {
	users: new UsersCRUDOps()
};

const app: Express = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(session({
	secret: 'some secret',
	resave: false,
	saveUninitialized: true,
	store: memoryStore
}));

const keycloak = new Keycloak({
	store: memoryStore
});

app.use(keycloak.middleware({
	logout: '/logout',
	admin: '/'
}));

function makeHandlerAwareOfAsyncErrors(handler: any) {
	return async function(req: Request, res: Response, next: NextFunction) {
		try {
			await handler(req, res);
		} catch (error) {
			next(error);
		}
	};
}

for (const [routeName, routeController] of Object.entries(routes)) {
	if (routeController.getAll) {
		app.get(
			`/api/${routeName}`,
			keycloak.protect(),
			makeHandlerAwareOfAsyncErrors(routeController.getAll)
		);
	}
	if (routeController.getById) {
		app.get(
			`/api/${routeName}/:id`,
			keycloak.protect(),
			makeHandlerAwareOfAsyncErrors(routeController.getById)
		);
	}
	if (routeController.create) {
		app.post(
			`/api/${routeName}`,
			keycloak.protect(),
			makeHandlerAwareOfAsyncErrors(routeController.create)
		);
	}
	if (routeController.update) {
		app.put(
			`/api/${routeName}/:id`,
			keycloak.protect(),
			makeHandlerAwareOfAsyncErrors(routeController.update)
		);
	}
	if (routeController.remove) {
		app.delete(
			`/api/${routeName}/:id`,
			keycloak.protect(),
			makeHandlerAwareOfAsyncErrors(routeController.remove)
		);
	}
}

function sendFile(req: Request, res: Response, next: NextFunction, fileName?: string) {
	var root = join(__dirname, '..', '..', '..', '..', 'frontend', 'dist', 'blog');
	var options = {
		root: root,
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};

	var fileName: string| undefined = fileName!==undefined ? fileName : req.params.name;
	res.sendFile(fileName, options, function (err) {
		console.log('Try to send:', fileName);
		if (err) {
			next(err);
		} else {
			console.log('Sent:', fileName);
		}
	});	
}

app.get('/:name', function (req, res, next) {
	var root = join(__dirname, '..', '..', '..', '..', 'frontend', 'dist', 'blog');

	var fileName = req.params.name;
	var file = join(root, fileName);
	if(existsSync(file)) {
		sendFile(req, res, next);
	}
	else {
		next();
	}
});

app.use(function(req, res, next){
	console.log(`redirecting to /index.html`);
	sendFile(req, res, next, 'index.html');
});

export default app;
