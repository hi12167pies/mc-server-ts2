import { Socket } from "net";
import { State } from "./enum/state";
import { Packet } from "./packets/packet";
import { BufferWriter } from "./buffer/bufferWriter";
import { Chat } from "./chat/chat";
import { PlayerEntity } from "./entity/player";
import { loggerError } from "./utils/logger";
import { OutLoginDisconnectPacket } from "./packets/login/outLoginDisconnect";
import { PacketHandler } from "./handler/packetHandler";
import { HandshakeHandler } from "./handler/handshakeHandler";
import { StatusHandler } from "./handler/statusHandler";
import { LoginHandler } from "./handler/loginHandler";
import { PlayHandler } from "./handler/playHandler";
import { Cipher, Decipher, randomBytes } from "crypto";
import { broadcastPacket } from ".";
import { OutPlayerListItemPacket, PlayerListAction } from "./packets/play/outPlayerListItem";
import { OutEntityDestoryPacket } from "./packets/play/outEntityDestroy";
import { distanceSqaured } from "./utils/mathUtils";
import { OutEntityTeleportPacket } from "./packets/play/outEntityTeleport";
import { ChatPosition, OutChatMessagePacket } from "./packets/play/outChatMessage";
import { OutPlayDisconnectPacket } from "./packets/play/outPlayDisconnect";

export class Connection {
  private static packetHandlers: Map<State, PacketHandler> = new Map()
  static {
    this.packetHandlers.set(State.Handshaking, new HandshakeHandler())
    this.packetHandlers.set(State.Status, new StatusHandler())
    this.packetHandlers.set(State.Login, new LoginHandler())
    this.packetHandlers.set(State.Play, new PlayHandler())
  }

  public state: State = State.Handshaking
  public player?: PlayerEntity

  // network
  public isFirstChunk: boolean = false
  public lastChunk: Buffer | null = null
  public listening: boolean = true

  // login
  public requestedUsername: string
  public verifyToken: Buffer = randomBytes(32)
  public sharedSecret?: Buffer
  public cipher?: Cipher
  public decipher?: Decipher

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
    let buffer = Buffer.concat([
      lengthWriter.getBuffer(),
      dataBuffer
    ])

    if (this.cipher != null) {
      buffer = this.cipher.update(buffer)
    }

    // write to the socket
    this.socket.write(buffer)
  }

  public disconnect(reason: Chat) {
    if (this.state == State.Login) {
      this.sendPacket(new OutLoginDisconnectPacket(reason))
    }

    if (this.state == State.Play) {
      this.sendPacket(new OutPlayDisconnectPacket(reason))
    }

    if (!this.socket.closed) {
      this.socket.destroy()
    }
  }

  public handlePacket(packet: Packet) {
    const packetHandler = Connection.packetHandlers.get(this.state)
    if (packetHandler == undefined) {
      loggerError("Warning: No packet handler exists for state " + this.state)
      return
    }
    packetHandler.handlePacket(this, packet)
  }

  public onJoin() {
  }

  public onDisconnect() {
    if (this.state == State.Play) {
      broadcastPacket(new OutPlayerListItemPacket(PlayerListAction.RemovePlayer, [ this.player ]))
      broadcastPacket(new OutEntityDestoryPacket([ this.player.eid ]))
    }
  }

  private lastLocX = 0
  private lastLocY = 0
  private lastLocZ = 0
  private lastYaw = 0
  private lastPitch = 0

  public onMove() {
    if (this.player.locX == this.lastLocX
      && this.player.locY == this.lastLocY
      && this.player.locZ == this.lastLocZ
      && this.player.yaw == this.lastYaw
      && this.player.pitch == this.lastPitch
    ) return
    
    const dist = distanceSqaured(
      this.player.locX, this.player.locY, this.player.locZ,
      this.lastLocX, this.lastLocY, this.lastLocZ
    )

    this.teleport(this.player.locX, this.player.locY, this.player.locZ)

    this.lastLocX = this.player.locX
    this.lastLocY = this.player.locY
    this.lastLocZ = this.player.locZ
    this.lastYaw = this.player.yaw
    this.lastPitch = this.player.pitch
  }

  sendMessage(message: string | Chat, pos: ChatPosition = ChatPosition.Chat) {
    const obj = message instanceof Chat ? message : new Chat(message)
    this.sendPacket(new OutChatMessagePacket(obj, pos))
  }

  teleport(x: number, y: number, z: number, yaw?: number, pitch?: number) {
    if (yaw == undefined) {
      yaw = this.player.yaw
    }
    if (pitch == undefined) {
      pitch = this.player.pitch
    }
    broadcastPacket(new OutEntityTeleportPacket(
      this.player.eid,
      x, y, z,
      yaw, pitch,
      this.player.ground
    ), [ this ])
  }
}