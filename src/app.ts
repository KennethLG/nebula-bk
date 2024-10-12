import express from 'express';
import cors from 'cors';
import router from './infrastructure/http/routes';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { MatchController } from './infrastructure/controllers/matchController';
import { MatchmakingService } from './core/usecases/matchMaking';
import { GenerateSeed } from './core/usecases/generateSeed';

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

const generateSeed = new GenerateSeed();
const matchmakingService = new MatchmakingService(generateSeed);
const matchController = new MatchController(matchmakingService);

io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    socket.on('joinMatch', () => {
        console.log('player joined')
        const result = matchController.handlePlayerJoin(socket.id);
        // socket.emit('matchFound', )
        if (result) {
            result.players.forEach(player => {
                io.to(player.id).emit('matchFound', {
                    seed: result.seed,
                    id: result.id
                })
            })

        }
    });

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
    })
})

httpServer.listen(5000, () => {
    console.log('server listening on port 5000');
});
// app.listen(5000, () => {
//     console.log('port listening on port 5000');
// });
