import { broadcastPacket } from "..";
import { Chat } from "../chat/chat";
import { Connection } from "../connnection";
import { Packet } from "../packets/packet";
import { InChatMessagePacket } from "../packets/play/inChatMessage";
import { ChatPosition, OutChatMessagePacket } from "../packets/play/outChatMessage";
import { PacketHandler } from "./packetHandler";

export class PlayHandler implements PacketHandler {
  handlePacket(connection: Connection, packet: Packet): void {
    const player = connection.player
    
    if (packet instanceof InChatMessagePacket) {
      broadcastPacket(new OutChatMessagePacket(new Chat(`<${player.username}> ${packet.message}`), ChatPosition.Chat))
    }
  }

}