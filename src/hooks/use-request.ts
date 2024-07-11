import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { siteConfig } from '@/site.config';

interface UseRequestResult<T> {
  data: T | undefined;
  error: AxiosError | undefined;
  isLoading: boolean;
}

interface RequestConfig extends AxiosRequestConfig {
  params?: Record<string, any>;
}

type RequestKey = string; // Single URL string
const baseUrl = siteConfig.url;

const defaultConfig: RequestConfig = {
  headers: {
    'Content-Type': 'application/json',
    'X-Version': '0.0.1',
  },
  withCredentials: true,
  timeout: 5000, // 5 seconds before timing out trying to log in with the backend
};

export function useRequest<T>(
  url: RequestKey,
  config: RequestConfig = {},
  swrConfig?: SWRConfiguration
): UseRequestResult<T> & Pick<SWRResponse<T, AxiosError>, 'mutate'> {
  console.debug("Entered into useRequest()");

  const combinedConfig = { ...defaultConfig, ...config };

  const fullUrl = `${baseUrl}/${url}`.replace(/\/+$/, '');
  console.debug("url: " + url);
  console.debug("fullURL: " + fullUrl);

  const fetchData = async (): Promise<T> => {
    console.debug("Entered into fetchData()");
    const response = await axios.get(fullUrl, combinedConfig);
    console.debug("response.data: " + JSON.stringify(response.data));
    return response.data;
  };

  const { data, error, mutate } = useSWR<T, AxiosError>(url, fetchData, swrConfig);

  return {
    data,
    error,
    isLoading: !error && !data,
    mutate,
  };
}