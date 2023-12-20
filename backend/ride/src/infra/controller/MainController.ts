import AccountRepositoryDatabase from "../repository/AccountRepositoryDatabase";
import GetAccount from "../../application/usecase/GetAccount";
import HttpServer from "../http/HttpServer";
import LoggerConsole from "../logger/LoggerConsole";
import PgPromiseAdapter from "../database/PgPromiseAdapter";
import Signup from "../../application/usecase/Signup";
import Registry, { inject } from "../di/Registry";

export default class MainController {
  @inject("httpServer")
  httpServer?: HttpServer;
  @inject("getAccount")
  signup?: Signup;
  @inject("getAccount")
  getAccount?: GetAccount;

  constructor() {
    // const httpServer = Registry.getInstance().inject("httpServer");
    // const getAccount = Registry.getInstance().inject("getAccount");
    // const signup = Registry.getInstance().inject("signup");

    this.httpServer?.register(
      "post",
      "/signup",
      async (params: any, body: any) => {
        const databaseConnection = new PgPromiseAdapter();
        const accountRepository = new AccountRepositoryDatabase(
          databaseConnection
        );
        const signup = new Signup(accountRepository, new LoggerConsole());
        const output = await this.signup?.execute(body);
        return output;
      }
    );

    this.httpServer?.register(
      "get",
      "/accounts/:accountId",
      async (params: any, body: any) => {
        const databaseConnection = new PgPromiseAdapter();
        const accountDAO = new AccountRepositoryDatabase(databaseConnection);
        const getAccount = new GetAccount(accountDAO);
        const output = await this.getAccount?.execute(params.accountId);
        return output;
      }
    );
  }
}
