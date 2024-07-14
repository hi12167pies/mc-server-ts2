import { Connection } from "../../connnection";
import { Event } from "../events";

export class LeaveEvent extends Event {
  constructor(
    public connection: Connection
  ) {
    super()
  }
}