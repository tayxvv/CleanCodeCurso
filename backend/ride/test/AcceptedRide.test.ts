import AccountDAODatabase from "../src/AccountDAODatabase";
import GetAccount from "../src/GetAccount";
import GetRide from "../src/GetRide";
import LoggerConsole from "../src/LoggerConsole";
import RequestRide from "../src/RequestRide";
import Signup from "../src/Signup";
import RideDAO from "../src/RideDAO";
import RideDAODatabase from "../src/RideDAODatabase";
import AcceptRide from "../src/AcceptRide";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;

beforeEach(() => {
  const accountDAO = new AccountDAODatabase();
  const rideDAO = new RideDAODatabase();
  const logger = new LoggerConsole();
  acceptRide = new AcceptRide(rideDAO, accountDAO);
  signup = new Signup(accountDAO, logger);
  getAccount = new GetAccount(accountDAO);
  requestRide = new RequestRide(rideDAO, accountDAO, logger);
  getRide = new GetRide(rideDAO, logger);
});

test("Deve aceitar uma corrida", async function () {
  const inputSignUpPassenger = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "06544656143",
    isPassenger: true,
    password: "123456",
  };
  const outputSignupPassenger = await signup.execute(inputSignUpPassenger);

  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);

  const inputSignUpDriver = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "06544656143",
    carPlate: "AAA9999",
    isDriver: true,
    isPassenger: false,
    password: "123456",
  };
  const outputSignupDriver = await signup.execute(inputSignUpDriver);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };
  await acceptRide.execute(inputAcceptRide);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.driver_id).toBe(outputSignupDriver.accountId);
  expect(outputGetRide.status).toBe("accepted");
});

test("Não pode aceitar uma corrida se a conta não for de um motorista", async function () {
  const inputSignUpPassenger = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "06544656143",
    isPassenger: true,
    password: "123456",
  };
  const outputSignupPassenger = await signup.execute(inputSignUpPassenger);

  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);

  const inputSignUpDriver = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "06544656143",
    carPlate: "AAA9999",
    isPassenger: true,
    password: "123456",
  };
  const outputSignupDriver = await signup.execute(inputSignUpDriver);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };
  await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(
    new Error("Only driver can accept a ride")
  );
});
