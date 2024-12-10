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
