import net from "net"
import { loggerDebug, loggerError, loggerInfo, loggerWarn } from "./utils/logger"
import { readVarIntBuffer } from "./utils/bufferUtils"
import { BufferReader } from "./buffer/bufferReader"
import { packetMap } from "./packetMap"
import { Connection } from "./connnection"
import { Dimension } from "./enum/dimension"
import { Difficulty } from "./enum/difficulty"
import { World } from "./world/world"
import { Packet } from "./packets/packet"
import { State } from "./enum/state"
import { LevelType } from "./enum/levelType"
import { OutKeepAlivePacket } from "./packets/play/outKeepAlive"
import { PlayerEntity } from "./entity/player"
import { Chat } from "./chat/chat"
import { generateKeyPairSync, KeyPairKeyObjectResult } from "crypto"
import { getKeyBytes } from "./utils/encryptionUtils"
import { readFileSync } from "fs"
import path from "path"
import { Config } from "./types"

export const connections: Set<Connection> = new Set()
export const players: Set<PlayerEntity> = new Set()

// config
export const config: Config = JSON.parse(readFileSync(path.join(process.cwd(), "config.json"), "utf8"))

// util function
export function broadcastPacket(packet: Packet, ignoredConnections: Connection[] = []) {
  connections.forEach(connection => {
    if (connection.state != State.Play) return
    if (ignoredConnections.includes(connection)) return
    connection.sendPacket(packet)
  })
}

// encryptions
export let serverKey: KeyPairKeyObjectResult = generateKeyPairSync("rsa", {
  modulusLength: 1024
})
export const publicKeyBuffer: Buffer = getKeyBytes(serverKey.publicKey)

// keep alive
setInterval(() => {
  connections.forEach(connection => {
    if (connection.state == State.Play) {
      connection.sendPacket(new OutKeepAlivePacket(1))
    }
  })
}, 15e3)

// temp world
export const tempWorld = new World(Dimension.Overworld, Difficulty.Easy, LevelType.flat)
// Grass layer
for (let x = -32; x < 32; x++) {
  for (let z = -32; z < 32; z++) {
    tempWorld.setBlockAt(x, 0, z, { type: 2, data: 0 })
  }
}

const server = net.createServer()
server.on("connection", (socket) => {
  const connection = new Connection(socket)
  connections.add(connection)

  socket.on("error", err => {
    // Ignore errors, mostly from socket disconnecting
  })

  socket.on("close", () => {
    connection.onDisconnect()
    connection.listening = false
    players.delete(connection.player)
    connections.delete(connection)
  })

  socket.on("data", incomingBuffer => {
    if (!connection.listening) return
    if (incomingBuffer[0] == 0xFE && connection.isFirstChunk) {
      // Legacy ping
      loggerWarn("Received unsupported legacy ping.")
      socket.destroy()
      return
    }

    if (connection.isFirstChunk) {
      connection.isFirstChunk = false
    }

    if (connection.decipher != null) {
      incomingBuffer = connection.decipher.update(incomingBuffer)
    }

    let buffer = incomingBuffer
    if (connection.lastChunk != null) {
      buffer = Buffer.concat([connection.lastChunk, incomingBuffer])
      connection.lastChunk = null
    }

    while (buffer.length > 0) {
      let index = 0

      let length: any
      try {
        length = readVarIntBuffer(buffer, index)
      } catch (e) {
        connection.lastChunk = buffer
        loggerDebug(`Waiting for more data... (length) (current size ${buffer.length})`, buffer)
        break
      }
      index = length.index

      if (buffer.length < length.value) {
        connection.lastChunk = buffer
        loggerDebug(`Waiting for more data... (buffer size) (expected size ${length.value}, current size ${buffer.length})`)
        break
      }

      const buff = buffer.subarray(index, index + length.value + 1)
      index += length.value

      // resize original
      buffer = buffer.subarray(index, buffer.length)

      const reader = new BufferReader(buff)

      let packetId: number
      
      try {
        packetId = reader.readVarInt()
      } catch (e) {
        loggerError("Failed to read packet id from inital buffer. ", buffer, e)
        break
      }
      
      const constructor = packetMap[connection.state][packetId]

      if (constructor == undefined) {
        if (packetId > 0x99) {
          loggerError(`Packet id too large (0x${packetId.toString(16)} > 0x99)`, buff)
          break
        }
        loggerWarn("Unknown packet id 0x" + packetId.toString(16))
        break
      }

      const packet = new constructor()

      try {
        packet.read(reader)
      } catch (e) {
        loggerError(`Failed to read packet (0x${packetId.toString(16)}, state:${connection.state})`, e)
        connection.disconnect(new Chat("Failed to handle packet. Check console for more information"))
        break
      }

      try {
        connection.handlePacket(packet)
      } catch (e) {
        loggerError(`Failed to handle packet (0x${packetId.toString(16)}, state:${connection.state})`, e)
        connection.disconnect(new Chat("Failed to handle packet. Check console for more information"))
        break
      }
    }
  })
})


server.listen(config.port, () => {
  loggerInfo("Server online " + (server.address() as net.SocketAddress).port)
})