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
        console.log('add book: ', createdBook);
        const indexes = await this.vectorService.findWordCounts(book.content);
        console.log('indexes: ', indexes);
        await this.vectorService.addWordToVector(indexes, createdBook.id);
        return true;
    }

    async getBook(word) {
        const bookID = await this.vectorService.findBookID(word);
        console.log('find book by word: ', bookID);
        const wordCount = await this.vectorService.findWordsCount(word, bookID);
        const wordIndex = await this.vectorService.findWordIndex(word);
        const indexCoef = this.vectorService.calculate(wordIndex, wordCount);
        const book = await this.documentService.getBook(bookID);
        return {
            name: book.name,
            title: book.title,
            date: book.date,
            content: book.content,
            coef: indexCoef,
        };
    }
}
