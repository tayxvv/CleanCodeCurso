import express, { Request, Response } from "express";
import AccountDAO from "./AccountDAODatabase";
import Signup from "./Signup";
import GetAccount from "./GetAccount";
import LoggerConsole from "./LoggerConsole";
import AccountDAODatabase from "./AccountDAODatabase";

const app = express();
app.use(express.json());

app.post("/signup", async function (req: Request, res: Response) {
  try {
    const input = req.body;
    const accountDAO = new AccountDAODatabase();
    const signup = new Signup(accountDAO, new LoggerConsole());
    const output = await signup.execute(input);
    res.json(output);
  } catch (e: any) {
    res.status(422).json({
      message: e.message,
    });
  }
});

app.get("/accounts/:accountId", async function (req: Request, res: Response) {
  const accountId = req.params.accountId;
  const getAccount = new GetAccount(new AccountDAO());
  const output = await getAccount.execute(accountId);
  res.json(output);
});
app.listen(3001);
