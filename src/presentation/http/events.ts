import { Server, Socket } from "socket.io";
import { Express } from "express";
import { createServer } from 'http';
import { createDependencies } from "./factory";
import { JoinMatchDto, UpdatePlayerDto } from "./dto/events";
import { createOkResponse } from "../../infrastructure/responseHandler";
import { JoinMatchUseCase } from "../../application/usecases/joinMatchUseCase";
import { UpdatePlayerUseCase } from "../../application/usecases/updatePlayerUseCase";


export default class IoConnection {
    private readonly joinMatchUseCase: JoinMatchUseCase
    private readonly updatePlayerUseCase: UpdatePlayerUseCase
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

        const { joinMatchUseCase, updatePlayerUseCase } = createDependencies();
        this.joinMatchUseCase = joinMatchUseCase;
        this.updatePlayerUseCase = updatePlayerUseCase;


    }

    init () {
        this.io.on('connection', this.handleConnection)
        this.httpServer.listen(5000, () => {
            console.log('Server listening on port 5000');
        })
    }
    
    private handleConnection = (socket: Socket) => {
        console.log(`Player connected: ${socket.id}`);
        
        
        socket.on('disconnect', () => {
            console.log(`Player disconnected: ${socket.id}`);
        })
        
        socket.on('joinMatch', async (data: JoinMatchDto) => {
            try {
                console.log("player received joinMatch", data);
                const result = await this.joinMatchUseCase.execute(socket.id, data.id)
                if (!result) return;

                const response = createOkResponse('match found', {
                    seed: result.seed,
                    id: result.id,
                    players: result.players
                });
                
                this.io.to(socket.id).emit('matchFound', response)
                
            } catch (error) {
                socket.id
            }
        });

        socket.on('updatePlayer', async (data: UpdatePlayerDto) => {
            try {
                console.log('updatePlayer', data);
                const result = await this.updatePlayerUseCase.execute(data.matchId, data.player);
                console.log("🚀 ~ IoConnection ~ socket.on ~ result:", result)
                this.io.to(socket.id).emit('playerUpdated', {
                    data
                });
                
            } catch (error) {
                socket.emit('error', {
                    message: error
                })
            }
        });

    }

    private handleMessage = (data: any) => {
    }
}