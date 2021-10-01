import { promisify } from 'util';
import { v1 as uuidv1 } from 'uuid';

export default class VectorRepository {
    constructor(connection) {
        this.connection = connection;
    }

    async add(bookWord, wordIndex, documentID) {
        try {
            const uuid = uuidv1();
            const data = { id: uuid, word: bookWord, index_num: wordIndex, document_id: documentID };
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
            console.log('bookWord: ', bookWord);
            const sql = `SELECT document_id FROM words WHERE
                    word = ?`;
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
            console.log('find word index: ', result);

            return result;
        } catch (e) {
            return e.message;
        }
    }

    async findAllBooksWithWord(word) {
        try {
            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = `SELECT COUNT( DISTINCT document_id ) FROM words WHERE
                word = ?`;
            const result = await queryAsync(sql, word);
            return result;
        } catch (e) {
            return e.message;
        }
    }

    async findWordsWithBooks(bookWord, bookID) {
        try {

            const queryAsync = promisify(this.connection.query).bind(this.connection);
            const sql = `SELECT COUNT( DISTINCT id ) as count FROM words WHERE
                document_id = \"${bookID[0].document_id}\" AND
                word = \"${bookWord.word}\"`;
            const result = await queryAsync(sql);
            console.log('find words with books: ', result);
            return result;
        } catch (e) {
            return e.message;
        }
    }
}
