export default class DocumentController {
    constructor(vectorService, documentService) {
        this.vectorService = vectorService;
        this.documentService = documentService;
    }

    async checkIsBookExist(book) {
        return await this.documentService.isExist(book);
    }

    async addBook(book) {
        const createdBook = await this.documentService.addBook(book);
        console.log('add book: ', createdBook);
        await this.vectorService.addWordToVector(createdBook);
        return true;
    }

    async getBook(word) {
        const bookID = await this.vectorService.findBookID(word);
        const book = await this.documentService.getBook(bookID.document_id);
        return {
            name: book.name,
            title: book.title,
            date: book.date,
            content: book.content,
            coef: bookID.coef,
        };
    }
}
