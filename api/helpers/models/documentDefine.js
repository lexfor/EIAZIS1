import { promisify } from 'util';

export async function documentDefine (connection) {
    const queryAsync = promisify(connection.query).bind(connection);
    const sqlQuery = `CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(255),
    name VARCHAR(255),
    title VARCHAR(255),
    content VARCHAR(255),
    date VARCHAR(255),
    PRIMARY KEY (id))`;
    await queryAsync(sqlQuery);
}
