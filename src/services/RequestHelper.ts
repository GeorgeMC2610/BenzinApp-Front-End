import TokenHelper from '../services/TokenHelper';

class RequestHelper {
    public static _baseUrl: string = 'https://localhost:3000';
    private static instance: RequestHelper;

    private getBasisHeaders(): Record<string, string> {
        return {
            'Content-Type': 'application/json'
        };
    }

    private getAuthHeaders(): Record<string, string> {
        const token = TokenHelper.getInstance().token || '';

        return {
            ...this.getBasisHeaders(),
            'Authorization': token
        };
    }

    private constructor() {}

    public static getInstance(): RequestHelper {
        if (!RequestHelper.instance) {
            RequestHelper.instance = new RequestHelper();
        }
        return RequestHelper.instance;
    }

    public async sendGetRequest(url: string, authorize: boolean = true): Promise<Response> {
        const response = await fetch(
            url,
            {
                method: 'GET',
                headers: authorize ? this.getAuthHeaders() : this.getBasisHeaders()
            }

        );

        return response;
    }

}