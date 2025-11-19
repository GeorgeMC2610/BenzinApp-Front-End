import axios, { AxiosInstance, AxiosResponse } from 'axios';
import TokenHelper from './TokenHelper';

class RequestHelper {
    public static _baseUrl: string = '/api';
    private static instance: RequestHelper;
    private axiosInstance: AxiosInstance;

    private getBasicHeaders(): Record<string, string> {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }

    private getAuthHeaders(): Record<string, string> {
        const rawToken = TokenHelper.getInstance().token || '';
        // const token = rawToken && !rawToken.toLowerCase().startsWith('bearer ') ? `Bearer ${rawToken}` : rawToken;

        const headers: Record<string, string> = {
            ...this.getBasicHeaders(),
        };
        if (rawToken !== '') headers['Authorization'] = rawToken;
        return headers;
    }

    private constructor() {
        this.axiosInstance = axios.create({
            withCredentials: false,
            headers: this.getBasicHeaders(),
        });
        // Central response interceptor: if the server returns 401 or an
        // "Expired token" message, clear stored token and redirect to login.
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                try {
                    const resp = error?.response;
                    const status = resp?.status;
                    const data = resp?.data;

                    const isExpiredMessage =
                        data && (data.message === 'Missing token' || data.message === 'Not enough or too many segments');

                    if (isExpiredMessage) {
                        // remove token and redirect to login page
                        TokenHelper.getInstance().removeToken();
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }
                    }
                } catch (e) {
                    // swallow any errors while trying to handle auth expiry
                    // and continue to reject the original error
                }
                return Promise.reject(error);
            }
        );
    }

    public static getInstance(): RequestHelper {
        if (!RequestHelper.instance) {
            RequestHelper.instance = new RequestHelper();
        }
        return RequestHelper.instance;
    }

    public async sendGetRequest(url: string, authorize: boolean = true): Promise<AxiosResponse> {
        const headers = authorize ? this.getAuthHeaders() : this.getBasicHeaders();
        return this.axiosInstance.get(url, { headers });
    }

    public async sendPostRequest(url: string, data?: unknown, authorize: boolean = true): Promise<AxiosResponse> {
        const headers = authorize ? this.getAuthHeaders() : this.getBasicHeaders();
        return this.axiosInstance.post(url, data, { headers });
    }

    public async sendPatchRequest(url: string, data?: unknown, authorize: boolean = true): Promise<AxiosResponse> {
        const headers = authorize ? this.getAuthHeaders() : this.getBasicHeaders();
        return this.axiosInstance.patch(url, data, { headers });
    }

    public async sendPutRequest(url: string, data?: unknown, authorize: boolean = true): Promise<AxiosResponse> {
        const headers = authorize ? this.getAuthHeaders() : this.getBasicHeaders();
        return this.axiosInstance.put(url, data, { headers });
    }

    public async sendDeleteRequest(url: string, data?: unknown, authorize: boolean = true): Promise<AxiosResponse> {
        const headers = authorize ? this.getAuthHeaders() : this.getBasicHeaders();
        // Some APIs accept a body for DELETE; axios requires it in `data` inside config
        return this.axiosInstance.delete(url, { headers, data });
    }
}

export default RequestHelper;
