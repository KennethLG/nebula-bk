// src/core/usecases/MatchmakingService.ts

import { Player } from '../entities/player';
import { GenerateSeed } from './generateSeed';

export interface Match {
  id: string;
  seed: number;
  players: Player[];
}

export class MatchService {
  private queue: Player[] = [];
  private matches: { [key: string]: Player[] } = {};
  
  constructor(private readonly generateSeed: GenerateSeed) {}

  // Adds a player to the matchmaking queue
  joinQueue(player: Player): Match | null {
    this.queue.push(player);
    console.log("adding player", player, this.queue)
    const result = this.checkForMatch();
    return result
  }

  // Checks if there are enough players to form a match
  private checkForMatch(): Match | null {
    if (this.queue.length >= 2) {
      const players = this.queue.splice(0, 2);
      const id = `${Date.now()}-${Math.random()}`; // Unique match ID
      this.matches[id] = players;

      // Generate seed for the match
      const seed = this.generateSeed.execute();

      // Notify all players in the match
      // this.notifyPlayers(players, matchId, seed);
      return {
        players,
        id,
        seed
      }
    }
    return null
  }

  // Notify players with the match ID and seed
  private notifyPlayers(players: Player[], matchId: string, seed: number): void {
    
    players.forEach(player => {
      // Implement a method that sends data to the player
      // This method would be provided by a higher-level service or controller
      console.log(`Notifying player ${player.id} of match ${matchId} with seed ${seed}`);
    });
  }
}
