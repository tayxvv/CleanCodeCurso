import DatabaseConnection from "./DatabaseConnection";
import pgp from "pg-promise";

export default class PgPromiseAdapter implements DatabaseConnection {
  connection: any;

  constructor() {
    this.connection = pgp()("postgres://tayssa:123abc@localhost:5432/app");
  }

  query(statement: string, params: any[]): Promise<any> {
    return this.connection.query(statement, params);
  }
  async close(): Promise<void> {
    await this.connection.$pool.end();
  }
}
