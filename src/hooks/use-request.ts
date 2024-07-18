import useSWR, { SWRConfiguration, SWRResponse } from 'swr'
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { siteConfig } from '@/site.config';

// Extended Axios Request Config with defaults
export interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  headers: {
    'Content-Type': 'application/json';
    'X-Version': '0.0.1';
  };
  withCredentials: boolean;
  timeout: number;
};

const baseURL = siteConfig.url;

const defaultConfig: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
    'X-Version': '0.0.1',
  },
  withCredentials: true,
  timeout: 5000,
};

export const axiosInstance = axios.create({
  baseURL,
  ...defaultConfig,
});

interface Return<Data, Error>
  extends Pick<
    SWRResponse<AxiosResponse<Data>, AxiosError<Error>>,
    'isValidating' | 'error' | 'mutate'
  > {
  data: Data | undefined
  response: AxiosResponse<Data> | undefined
}

export interface Config<Data = unknown, Error = unknown>
  extends Omit<
    SWRConfiguration<AxiosResponse<Data>, AxiosError<Error>>,
    'fallbackData'
  > {
  fallbackData?: Data
}

export default function useRequest<Data = unknown, Error = unknown>(
  request: GetRequest,
  { fallbackData, ...config }: Config<Data, Error> = {}
): Return<Data, Error> {
  const {
    data: response,
    error,
    isValidating,
    mutate
  } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
    request,
    /**
     * NOTE: Typescript thinks `request` can be `null` here, but the fetcher
     * function is actually only called by `useSWR` when it isn't.
     */
    () => axiosInstance.request<Data>(request!),
    {
      ...config,
      fallbackData: fallbackData && {
        status: 200,
        statusText: 'InitialData',
        config: request!,
        headers: {},
        data: fallbackData
      } as AxiosResponse<Data>
    }
  )

  return {
    data: response && response.data,
    response,
    error,
    isValidating,
    mutate
  }
}
