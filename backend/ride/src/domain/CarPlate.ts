export default class CarPlate {
  constructor(readonly value: string) {
    if (value && this.isInvalidCarPlate(value))
      throw new Error("Invalid Car Plate.");
  }

  isInvalidCarPlate(value: string) {
    return !value.match(/[A-Z]{3}[0-9]{4}/);
  }
}
