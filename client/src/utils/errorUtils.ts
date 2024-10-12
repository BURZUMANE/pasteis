import { AxiosError } from 'axios';

export const extractErrorMessage = (error: Error | AxiosError): string => {
    if (error instanceof AxiosError && error.response) {
        return error.response.data?.message || error.response.statusText || 'An error occurred';
    }

    return error.message || 'An unexpected error occurred';
};
