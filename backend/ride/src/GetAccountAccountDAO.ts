export default interface GetAccountAccountDAO {
  getById(accountId: string): Promise<any>;
}
