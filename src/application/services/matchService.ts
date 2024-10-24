import { Player } from '../../domain/entities/player';
import IMatchesRepo from '../../domain/interfaces/IMatchesRepo';
import IPlayersQueueRepo from '../../domain/interfaces/IPlayersQueueRepo';
import { RoomService } from './roomService';
import { GenerateSeed } from './seedService';

class PlayerQueueDto extends Player {
  socketId: string;
}

export interface Match {
  id: string;
  seed: number;
  players: PlayerQueueDto[];
  roomName: string;
}

export class MatchService {
  constructor(
    private readonly generateSeed: GenerateSeed,
    private readonly matchesRepo: IMatchesRepo,
    private readonly playersQueueRepo: IPlayersQueueRepo,
    private readonly roomService: RoomService
  ) {}

  async joinQueue(player: PlayerQueueDto){
    console.log("adding player to queue", player)
    await this.playersQueueRepo.addPlayer(player);
    
  }

  async updatePlayer(matchId: string, player: Player): Promise<void> {
    return await this.matchesRepo.updatePlayer(matchId, player);
  }

  async checkForMatch(): Promise<Match | null> {
    const playersCount = await this.playersQueueRepo.getPlayersCount();
    if (playersCount >= 2) {
      const playersData = await this.playersQueueRepo.popPlayers(2) as string[];
      const players = playersData.map(player => {
        const parsedPlayer = JSON.parse(player);
        const newPlayer = new Player(parsedPlayer.id, parsedPlayer.position, parsedPlayer.velocity);
        return {
          ...newPlayer,
          socketId: parsedPlayer.socketId
        }
      })

      const seed = this.generateSeed.execute();
      
      const { id } = await this.matchesRepo.createMatch(players);
      const roomName = this.roomService.createRoomName(id);

      return {
        players,
        id,
        seed,
        roomName
      }
    }
    return null;
  }
}
