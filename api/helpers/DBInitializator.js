import { promisify } from 'util';
import { documentDefine } from "./models/documentDefine";
import { vectorDefine } from "./models/vectorDefine";

export async function initializeDB(connection) {
    const queryAsync = promisify(connection.query).bind(connection);
    await queryAsync('CREATE DATABASE IF NOT EXISTS eiazis1');

    await documentDefine(connection);
    await vectorDefine(connection);
}
