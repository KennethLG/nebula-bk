// join match flow
client.join(playerId)

server.playersPools.add(playerId)

if (server.playersPool.length > 2) {
    room = createRoom()
    players = removePlayersFromQueue()
    addPlayersToRoom(room, players)
    notifyToRoomMatchStarted(room, players)
}

// player state flow
client.sendState(matchId, playerId, playerState)

room = findRoom(matchId)
if (!room) {
    throw "no room found"
}
player = room.find(playerId)
if (!player) {
    throw "no player found"
}

room.players[playerId] = playerState
notifyToRoomPlayerUpdated(room, playerState)