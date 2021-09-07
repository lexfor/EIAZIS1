import express from 'express';
import { injector } from "../../injector";

const router = express();
const authenticationController = injector.getDocumentController;

router.post('/library/document', async (req, res, next) => {
    await authenticationController.addBook(req.body);
    res.status(200).json('added');
});

router.get('/library/document', async (req, res, next) => {
    const book = await authenticationController.getBook(req.query);
    res.status(200).json(book);
});


export default router;
