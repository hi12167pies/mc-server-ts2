import net from "net"
import { loggerError, loggerInfo, loggerWarn } from "./utils/logger"
import { readVarIntBuffer } from "./utils/bufferUtils"
import { BufferReader } from "./buffer/bufferReader"
import { packetMap } from "./packetMap"
import { Connection } from "./connnection"
import { World } from "./world/world"
import { Dimension } from "./enum/dimension"
import { Difficulty } from "./enum/difficulty"

const server = net.createServer()

export const tempWorld = new World(Dimension.Overworld, Difficulty.Easy)

for (let x = 0; x < 16; x++) {
  for (let z = 0; z < 16; z++) {
    tempWorld.setBlock({x, y: 0, z}, { type: x+z, meta: 0 })
  }
}


server.on("connection", (socket) => {
  const connection = new Connection(socket)

  socket.on("error", err => {
    // Ignore errors, mostly from socket disconnecting
  })

  let isFirstChunk = true
  socket.on("data", buffer => {
    if (buffer[0] == 0xFE && isFirstChunk) {
      // Legacy ping
      loggerWarn("Received unsupported legacy ping.")
      socket.destroy()
      return
    }

    if (isFirstChunk) {
      isFirstChunk = false
    }

    // Buffer index is the current index of the buffer for reading data
    let bufferIndex = 0

    while (bufferIndex < buffer.length) {
      // Read VarInt for data length
      const dataInfo = readVarIntBuffer(buffer, bufferIndex)
      bufferIndex = dataInfo.index
      const dataLength = dataInfo.value

      // Read the packet
      const data = buffer.subarray(bufferIndex, bufferIndex + dataLength)
      bufferIndex += dataLength
      
      const dataReader = new BufferReader(data)

      let packetId: number

      try {
        packetId = dataReader.readVarInt()
      } catch (e) {
        loggerError(`Failed to read packet (state ${connection.state})`)
        return
      }
      
      const packetConstructor = packetMap[connection.state][packetId]

      if (packetConstructor == null) {
        loggerError(`Unknown packet id ${packetId} (state ${connection.state})`)
        return
      }

      const packet = new packetConstructor()

      try {
        packet.read(dataReader)
      } catch (e) {
        loggerError(`Failed to read packet (Id: ${packetId}, State: ${connection.state})`, e)
        return
      }

      try {
        connection.handlePacket(packet)
      } catch (e) {
        loggerError(`Failed to handle packet`, packet, e)
        return
      }
    }
  })
})


server.listen(25567, () => {
  // @ts-ignore - typescript types says address is string?
  loggerInfo("Server online " + server.address().port)
})