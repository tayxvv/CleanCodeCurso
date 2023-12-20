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
import UpdatePosition from "../src/application/usecase/UpdatePosition";
import PositionRepositoryDatabase from "../src/infra/repository/PositionRepositoryDatabase";
import FinishRide from "../src/application/usecase/FinishRide";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let databaseConnection: PgPromiseAdapter;
let updatePosition: UpdatePosition;
let finishRide: FinishRide;

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter();
  const accountDAO = new AccountDAODatabase(databaseConnection);
  const rideDAO = new RideDAODatabase();
  const positionRepository = new PositionRepositoryDatabase(databaseConnection);
  const logger = new LoggerConsole();
  acceptRide = new AcceptRide(rideDAO, accountDAO);
  signup = new Signup(accountDAO, logger);
  getAccount = new GetAccount(accountDAO);
  requestRide = new RequestRide(rideDAO, accountDAO, logger);
  getRide = new GetRide(rideDAO, positionRepository, logger);
  startRide = new StartRide(rideDAO);
  updatePosition = new UpdatePosition(rideDAO, positionRepository);
  finishRide = new FinishRide(rideDAO, positionRepository);
});

test("Deve finalizar uma corrida", async function () {
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
  const inputStartRide = {
    rideId: outputRequestRide.rideId,
  };
  await startRide.execute(inputStartRide);
  const inputUpdatePosition1 = {
    rideId: outputRequestRide.rideId,
    lat: -27.584905257808835,
    long: -48.545022195325124,
  };

  await updatePosition.execute(inputUpdatePosition1);

  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
  };

  await updatePosition.execute(inputUpdatePosition2);
  const inputFinishRide = {
    rideId: outputRequestRide.rideId,
  };
  await finishRide.execute(inputFinishRide);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe("completed");
  expect(outputGetRide.distance).toBe(10);
  expect(outputGetRide.fare).toBe(21);
});

afterEach(async () => {
  await databaseConnection.close();
});
