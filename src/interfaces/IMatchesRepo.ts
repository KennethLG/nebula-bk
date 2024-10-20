import { Player } from "../core/entities/player";

export default interface IMatchesRepo {
    createMatch: (players: Player[]) => Promise<{id: string}>;
    updatePlayer: (matchId: string, player: Player) => Promise<void>;
}