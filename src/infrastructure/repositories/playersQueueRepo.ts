import fs from "fs";
import path from "path";
import { Player } from "../../domain/entities/player";
import IPlayersQueueRepo from "../../domain/interfaces/IPlayersQueueRepo";
import { IRedisQueueRepo } from "../../domain/interfaces/IRedisQueueRepo";

export default class PlayersQueueRepo implements IPlayersQueueRepo {
  private KEY = "playersQueue";
  // addPlayerScript;
  constructor(private readonly redisRepo: IRedisQueueRepo) {
    // this.addPlayerScript = fs.readFileSync(
    //   path.resolve(__dirname, "../luaScripts/addPlayer.lua"),
    //   "utf8",
    // );
  }

  async add(player: Player) {
    const result = await this.redisRepo.evalScript<number>(
      `
local key = KEYS[1]
local playerId = ARGV[1]
local playerData = ARGV[2]

-- Check if player with the same ID already exists
local players = redis.call("LRANGE", key, 0, -1)
for _, player in ipairs(players) do
	local parsedPlayer = cjson.decode(player)
	if parsedPlayer.id == playerId then
		return 0 -- Player already exists
	end
end

-- Add the new player to the list
redis.call("RPUSH", key, playerData)
return 1 -- Player added successfully
    `,
      [this.KEY],
      [player.id, JSON.stringify(player)],
    );

    if (result === 1) {
      console.log(`Player added: ${player.id}`);
      return;
    }
    console.log(`Player already exists: ${player.id}`);
    // await this.redisRepo.push(this.KEY, player, false);
  }

  async range(start: number, end: number) {
    const players = await this.redisRepo.range(this.KEY, start, end);
    return players;
  }

  async length() {
    const count = await this.redisRepo.length(this.KEY);
    return count;
  }

  async trim(start: number, end: number) {
    await this.redisRepo.trim(this.KEY, start, end);
  }

  async removeBySocketId(socketId: string) {
    console.log(`Removing player by socketId ${socketId}`);

    const script = `
    local key = KEYS[1]
    local socketId = ARGV[1]

    local players = redis.call("LRANGE", key, 0, -1)
    for i, player in ipairs(players) do
        local parsedPlayer = cjson.decode(player)
        if parsedPlayer.socketId == socketId then
            redis.call("LSET", key, i - 1, "__TO_DELETE__")
            redis.call("LREM", key, 0, "__TO_DELETE__")
            return 1
        end
    end

    return 0
  `;

    const indexRemoved = await this.redisRepo.evalScript<number>(
      script,
      [this.KEY],
      [socketId],
    );

    if (indexRemoved >= 0) {
      console.log(`Player with socketId ${socketId} removed.`);
    } else {
      console.log(`Player with socketId ${socketId} not found.`);
    }
  }
}
