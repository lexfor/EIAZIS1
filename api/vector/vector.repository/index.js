import { promisify } from 'util';
import { v1 as uuidv1 } from 'uuid';

export default class VectorRepository {
    constructor(connection) {
        this.connection = connection;
    }

    async add(bookWord, wordIndex, documentID, count) {
        try {
            const uuid = uuidv1();
            const data = { id: uuid, word: bookWord, index_num: wordIndex, document_id: documentID, count: count };
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = 'INSERT INTO words SET ?';
            await queryAsync(sql, data);

            return data;
        } catch (e) {
            return e.message;
        }
    }

    async findBook(bookWord) {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = `SELECT * FROM words WHERE
                word = ? AND id = (SELECT words.id FROM words WHERE index_num = (SELECT MIN(index_num) FROM words))`;
            const result = await queryAsync(sql, bookWord.word);

            return result;
        } catch (e) {
            return e.message;
        }
    }

    async getWordIndex(bookWord) {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = `SELECT index_num FROM words WHERE
                    word = ?`;
            const result = await queryAsync(sql, bookWord.word);

            return result;
        } catch (e) {
            return e.message;
        }
    }

    async findAllBooksWithWord(word) {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = `SELECT COUNT( DISTINCT document_id ) as count FROM words WHERE
                word = ?`;
            const [result] = await queryAsync(sql, word);
            return result.count;
        } catch (e) {
            return e.message;
        }
    }

    async findBooksCount() {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = `SELECT COUNT( DISTINCT document_id ) as count FROM words`;
            const [result] = await queryAsync(sql);
            return result.count;
        } catch (e) {
            return e.message;
        }
    }

    async findAllBooksIDs() {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = `SELECT DISTINCT (document_id) FROM words`;
            let result = await queryAsync(sql);
            result = result.map((item) => item.document_id);
            return result;
        } catch (e) {
            return e.message;
        }
    }

    async findAllBookWords(documentID) {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = `SELECT * FROM words WHERE document_id = ?`;
            const result = await queryAsync(sql, documentID);
            return result;
        } catch (e) {
            return e.message;
        }
    }
    async deleteAllBookWords(documentID) {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = `DELETE FROM words WHERE document_id = ?`;
            const result = await queryAsync(sql, documentID);
            return result;
        } catch (e) {
            return e.message;
        }
    }

    async findWordsWithBooks(bookWord, bookID) {
        try {

            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = `SELECT COUNT( DISTINCT id ) as count FROM words WHERE
                document_id = "${bookID.document_id}" AND
                word = "${bookWord.word}"`;
            const result = await queryAsync(sql);
            return result;
        } catch (e) {
            return e.message;
        }
    }
}
