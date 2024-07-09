import { Chat } from "../chat/chat";
import { Connection } from "../connnection";
import { Packet } from "../packets/packet";
import { InStatusPingPacket } from "../packets/status/inStatusPing";
import { InStatusRequestPacket } from "../packets/status/inStatusRequest";
import { OutStatusPongPacket } from "../packets/status/outStatusPong";
import { OutStatusResponsePacket } from "../packets/status/outStatusResponse";
import { PacketHandler } from "./packetHandler";

export class StatusHandler implements PacketHandler {
  handlePacket(connection: Connection, packet: Packet): void {
    
    if (packet instanceof InStatusRequestPacket) {
      connection.sendPacket(new OutStatusResponsePacket({
        version: {
          name: "vanilla",
          protocol: 47
        },
        players: {
          max: 5,
          online: 1,
          sample: []
        },
        description: new Chat("Typescript server!")
      }))
    }
    
    if (packet instanceof InStatusPingPacket) {
      connection.sendPacket(new OutStatusPongPacket(packet.payload))
    }
    
  }
}