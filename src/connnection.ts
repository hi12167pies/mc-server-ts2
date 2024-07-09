import { Socket } from "net";
import { State } from "./enum/state";
import { Packet } from "./packets/packet";
import { BufferWriter } from "./buffer/bufferWriter";
import { Chat } from "./chat/chat";
import { PlayerEntity } from "./entity/player";
import { loggerDebug, loggerError } from "./utils/logger";
import { OutLoginDisconnectPacket } from "./packets/login/outLoginDisconnect";
import { PacketHandler } from "./handler/packetHandler";
import { HandshakeHandler } from "./handler/handshakeHandler";
import { StatusHandler } from "./handler/statusHandler";
import { LoginHandler } from "./handler/loginHandler";
import { PlayHandler } from "./handler/playHandler";
import { randomBytes } from "crypto";

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

  public disconnect(reason: Chat) {
    if (this.state == State.Login) {
      this.sendPacket(new OutLoginDisconnectPacket(reason))
    }

    if (this.state == State.Play) {
      loggerDebug("Unimplemented disconnect on play")
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

  }
}