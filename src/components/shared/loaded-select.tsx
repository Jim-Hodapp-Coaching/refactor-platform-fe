import useRequest from "@/hooks/use-request";
import { Select, SelectItem } from "@radix-ui/react-select";
import { memo, useEffect, useMemo, useState } from "react";
import { SWRResponse } from "swr";

export type SelectListDataType = any;

export interface LoadedSelectProps {
    url: string;
    params?: any;
    selectedItem?: (value: string) => void;
    onSelectedValue?: (value: string) => void;
}

const LoadedSelect = memo(function LoadedSelect({
    url: url,
    params: params,
    selectedItem,
    onSelectedValue
}: LoadedSelectProps): JSX.Element {

    const [selectedValue, setSelectedValue] = useState<string>("");

    useEffect(() => setSelectedValue(selectedValue), [selectedValue]);

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

    const handleValueChange = (value: string) => {
        setSelectedValue(value);
    };

    if (error) {
        return <div>Error: {error.message}</div>
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <Select
            onValueChange={handleValueChange}
        >{
                selectItemList
            }
        </Select>)
});

export default LoadedSelect;