import { Socket } from "net";
import { State } from "./enum/state";
import { Packet } from "./packets/packet";
import { InHandshakePacket } from "./packets/handshaking/inHandshake";
import { BufferWriter } from "./buffer/bufferWriter";
import { InStatusRequestPacket } from "./packets/status/inStatusRequest";
import { OutStatusResponsePacket } from "./packets/status/outStatusResponse";
import { Chat } from "./chat/chat";
import { InStatusPingPacket } from "./packets/status/inStatusPing";
import { OutStatusPongPacket } from "./packets/status/outStatusPong";
import { InLoginStartPacket } from "./packets/login/inLoginStart";
import { InLoginSuccessPacket } from "./packets/login/inLoginSuccess";
import { PlayerEntity } from "./entity/player";
import { OutJoinGamePacket } from "./packets/play/outJoinGame";
import { Gamemode } from "./enum/gamemode";
import { Dimension } from "./enum/dimension";
import { Difficulty } from "./enum/difficulty";
import { LevelType } from "./enum/levelType";
import { randomUUID } from "crypto";
import { tempWorld } from ".";
import { OutSetDifficultyPacket } from "./packets/play/outSetDifficulty";
import { OutSpawnPositionPacket } from "./packets/play/outSpawnPosition";
import { OutChunkBulkPacket } from "./packets/play/outChunkBulk";
import { OutPlayerPosLookPacket } from "./packets/play/outPlayerPosLook";
import { OutSetCompressionPacket } from "./packets/login/outSetCompressionPacket";
import { InPluginMessage } from "./packets/play/inPluginMessage";

export class Connection {
  public state: State = State.Handshaking
  public player?: PlayerEntity

  // network
  public isFirstChunk: boolean = false
  public lastChunk: Buffer | null = null

  constructor(
    public socket: Socket
  ) {}

  public sendPacket(packet: Packet) {
    const dataWriter = new BufferWriter()

    // write packet id
    dataWriter.writeVarInt(packet.getId())

    // write packet data
    packet.write(dataWriter)

    // get the buffer from the temp writer
    const dataBuffer = dataWriter.getBuffer()
    
    // create a new writer
    const lengthWriter = new BufferWriter()
    
    // write the length from the buffer
    lengthWriter.writeVarInt(dataBuffer.length)

    // join the two buffers together
    const buffer = Buffer.concat([
      lengthWriter.getBuffer(),
      dataBuffer
    ])

    // write to the socket
    this.socket.write(buffer)
  }

  public handlePacket(packet: Packet) {
    if (packet instanceof InHandshakePacket) {
      switch (packet.nextState) {
        case 1:
          this.state = State.Status
          break
        case 2:
          this.state = State.Login
          break
      }
    }

    if (packet instanceof InStatusRequestPacket) {
      this.sendPacket(new OutStatusResponsePacket({
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
      this.sendPacket(new OutStatusPongPacket(packet.payload))
    }

    if (packet instanceof InLoginStartPacket) {
      // create the player
      this.player = new PlayerEntity(this, packet.username, randomUUID(), tempWorld)
      
      // complete login
      this.sendPacket(new InLoginSuccessPacket(this.player.username, this.player.uuid))
      // this.sendPacket(new SetCompressionPacket(-1))

      // change state and init the player
      this.state = State.Play
      this.init()
    }
  }

  public init() {
    this.sendPacket(new OutJoinGamePacket(
      this.player.eid,
      Gamemode.Creative,
      Dimension.Overworld,
      Difficulty.Easy,
      100,
      LevelType.default,
      false
    ))

    this.sendPacket(new OutSetDifficultyPacket(this.player.world.difficulty))
    this.sendPacket(new OutSpawnPositionPacket(this.player.world.spawnX, this.player.world.spawnY, this.player.world.spawnZ))
    this.sendPacket(new OutPlayerPosLookPacket(this.player.locX, this.player.locY, this.player.locZ, this.player.yaw, this.player.pitch))

    const chunks = [...this.player.world.chunks.values()]
    this.sendPacket(new OutChunkBulkPacket(this.player.world.dimension, chunks))

  }
}