import net from "net"
import { loggerDebug, loggerError, loggerInfo, loggerWarn } from "./utils/logger"
import { readVarIntBuffer } from "./utils/bufferUtils"
import { BufferReader } from "./buffer/bufferReader"
import { packetMap } from "./packetMap"
import { Connection } from "./connnection"
import { Dimension } from "./enum/dimension"
import { Difficulty } from "./enum/difficulty"
import { World } from "./world/world"

const server = net.createServer()

export const tempWorld = new World(Dimension.Overworld, Difficulty.Easy)
tempWorld.setBlockAt(0,0,0, { type: 1, data: 0 })
tempWorld.setBlockAt(1,0,0, { type: 2, data: 0 })
tempWorld.setBlockAt(2,55,0, { type: 2, data: 0 })

server.on("connection", (socket) => {
  const connection = new Connection(socket)

  socket.on("error", err => {
    // Ignore errors, mostly from socket disconnecting
  })

  socket.on("data", incomingBuffer => {
    if (incomingBuffer[0] == 0xFE && connection.isFirstChunk) {
      // Legacy ping
      loggerWarn("Received unsupported legacy ping.")
      socket.destroy()
      return
    }

    if (connection.isFirstChunk) {
      connection.isFirstChunk = false
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
        loggerDebug("Waiting for more data...")
        break
      }
      index = length.index

      if (buffer.length < length.value) {
        connection.lastChunk = buffer
        loggerDebug("Waiting for more data...")
        break
      }

      const buff = buffer.subarray(index, length.value + 1)

      // resize original
      buffer = buffer.subarray(length.value + 1, buffer.length)

      const reader = new BufferReader(buff)

      let packetId: number
      
      try {
        packetId = reader.readVarInt()
      } catch (e) {
        loggerError("Faield to read packet id from inital buffer. ", e)
        break
      }
      
      const constructor = packetMap[connection.state][packetId]

      if (constructor == undefined) {
        if (packetId > 0x99) {
          loggerError(`Packet id too large (0x${packetId.toString(16)})`, buff)
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
        break
      }

      try {
        connection.handlePacket(packet)
      } catch (e) {
        loggerError(`Failed to handle packet (0x${packetId.toString(16)}, state:${connection.state})`, e)
        break
      }
    }
  })
})


server.listen(25567, () => {
  loggerInfo("Server online " + (server.address() as net.SocketAddress).port)
})