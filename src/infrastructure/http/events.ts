import { Server, Socket } from "socket.io";
import { Express } from "express";
import { createServer } from 'http';
import { JoinMatchHandler } from "./joinMatchHandler";
import { createDependencies } from "./factory";
import { UpdatePlayerHandler } from "./updatePlayerHandler";
import { JoinMatchDto, UpdatePlayerDto } from "./dto/events";


export default class IoConnection {
    private readonly joinMatchHandler: JoinMatchHandler
    private readonly updatePlayerHandler: UpdatePlayerHandler
    private readonly io: Server
    private readonly httpServer
    constructor(
        app: Express
    ) {
        this.httpServer = createServer(app)
        this.io = new Server(this.httpServer, {
            cors: {
                origin: '*'
            }
        })
        const { joinMatchHandler, updatePlayerHandler } = createDependencies();
        this.joinMatchHandler = joinMatchHandler;
        this.updatePlayerHandler = updatePlayerHandler;

    }

    init () {
        this.io.on('connection', this.handleConnection)
        this.httpServer.listen(5000, () => {
            console.log('Server listening on port 5000');
        })
    }

    private handleConnection = (socket: Socket) => {
        console.log(`Player connected: ${socket.id}`);
        socket.on('joinMatch', async (data: JoinMatchDto) => {
            const result = await this.joinMatchHandler.handle(data);
            if (!result) return;
            
            this.io.to(socket.id).emit('matchFound', {
                seed: result.seed,
                id: result.id,
                players: result.players
            })
        });

        socket.on('updatePlayer', async (data: UpdatePlayerDto) => {
            console.log('updatePlayer', data);
            await this.updatePlayerHandler.handle(data.matchId, data.player);
            this.io.to(socket.id).emit('playerUpdated', {
                data
            });
        });

        socket.on('disconnect', () => {
            console.log(`Player disconnected: ${socket.id}`);
        })

        socket.on('error', (error) => {
            console.log('Socket error', error);
        });
    }

    private handleMessage = (socket: Socket) => {

    }
}