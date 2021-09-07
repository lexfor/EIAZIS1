import { promisify } from 'util';
import { v1 as uuidv1 } from 'uuid';

export default class VectorRepository {
    constructor(connection) {
        this.connection = connection;
    }

    async add(bookWord, wordIndex, documentID) {
        try {
            const uuid = uuidv1();
            const data = { id: uuid, word: bookWord, index: wordIndex, document_id: documentID };
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = 'INSERT INTO vectors SET ?';
            await queryAsync(sql, data);
            return data;
        } catch (e) {
            return e.message;
        }
    }

    async findBook(bookWord) {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = `SELECT document_id FROM vectors WHERE
                    word = ? AND 
                    index = (SELECT MAX(index) FROM vectors)`;
            const result = await queryAsync(sql, bookWord);
            return result;
        } catch (e) {
            return e.message;
        }
    }

    async findAllBooksWithWord(word) {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = `SELECT COUNT( DISTINCT document_id ) FROM vectors WHERE
                word = ?`;
            const result = await queryAsync(sql, word);
            return result;
        } catch (e) {
            return e.message;
        }
    }
}
