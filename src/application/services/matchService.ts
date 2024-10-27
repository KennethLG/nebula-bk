import { Player, PlayerQueue } from '../../domain/entities/player';
import IMatchesRepo from '../../domain/interfaces/IMatchesRepo';
import IPlayersQueueRepo from '../../domain/interfaces/IPlayersQueueRepo';
import { RoomService } from './roomService';
import { GenerateSeed } from './seedService';

export interface Match {
  id: string;
  seed: number;
  players: PlayerQueue[];
  roomName: string;
}

export class MatchService {
  constructor(
    private readonly generateSeed: GenerateSeed,
    private readonly matchesRepo: IMatchesRepo,
    private readonly playersQueueRepo: IPlayersQueueRepo,
    private readonly roomService: RoomService
  ) {}

  async joinQueue(player: PlayerQueue){
    console.log("adding player to queue", player)
    await this.playersQueueRepo.addPlayer(player);
    
  }

  async updatePlayer(matchId: string, player: Player): Promise<void> {
    return await this.matchesRepo.updatePlayer(matchId, player);
  }

  async checkForMatch(): Promise<Match | null> {
    const playersCount = await this.playersQueueRepo.getPlayersCount();
    console.log("players count", playersCount, "checking for match")
    if (playersCount >= 2) {
      console.log("enough players for a match poping players...")
      const playersData = await this.playersQueueRepo.popPlayers(2);
      console.log("players poped", playersData)
      const players = playersData.map(player => {
        const newPlayer = new Player(player.id, player.xVel, player.yVel, player.position, player.key, player.keyState);
        return {
          ...newPlayer,
          socketId: player.socketId
        }
      })
      console.log("creating match with players", players)

      const seed = this.generateSeed.execute();
      console.log("seed generated", seed)
      
      const { id } = await this.matchesRepo.createMatch(players);
      console.log("room created", id)
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

  async disconnectPlayer(socketId: string): Promise<void> {
    // remove player from queue that matches socketId
    await this.playersQueueRepo.deletePlayerBySocketId(socketId);
  }
}
