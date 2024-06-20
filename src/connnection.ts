import { Socket } from "net";
import { State } from "./enum/state";
import { Packet } from "./packets/packet";
import { HandshakePacket } from "./packets/handshaking/handshake";
import { BufferWriter } from "./buffer/bufferWriter";
import { StatusRequestPacket } from "./packets/status/statusRequest";
import { StatusResponsePacket } from "./packets/status/statusResponse";
import { Chat } from "./chat/chat";
import { StatusPingPacket } from "./packets/status/statusPing";
import { StatusPongPacket } from "./packets/status/statusPong";
import { LoginStartPacket } from "./packets/login/loginStart";
import { LoginSuccessPacket } from "./packets/login/loginSuccess";
import { PlayerEntity } from "./entity/player";
import { JoinGamePacket } from "./packets/play/joinGame";
import { Gamemode } from "./enum/gamemode";
import { Dimension } from "./enum/dimension";
import { Difficulty } from "./enum/difficulty";
import { LevelType } from "./enum/levelType";
import { randomUUID } from "crypto";
import { SetDifficultyPacket } from "./packets/play/setDifficulty";
import { SpawnPositionPacket } from "./packets/play/spawnPosition";
import { tempWorld } from ".";

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
    
    if (packet instanceof StatusPingPacket) {
      this.sendPacket(new StatusPongPacket(packet.payload))
    }

    if (packet instanceof LoginStartPacket) {
      // create the player
      this.player = new PlayerEntity(this, packet.username, randomUUID(), tempWorld)
      
      // complete login
      this.sendPacket(new LoginSuccessPacket(this.player.username, this.player.uuid))
      // this.sendPacket(new SetCompressionPacket(-1))

      // change state and init the player
      this.state = State.Play
      this.init()
    }
  }

  public init() {
    this.sendPacket(new JoinGamePacket(
      this.player.eid,
      Gamemode.Creative,
      Dimension.Overworld,
      Difficulty.Easy,
      100,
      LevelType.default,
      false
    ))

    this.sendPacket(new SetDifficultyPacket(this.player.world.difficulty))
    this.sendPacket(new SpawnPositionPacket(this.player.world.spawn))
    const chunks = []
    for (const chunk of this.player.world.chunks.values()) {
      chunks.push(chunk)
    }
  }
}