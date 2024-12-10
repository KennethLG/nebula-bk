import { CheckForMatchUseCase } from "../../application/usecases/checkForMatchUseCase";
import { JoinPlayersToRoom } from "../io/joinPlayersToRoomService";
import { NotifyMatchFound } from "../io/playerNotificationService";

export class PlayersQueueWorker {
  constructor(
    private readonly checkForMatchUseCase: CheckForMatchUseCase,
    private readonly notifyPlayers: NotifyMatchFound,
    private readonly joinPlayersToRoom: JoinPlayersToRoom,
  ) {
    this.init();
  }

  private async init() {
    this.checkForMatch();
  }

  private async checkForMatch() {
    while (true) {
      try {
        const match = await this.checkForMatchUseCase.execute();
        if (match) {
          this.joinPlayersToRoom(match.players, match.roomName);
          this.notifyPlayers(match);
        }
      } catch (error) {
        console.error(`Error in PlayersQueueWorker: ${error}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}
