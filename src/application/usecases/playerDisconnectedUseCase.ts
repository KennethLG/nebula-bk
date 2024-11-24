import IPlayersQueueRepo from "../../domain/interfaces/IPlayersQueueRepo";

export class PlayerDisconnectedUseCase {
    constructor(
        private readonly playersQueueRepo: IPlayersQueueRepo
    ) {}

    async execute(socketId: string) {
      await this.playersQueueRepo.removeBySocketId(socketId);
    }
}
