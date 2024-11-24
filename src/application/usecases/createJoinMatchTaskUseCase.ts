import { playerQueueFactory } from "../../domain/entities/player";
import IPlayersQueueRepo from "../../domain/interfaces/IPlayersQueueRepo";

export class CreateJoinMatchTaskUseCase {
  constructor (
    private readonly playerQueueRepo: IPlayersQueueRepo
  ) {}

  async execute(
    socketId: string,
    id: string
  ) {
    const newPlayer = playerQueueFactory(id, socketId);
    newPlayer.assignRandomPosition();  
    await this.playerQueueRepo.add(newPlayer);
  }
}
