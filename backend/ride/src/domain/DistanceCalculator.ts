import Coord from "./Coord";

export default class DistanceCalculator {
  static calculate(from: Coord, to: Coord) {
    const earthRadius = 6371;
    const degreesToRadius = Math.PI / 180;
    const deltaLat = (to.lat - from.lat) * degreesToRadius;
    const deltaLong = (to.long - from.long) * degreesToRadius;
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(from.lat * degreesToRadius) *
        Math.cos(to.lat * degreesToRadius) *
        Math.sin(deltaLong / 2) *
        Math.sin(deltaLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(earthRadius * c);
  }
}
