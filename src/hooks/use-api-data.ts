import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useApiData<T>(url: string | null, queryParams: Record<string, string> = {}) {
    const fullUrl = url ? `${url}?${new URLSearchParams(queryParams)}` : null

    const { data, error, mutate } = useSWR<T>(fullUrl, fetcher)

    return {
        data,
        isLoading: !error && !data,
        isError: error,
        mutate
    }
}