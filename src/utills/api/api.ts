import { API_PORT, API_URL, API_PASSWORD } from '../constants';
import { generateXAuthHeader } from '../generateXAuth';
import { getUniqueItems } from '../getUniqueItems';

class ApiClient {
    private apiUrl: string;
    private apiPort: number;
    private password: string;

    constructor(apiUrl: string, apiPort: number, password: string) {
        this.apiUrl = apiUrl;
        this.apiPort = apiPort;
        this.password = password;
    }

    private sendAPIRequest = async (
        action: string,
        params?: Record<string, unknown>,
        maxRetries: number = 3,
        retryDelay: number = 1000
    ) => {
        const url = `${this.apiUrl}:${this.apiPort}`;
        const xAuthHeader = generateXAuthHeader(this.password);
        const requestData = { action, params };
        const requestOptions = {
            method: 'POST',
            headers: {
                ...xAuthHeader,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        };

        for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
            try {
                const response = await fetch(url, requestOptions);

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const responseData = await response.json();
                return responseData;
            } catch (error) {
                console.error(`Error in request: ${error}`);

                if (error instanceof Error && error.name === 'AbortError') {
                    console.error(`Error identifier: ${error.message}`);
                }

                await new Promise((resolve) => setTimeout(resolve, retryDelay));
            }
        }

        throw new Error(`Maximum number of retries reached.`);
    };

    private capitalizeFirstLetter = (inputString: string) => {
        return inputString.charAt(0).toUpperCase() + inputString.slice(1);
    };

    private sendFilterRequest = async (
        fieldToFilter: string,
        filterValue: string
    ) => {
        try {
            const response = await this.sendAPIRequest('filter', {
                [fieldToFilter]: filterValue,
            });

            return response.result || [];
        } catch (error) {
            console.error(`Error in filter request: ${error}`);
            throw error;
        }
    };

    getFilterItems = async (
        fieldToFilter: string,
        filterValue: string | number
    ) => {
        const filterValueLowerCase = String(filterValue).toLowerCase();
        const filterValueUpperCaseFirstLetter = this.capitalizeFirstLetter(
            String(filterValueLowerCase)
        );

        try {
            const responseLowerCase = await this.sendFilterRequest(
                fieldToFilter,
                filterValueLowerCase
            );
            const responseUpperCaseFirstLetter = await this.sendFilterRequest(
                fieldToFilter,
                filterValueUpperCaseFirstLetter
            );

            const combinedResults = [
                ...new Set([
                    ...responseLowerCase,
                    ...responseUpperCaseFirstLetter,
                ]),
            ];
            return combinedResults;
        } catch (error) {
            console.error(`Error filtering items: ${error}`);
            throw error;
        }
    };

    getItemsIds = (offset: number, limit: number) => {
        return this.sendAPIRequest('get_ids', { offset, limit }).then((res) => [
            ...new Set(res.result),
        ]);
    };

    getItems = (ids: string[]) => {
        return this.sendAPIRequest('get_items', { ids }).then((res) =>
            getUniqueItems(res.result)
        );
    };
}

export const api = new ApiClient(API_URL, API_PORT, API_PASSWORD);
