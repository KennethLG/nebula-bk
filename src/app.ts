import express from 'express';
import cors from 'cors';
import HttpRouter from './presentation/http/routes';
import IoConnection from './presentation/http/events';
import { createHttpDependencies } from './presentation/http/factory';
import { errorHandler } from './infrastructure/httpError';

const app = express();

const { loginUseCase, signupUseCase } = createHttpDependencies();
const httpRouter = new HttpRouter(loginUseCase, signupUseCase);
const router = httpRouter.getRouter();
app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use(errorHandler);

const ioConnection = new IoConnection(app)
ioConnection.init()
