import useSWR from 'swr';
import { siteConfig } from '@/site.config';

interface FetcherOptions {
    url: string,
    method?: 'GET' | 'POST',
    params?: Record<string, string>,
    // body?: Record<string, any>
}

const baseUrl = siteConfig.url;

const fetcher = async ({ url, method = 'POST', params }: FetcherOptions) => {
    const fullUrl = `${baseUrl}${url}`;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'X-Version': '0.0.1'
    };

    const fetchOptions: RequestInit = {
        method,
        headers,
        credentials: 'include',
    };

    const response = await fetch(fullUrl, fetchOptions);
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'An error occurred while fetching the data.');
    }
    return response.json();
};

export function useApiData<T>(
    url: string,
    options: {
        method?: 'GET' | 'POST'
        params?: Record<string, string>
        body?: Record<string, any>
    } = {}
) {
    const { method = 'POST', params = {}, body = {} } = options

    const { data, error, isLoading, mutate } = useSWR<T, Error>(
        { url, method, params, body },
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    )

    return {
        data,
        isLoading,
        error,
        mutate,
    }
}