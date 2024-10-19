import { Player } from "../core/entities/player";

export default interface IMatchesRepo {
    createMatch: (players: Player[]) => Promise<{id: string}>;
}