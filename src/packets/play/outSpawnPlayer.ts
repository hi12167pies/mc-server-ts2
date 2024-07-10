import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { PlayerEntity } from "../../entity/player";
import { State } from "../../enum/state";
import { loggerDebug } from "../../utils/logger";
import { toAngle, toFixedNumber } from "../../utils/typeUtil";
import { Packet } from "../packet";

export class OutSpawnPlayerPacket implements Packet {
  constructor(
    public player: PlayerEntity
  ) {}

  getId(): number {
    return 0x0C
  }

  getState(): State {
    return State.Play
  }

  read(reader: BufferReader): void {
  }

  write(writer: BufferWriter): void {
    writer.writeVarInt(this.player.eid)
    writer.writeUUID(this.player.uuid)

    writer.writeInt(toFixedNumber(this.player.locX))
    writer.writeInt(toFixedNumber(this.player.locY))
    writer.writeInt(toFixedNumber(this.player.locZ))

    // TODO: Fix angles
    writer.writeByte(0)
    writer.writeByte(0)

    writer.writeShort(0)
    this.player.writeMetadata(writer)
  }
}