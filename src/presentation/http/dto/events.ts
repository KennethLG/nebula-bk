import { Player } from "../../../domain/entities/player";

export class UpdatePlayerDto {
    matchId: string;
    player: Player;
}

export class JoinMatchDto {
    id: string;
}