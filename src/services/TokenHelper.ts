class TokenHelper {
  private static instance: TokenHelper;
  private _token: string | null = null;

  private constructor() {}

  public static getInstance(): TokenHelper {
    if (!TokenHelper.instance) {
      TokenHelper.instance = new TokenHelper();
      TokenHelper.instance.initialize();
    }
    return TokenHelper.instance;
  }

  public initialize(): void {
    this._token = localStorage.getItem('bearer_token');
  }

  public get token(): string | null {
    return this._token;
  }

  public setToken(token: string): void {
    this._token = token;
    localStorage.setItem('bearer_token', token);
  }

  public removeToken(): void {
    this._token = null;
    localStorage.removeItem('bearer_token');
  }

  public get isTokenPresent(): boolean {
    return this._token !== null;
  }
}

export default TokenHelper;