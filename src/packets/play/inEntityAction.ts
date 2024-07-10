import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export enum EntityActionId {
  StartSneaking = 0,
  StopSneaking = 1,
  LeaveBed = 2,
  StartSprinting = 3,
  StopSprinting = 4,
  JumpWithHorse = 5,
  OpenHorseInventory = 6
}

export class InEntityActionPacket implements Packet {
  public entityId: number
  public actionId: EntityActionId
  /**
   * wiki.vg - "Only used by Horse Jump Boost, in which case it ranges from 0 to 100. In all other cases it is 0."
   */
  public actionParam: number

  getId(): number {
    return 0x0B
  }

  getState(): State {
    return State.Play
  }

  read(reader: BufferReader): void {
    this.entityId = reader.readVarInt()
    this.actionId = reader.readVarInt()
    this.actionParam = reader.readVarInt()
  }

  write(writer: BufferWriter): void {
  }
}