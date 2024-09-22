"use client"

import { useState, useCallback } from 'react'
import * as Select from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { useApiData } from '@/hooks/use-api-data'

interface Option {
    value: string
    label: string
}

interface ReusableSelectProps {
    url: string
    queryParams?: Record<string, string>
    onSelectChange: (value: string) => void
    placeholder?: string
}

export function ReusableSelect({
    url,
    queryParams = {},
    onSelectChange,
    placeholder = 'Select an option...'
}: ReusableSelectProps) {
    const [selectedValue, setSelectedValue] = useState<string>('')

    const { data, isLoading, isError, mutate } = useApiData<Option[]>(
        selectedValue ? url : null,
        { value: selectedValue, ...queryParams }
    )

    const handleValueChange = useCallback(async (value: string) => {
        setSelectedValue(value)
        await mutate()
        onSelectChange(value)
    }, [mutate, onSelectChange])

    return (
        <Select.Root value={selectedValue} onValueChange={handleValueChange}>
            <Select.Trigger className="inline-flex items-center justify-between rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-violet11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9 outline-none w-full">
                <Select.Value placeholder={placeholder} />
                <Select.Icon className="text-violet11">
                    <ChevronDownIcon />
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
                    <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
                        <ChevronUpIcon />
                    </Select.ScrollUpButton>
                    <Select.Viewport className="p-[5px]">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-[25px]">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet11"></div>
                            </div>
                        ) : isError ? (
                            <div className="text-red-500 text-[13px] p-2">Error loading options</div>
                        ) : data ? (
                            data.map((option) => (
                                <Select.Item
                                    key={option.value}
                                    value={option.value}
                                    className="text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
                                >
                                    <Select.ItemText>{option.label}</Select.ItemText>
                                    <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                                        <CheckIcon />
                                    </Select.ItemIndicator>
                                </Select.Item>
                            ))
                        ) : (
                            <div className="text-[13px] p-2">Select an option to load data</div>
                        )}
                    </Select.Viewport>
                    <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
                        <ChevronDownIcon />
                    </Select.ScrollDownButton>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    )
}