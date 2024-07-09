import { State } from "./enum/state"
import { InHandshakePacket } from "./packets/handshaking/inHandshake"
import { InLoginStartPacket } from "./packets/login/inLoginStart"
import { Packet } from "./packets/packet"
import { InArmAnimation } from "./packets/play/inArmAnimation"
import { InClientSettingsPacket } from "./packets/play/inClientSettings"
import { InPlayerGroundPacket } from "./packets/play/inGroundPacket"
import { InPlayerPosLookPacket } from "./packets/play/inPlayerPosLook"
import { InPluginMessage } from "./packets/play/inPluginMessage"
import { InPlayerAbilitiesPacket } from "./packets/play/inPlayerAbilities"
import { InPlayerLookPacket } from "./packets/play/inPlayerLook"
import { InPlayerPositionPacket } from "./packets/play/inPlayerPosition"
import { InStatusPingPacket } from "./packets/status/inStatusPing"
import { InStatusRequestPacket } from "./packets/status/inStatusRequest"
import { InChatMessagePacket } from "./packets/play/inChatMessage"

export type PacketMap = {
  [key in State]: {
    [key: number]: new() => Packet
  }
}

export const packetMap: PacketMap = {
  [State.Handshaking]: {
    [0x00]: InHandshakePacket
  },
  [State.Status]: {
    [0x00]: InStatusRequestPacket,
    [0x01]: InStatusPingPacket,
  },
  [State.Login]: {
    [0x00]: InLoginStartPacket
  },
  [State.Play]: {
    [0x01]: InChatMessagePacket,
    [0x03]: InPlayerGroundPacket,
    [0x04]: InPlayerPositionPacket,
    [0x05]: InPlayerLookPacket,
    [0x06]: InPlayerPosLookPacket,
    [0x0A]: InArmAnimation,
    [0x13]: InPlayerAbilitiesPacket,
    [0x15]: InClientSettingsPacket,
    [0x17]: InPluginMessage
  }
}