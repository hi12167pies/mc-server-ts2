import { Connection } from "../../connnection";
import { Event } from "../events";

export class JoinEvent extends Event {
  constructor(
    public connection: Connection
  ) {
    super()
  }
}