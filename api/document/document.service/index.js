export default class DocumentService {
    constructor(documentRepository) {
        this.documentRepository = documentRepository;
    }

    async addBook(book) {
        const result = await this.documentRepository.create(book.name, book.title, book.content);
        return result;
    }

    async getBook(bookID) {
        const result = await this.documentRepository.get(bookID);
        // console.log('book: ', result);
        return result;
    }

    async isExist(book) {
        const books = await this.documentRepository.getAll();
        return books.indexOf(book.name) !== -1;
    }
}
