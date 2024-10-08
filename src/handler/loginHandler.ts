import { Connection } from "../connnection";
import { InLoginStartPacket } from "../packets/login/inLoginStart";
import { Packet } from "../packets/packet";
import { PacketHandler } from "./packetHandler";
import { broadcastPacket, config, players, publicKeyBuffer, serverKey, tempWorld } from "..";
import { InLoginSuccessPacket } from "../packets/login/inLoginSuccess";
import { State } from "../enum/state";
import { OutJoinGamePacket } from "../packets/play/outJoinGame";
import { OutSetDifficultyPacket } from "../packets/play/outSetDifficulty";
import { OutSpawnPositionPacket } from "../packets/play/outSpawnPosition";
import { OutPlayerPosLookPacket } from "../packets/play/outPlayerPosLook";
import { OutChunkBulkPacket } from "../packets/play/outChunkBulk";
import { InEncryptionResponse } from "../packets/login/inEncryptionResponse";
import { hexDigest } from "../utils/encryptionUtils";
import { Chat } from "../chat/chat";
import { constants, createCipheriv, createDecipheriv, privateDecrypt, randomUUID } from "crypto";
import axios from "axios";
import { PlayerEntity } from "../entity/player";
import { hasJoinedResponse } from "../mojangTypes";
import { dashUUID } from "../utils/uuidUtils";
import { OutPlayerListItemPacket, PlayerListAction } from "../packets/play/outPlayerListItem";
import { OutEntityMetadataPacket } from "../packets/play/outEntityMetadata";
import { OutSpawnPlayerPacket } from "../packets/play/outSpawnPlayer";
import { OutEncryptionRequest } from "../packets/login/outEncryptionRequest";
import { callEvent } from "../plugin/events";
import { LoginEvent } from "../plugin/events/LoginEvent";

export class LoginHandler implements PacketHandler {
  async handlePacket(connection: Connection, packet: Packet): Promise<void> {

    if (packet instanceof InLoginStartPacket) {
      connection.requestedUsername = packet.username

      if (callEvent(new LoginEvent(connection)).cancelled) {
        return
      } 

      // Offline mode
      if (config.online_mode) {
        connection.sendPacket(new OutEncryptionRequest(publicKeyBuffer, connection.verifyToken))
      } else {
        initPlayer(connection, {
          id: randomUUID().replaceAll("-", ""),
          name: connection.requestedUsername,
          properties: [],
          profileActions: []
        })
      }
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
  const player = new PlayerEntity(connection, response.name, dashUUID(response.id), tempWorld)
  connection.player = player

  for (let i = 0; i < response.properties.length; i++) {
    const property = response.properties[i]
    player.setProperty(property)
  }


  // set spawn location
  player.locX = 1.5
  player.locY = 1.5
  player.locZ = 1.5
  
  // complete login
  connection.sendPacket(new InLoginSuccessPacket(player.username, player.uuid))
  // this.sendPacket(new SetCompressionPacket(-1))

  // change state and init the player
  connection.state = State.Play
  
  // send join game
  connection.sendPacket(new OutJoinGamePacket(
    player.eid,
    player.gamemode,
    player.world.dimension,
    player.world.difficulty,
    100,
    player.world.levelType,
    false
  ))

  // send world info
  connection.sendPacket(new OutSetDifficultyPacket(player.world.difficulty))
  connection.sendPacket(new OutSpawnPositionPacket(player.world.spawnX, player.world.spawnY, player.world.spawnZ))

  // send player location
  connection.sendPacket(new OutPlayerPosLookPacket(player.locX, player.locY, player.locZ, player.yaw, player.pitch))

  // send chunks
  const chunks = [...player.world.chunks.values()]
  connection.sendPacket(new OutChunkBulkPacket(player.world.dimension, chunks))
  
  // add player to tablist & add metadata
  broadcastPacket(new OutPlayerListItemPacket(PlayerListAction.AddPlayer, [ player ]))
  connection.sendPacket(new OutPlayerListItemPacket(PlayerListAction.AddPlayer, [ ...players ]))
  broadcastPacket(new OutEntityMetadataPacket(player))

  // spawn the player to others
  broadcastPacket(new OutSpawnPlayerPacket(player), [ connection ])

  players.forEach(other => {
    if (other == player) return
    connection.sendPacket(new OutSpawnPlayerPacket(other))
  })

  // add to player list
  players.add(player)

  connection.onJoin()
}