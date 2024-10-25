import { Player, PlayerQueue } from "../entities/player";

export default interface IPlayersQueueRepo {
    addPlayer: (player: any) => Promise<any>;
    getPlayers: (start: number, end: number) => Promise<PlayerQueue[]>;
    getPlayersCount: () => Promise<number>;
    popPlayers: (count: number) => Promise<any>;
    deletePlayerBySocketId: (socketId: string) => Promise<any>;
} 