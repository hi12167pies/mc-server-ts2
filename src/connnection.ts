import { Socket } from "net";
import { State } from "./enum/state";
import { Packet } from "./packets/packet";
import { loggerDebug } from "./utils/logger";
import { HandshakePacket } from "./packets/handshaking/handshake";
import { BufferWriter } from "./buffer/bufferWriter";
import { StatusRequestPacket } from "./packets/status/statusRequest";
import { StatusResponsePacket } from "./packets/status/statusResponse";
import { Chat } from "./chat/chat";
import { StatusPingPacket } from "./packets/status/statusPing";
import { StatusPongPacket } from "./packets/status/statusPong";
import { LoginStartPacket } from "./packets/login/loginStart";
import { LoginSuccessPacket } from "./packets/login/loginSuccess";
import { v4 as generateUUIDv4 } from "uuid"
import { PlayerEntity } from "./entity/player";

export class Connection {
  public state: State = State.Handshaking
  public player?: PlayerEntity

  constructor(
    public socket: Socket
  ) {}

  public sendPacket(packet: Packet) {
    const dataWriter = new BufferWriter()

    dataWriter.writeVarInt(packet.getId())
    packet.write(dataWriter)

    const dataBuffer = dataWriter.getBuffer()
    const lengthWriter = new BufferWriter()
    lengthWriter.writeVarInt(dataBuffer.length)

    const buffer = Buffer.concat([
      lengthWriter.getBuffer(),
      dataBuffer
    ])

    this.socket.write(buffer)
  }

  public handlePacket(packet: Packet) {
    if (packet instanceof HandshakePacket) {
      switch (packet.nextState) {
        case 1:
          this.state = State.Status
          break
        case 2:
          this.state = State.Login
          break
      }
    }

    if (packet instanceof StatusRequestPacket) {
      this.sendPacket(new StatusResponsePacket({
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

    if (packet instanceof LoginStartPacket) {
      this.player = new PlayerEntity(this, packet.username, generateUUIDv4())
      this.sendPacket(new LoginSuccessPacket(this.player.username, this.player.uuid))
      this.state = State.Play
    }

    if (packet instanceof StatusPingPacket) {
      this.sendPacket(new StatusPongPacket(packet.payload))
    }
  }

  public init() {

  }
}