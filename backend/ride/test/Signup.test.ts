import Account from "../src/domain/Account";
import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";
import AccountDAODatabase from "../src/infra/repository/AccountRepositoryDatabase";
import AccountDAO from "../src/infra/repository/AccountRepositoryDatabase";
import GetAccount from "../src/application/usecase/GetAccount";
import Logger from "../src/application/logger/Logger";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import Signup from "../src/application/usecase/Signup";
import sinon from "sinon";

let signup: Signup;
let getAccount: GetAccount;
let databaseConnection: PgPromiseAdapter;

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter();
  const accountDAO = new AccountRepositoryDatabase(databaseConnection);
  const logger = new LoggerConsole();
  signup = new Signup(accountDAO, logger);
  getAccount = new GetAccount(accountDAO);
});

test("Deve criar uma conta para o passageiro com stub", async function () {
  const subAccountDAOSave = sinon
    .stub(AccountDAODatabase.prototype, "save")
    .resolves();
  const stubAccountDAOGetByEmail = sinon
    .stub(AccountDAODatabase.prototype, "getByEmail")
    .resolves(undefined);

  const inputSignUp = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "06544656143",
    isPassenger: true,
    password: "123456",
  };
  const outputSignup = await signup.execute(inputSignUp);
  expect(outputSignup.accountId).toBeDefined();
  const stubAccountDAOGetById = sinon
    .stub(AccountDAODatabase.prototype, "getById")
    .resolves(
      Account.create(
        inputSignUp.name,
        inputSignUp.email,
        inputSignUp.cpf,
        "",
        inputSignUp.isPassenger,
        false
      )
    );
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount?.name).toBe(inputSignUp.name);
  expect(outputGetAccount?.email).toBe(inputSignUp.email);
  subAccountDAOSave.restore();
  stubAccountDAOGetByEmail.restore();
  stubAccountDAOGetById.restore();
});

test("Deve criar uma conta para o passageiro com mock", async function () {
  const mockLogger = sinon.mock(LoggerConsole.prototype);
  mockLogger.expects("log").withArgs("Signup").once();
  const inputSignUp = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "06544656143",
    isPassenger: true,
    password: "123456",
  };
  const outputSignup = await signup.execute(inputSignUp);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount?.name).toBe(inputSignUp.name);
  expect(outputGetAccount?.email).toBe(inputSignUp.email);
  mockLogger.verify();
  mockLogger.restore();
});

test("Não deve criar uma conta se o nome for inválido", async function () {
  const inputSignUp = {
    name: "John",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "06544656143",
    isPassenger: true,
    password: "123456",
  };

  // when
  await expect(() => signup.execute(inputSignUp)).rejects.toThrow(
    new Error("Invalid Name.")
  );
});

test("Não deve criar uma conta se o email for inválido", async function () {
  const inputSignUp = {
    name: "John Doe",
    email: `john.doe${Math.random()}gmail.com`,
    cpf: "06544656143",
    isPassenger: true,
    password: "123456",
  };

  // when
  await expect(() => signup.execute(inputSignUp)).rejects.toThrow(
    new Error("Invalid Email.")
  );
});

test.each(["", undefined, null, "111", "11111111111111", "11111111111"])(
  "Não deve criar uma conta se o cpf for inválido",
  async function () {
    const inputSignUp = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "",
      isPassenger: true,
      password: "123456",
    };

    // when
    await expect(() => signup.execute(inputSignUp)).rejects.toThrow(
      new Error("Invalid CPF.")
    );
  }
);

test("Não deve criar uma conta se o email for duplicado", async function () {
  const inputSignUp = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "06544656143",
    isPassenger: true,
    password: "123456",
  };

  // when
  await signup.execute(inputSignUp);
  await expect(() => signup.execute(inputSignUp)).rejects.toThrow(
    new Error("Duplicate account.")
  );
});

test("Deve criar uma conta para o motorista", async function () {
  const spyLogger = sinon.spy(LoggerConsole.prototype, "log");

  const inputSignUp = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "06544656143",
    carPlate: "AAA9999",
    isPassenger: false,
    isDriver: true,
    password: "123456",
  };

  // when
  const outputSignup = await signup.execute(inputSignUp);
  // @ts-ignore
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  // then
  // @ts-ignore
  expect(outputSignup.accountId).toBeDefined();
  // @ts-ignore
  expect(outputGetAccount.name).toBe(inputSignUp.name);
  // @ts-ignore
  expect(outputGetAccount.email).toBe(inputSignUp.email);

  expect(spyLogger.calledOnce).toBeTruthy();
  expect(spyLogger.calledWith("Signup")).toBeTruthy();
  spyLogger.restore();
});

test("Não deve criar uma conta para o motorista com placa inválida", async function () {
  const inputSignUp = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "06544656143",
    carPlate: "AAA999",
    isPassenger: false,
    isDriver: true,
    password: "123456",
  };

  // when
  await expect(() => signup.execute(inputSignUp)).rejects.toThrow(
    new Error("Invalid Car Plate.")
  );
});

// test("Deve criar uma conta para o passageiro com fake", async function () {
//   const inputSignUp = {
//     name: "John Doe",
//     email: `john.doe${Math.random()}@gmail.com`,
//     cpf: "06544656143",
//     isPassenger: true,
//     password: "123456",
//   };
//   const accounts: any = [];
//   const accountDAO: AccountRepositoryDatabase = {
//     async save(account: any): Promise<void> {
//       accounts.push(account);
//     },

//     async getById(accountId: string): Promise<any> {
//       return accounts.find((account: any) => account.accountId === accountId);
//     },

//     async getByEmail(email: string): Promise<any> {
//       return accounts.find((account: any) => account.accountId === email);
//     },
//     connection: DatabaseConnection,
//   };

//   const logger: Logger = {
//     log(message: string): void {},
//   };

//   const signup = new Signup(accountDAO, logger);
//   const getAccount = new GetAccount(accountDAO);
//   const outputSignup = await signup.execute(inputSignUp);
//   expect(outputSignup.accountId).toBeDefined();
//   const outputGetAccount = await getAccount.execute(outputSignup.accountId);
//   expect(outputGetAccount?.name).toBe(inputSignUp.name);
//   expect(outputGetAccount?.email).toBe(inputSignUp.email);
// });

afterEach(async () => {
  await databaseConnection.close();
});
