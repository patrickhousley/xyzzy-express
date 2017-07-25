class MockStorage {
  private storage = new Map<string, string>();

  public getItem(key: string): string {
    return this.storage.get(key);
  }

  public setItem(key: string, value: string) {
    this.storage.set(key, value);
  }

  public removeItem(key: string) {
    this.storage.delete(key);
  }

  public clearImmediate() {
    this.storage.clear();
  }
}

Object.defineProperty(window, 'localStorage', { value: new MockStorage() });
Object.defineProperty(window, 'sessionStorage', { value: new MockStorage() });
