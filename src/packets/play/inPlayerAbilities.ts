import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export class InPlayerAbilitiesPacket implements Packet {
  public isCreative: boolean
  public isFlying: boolean
  public canFly: boolean
  public damageDisabled: boolean

  public flyingSpeed: number
  public walkingSpeed: number

  getId(): number {
    return 0x13
  }
  
  getState(): State {
    return State.Play
  }

  read(reader: BufferReader): void {
    const flags = reader.readByte()

    this.isCreative = (flags & 0x01) == 0x01
    this.isFlying = (flags & 0x02) == 0x02
    this.canFly = (flags & 0x04) == 0x04
    this.damageDisabled = (flags & 0x08) == 0x08

    this.flyingSpeed = reader.readFloat()
    this.walkingSpeed = reader.readFloat()
  }
  
  write(writer: BufferWriter): void {
  }
}