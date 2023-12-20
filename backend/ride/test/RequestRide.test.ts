import AccountDAODatabase from "../src/infra/repository/AccountRepositoryDatabase";
import GetAccount from "../src/application/usecase/GetAccount";
import GetRide from "../src/application/usecase/GetRide";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import RequestRide from "../src/application/usecase/RequestRide";
import Signup from "../src/application/usecase/Signup";
import RideDAO from "../src/application/repository/RideRepository";
import RideDAODatabase from "../src/infra/repository/RideRepositoryDatabase";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let databaseConnection: PgPromiseAdapter;

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter();
  const accountDAO = new AccountDAODatabase(databaseConnection);
  const rideDAO = new RideDAODatabase();
  const logger = new LoggerConsole();
  signup = new Signup(accountDAO, logger);
  getAccount = new GetAccount(accountDAO);
  requestRide = new RequestRide(rideDAO, accountDAO, logger);
  getRide = new GetRide(rideDAO, logger);
});

test("Deve solicitar uma corrida", async function () {
  const inputSignUp = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "06544656143",
    isPassenger: true,
    password: "123456",
  };
  const outputSignup = await signup.execute(inputSignUp);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe("requested");
});

test("Não deve poder solicitar uma corrida se a conta não for de um passageiro", async function () {
  const inputSignUp = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "06544656143",
    carPlate: "AAA9999",
    isPassenger: false,
    isDriver: true,
    password: "123456",
  };
  const outputSignup = await signup.execute(inputSignUp);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error("Only passengers can request a ride")
  );
});

test("Não Deve poder solicitar uma corrida se o passageiro já tiver outra corrida ativa", async function () {
  const inputSignUp = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "06544656143",
    isPassenger: true,
    password: "123456",
  };
  const outputSignup = await signup.execute(inputSignUp);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  await requestRide.execute(inputRequestRide);
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    "Passenger has an active ride"
  );
});

test("Não deve poder solicitar uma corrida se a conta não existir", async function () {
  const inputRequestRide = {
    passengerId: "829649cd-d7d1-4bec-832d-6a8cce9693df",
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error("Account does not exist")
  );
});

afterEach(async () => {
  await databaseConnection.close();
});
