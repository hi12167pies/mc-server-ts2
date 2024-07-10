import { broadcastPacket } from "..";
import { Chat } from "../chat/chat";
import { Connection } from "../connnection";
import { Packet } from "../packets/packet";
import { InChatMessagePacket } from "../packets/play/inChatMessage";
import { EntityActionId, InEntityActionPacket } from "../packets/play/inEntityAction";
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

    if (packet instanceof InChatMessagePacket) {
      broadcastPacket(new OutChatMessagePacket(new Chat(`<${player.username}> ${packet.message}`), ChatPosition.Chat))
    }
  }

}