import useRequest from "@/hooks/use-request";
import { SelectItem } from "@radix-ui/react-select";
import { memo, useMemo } from "react";
import { SWRResponse } from "swr";

export type SelectListDataType = any;

export interface LoadedSelectProps {
    url: string,
    params?: any,
}

const LoadedSelect = memo(function LoadedSelect({
    url: url,
    params: params,
}: LoadedSelectProps): JSX.Element {

    const {
        data: selectList,
        error,
        isLoading,
        mutate
    } = useRequest<SelectListDataType>(url, params);

    const { data: selectItems } = (selectList || {}) as SWRResponse<SelectListDataType[]> & { data: SelectListDataType[] };
    console.info(selectItems);

    const selectItemList = useMemo(() => {
        if (!selectItems) return null;

        return selectItems.map((listItem: SelectListDataType) => {
            return (
                <SelectItem value={listItem.id} key={listItem.id}>
                    {listItem.name}
                </SelectItem>
            );
        });
    }, [selectList]);

    if (error) {
        return <div>Error: {error.message}</div>
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (<div>{selectItemList}</div>)
});

export default LoadedSelect;