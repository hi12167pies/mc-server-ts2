export enum ChatColor {
  BLACK = "black",
  DARK_BLUE = "dark_blue",
  DARK_GREEN = "dark_green",
  DARK_AQUA = "dark_aqua",
  DARK_RED = "dark_red",
  DARK_PURPLE = "dark_purple",
  GOLD = "gold",
  GRAY = "gray",
  DARK_GRAY = "dark_gray",
  BLUE = "blue",
  GREEN = "green",
  AQUA = "aqua",
  RED = "red",
  LIGHT_PURPLE = "light_purple",
  YELLOW = "yellow",
  WHITE = "white",
  RESET = "reset"
}

export class Chat {
  public json: any = {}

  constructor(
    public text: string
  ) {
    this.json.text = text
  }

  color(color: ChatColor) {
    this.json.color = color
    return this
  }

  italic() {
    this.json.italic = true
    return this
  }

  bold() {
    this.json.bold = true
    return this
  }

  strikethrough() {
    this.json.strikethrough = true
    return this
  }

  obfuscated() {
    this.json.obfuscated = true
    return this
  }

  extra(chat: Chat[]) {
    this.json.extra = chat.map(chat => chat.json)
    return this
  }

  toString() {
    return JSON.stringify(this.json)
  }
}