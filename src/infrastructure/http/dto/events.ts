import { Player } from "../../../core/entities/player";

export class UpdatePlayerDto {
    matchId: string;
    player: Player;
}

export class JoinMatchDto {
    id: number;
}