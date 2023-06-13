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

import { Request, Response } from 'express';

const { models } = require('../../sequelize');
import { getIdParam } from '../helpers';
import { CRUD } from './crud';

export class UsersCRUDOps implements CRUD {
	public async getAll(req: Request, res: Response) {
		const users = await models.user.findAll();
		res.status(200).json(users);
	};
	
	public async getById(req: Request, res:Response) {
		const id = getIdParam(req);
		const user = await models.user.findByPk(id);
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404).send('404 - Not found');
		}
	};
	
	public async create(req: Request, res: Response) {
		if (req.body.id) {
			res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
		} else {
			await models.user.create(req.body);
			res.status(201).end();
		}
	};
	
	public async update(req: Request, res: Response) {
		const id = getIdParam(req);
	
		// We only accept an UPDATE request if the `:id` param matches the body `id`
		if (req.body.id === id) {
			await models.user.update(req.body, {
				where: {
					id: id
				}
			});
			res.status(200).end();
		} else {
			res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`);
		}
	};
	
	public async remove(req: Request, res: Response) {
		const id = getIdParam(req);
		await models.user.destroy({
			where: {
				id: id
			}
		});
		res.status(200).end();
	};
}
