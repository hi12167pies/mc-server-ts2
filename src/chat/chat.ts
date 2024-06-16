export class Chat {
  constructor(
    public text: string
  ) {}

  toJson() {
    return JSON.stringify({
      text: this.text
    })
  }
}