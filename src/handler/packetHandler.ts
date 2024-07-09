import { Connection } from "../connnection";
import { Packet } from "../packets/packet";

export interface PacketHandler {
  handlePacket(connection: Connection, packet: Packet): void
}