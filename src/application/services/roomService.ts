import { Player } from "../../domain/entities/player";

export class RoomService {
    createRoomName(players: Player[]) {
        const prefix = "match-";
        const playersId = players.map(player => player.id).join('-');
        return `${prefix}${playersId}`;
    }
}