import { PlayerQueue } from "../entities/player";

export default interface IPlayersQueueRepo {
    add: (player: any) => Promise<void>;
    range: (start: number, end: number) => Promise<PlayerQueue[]>;
    length: () => Promise<number>;
    trim: (start: number, end: number) => Promise<void>;
    removeBySocketId: (socketId: string) => Promise<void>;
} 
