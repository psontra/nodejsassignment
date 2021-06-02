import * as fs from 'fs';
import * as _ from 'lodash';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
const moment = require('moment');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

export class BaseRepository {

    constructor(path) {
        this._path = path;
    }

    async retrieve(page, pageSize, filterFunction) {
        try {
            page = parseInt(page);
            pageSize = parseInt(pageSize);

            let items = await readFileAsync(this._path);
            items = JSON.parse(items);

            let result = filterFunction(items);
            const count = result.length;

            if (page && pageSize) {
                result = _.slice(result, ((page - 1) * pageSize), ((page * pageSize)));
            }

            return [count, result];
        } catch (e) {
            console.error(e);

            throw e;
        }
    }

    async updateById(id, updateObject) {
        try {
            let items = await readFileAsync(this._path);
            items = JSON.parse(items);

            let itemToUpdate = _.find(items, (item) => {
                return item.id === id;
            });

            if (!itemToUpdate) {
                throw new Error('Id does not exist in system');
            }

            _.assign(itemToUpdate, updateObject);

            await writeFileAsync(this._path, JSON.stringify(items));

            return itemToUpdate;
        } catch (e) {
            console.error(e);

            throw e;
        }
    }

    async findOneAndUpdate(filterFunction, updateObject) {
        try {
            let items = await readFileAsync(this._path);
            items = JSON.parse(items);
            let itemToUpdate = filterFunction(items);

            if (!itemToUpdate) {
                throw new Error('The requested resource does not exist in system');
            }

            _.assign(itemToUpdate, updateObject);

            await writeFileAsync(this._path, JSON.stringify(items));

            return itemToUpdate;
        } catch (e) {
            console.error(e);

            throw e;
        }
    }

    async findOne(filterFunction, throwNotFoundError = true) {
        try {
            let items = await readFileAsync(this._path);
            items = JSON.parse(items);

            let rs = filterFunction(items);

            if (!rs && throwNotFoundError) {
                throw new Error('The requested resource does not exist in system');
            }

            return rs;
        } catch (e) {
            console.error(e);

            throw e;
        }
    }

    async create(item) {
        try {
            let items = await readFileAsync(this._path);
            items = JSON.parse(items);
            item.id = uuidv4();
            item.created = moment().toDate();
            items.push(item);

            await writeFileAsync(this._path, JSON.stringify(items));

            return item;
        } catch (e) {
            console.error(e);

            throw e;
        }
    }
}
