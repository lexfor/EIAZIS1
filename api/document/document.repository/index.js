import { promisify } from 'util';
import { v1 as uuidv1 } from 'uuid';

export default class DocumentRepository {
    constructor(connection) {
        this.connection = connection;
    }

    async create(bookName, bookTitle, bookContent) {
        try {
            const uuid = uuidv1();
            const data = { id: uuid, name: bookName, title: bookTitle, content: bookContent, date: new Date().toString() };
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = 'INSERT INTO documents SET ?';
            await queryAsync(sql, data);
            console.log('data: ', data);
            return data;
        } catch (e) {
            console.log('error: ', e);
            return e.message;
        }
    }

    async get(bookID) {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = `SELECT * FROM documents WHERE id = ?`;
            const result = await queryAsync(sql, bookID);
            console.log('get book: ', result);
            return result[0];

        } catch (e) {
            return e.message;
        }
    }

    async getAll() {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = `SELECT name FROM documents`;
            const result = await queryAsync(sql);
            return result;
        } catch (e) {
            return e.message;
        }
    }
}
