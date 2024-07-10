/**
 * types for resposne from mojang
 */

import { Property } from "./entity/properties"

export type hasJoinedResponse = {
  id: string,
  name: string,
  properties: Property[]
  profileActions: any[] // unknown
}