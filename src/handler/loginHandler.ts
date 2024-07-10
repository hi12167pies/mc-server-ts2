import { Connection } from "../connnection";
import { InLoginStartPacket } from "../packets/login/inLoginStart";
import { Packet } from "../packets/packet";
import { PacketHandler } from "./packetHandler";
import { broadcastPacket, players, publicKeyBuffer, serverKey, tempWorld } from "..";
import { InLoginSuccessPacket } from "../packets/login/inLoginSuccess";
import { State } from "../enum/state";
import { OutJoinGamePacket } from "../packets/play/outJoinGame";
import { OutSetDifficultyPacket } from "../packets/play/outSetDifficulty";
import { OutSpawnPositionPacket } from "../packets/play/outSpawnPosition";
import { OutPlayerPosLookPacket } from "../packets/play/outPlayerPosLook";
import { OutChunkBulkPacket } from "../packets/play/outChunkBulk";
import { OutPlayerListItemPacket, PlayerListAction } from "../packets/play/outPlayerListItem";
import { InEncryptionResponse } from "../packets/login/inEncryptionResponse";
import { hexDigest } from "../utils/encryptionUtils";
import { OutEncryptionRequest } from "../packets/login/outEncryptionRequest";
import { Chat } from "../chat/chat";
import { constants, createCipheriv, createDecipheriv, privateDecrypt, randomUUID } from "crypto";
import axios from "axios";
import { PlayerEntity } from "../entity/player";
import { hasJoinedResponse } from "../mojangTypes";
import { dashUUID } from "../utils/uuidUtils";
import { OutEntityMetadataPacket } from "../packets/play/outEntityMetadata";

export class LoginHandler implements PacketHandler {
  async handlePacket(connection: Connection, packet: Packet): Promise<void> {

    if (packet instanceof InLoginStartPacket) {
      connection.requestedUsername = packet.username

      connection.sendPacket(new OutEncryptionRequest(publicKeyBuffer, connection.verifyToken))
    }
    
    if (packet instanceof InEncryptionResponse) {
      const decryptedSecret = privateDecrypt({
        key: serverKey.privateKey,
        padding: constants.RSA_PKCS1_PADDING
      }, packet.sharedSecret)
      
      const decryptedVerifyToken = privateDecrypt({
        key: serverKey.privateKey,
        padding: constants.RSA_PKCS1_PADDING
      }, packet.verifyToken)
      
      connection.sharedSecret = decryptedSecret
      connection.cipher = createCipheriv("aes-128-cfb8", connection.sharedSecret, connection.sharedSecret)
      connection.decipher = createDecipheriv("aes-128-cfb8", connection.sharedSecret, connection.sharedSecret)

      if (!decryptedVerifyToken.equals(connection.verifyToken)) {
        connection.disconnect(new Chat("Verify token encrypted incorrectly."))
        return
      }


      const hash = hexDigest(connection.requestedUsername, connection)
  
      try {
        const response = await axios.get(`https://sessionserver.mojang.com/session/minecraft/hasJoined?username=${connection.requestedUsername}&serverId=${hash}`)
        if (response.status != 200) {
          connection.disconnect(new Chat("Failed to authenticate your account with session server."))
          return
        }
        if (response.data.name != connection.requestedUsername) {
          connection.disconnect(new Chat("Username does not match session server."))
        }
        initPlayer(connection, response.data)
      } catch (e) {
        connection.state = State.Login
        connection.disconnect(new Chat("Failed to connect to session server."))
      }

    }
  }
}

function initPlayer(connection: Connection, response: hasJoinedResponse) {
  // create the player
  connection.player = new PlayerEntity(connection, response.name, dashUUID(response.id), tempWorld)
  for (let i = 0; i < response.properties.length; i++) {
    const property = response.properties[i]
    connection.player.setProperty(property)
  }

  // set spawn location
  connection.player.locX = 1.5
  connection.player.locY = 1.5
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
  
  players.add(connection.player)

  connection.onJoin()
}