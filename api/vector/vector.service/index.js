export default class VectorService {
    constructor(vectorRepository) {
        this.vectorRepository = vectorRepository;
    }

    async addWordToVector(indexes, bookID) {
        const iterator = indexes.entries();
        for(let i = 0; i < indexes.size; i += 1) {
            const value = iterator.next().value;
            this.vectorRepository.add(value[0], +value[1], bookID)
        }
    }

    async findBookID(bookWord) {
        const result = await this.vectorRepository.getBook(bookWord);
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
                counts.set(item, '1');
            } else {
                count = (+count) + 1;
                counts.set(item, count);
            }
        });
        return counts;
    }

    async indexing(counts, documentsWithWordCount, documentsCount) {
        const results = new Map();
        const iterator = counts.entries();
        for(let i = 0; i < counts.size; i += 1) {
            const value = iterator.next().value;
            results.set(value[0], value[1] * Math.log(documentsWithWordCount / documentsCount));
        }
        const summIterator = results.values();
        let summ = 0;
        for(let i = 0; i < results.size; i += 1) {
            const value = summIterator.next().value;
            summ +=  Math.pow(value, 2);
        }
        summ = Math.sqrt(summ);
        const resultIterator = results.entries();
        for(let i = 0; i < results.size; i += 1) {
            const value = resultIterator.next().value;
            results.set(value[0], value[1] / summ);
        }
        return results;
    }
}
