import { Connection } from "../connnection";
import { State } from "../enum/state";
import { InHandshakePacket } from "../packets/handshaking/inHandshake";
import { Packet } from "../packets/packet";
import { PacketHandler } from "./packetHandler";

export class HandshakeHandler implements PacketHandler {
  handlePacket(connection: Connection, packet: Packet): void {

    if (packet instanceof InHandshakePacket) {
      switch (packet.nextState) {
        case 1:
          connection.state = State.Status
          break
        case 2:
          connection.state = State.Login
          break
      }
    }

  }
}