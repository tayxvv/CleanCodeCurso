export default interface RideDAO {
  save(ride: any): Promise<any>;
  getById(rideId: string): Promise<any>;
  list(): Promise<any>;
  getActiveRideByPassengerId(passengerId: string): Promise<any>;
  update(ride: any): Promise<void>;
}
