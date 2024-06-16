import { State } from "./enum/state"
import { HandshakePacket } from "./packets/handshaking/handshake"
import { Packet } from "./packets/packet"
import { StatusPingPacket } from "./packets/status/statusPing"
import { StatusRequestPacket } from "./packets/status/statusRequest"

export type PacketMap = {
  [key in State]: {
    [key: number]: new() => Packet
  }
}

export const packetMap: PacketMap = {
  [State.Handshaking]: {
    [0x00]: HandshakePacket
  },
  [State.Status]: {
    [0x00]: StatusRequestPacket,
    [0x01]: StatusPingPacket,
  },
  [State.Login]: {},
  [State.Play]: {}
}