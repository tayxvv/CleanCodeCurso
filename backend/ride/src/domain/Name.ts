export default class Name {
  constructor(readonly value: string) {
    if (!this.isInvalidName(value)) throw new Error("Invalid Name.");
  }

  isInvalidName(value: string) {
    return value.match(/[a-zA-Z] [a-zA-Z]+/);
  }
}
