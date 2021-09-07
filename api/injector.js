import DocumentRepository from "./document/document.repository";
import VectorRepository from "./vector/vector.repository";
import DocumentService from "./document/document.service";
import VectorService from "./vector/vector.service";
import DocumentController from "./document/document.controller";

import { connection } from "./helpers/DBConnection";

class Injector {
    constructor() {
        initializeDB(connection);
        this.documentRepository = new DocumentRepository(connection);
        this.vectorRepository = new VectorRepository(connection);
        this.documentService = new DocumentService(this.documentRepository);
        this.vectorService = new VectorService(this.vectorRepository);
        this.documentController = new DocumentController(this.vectorService, this.documentService);
    }

    get getDocumentController() {
        return this.documentController;
    }
}

const injector = new Injector();
export { injector };
