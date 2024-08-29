import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { siteConfig } from '@/site.config';

export type FetcherResponse<Data> = Data[];

type FetcherError = any;

const baseUrl = siteConfig.url;

const defaultConfig: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
    'X-Version': '0.0.1',
  },
  withCredentials: true,
  timeout: 5000,
};

const axiosFetcher = async <Data extends any>(
  url: string,
  body: any,
  options: AxiosRequestConfig
): Promise<FetcherResponse<Data>> => {
  const response: AxiosResponse<Data[]> = await axios({
    url: baseUrl + url,
    data: body,
    ...defaultConfig,
    ...options
  });

  return response.data;
}

const useRequest = <Data = unknown>(
  url: string,
  body: any = null,
  options: AxiosRequestConfig = {},
  swrOptions: SWRConfiguration = {}
): SWRResponse<FetcherResponse<Data>, FetcherError> => {
  const key = body ? [url, JSON.stringify(body), JSON.stringify(options)] : [url, JSON.stringify(options)];
  return useSWR<FetcherResponse<Data>, FetcherError>(
    key,
    () => axiosFetcher<Data>(url, body, options),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      ...swrOptions
    }
  );
};

export default useRequest;