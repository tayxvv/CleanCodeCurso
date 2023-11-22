import axios from "axios";
// import { signup, getAccount } from "../src/main";

axios.defaults.validateStatus = function () {
  return true;
};

test.each(["06544656143", "71428793860", "87748248800"])(
  "Deve criar uma conta para o passageiro pela API",
  async function () {
    const inputSignUp = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "06544656143",
      isPassenger: true,
      password: "123456",
    };

    // when
    const responseSignUp = await axios.post(
      "http://localhost:3000/signup",
      inputSignUp
    );
    const outputSignup = responseSignUp.data;
    const responseGetAccount = await axios.get(
      `http://localhost:3000/accounts/${outputSignup.accountId}`
    );
    const outputGetAccount = responseGetAccount.data;
    // then
    // @ts-ignore
    expect(outputSignup.accountId).toBeDefined();
    // @ts-ignore
    expect(outputGetAccount.name).toBe(inputSignUp.name);
    // @ts-ignore
    expect(outputGetAccount.email).toBe(inputSignUp.email);
  }
);

test("Não deve criar uma conta se o nome for inválido", async function () {
  const inputSignUp = {
    name: "John",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "06544656143",
    isPassenger: true,
    password: "123456",
  };

  // when

  const responseSignUp = await axios.post(
    "http://localhost:3000/signup",
    inputSignUp
  );
  expect(responseSignUp.status).toBe(422);
  const outputSignup = responseSignUp.data;
  expect(outputSignup.message).toBe("Invalid Name.");
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
  const responseSignUp = await axios.post(
    "http://localhost:3000/signup",
    inputSignUp
  );
  expect(responseSignUp.status).toBe(422);
  const outputSignup = responseSignUp.data;
  expect(outputSignup.message).toBe("Invalid Email.");
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
    const responseSignUp = await axios.post(
      "http://localhost:3000/signup",
      inputSignUp
    );
    expect(responseSignUp.status).toBe(422);
    const outputSignup = responseSignUp.data;
    expect(outputSignup.message).toBe("Invalid CPF.");
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
  await axios.post("http://localhost:3000/signup", inputSignUp);
  const responseSignUp = await axios.post(
    "http://localhost:3000/signup",
    inputSignUp
  );
  const outputSignup = responseSignUp.data;
  expect(outputSignup.message).toBe("Duplicate account.");
});

test("Deve criar uma conta para o motorista", async function () {
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
  const responseSignUp = await axios.post(
    "http://localhost:3000/signup",
    inputSignUp
  );
  const outputSignup = responseSignUp.data;
  // @ts-ignore
  const responseGetAccount = await axios.get(
    `http://localhost:3000/accounts/${outputSignup.accountId}`
  );
  const outputGetAccount = responseGetAccount.data;
  // then
  // @ts-ignore
  expect(outputSignup.accountId).toBeDefined();
  // @ts-ignore
  expect(outputGetAccount.name).toBe(inputSignUp.name);
  // @ts-ignore
  expect(outputGetAccount.email).toBe(inputSignUp.email);
});

test("Não deve criar uma conta para o motorista com placa inválida", async function () {
  const inputSignUp = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "06544656143",
    carPlate: "",
    isPassenger: false,
    isDriver: true,
    password: "123456",
  };

  // when
  const responseSignUp = await axios.post(
    "http://localhost:3000/signup",
    inputSignUp
  );
  const outputSignup = responseSignUp.data;
  expect(outputSignup.message).toBe("Invalid Car Plate.");
});
