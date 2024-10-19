import { Server, Socket } from "socket.io";
import { Express } from "express";
import { createServer } from 'http';
import { joinMatchHandlerFactory, JoinMatchHandler } from "./joinMatchHandler";


export default class IoConnection {
    private readonly joinMatchHandler: JoinMatchHandler
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
        this.joinMatchHandler = joinMatchHandlerFactory()

    }

    init () {
        this.io.on('connection', this.handle)
        this.httpServer.listen(5000, () => {
            console.log('Server listening on port 5000');
        })
    }

    private handle = (socket: Socket) => {
        console.log(`Player connected: ${socket.id}`);
        socket.on('joinMatch', (data) => {
            this.joinMatchHandler.handle(data, this.io, socket);
        })

        socket.on('disconnect', () => {
            console.log(`Player disconnected: ${socket.id}`);
        })
    }
}