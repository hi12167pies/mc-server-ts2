import { broadcastPacket } from "..";
import { Chat } from "../chat/chat";
import { Connection } from "../connnection";
import { Packet } from "../packets/packet";
import { InChatMessagePacket } from "../packets/play/inChatMessage";
import { EntityActionId, InEntityActionPacket } from "../packets/play/inEntityAction";
<<<<<<< HEAD
import { InPlayerGroundPacket } from "../packets/play/inGroundPacket";
import { InPlayerLookPacket } from "../packets/play/inPlayerLook";
import { InPlayerPositionPacket } from "../packets/play/inPlayerPosition";
import { InPlayerPosLookPacket } from "../packets/play/inPlayerPosLook";
=======
>>>>>>> abe2345d1a24600309d3ebd0dcd9efd41fb00700
import { ChatPosition, OutChatMessagePacket } from "../packets/play/outChatMessage";
import { PacketHandler } from "./packetHandler";

export class PlayHandler implements PacketHandler {
  handlePacket(connection: Connection, packet: Packet): void {
    const player = connection.player
    
    if (packet instanceof InEntityActionPacket) {
      switch (packet.actionId) {
        case EntityActionId.StartSneaking:
          player.sneaking = true
          break
        case EntityActionId.StopSneaking:
          player.sneaking = false
          break
        case EntityActionId.StartSprinting:
          player.sprinting = true
          break
        case EntityActionId.StopSprinting:
          player.sprinting = false
          break
      }
    }

<<<<<<< HEAD
    if (packet instanceof InPlayerGroundPacket) {
      player.ground = packet.ground
      connection.onMove()
    }

    if (packet instanceof InPlayerPositionPacket) {
      player.locX = packet.x
      player.locY = packet.y
      player.locZ = packet.z
      connection.onMove()
    }

    if (packet instanceof InPlayerPosLookPacket) {
      player.locX = packet.x
      player.locY = packet.y
      player.locZ = packet.z
      player.yaw = packet.yaw
      player.pitch = packet.pitch
      connection.onMove()
    }

    if (packet instanceof InPlayerLookPacket) {
      player.yaw = packet.yaw
      player.pitch = packet.pitch
      connection.onMove()
    }

=======
>>>>>>> abe2345d1a24600309d3ebd0dcd9efd41fb00700
    if (packet instanceof InChatMessagePacket) {
      broadcastPacket(new OutChatMessagePacket(new Chat(`<${player.username}> ${packet.message}`), ChatPosition.Chat))
    }
  }

}