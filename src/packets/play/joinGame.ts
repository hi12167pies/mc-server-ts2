import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { Difficulty } from "../../enum/difficulty";
import { Dimension } from "../../enum/dimension";
import { Gamemode } from "../../enum/gamemode";
import { LevelType } from "../../enum/levelType";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class JoinGamePacket implements Packet {
  constructor(
    public entityId: number,
    public gamemode: Gamemode,
    public dimension: Dimension,
    public difficulty: Difficulty,
    public maxPlayers: number,
    public levelType: LevelType,
    public reducedDebugInfo: boolean
  ) {}

  getId(): number {
    return 0x01
  }

  getState(): State {
    return State.Play
  }

  read(reader: BufferReader): void {
  }

  write(writer: BufferWriter): void {
    writer.writeInt(this.entityId)
    writer.writeUnsignedByte(this.gamemode)
    writer.writeByte(this.dimension)
    writer.writeUnsignedByte(this.difficulty)
    writer.writeUnsignedByte(this.maxPlayers)
    writer.writeString(this.levelType)
    writer.writeBoolean(this.reducedDebugInfo)
  }
}