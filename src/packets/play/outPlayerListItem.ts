import { BufferReader } from "../../buffer/bufferReader";
import { BufferWriter } from "../../buffer/bufferWriter";
import { PlayerEntity } from "../../entity/player";
import { State } from "../../enum/state";
import { Packet } from "../packet";

export enum PlayerListAction {
  AddPlayer = 0,
  UpdateGamemode = 1,
  UpdatePing = 2,
  UpdateDisplayName = 3,
  RemovePlayer = 4
}

export class OutPlayerListItem implements Packet {
  constructor(
    public action: PlayerListAction,
    public players: PlayerEntity[],

  ) {}

  getId(): number {
    return 0x38
  }

  getState(): State {
    return State.Play
  }
  
  read(reader: BufferReader): void {
  }
  
  write(writer: BufferWriter): void {
    writer.writeVarInt(this.action)
    writer.writeVarInt(this.players.length)

    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i]

      writer.writeUUID(player.uuid)

      switch (this.action) {
        case PlayerListAction.AddPlayer:
          writer.writeString(player.username)
          
          // properties
          writer.writeVarInt(player.properties.size)
          for (const properties of player.properties.values()) {
            for (let i = 0; i < properties.length; i++) {
              const property = properties[i]

              writer.writeString(property.name)
              writer.writeString(property.value)
              writer.writeBoolean(property.signature != undefined)

              if (property.signature != undefined) {
                writer.writeString(property.signature)
              }
            }
          }

          writer.writeVarInt(player.gamemode)
          writer.writeVarInt(player.ping)

          writer.writeBoolean(player.displayName != undefined)
          if (player.displayName != undefined) {
            writer.writeChat(player.displayName)
          }
          break
        case PlayerListAction.UpdateGamemode:
          break
        case PlayerListAction.UpdatePing:
          break
        case PlayerListAction.UpdateDisplayName:
          break
        case PlayerListAction.RemovePlayer:
          break
      }
    }
  }
}