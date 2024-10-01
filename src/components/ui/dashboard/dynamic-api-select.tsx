import React, { useState } from 'react';
import { useApiData } from '@/hooks/use-api-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DynamicApiSelectProps<T> {
  url: string;
  method?: 'GET' | 'POST';
  params?: Record<string, any>;
  onChange: (value: string) => void;
  placeholder?: string;
  getOptionLabel: (item: T) => string;
  getOptionValue: (item: T) => string;
}

interface ApiResponse<T> {
  status_code: number;
  data: T[];
}

export function DynamicApiSelect<T>({
  url,
  method = 'GET',
  params = {},
  onChange,
  placeholder = "Select an organization",
  getOptionLabel,
  getOptionValue
}: DynamicApiSelectProps<T>) {
  const { data: response, isLoading, error } = useApiData<ApiResponse<T>>(url, { method, params });
  const [value, setValue] = useState<string>('');

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onChange(newValue);
  }

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  if (!response || response.status_code !== 200) return <p>Error: Invalid response</p>

  const items = response.data;

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item, index) => (
          <SelectItem key={index} value={getOptionValue(item)}>
            {getOptionLabel(item)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
