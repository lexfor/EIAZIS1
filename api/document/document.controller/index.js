export default class DocumentController {
    constructor(vectorService, documentService) {
        this.vectorService = vectorService;
        this.documentService = documentService;
    }

    async checkIsBookExist(book) {
        const result =  await this.documentService.isExist(book);
        return result;
    }

    async addBook(book) {
        if(await this.checkIsBookExist(book)) {
            return false;
        }
        const createdBook = await this.documentService.addBook(book);
        const indexes = await this.vectorService.findWordCounts(book.content);
        await this.vectorService.addWordToVector(indexes, createdBook.id);
        return true;
    }

    async getBook(word) {
        const bookID = await this.vectorService.findBook(word);
        const book = await this.documentService.getBook(bookID);
        return book;
    }
}
