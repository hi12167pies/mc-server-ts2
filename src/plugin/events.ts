export abstract class Event {
}

const eventMap: Map<Event, Function[]> = new Map()

// i just love generics and types!
export function hookEvent<T extends Event>(
  event: new(...args: any[]) => T,
  listener: (event: T) => void
) {
  if (!eventMap.has(event)) {
    eventMap.set(event, [])
  }
  eventMap.get(event).push(listener)
}

export function callEvent<T extends Event>(event: T): T {
  const constructor = event.constructor

  if (!eventMap.has(constructor)) return event
  const calls = eventMap.get(constructor)
  for (let i = 0; i < calls.length; i++) {
    calls[i](event)
  }
  
  return event
}