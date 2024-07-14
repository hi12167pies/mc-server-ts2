import { Connection } from "../../connnection"
import { Packet } from "../../packets/packet"
import { Event } from "../events"

export class PacketOutEvent extends Event {
  public cancelled: boolean = false
  constructor(
    public connection: Connection,
    public packet: Packet
  ) {
    super()
  }
}

export class PacketInEvent extends Event {
  public cancelled: boolean = false
  constructor(
    public connection: Connection,
    public packet: Packet
  ) {
    super()
  }
}