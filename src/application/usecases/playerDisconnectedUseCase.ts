import IPlayersQueueRepo from "../../domain/interfaces/IPlayersQueueRepo";

export class PlayerDisconnectedUseCase {
    constructor(
        private readonly playersQueueRepo: IPlayersQueueRepo
    ) {}

    async execute(socketId: string) {
      console.log(`disconnecting player ${socketId}`);
      await this.playersQueueRepo.removeBySocketId(socketId);
    }
}
