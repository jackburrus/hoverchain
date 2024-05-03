import { ILocalStorage, LocalStorage } from '@src/pages/chrome/localStorage';

export class ApiKeyStorage {
  private static API_KEY = 'ALCHEMY_API_KEY';
  static storage: ILocalStorage = new LocalStorage();

  static async getApiKey(): Promise<string> {
    const apiKey = await this.storage.load(this.API_KEY);
    return String(apiKey);
  }
  static async setApiKey(apiKey: string | null): Promise<void> {
    await this.storage.save(this.API_KEY, apiKey);
  }
}
