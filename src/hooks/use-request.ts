import useSWR, { BareFetcher, SWRConfiguration, SWRResponse } from 'swr';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

interface UseRequestResult<T> {
  data: T | undefined;
  error: AxiosError | undefined;
  isLoading: boolean;
}

interface RequestConfig extends AxiosRequestConfig {
  params?: Record<string, any>;
}

type RequestKey = string | null | (() => string | null);

const fetcher = async <T>(url: string, config: RequestConfig): Promise<T> => {
  const response = await axios({
    url,
    ...config,
    params: config.params,
  });
  return response.data;
};

export function useRequest<T>(
  key: RequestKey,
  config: RequestConfig = {},
  swrConfig?: SWRConfiguration
): UseRequestResult<T> & Pick<SWRResponse<T, AxiosError>, 'mutate'> {
  // Simplify the fetcher function call by directly using a ternary operator for the key check
  const fetcherFunction: BareFetcher<T> | null = key ? (() => {
    const url = typeof key === 'function' ? key() : key;
    return url ? fetcher<T>(url, config) : null;
  }) as BareFetcher<T> : null;

  const { data, error, mutate } = useSWR<T, AxiosError>(key, fetcherFunction, swrConfig);

  // Directly return the isLoading calculation to avoid redundancy
  return {
    data,
    error,
    isLoading: !error && !data && key !== null,
    mutate,
  };
}