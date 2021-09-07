import { promisify } from 'util';

export async function vectorDefine (connection) {
    const queryAsync = promisify(connection.query).bind(connection);
    const sqlQuery = `CREATE TABLE IF NOT EXISTS words (
    id VARCHAR(255),
    word VARCHAR(255),
    index INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (document_id) REFERENCES documents(id))`;
    await queryAsync(sqlQuery);
}
