export default class VectorService {
    constructor(vectorRepository) {
        this.vectorRepository = vectorRepository;
    }

    async addWordToVector(book) {
        const words = await this.findWordCounts(book.content);
        const indexes = await this.indexing(words);
        const iterator = indexes.entries();

        for(let i = 0; i < indexes.size; i += 1) {
            const value = iterator.next().value;
            await this.vectorRepository.add(value[0], value[1], book.id, words.get(value[0]));
        }

        await this.updateOtherBooks(book);
    }

    async findBookID(bookWord) {
        let count = 1;
        let bookID = {};
        const result = await this.vectorRepository.findBook(bookWord);
        for(let i of result){
            const calculatedCount = this.calculate([i.index_num]);
            if(calculatedCount < count) {
                bookID.document_id = i.document_id;
                bookID.coef = calculatedCount;
                count = calculatedCount;
            }
        }
        return bookID;
    }

    async findBooksCount() {
        return await this.vectorRepository.findBooksCount();
    }

    async findAllBooksWithWord(word) {
        return await this.vectorRepository.findAllBooksWithWord(word);
    }

    calculate(index) {
        const result = Math.sqrt(index.reduce((item, summ) => summ += Math.pow(item, 2)));
        console.log(result);
        return result;
    }


    async findWordCounts(content) {
        let str = content.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        str = str.toLowerCase();
        const words = str.split(' ');
        const counts = new Map();
        words.forEach((item) => {
            let count = counts.get(item);
            if(!count) {
                counts.set(item, 1 );
            } else {
                count = count + 1;
                counts.set(item, count);
            }
        });
        return counts;
    }

    async indexing(counts) {
        const results = new Map();
        const indexes = new Map();
        const N = await this.findBooksCount() + 1;
        const iterator = counts.entries();

        for(let i = 0; i < counts.size; i += 1) {
            const value = iterator.next().value;
            const Nk = await this.findAllBooksWithWord(value[0]) + 1;
            results.set(value[0], value[1] * Math.log(N / Nk));
        }

        const summIterator = results.values();

        let summ = 0;

        for(let i = 0; i < results.size; i += 1) {
            const value = summIterator.next().value;
            summ +=  Math.pow(value[1], 2);
        }

        summ = Math.sqrt(summ);

        const resultIterator = results.entries();

        for(let i = 0; i < results.size; i += 1) {
            const value = resultIterator.next().value;
            let res = value[1] / summ;
            if(res > 1) {
                indexes.set(value[0], 1);
            }else {
                indexes.set(value[0], res);
            }
        }

        return results;
    }

    async updateOtherBooks(addedBook) {
        let booksIDs = await this.vectorRepository.findAllBooksIDs();
        const books = [];
        for(let bookID of booksIDs){
            if(bookID === addedBook.id){
                continue;
            }
            books.push(await this.vectorRepository.findAllBookWords(bookID));
            await this.vectorRepository.deleteAllBookWords(bookID);
        }

        for(let book of books){
            const words = new Map();
            let bookID;
            book.forEach((word) => {
                words.set(word.word, word.count);
                bookID = word.document_id;
            })

            const indexes = await this.indexing(words);

            const iterator = indexes.entries();

            for(let i = 0; i < indexes.size; i += 1) {
                const value = iterator.next().value;
                await this.vectorRepository.add(value[0], value[1], bookID, words.get(value[0]));
            }
        }
    }
}
