export default interface AccountDAO {
  save(account: any): Promise<void>;

  getById(accountId: string): Promise<any>;

  getByEmail(email: string): Promise<any>;
}
