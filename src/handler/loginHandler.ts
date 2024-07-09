import { Connection } from "../connnection";
import { InLoginStartPacket } from "../packets/login/inLoginStart";
import { Packet } from "../packets/packet";
import { PacketHandler } from "./packetHandler";
import { broadcastPacket, players, serverKey } from "..";
import { InLoginSuccessPacket } from "../packets/login/inLoginSuccess";
import { State } from "../enum/state";
import { OutJoinGamePacket } from "../packets/play/outJoinGame";
import { OutSetDifficultyPacket } from "../packets/play/outSetDifficulty";
import { OutSpawnPositionPacket } from "../packets/play/outSpawnPosition";
import { OutPlayerPosLookPacket } from "../packets/play/outPlayerPosLook";
import { OutChunkBulkPacket } from "../packets/play/outChunkBulk";
import { OutPlayerListItem, PlayerListAction } from "../packets/play/outPlayerListItem";
import { InEncryptionResponse } from "../packets/login/inEncryptionResponse";
import { getPublicKeyBytes } from "../utils/encryptionUtils";
import { OutEncryptionRequest } from "../packets/login/outEncryptionRequest";
import { Chat } from "../chat/chat";

export class LoginHandler implements PacketHandler {
  handlePacket(connection: Connection, packet: Packet): void {

    if (packet instanceof InLoginStartPacket) {
      connection.requestedUsername = packet.username

      connection.sendPacket(new OutEncryptionRequest(getPublicKeyBytes(serverKey), connection.verifyToken))
    }
    
    if (packet instanceof InEncryptionResponse) {
      const decryptedSecret = serverKey.decrypt(packet.sharedSecret)
      const decryptedVerifyToken = serverKey.decrypt(packet.verifyToken)

      if (!decryptedVerifyToken.equals(connection.verifyToken)) {
        connection.disconnect(new Chat("Verify token encrypted incorrectly."))
        return
      }
    }
  }
}

function initPlayer(connection: Connection) {
      // create the player
      // TODO: FIX
      // connection.player = new PlayerEntity(connection, packet.username, randomUUID(), tempWorld)

      // set spawn location
      connection.player.locX = 1.5
      connection.player.locY = 1
      connection.player.locZ = 1.5
      
      // complete login
      connection.sendPacket(new InLoginSuccessPacket(connection.player.username, connection.player.uuid))
      // this.sendPacket(new SetCompressionPacket(-1))

      // change state and init the player
      connection.state = State.Play
      
      // init the player
      connection.sendPacket(new OutJoinGamePacket(
        connection.player.eid,
        connection.player.gamemode,
        connection.player.world.dimension,
        connection.player.world.difficulty,
        100,
        connection.player.world.levelType,
        false
      ))
  
      connection.sendPacket(new OutSetDifficultyPacket(connection.player.world.difficulty))
      connection.sendPacket(new OutSpawnPositionPacket(connection.player.world.spawnX, connection.player.world.spawnY, connection.player.world.spawnZ))

      connection.sendPacket(new OutPlayerPosLookPacket(connection.player.locX, connection.player.locY, connection.player.locZ, connection.player.yaw, connection.player.pitch))
  
      const chunks = [...connection.player.world.chunks.values()]
      connection.sendPacket(new OutChunkBulkPacket(connection.player.world.dimension, chunks))
  
      broadcastPacket(new OutPlayerListItem(PlayerListAction.AddPlayer, [ connection.player ]))

      connection.sendPacket(new OutPlayerListItem(PlayerListAction.AddPlayer, [ ...players ]))

      players.add(connection.player)
      
      connection.onJoin()
}