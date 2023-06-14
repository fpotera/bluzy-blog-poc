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

import { Sequelize } from 'sequelize';

import { applyExtraSetup } from './extra-setup';
import userModel from './models/user.model';

require('dotenv').config();
const DB_URL = process.env.DB_URL!;

const sequelize: any = new Sequelize(DB_URL);

const modelDefiners = [
	userModel
];

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

applyExtraSetup(sequelize);

export default sequelize;
