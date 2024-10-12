import express from 'express';
import router from './infrastructure/http/routes';

const app = express();

app.use(express.json());
app.use(router);

app.listen(5000, () => {
    console.log('port listening on port 5000');
});
