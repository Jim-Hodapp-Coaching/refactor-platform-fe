import useSWR from 'swr';
import { siteConfig } from '@/site.config';

interface FetcherOptions {
    url: string
    params?: Record<string, string>
}

const baseUrl = siteConfig.url;

const fetcher = async ({ url, params }: FetcherOptions) => {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${baseUrl}${url}${queryString ? `?${queryString}` : ''}`;
    console.log(fullUrl);
    const response = await fetch(fullUrl);

    if (!response.ok) {
        throw new Error('An error occcured while fetching the data.');
    }

    return response.json();
};

export function useApiData<T>(url: string, params: Record<string, string> = {}) {
    const { data, error, isLoading } = useSWR<T, Error>(
        { url, params },
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    return {
        data,
        isLoading,
        error
    };
};