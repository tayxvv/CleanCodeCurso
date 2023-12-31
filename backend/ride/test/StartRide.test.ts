import AccountDAODatabase from "../src/infra/repository/AccountRepositoryDatabase";
import GetAccount from "../src/application/usecase/GetAccount";
import GetRide from "../src/application/usecase/GetRide";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import RequestRide from "../src/application/usecase/RequestRide";
import Signup from "../src/application/usecase/Signup";
import RideDAO from "../src/application/repository/RideRepository";
import RideDAODatabase from "../src/infra/repository/RideRepositoryDatabase";
import AcceptRide from "../src/application/usecase/AcceptRide";
import StartRide from "../src/application/usecase/StartRide";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let databaseConnection: PgPromiseAdapter;

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter();
  const accountDAO = new AccountDAODatabase(databaseConnection);
  const rideDAO = new RideDAODatabase();
  const logger = new LoggerConsole();
  acceptRide = new AcceptRide(rideDAO, accountDAO);
  signup = new Signup(accountDAO, logger);
  getAccount = new GetAccount(accountDAO);
  requestRide = new RequestRide(rideDAO, accountDAO, logger);
  getRide = new GetRide(rideDAO, logger);
  startRide = new StartRide(rideDAO);
});

test("Deve iniciar uma corrida", async function () {
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
  await startRide.execute(inputAcceptRide);
  const inputStartRide = {
    rideId: outputRequestRide.rideId,
  };
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
  expect(outputGetRide.status).toBe("in_progress");
});

afterEach(async () => {
  await databaseConnection.close();
});
