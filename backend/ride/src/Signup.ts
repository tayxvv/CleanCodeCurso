import crypto from "crypto";
import AccountDAO from "./AccountDAODatabase";
import { validateCpf } from "./CpfValidator";
import Logger from "./Logger";
import SignupAccountDAO from "./SignupAccountDAO";

export default class Signup {
  constructor(private accountDAO: SignupAccountDAO, private logger: Logger) {}

  async execute(input: any) {
    this.logger.log("Signup");
    const accountDAO = new AccountDAO();
    input.accountId = crypto.randomUUID();
    const account = await accountDAO.getByEmail(input.email);
    if (account) throw new Error("Duplicate account.");
    if (!this.isInvalidName(input.name)) throw new Error("Invalid Name.");
    if (!this.isInvalidEmail(input.email)) throw new Error("Invalid Email.");
    if (!validateCpf(input.cpf)) throw new Error("Invalid CPF.");
    if (input.isDriver && !this.isInvalidCarPlate(input.carPlate))
      throw new Error("Invalid Car Plate.");
    await accountDAO.save(input);
    return {
      accountId: input.accountId,
    };
  }

  isInvalidName(name: string) {
    return name.match(/[a-zA-Z] [a-zA-Z]+/);
  }

  isInvalidEmail(email: string) {
    return email.match(/^(.+)@(.+)$/);
  }

  isInvalidCarPlate(carPlate: string) {
    return carPlate.match(/[A-Z]{3}[0-9]{4}/);
  }
}
