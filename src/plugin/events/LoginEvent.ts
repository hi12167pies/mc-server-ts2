import { Connection } from "../../connnection";
import { Event } from "../events";

export class LoginEvent extends Event {
  public cancelled: boolean = false
  constructor(
    public connection: Connection
  ) {
    super()
  }
}