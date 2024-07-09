import { BufferWriter } from "./src/buffer/bufferWriter";

const uuid = '123e4567-e89b-12d3-a456-426614174000';

const bufferWriter = new BufferWriter()

bufferWriter.writeUUID(uuid)

console.log(bufferWriter.getBuffer())