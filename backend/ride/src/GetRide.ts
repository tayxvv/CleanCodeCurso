import crypto from "crypto";
import Logger from "./Logger";
import RideDAO from "./RideDAO";

export default class GetRide {
  constructor(private rideDAO: RideDAO, private logger: Logger) {}

  async execute(rideId: any) {
    this.logger.log("RequestRide");
    const ride = await this.rideDAO.getById(rideId);
    return ride;
  }
}
