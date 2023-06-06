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

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const Keycloak = require('keycloak-connect');
const fs = require('fs');

const memoryStore = new session.MemoryStore();

const routes = {
	users: require('./routes/users'),
	// Add more routes here...
	// items: require('./routes/items'),
};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

// We create a wrapper to workaround async errors not being transmitted correctly.
function makeHandlerAwareOfAsyncErrors(handler) {
	return async function(req, res, next) {
		try {
			await handler(req, res);
		} catch (error) {
			next(error);
		}
	};
}

// We define the standard REST APIs for each route (if they exist).
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

function sendFile(req, res, next, fileName) {
	var root = path.join(__dirname, '..', '..', '..', '..', 'frontend', 'dist', 'blog');
	var options = {
		root: root,
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};

	var fileName = fileName!==undefined ? fileName : req.params.name;
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
	var root = path.join(__dirname, '..', '..', '..', '..', 'frontend', 'dist', 'blog');

	var fileName = req.params.name;
	var file = path.join(root, fileName);
	if(fs.existsSync(file)) {
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

module.exports = app;
