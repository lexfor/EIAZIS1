import express from 'express';
import documentRouter from './api/document/document.routes';

import { envConfig } from './config';

const app = express();

app.use(express.static('./Project/public'));
app.use(express.static('./Project/api'));

app.use(express.json({ strict: false }));

app.use('/', documentRouter);


app.listen(envConfig.app.port, () => {
    console.log(`Express web app available at localhost: ${envConfig.app.port}`);
});
