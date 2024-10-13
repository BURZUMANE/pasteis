import { config } from '@/config/config';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const apiClient = axios.create({
    baseURL: config.API_URL,
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.request(config);
    return response.data;
}

export const ApiUtils = {
    get: <T>(url: string, config?: AxiosRequestConfig) => request<T>({ ...config, method: 'GET', url }),
    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>({ ...config, method: 'POST', url, data }),
    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>({ ...config, method: 'PUT', url, data }),
    delete: <T>(url: string, config?: AxiosRequestConfig) => request<T>({ ...config, method: 'DELETE', url }),
};

export default apiClient;
