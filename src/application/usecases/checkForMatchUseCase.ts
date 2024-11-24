import IMatchesRepo from "../../domain/interfaces/IMatchesRepo";
import IPlayersQueueRepo from "../../domain/interfaces/IPlayersQueueRepo";
import { RoomService } from "../services/roomService";
import { GenerateSeed } from "../services/seedService";

export class CheckForMatchUseCase {
  private MATCH_SIZE = 2;
  constructor(
    private readonly playersQueueRepo: IPlayersQueueRepo,
    private readonly generateSeed: GenerateSeed,
    private readonly matchesRepo: IMatchesRepo,
    private readonly roomService: RoomService,
  ) {}

  async execute() {
    const len = await this.playersQueueRepo.length();
    if (len >= this.MATCH_SIZE) {
      const players = await this.playersQueueRepo.range(0, this.MATCH_SIZE - 1);
      await this.playersQueueRepo.trim(this.MATCH_SIZE, -1);
      const seed = this.generateSeed.execute();
      const { id } = await this.matchesRepo.createMatch(players);
      const roomName = this.roomService.createRoomName(id);
      return {
        players,
        id,
        seed,
        roomName,
      };
    }
    return null;
  }
}
