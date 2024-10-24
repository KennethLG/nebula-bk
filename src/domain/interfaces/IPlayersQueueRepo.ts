import { Player } from "../entities/player";

export default interface IPlayersQueueRepo {
    addPlayer: (player: any) => Promise<any>;
    getPlayers: () => Promise<Player[]>;
    getPlayersCount: () => Promise<number>;
    removePlayersRange: () => Promise<any>;
    popPlayers: (count: number) => Promise<any>;
} 