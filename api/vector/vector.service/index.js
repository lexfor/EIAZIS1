export default class VectorService {
    constructor(vectorRepository) {
        this.vectorRepository = vectorRepository;
    }

    async addWordToVector(indexes, bookID) {
        const iterator = indexes.entries();

        for(let i = 0; i < indexes.size; i += 1) {
            const value = iterator.next().value;
            const res = await this.vectorRepository.add(value[0], +value[1], bookID);
            console.log('add word: ', res);
        }
    }

    async findBookID(bookWord) {
        const result = await this.vectorRepository.findBook(bookWord);
        console.log("book id vector service", result);
        return result;
    }

    async findWordsCount(word, bookID) {
        const result = await this.vectorRepository.findWordsWithBooks(word, bookID);
        return result;
    }

    async findWordIndex(word) {
        const result = await this.vectorRepository.getWordIndex(word);
        return result;
    }

    calculate(index, count) {
        if (index.length){
            console.log('index: ', index);
            console.log('calculate index: ', index[0].index_num / count[0].count);
            return index[0].index_num / count[0].count;
        }
        return null;
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
