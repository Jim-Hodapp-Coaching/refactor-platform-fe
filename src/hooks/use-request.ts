import useSWR, { KeyedMutator, SWRConfiguration, SWRResponse } from 'swr';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

interface UseRequestResult<T> {
  data: T[] | undefined; // Array to hold data from all endpoints
  error: AxiosError | undefined;
  isLoading: boolean;
}

interface RequestConfig extends AxiosRequestConfig {
  params?: Record<string, any>;
}

type RequestKey = string[]; // Array of endpoint URLs

const fetcher = async <T>(url: string, config: RequestConfig): Promise<T> => {
  const fullUrl = `http://localhost:4000${url}`;
  console.log(fullUrl)
  const response = await axios({
    url: fullUrl,
    ...config,
    params: config.params,
  });
  return response.data;
};

const defaultConfig: RequestConfig = {
  headers: {
    'Content-Type': 'application/json',
    'X-Version': '0.0.1'
  },
  withCredentials: true,
  timeout: 5000, // 5 seconds before timing out trying to log in with the backend
};

export function useRequest<T>(
  keys: RequestKey,
  config: RequestConfig = {},
  swrConfig?: SWRConfiguration
): UseRequestResult<T> & Pick<SWRResponse<T[], AxiosError>, 'mutate'> {

  const combinedConfig = { ...defaultConfig, ...config };

  const fetchData = async (): Promise<T[]> => {
    const results: T[] = [];
    for (const key of keys) {
      if (key) { // Skip empty URLs
        results.push(await fetcher<T>(key, combinedConfig));
      }
    }
    return results;
  };

  const { data, error, mutate } = useSWR<T[], AxiosError>(keys, fetchData, swrConfig);

  return {
    data, // Array containing data from all endpoints
    error,
    isLoading: !error && !data?.length, // Check if all data is fetched
    mutate,
  };
}
