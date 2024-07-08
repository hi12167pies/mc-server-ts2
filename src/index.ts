import net from "net"
import { loggerError, loggerInfo, loggerWarn } from "./utils/logger"
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
      let readIndex = 0
      
      let lengthInfo: any
      try {
        lengthInfo = readVarIntBuffer(buffer, readIndex)
      } catch (e) {
        // there is not enough data
        connection.lastChunk = buffer
        break
      }
      
      const length = lengthInfo.value
      readIndex += lengthInfo.index

      if (length == 0) continue
      
      // there is not enough data
      if (buffer.length < length) {
        connection.lastChunk = buffer
        break
      }


      const packetData = buffer.subarray(readIndex, length + readIndex)
      const packetReader = new BufferReader(packetData)

      try {
        const id = packetReader.readVarInt()

        const packet = new packetMap[connection.state][id]()

        if (packet == undefined) {
          loggerError("Unknown packet " + id)
        }

        packet.read(packetReader)

        connection.handlePacket(packet)
      } catch (e) {
        loggerError("Failed to read packet")
      }

      buffer = buffer.subarray(readIndex, buffer.byteLength)
    }

  })
})


server.listen(25567, () => {
  loggerInfo("Server online " + (server.address() as net.SocketAddress).port)
})