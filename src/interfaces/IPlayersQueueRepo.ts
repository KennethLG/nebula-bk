import { Player } from "../core/entities/player";

export default interface IPlayersQueueRepo {
    addPlayer: (player: any) => Promise<any>;
    getPlayers: () => Promise<Player[]>;
    getPlayersCount: () => Promise<number>;
} 