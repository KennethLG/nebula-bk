import express from 'express';
import cors from 'cors';
import router from './presentation/http/routes';
import IoConnection from './presentation/http/events';

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

const ioConnection = new IoConnection(app)
ioConnection.init()