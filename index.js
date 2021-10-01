import express from 'express';
import documentRouter from './api/document/document.routes';
import cors from 'cors';

const corsOptions = {
    origin: '*'
};

const app = express();

app.use(express.static('./Project/public'));
app.use(express.static('./Project/api'));

app.use(express.json({ strict: false }));

app.use(cors(corsOptions));
app.use('/', documentRouter);


app.listen(3001, () => {
    console.log(`Express web app available at localhost: 3000`);
});
