import express from 'express';
import cors from 'cors';
import router from './infrastructure/http/routes';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { MatchController } from './infrastructure/controllers/matchController';
import { MatchService } from './core/usecases/matchService';
import { GenerateSeed } from './core/usecases/generateSeed';
import IoConnection from './infrastructure/http/events';

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

const ioConnection = new IoConnection(app)
ioConnection.init()