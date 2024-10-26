import { Player } from "../../domain/entities/player";

export class RoomService {
    createRoomName(id: string) {
        const prefix = "match-";
        return `${id}`;
    }
}